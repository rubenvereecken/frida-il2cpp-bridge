import { createHarness } from "zora";
import { indentedTapReporter } from "zora-tap-reporter";
import type { AgentDebug, AgentTap } from "../shared.js";
import { unityTests } from "./unity.js";

// Frida provides `send()` in the agent; declare for TypeScript.
declare function send(payload: AgentTap | AgentDebug): void;
declare const rpc: {
  exports: {
    runTests: () => Promise<void>;
  };
};

// Custom reporter that wraps indentedTapReporter for Frida
function createFridaReporter() {
  let outputBuffer = "";

  // Create a custom logger that captures output instead of writing to console
  const customLogger = {
    log: (...args: any[]) => {
      const data = args.join(" ") + "\n";
      outputBuffer += data;
      // Split by lines and send each line
      const lines = outputBuffer.split("\n");
      outputBuffer = lines.pop() || ""; // Keep incomplete line in buffer

      lines.forEach((line) => {
        if (line.trim()) {
          send({ tap: line } satisfies AgentTap);
        }
      });
    },
  };

  // Return the indentedTapReporter configured with our custom logger
  return indentedTapReporter(customLogger);
}

// Create a custom harness instead of using the global one
const harness = createHarness();
const { test } = harness;

// Make sure the basics work
test("Test framework: Zora inside Frida", (t) => {
  t.eq(1 + 1, 2, "TAP works");
});

unityTests(test);

// Run tests and signal completion
rpc.exports = {
  runTests: async function () {
    try {
      // Use the indented TAP reporter from zora-tap-reporter
      await harness.report(createFridaReporter());
    } catch (error) {
      send({ debug: `Error: ${error}` } satisfies AgentDebug);
      if (error instanceof Error && error.stack) {
        send({ debug: `Stack: ${error.stack}` } satisfies AgentDebug);
      }
    }
  },
};
