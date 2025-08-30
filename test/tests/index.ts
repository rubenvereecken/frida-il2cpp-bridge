// Build this with esbuild into a single JS file for Frida.
// Example: esbuild agent.ts --bundle --platform=browser --format=iife --target=es2018 --outfile=dist/agent.bundle.js

import { createHarness, createTAPReporter } from 'zora';
import type { AgentComplete, AgentDebug, AgentDone, AgentTap } from '../shared.js';
import { getUnityVersionRaw, perform } from '@frida-il2cpp/bridge';

// Frida provides `send()` in the agent; declare for TypeScript.
declare function send(payload: AgentTap | AgentDebug | AgentComplete | AgentDone): void;

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
    t.eq(1 + 1, 2, 'async test');

    await new Promise(res => setTimeout(res, 1000));
    send({ debug: 'Finished promise' });
    t.truthy('hello', 'great');
    // await performAsync(() => {
    //     t.eq(1 + 1, 2, 'async il2cpp test');
    // });
});

// Run tests and signal completion
(async () => {
    try {
        const reporter = createTAPReporter({ log: writeTap });

        // Start the test run
        await harness.report({ reporter });
    } catch (error) {
        send({ debug: `Error: ${error}` } satisfies AgentDebug);
    } finally {
        send({ debug: 'Finished!' });
        // Signal completion to the host
        send({ complete: true } satisfies AgentComplete);
    }
})();
