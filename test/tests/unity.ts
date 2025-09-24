import { type ITester } from "zora";
import { performAsync } from "./common.js";
import {
  getCurrentThread,
  getDomain,
  getUnityVersionRaw,
  System,
} from "@frida-il2cpp/bridge";

export function unityTests(test: ITester["test"]) {
  test("unity basics", async (t) => {
    await performAsync(() => {
      t.eq(getUnityVersionRaw(), "2022.3.62f1", "read Unity version");
    });
  });

  test("unity thread", async (t) => {
    await performAsync(() => {
      // TODO get on top of threads
      // t.notEq(getCurrentThread(), null, 'get current thread');
      // t.eq(Process.getCurrentThreadId(), getCurrentThread().id);
    });
  });

  test("domain", async (t) => {
    await performAsync(() => {
      t.notEq(getDomain().handle, null, "domain handle");
      t.notEq(getDomain().assemblies.length, 0, "domain assemblies");
    });
  });
}
