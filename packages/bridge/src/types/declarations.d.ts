/**
 * Global type declarations for frida-il2cpp-bridge
 *
 * These declarations extend the global scope to allow library users
 * to override certain configuration values.
 */

declare global {
    /**
     * Optional Unity version override that library users can set.
     *
     * When set, this value will be used instead of auto-detecting the Unity version
     * from the application binary.
     *
     * @example
     * ```typescript
     * // Override the Unity version before using the library
     * globalThis.IL2CPP_UNITY_VERSION = "2021.3.16f1";
     *
     * Il2Cpp.perform(() => {
     *   console.log(Il2Cpp.application.unityVersion); // "2021.3.16f1"
     * });
     * ```
     *
     * @remarks
     * The version string must match the Unity version format:
     * `(6\d{3}|20\d{2}|\d)\.(\d)\.(\d{1,2})(?:[abcfp]|rc){0,2}\d?`
     *
     * Examples of valid versions:
     * - "2021.3.16f1"
     * - "2022.1.0a12"
     * - "5.6.7p4"
     * - "6000.1.0f1"
     */
    var IL2CPP_UNITY_VERSION: string | undefined;

    /**
     * Optional IL2CPP module name override that library users can set.
     *
     * When set, this value will be used instead of the default platform-specific
     * module names when locating the IL2CPP native library.
     *
     * @example
     * ```typescript
     * // Override the module name before using the library
     * globalThis.IL2CPP_MODULE_NAME = "CustomModule.dll";
     *
     * Il2Cpp.perform(() => {
     *   // The library will now look for "CustomModule.dll" instead of
     *   // the default platform-specific names
     * });
     * ```
     *
     * @remarks
     * Default module names by platform:
     * - Android: `libil2cpp.so`
     * - Linux: `GameAssembly.so`
     * - Windows: `GameAssembly.dll`
     * - iOS: `UnityFramework`
     * - macOS: `GameAssembly.dylib`
     */
    var IL2CPP_MODULE_NAME: string | undefined;
}

export {};
