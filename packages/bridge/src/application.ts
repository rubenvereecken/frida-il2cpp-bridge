import { memoize } from './utils/cache.js';
import { raise } from './utils/error.js';
import { UnityVersion } from './utils/unity-version.js';
import { getNativeResolveInternalCall } from './native/index.js';
import { getModule } from './module.js';

/**
 * Gets the data path name of the current application, e.g.
 * `/data/emulated/0/Android/data/com.example.application/files`
 * on Android.
 *
 * **This information is not guaranteed to exist.**
 *
 * ```ts
 * Il2Cpp.perform(() => {
 *     // prints /data/emulated/0/Android/data/com.example.application/files
 *     console.log(Il2Cpp.application.dataPath);
 * });
 * ```
 */
export const getDataPath = memoize(() => unityEngineCall('get_persistentDataPath'));

/**
 * Gets the identifier name of the current application, e.g.
 * `com.example.application` on Android.
 *
 * **This information is not guaranteed to exist.**
 *
 * ```ts
 * Il2Cpp.perform(() => {
 *     // prints com.example.application
 *     console.log(Il2Cpp.application.identifier);
 * });
 * ```
 */
export const getIdentifier = memoize(
    () => unityEngineCall('get_identifier') ?? unityEngineCall('get_bundleIdentifier')
);
/**
 * Gets the version name of the current application, e.g. `4.12.8`.
 *
 * **This information is not guaranteed to exist.**
 *
 * ```ts
 * Il2Cpp.perform(() => {
 *     // prints 4.12.8
 *     console.log(Il2Cpp.application.version);
 * });
 * ```
 */
export const getVersion = memoize(() =>
    // Alternatively, could use `Il2Cpp.domain.assembly("UnityEngine.CoreModule").image.class("UnityEngine.Application").m.get_version()`
    unityEngineCall('get_version')
);

/**
 * Gets the Unity version of the current application.
 *
 * **It is possible to override or manually set its value using a global
 * variable:**
 * ```ts
 * globalThis.IL2CPP_UNITY_VERSION = "5.3.5f1";
 *
 * Il2Cpp.perform(() => {
 *     // prints 5.3.5f1
 *     console.log(Il2Cpp.unityVersion);
 * });
 * ```
 *
 * When overriding its value, the user has to make sure to set a valid
 * value so that it gets matched by the following regular expression:
 * ```
 * (20\d{2}|\d)\.(\d)\.(\d{1,2})(?:[abcfp]|rc){0,2}\d?
 * ```
 */
export const getUnityVersionRaw = memoize(() => {
    try {
        const unityVersionValue =
            globalThis.IL2CPP_UNITY_VERSION ?? unityEngineCall('get_unityVersion');

        if (unityVersionValue != null) {
            return unityVersionValue;
        }
    } catch (_) {}

    const searchPattern = '69 6c 32 63 70 70';
    const module = getModule();

    for (const range of module
        .enumerateRanges('r--')
        .concat(Process.getRangeByAddress(module.base))) {
        for (let { address } of Memory.scanSync(range.base, range.size, searchPattern)) {
            while (address.readU8() != 0) {
                address = address.sub(1);
            }
            const match = UnityVersion.find(address.add(1).readCString())?.versionString;

            if (match != undefined) {
                return match;
            }
        }
    }

    raise("couldn't determine the Unity version, please specify it manually");
});

export function getUnityVersion() {
    return new UnityVersion(getUnityVersionRaw());
}

export const isUnityVersionIsBelow201830 = () => getUnityVersion().lt(new UnityVersion('2018.3.0'));

export const isUnityVersionIsBelow202120 = () => getUnityVersion().lt(new UnityVersion('2021.2.0'));

export function unityEngineCall(method: string): string | null {
    const handle = getNativeResolveInternalCall()(
        Memory.allocUtf8String('UnityEngine.Application::' + method)
    );
    const getNativeFunction = new NativeFunction(handle, 'pointer', []);

    if (getNativeFunction.isNull()) {
        return null;
    }

    // TODO: Fix Il2Cpp.String dependency - for now return null until String is converted
    return null;
}
