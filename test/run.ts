// Ensure tsconfig has: "allowSyntheticDefaultImports": true.
import { PassThrough } from "node:stream";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import frida, { ScriptRuntime, Stdio } from "frida";
import TapMochaReporter from "tap-mocha-reporter"; // function returning a transform stream

import { isAgentDebug, isAgentTap } from "./shared.ts";
import { spawn } from "node:child_process";

async function main() {
  const root = path.join(
    path.dirname(import.meta.url.replace(/^file:\/\//, "")),
    ".."
  );
  const buildPath = path.join(root, "build");

  // Tests to be loaded into Frida
  const agentBundlePath = path.join(root, "test", "tests", "dist", "tests.js");
  const agentSource = await fs.readFile(path.resolve(agentBundlePath), "utf-8");

  // Binary host that will load the Unity application library
  const execPath = path.join(buildPath, "host");

  // Path containing the Unity application library (.so or .dylib)
  const libraryPath = path.join(buildPath, "2022.3.62f1", "out");

  // Spawn target suspended
  // const hostProcess = await frida.spawn(execPath, {
  //     argv: [libraryPath],
  //     stdio: Stdio.Inherit,
  // });

  // Use Node.js spawn (bypasses Frida's spawn issues)
  const hostProcess = spawn(execPath, [libraryPath], {
    stdio: ["pipe", "pipe", "pipe"], // inherit stdout/stderr for debugging
    detached: false,
  });

  hostProcess.on("error", (err) => {
    console.error("[SPAWN ERROR]", err);
    throw err;
  });

  // TODO get this part to work in order to wait for il2cpp to be loaded – replaces the 250ms wait
  hostProcess.stdout.on("data", (data) => {
    console.log("[HOST]", data);
  });
  hostProcess.stderr.on("data", (data) => {
    console.error("[HOST]", data);
  });

  // Wait for process to start
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (!hostProcess.pid) {
    throw new Error("Failed to get child process PID");
  }

  console.log("Spawned process PID:", hostProcess.pid);

  // Now attach Frida (this usually works fine)
  const session = await frida.attach(hostProcess.pid);

  // Attach and load the agent (suspended)
  const script = await session.createScript(agentSource, {
    runtime: ScriptRuntime.V8,
  });

  // TAP pipeline
  const tapStream = new PassThrough();

  // Pretty reporter (Mocha-style)
  const pretty = TapMochaReporter("tap");
  tapStream.pipe(pretty);

  // Feed TAP lines from the agent
  // Create a promise that resolves when tests complete
  const testsComplete = new Promise<void>((resolve, reject) => {
    script.message.connect((message) => {
      if (message.type !== "send") {
        console.error(
          `[ERROR] Ignoring unexpected message type ${message.type}`
        );
        return;
      }

      const payload = message.payload;

      if (isAgentDebug(payload)) {
        console.log("[DEBUG]", payload.debug);
        return;
      }

      if (isAgentTap(payload)) {
        tapStream.write(payload.tap.replace(/\r?\n$/, "") + "\n");
      }
    });
  });

  // script.destroyed.connect(() => {
  //     // TODO: do we need to close the stream if the script dies?
  // });

  await script.load();
  await script.exports.runTests();

  hostProcess.kill();
  // process.exit();
}

(async () => {
  try {
    await main();
  } catch (err: any) {
    console.error(`[ERROR] Uncaught exception`);
    console.error(err?.stack || String(err));
    process.exit(1);
  }
})();
