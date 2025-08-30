// Ensure tsconfig has: "allowSyntheticDefaultImports": true.
import { PassThrough } from 'node:stream';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import frida, { Stdio } from 'frida';
import TapMochaReporter from 'tap-mocha-reporter'; // function returning a transform stream

import type { AgentTap, AgentDebug, AgentComplete } from './shared.js';

async function main() {
    const root = path.join(path.dirname(import.meta.url.replace(/^file:\/\//, '')), '..');
    const buildPath = path.join(root, 'build');

    // Tests to be loaded into Frida
    const agentBundlePath = path.join(root, 'test', 'dist', 'tests.js');
    const agentSource = await fs.readFile(path.resolve(agentBundlePath), 'utf-8');

    // Binary host that will load the Unity application library
    const execPath = path.join(buildPath, 'host');

    // Path containing the Unity application library (.so or .dylib)
    const libraryPath = path.join(buildPath, '2022.3.62f1', 'out');

    // Spawn target suspended
    const pid = await frida.spawn(execPath, {
        argv: [libraryPath],
        stdio: Stdio.Pipe,
    });

    // Attach to the spawned process instead
    const session = await frida.attach(pid);

    // Attach and load the agent (suspended)
    const script = await session.createScript(agentSource);

    // TAP pipeline
    const tapStream = new PassThrough();

    // Pretty reporter (Mocha-style)
    const pretty = TapMochaReporter('spec');
    tapStream.pipe(pretty);

    // Feed TAP lines from the agent
    script.message.connect(message => {
        if (message.type !== 'send') return;
        console.dir(message.payload, { depth: null });

        if (!message.payload) {
            throw new Error('Got frida message without payload');
        }

        if (message.payload.debug) {
            // console.dir(message.payload as AgentDebugMessage, { depth: null });
            return;
        } else if (typeof message.payload.tap === 'string') {
            const payload = message.payload as AgentTap;
            tapStream.write(payload.tap.replace(/\r?\n$/, '') + '\n');
        } else if (typeof message.payload.complete === 'boolean') {
            const payload = message.payload as AgentComplete;
            console.log(`🥹 Got finished`);
        } else {
            throw new Error(`Got unexpected payload: ${JSON.stringify(message.payload)}`);
        }
    });

    // Close stream if the script dies
    script.destroyed.connect(() => {
        console.log('script destroyed');
        return tapStream.end();
    });

    tapStream.on('finish', () => {
        console.log('tap stream finished');
    });

    await script.load();

    console.log('finished loading');

    // Important: spawned process is suspended until resumed
    await frida.resume(pid);

    console.log('finished resuming');
}

(async () => {
    try {
        await main();
    } catch (err: any) {
        console.error(err?.stack || String(err));
        process.exit(1);
    }
})();
