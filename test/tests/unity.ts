import { type TestFunction } from "zora";
import { performAsync } from "./common.js";
import {
  getCurrentThread,
  getDomain,
  getUnityVersionRaw,
  System,
} from "@frida-il2cpp/bridge";

export function unityTests(describe: TestFunction) {
  describe("Unity", (t) => {
    t.test("basics", async (t) => {
      await performAsync(() => {
        t.eq(getUnityVersionRaw(), "2022.3.62f1", "read Unity version");
      });
    });

    t.skip("thread", async (t) => {
      await performAsync(() => {
        // TODO get on top of threads
        t.notEq(getCurrentThread(), null, "get current thread");
        t.eq(Process.getCurrentThreadId(), getCurrentThread()?.id);
      });
    });

    t.test("domain", async (t) => {
      await performAsync(() => {
        t.notEq(getDomain().handle, null, "domain handle");
        t.notEq(getDomain().assemblies.length, 0, "domain assemblies");
      });
    });
  });
}
