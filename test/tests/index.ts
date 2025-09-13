// Build this with esbuild into a single JS file for Frida.
// Example: esbuild agent.ts --bundle --platform=browser --format=iife --target=es2018 --outfile=dist/agent.bundle.js

import { createHarness, createTAPReporter } from 'zora';
import type { AgentDebug, AgentTap } from '../shared.js';
import { getUnityVersionRaw, perform } from '@frida-il2cpp/bridge';

// Frida provides `send()` in the agent; declare for TypeScript.
declare function send(payload: AgentTap | AgentDebug): void;
declare const rpc: {
    exports: {
        runTests: () => Promise<void>;
    };
};

function sendDebug(debug: unknown) {
    send({ debug } satisfies AgentDebug);
}

function writeTap(message: any) {
    message
        .toString()
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line: string) => {
            send({ tap: line } satisfies AgentTap);
        });
}

function performAsync(cb: () => void) {
    return new Promise<void>(res =>
        perform(() => {
            cb();
            res();
        })
    );
}

// Create a custom harness instead of using the global one
const harness = createHarness({});
const { test } = harness;

// Your tests
test('zora in Frida emits TAP', t => {
    t.eq(1 + 1, 2, 'TAP works');
});

test('unity version', async t => {
    await performAsync(() => {
        t.eq(getUnityVersionRaw(), '2022.3.62f1', 'read Unity version');
    });
});

// Run tests and signal completion
rpc.exports = {
    runTests: async function () {
        try {
            const reporter = createTAPReporter({ log: writeTap });

            // Start the test run
            await harness.report({ reporter });
        } catch (error) {
            send({ debug: `Error: ${error}` } satisfies AgentDebug);
        } finally {
        }
    },
};
