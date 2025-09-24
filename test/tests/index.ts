import { createHarness, createTAPReporter } from 'zora';
import type { AgentDebug, AgentTap } from '../shared.js';
import { unityTests } from './unity.js';

// Frida provides `send()` in the agent; declare for TypeScript.
declare function send(payload: AgentTap | AgentDebug): void;
declare const rpc: {
    exports: {
        runTests: () => Promise<void>;
    };
};

function writeTap(message: any) {
    message
        .toString()
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line: string) => {
            send({ tap: line } satisfies AgentTap);
        });
}

// Create a custom harness instead of using the global one
const harness = createHarness({});
const { test } = harness;

// Make sure the basics work
test('zora in Frida emits TAP', t => {
    t.eq(1 + 1, 2, 'TAP works');
});

unityTests(test);

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
