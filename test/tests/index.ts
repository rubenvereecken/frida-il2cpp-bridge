// Build this with esbuild into a single JS file for Frida.
// Example: esbuild agent.ts --bundle --platform=browser --format=iife --target=es2018 --outfile=dist/agent.bundle.js

import { test } from 'zora';
import type { AgentOutboundMessage } from '../shared.js';

// Frida provides `send()` in the agent; declare for TypeScript.
declare function send(payload: AgentOutboundMessage): void;

// Forward any console output as TAP lines via Frida messages
(function wireConsoleToFrida() {
    const origLog = console.log.bind(console);
    const origErr = console.error.bind(console);

    function forward(line: string) {
        if (!line) return;
        // Each call sends exactly one TAP line to the host
        send({ tap: line });
    }

    function splitAndForward(text: string) {
        text.split(/\r?\n/)
            .map(s => s.trimEnd())
            .filter(Boolean)
            .forEach(forward);
    }

    // Replace console methods used by zora reporters
    console.log = (...args: any[]) => splitAndForward(args.map(String).join(' '));
    console.error = (...args: any[]) => splitAndForward(args.map(String).join(' '));

    // Keep warn/info quiet or route them as comments if needed later
    // console.warn = console.info = console.log;
})();

// A tiny demo test so you can see it working
test('zora in Frida emits TAP', t => {
    t.eq(1 + 1, 2, '1 + 1 = 2');
    t.ok(true, 'truth holds');
});

// zora auto-runs and prints TAP to console; our console shim forwards lines via send()
// If you ever want JSON events instead of TAP, zora supports a JSON reporter via env/config,
// but TAP keeps the runner-deps tiny. :contentReference[oaicite:2]{index=2}
