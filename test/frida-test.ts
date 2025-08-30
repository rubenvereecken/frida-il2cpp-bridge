// Node >=18 recommended. TypeScript "module": "node16" or "nodenext".
// Ensure tsconfig has: "esModuleInterop": true, "allowSyntheticDefaultImports": true.
import { PassThrough } from "node:stream";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import { spawn } from "node:child_process";
import frida, { Stdio } from "frida"; // CJS under the hood; default import works with esModuleInterop
import TapMochaReporter from "tap-mocha-reporter"; // function returning a transform stream

import type { AgentOutboundMessage } from "./shared.js";

async function main() {
    const root = path.join(path.dirname(import.meta.url.replace(/^file:\/\//, "")), "..");
    const buildPath = path.join(root, "build");

    // Tests to be loaded into Frida
    const agentBundlePath = path.join(root, "test", "dist", "agent.js");
    const agentSource = await fs.readFile(path.resolve(agentBundlePath), "utf-8");

    // Binary host that will load the Unity application library
    const execPath = path.join(buildPath, "host");

    // Path containing the Unity application library (.so or .dylib)
    const libraryPath = path.join(buildPath, "2022.3.62f1", "out");

    console.log(execPath, libraryPath);

    // Spawn target suspended
    const pid = await frida.spawn(execPath, {
        argv: [libraryPath],
        stdio: Stdio.Pipe
    });

    // Attach to the spawned process instead
    const session = await frida.attach(pid);

    // Attach and load the agent
    // const session = await frida.attach(pid);
    const script = await session.createScript(agentSource);

    // TAP pipeline
    const tapStream = new PassThrough();

    // Pretty reporter (Mocha-style)
    const pretty = TapMochaReporter("spec");
    tapStream.pipe(pretty);

    pretty.on("finish", () => {
        console.log("\nTests completed.");
    });

    // Feed TAP lines from the agent
    script.message.connect(message => {
        console.dir(message, { depth: null });
        if (message.type !== "send") return;
        const payload = message.payload as AgentOutboundMessage;
        if (payload && typeof payload.tap === "string") {
            tapStream.write(payload.tap.replace(/\r?\n$/, "") + "\n");
        }

        // if (payload.tap === "end") {
        //     console.log("Ending tap stream");
        //     tapStream.end();
        // }
    });

    // Close stream if the script dies
    script.destroyed.connect(() => {
        console.log("Script destroyed");
        return tapStream.end();
    });

    await script.load();

    // Important: spawned process is suspended until resumed
    await frida.resume(pid);
}

await main();
