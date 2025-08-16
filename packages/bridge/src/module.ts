import { nativeGetCorlib, nativeInitialize } from './native/index.js';
import { getApiLevel } from './utils/android.js';
import { raise } from './utils/error.js';
import { memoize } from './utils/cache.js';
import { forModule } from './utils/native-wait.js';

let initializedModule: Module | undefined;

/**
 * Gets the IL2CPP module (a *native library*), that is where the IL2CPP
 * exports will be searched for (see {@link Il2Cpp.exports}).
 *
 * The module is located by its name:
 * - Android: `libil2cpp.so`
 * - Linux: `GameAssembly.so`
 * - Windows: `GameAssembly.dll`
 * - iOS: `UnityFramework`
 * - macOS: `GameAssembly.dylib`
 *
 * On iOS and macOS, IL2CPP exports may be located within a module having
 * a different name.
 *
 * In any case, it is possible to override or set the IL2CPP module name
 * using a global variable:
 * ```ts
 * (globalThis as any).IL2CPP_MODULE_NAME = "CustomName.dylib";
 *
 * Il2Cpp.perform(() => {
 *     // ...
 * });
 * ```
 */
export const getModule = memoize(() => {
    if (initializedModule) return initializedModule;

    const [moduleName, fallback] = getExpectedModuleNames();
    return Process.findModuleByName(moduleName) ?? Process.getModuleByName(fallback);
});

/**
 * @internal
 * Waits for the IL2CPP native library to be loaded and initialized.
 */
export async function initializeIl2cpp(blocking = false): Promise<boolean> {
    // TODO double check if this logic adds up with `getModule`
    initializedModule ??=
        Process.platform == 'darwin'
            ? (Process.findModuleByAddress(DebugSymbol.fromName('il2cpp_init').address) ??
              (await forModule(...getExpectedModuleNames())))
            : await forModule(...getExpectedModuleNames());

    // At this point, the IL2CPP native library has been loaded, but we
    // cannot interact with IL2CPP until `il2cpp_init` is done.
    // It looks like `il2cpp_get_corlib` returns NULL only when the
    // initialization is not completed yet.
    if (nativeGetCorlib().isNull()) {
        return await new Promise<boolean>(resolve => {
            const interceptor = Interceptor.attach(nativeInitialize, {
                onLeave() {
                    interceptor.detach();
                    blocking ? resolve(true) : setImmediate(() => resolve(false));
                },
            });
        });
    }

    return false;
}

function getExpectedModuleNames(): string[] {
    if ((globalThis as any).IL2CPP_MODULE_NAME) {
        return [(globalThis as any).IL2CPP_MODULE_NAME];
    }

    switch (Process.platform) {
        case 'linux':
            return [getApiLevel() ? 'libil2cpp.so' : 'GameAssembly.so'];
        case 'windows':
            return ['GameAssembly.dll'];
        case 'darwin':
            return ['UnityFramework', 'GameAssembly.dylib'];
    }

    raise(`${Process.platform} is not supported yet`);
}
