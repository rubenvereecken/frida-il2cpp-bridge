import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === GC HANDLE FUNCTIONS ===
/**
 * Creates a new GC handle for an object.
 * @param obj Il2CppObject* - The object to create a handle for
 * @param pinned bool - Whether to pin the object in memory
 * @returns uint32_t - The GC handle
 */
export const getNativeGcHandleNew = memoize(() =>
    lookup('il2cpp_gchandle_new', 'uint32', ['pointer', 'bool'])
);

/**
 * Creates a new weak reference GC handle for an object.
 * @param obj Il2CppObject* - The object to create a weak reference for
 * @param track_resurrection bool - Whether to track resurrection
 * @returns uint32_t - The weak GC handle
 */
export const getNativeGcHandleNewWeakRef = memoize(() =>
    lookup('il2cpp_gchandle_new_weakref', 'uint32', ['pointer', 'bool'])
);

/**
 * Gets the target object from a GC handle.
 * @param gchandle uint32_t - The GC handle
 * @returns Il2CppObject* - The target object, or null if collected
 */
export const getNativeGcHandleGetTarget = memoize(() =>
    lookup('il2cpp_gchandle_get_target', 'pointer', ['uint32'])
);

/**
 * Frees a GC handle.
 * @param gchandle uint32_t - The GC handle to free
 */
export const getNativeGcHandleFree = memoize(() => lookup('il2cpp_gchandle_free', 'void', ['uint32']));

/**
 * Iterates over all GC handles with a callback.
 * @param func void(*)(void* data, void* userData) - Callback for each handle
 * @param userData void* - User data passed to the callback
 */
export const getNativeGcHandleForEachGetTarget = memoize(() =>
    lookup('il2cpp_gchandle_foreach_get_target', 'void', ['pointer', 'pointer'])
);
