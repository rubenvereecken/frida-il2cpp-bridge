import { slow } from '../utils/cache.js';
import { lookup } from './common.js';

// === GC FUNCTIONS ===
/**
 * Forces garbage collection up to the specified generation.
 * @param maxGenerations int - Maximum generation to collect
 */
export const nativeGcCollect = slow(() => lookup('il2cpp_gc_collect', 'void', ['int']));

/**
 * Performs a small incremental garbage collection.
 * @returns int32_t - Result of the collection
 */
export const nativeGcCollectALittle = slow(() => lookup('il2cpp_gc_collect_a_little', 'int32', []));

/**
 * Starts an incremental garbage collection.
 */
export const nativeGcStartIncrementalCollection = slow(() =>
    lookup('il2cpp_gc_start_incremental_collection', 'void', [])
);

/**
 * Disables garbage collection.
 */
export const nativeGcDisable = slow(() => lookup('il2cpp_gc_disable', 'void', []));

/**
 * Enables garbage collection.
 */
export const nativeGcEnable = slow(() => lookup('il2cpp_gc_enable', 'void', []));

/**
 * Determines whether garbage collection is disabled.
 * @returns bool - True if GC is disabled
 */
export const nativeGcIsDisabled = slow(() => lookup('il2cpp_gc_is_disabled', 'bool', []));

/**
 * Sets the garbage collection mode.
 * @param mode Il2CppGCMode - The GC mode to set
 */
export const nativeGcSetMode = slow(() => lookup('il2cpp_gc_set_mode', 'void', ['int']));

/**
 * Gets the maximum time slice for incremental GC in nanoseconds.
 * @returns int64_t - The maximum time slice in nanoseconds
 */
export const nativeGcGetMaxTimeSlice = slow(() =>
    lookup('il2cpp_gc_get_max_time_slice_ns', 'int64', [])
);

/**
 * Sets the maximum time slice for incremental GC in nanoseconds.
 * @param maxTimeSlice int64_t - The maximum time slice in nanoseconds
 */
export const nativeGcSetMaxTimeSlice = slow(() =>
    lookup('il2cpp_gc_set_max_time_slice_ns', 'void', ['int64'])
);

/**
 * Determines whether incremental garbage collection is enabled.
 * @returns bool - True if incremental GC is enabled
 */
export const nativeGcIsIncremental = slow(() => lookup('il2cpp_gc_is_incremental', 'bool', []));

/**
 * Gets the amount of memory currently used by the GC heap.
 * @returns int64_t - The used heap size in bytes
 */
export const nativeGcGetUsedSize = slow(() => lookup('il2cpp_gc_get_used_size', 'int64', []));

/**
 * Gets the total size of the GC heap.
 * @returns int64_t - The heap size in bytes
 */
export const nativeGcGetHeapSize = slow(() => lookup('il2cpp_gc_get_heap_size', 'int64', []));

/**
 * Sets a field with write barrier for garbage collection.
 * @param obj Il2CppObject* - The object containing the field
 * @param targetAddress void** - Address of the field to set
 * @param object void* - The value to assign
 */
export const nativeGcWbarrierSetField = slow(() =>
    lookup('il2cpp_gc_wbarrier_set_field', 'void', ['pointer', 'pointer', 'pointer'])
);

/**
 * Determines whether the GC has strict write barriers.
 * @returns bool - True if GC has strict write barriers
 */
export const nativeGcHasStrictWbarriers = slow(() =>
    lookup('il2cpp_gc_has_strict_wbarriers', 'bool', [])
);

/**
 * Sets an external allocation tracker for the GC.
 * @param func void(*)(void*, size_t, int) - The tracker function
 */
export const nativeGcSetExternalAllocationTracker = slow(() =>
    lookup('il2cpp_gc_set_external_allocation_tracker', 'void', ['pointer'])
);

/**
 * Sets an external write barrier tracker for the GC.
 * @param func void(*)(void**) - The tracker function
 */
export const nativeGcSetExternalWbarrierTracker = slow(() =>
    lookup('il2cpp_gc_set_external_wbarrier_tracker', 'void', ['pointer'])
);

/**
 * Iterates over each heap with a callback.
 * @param func void(*)(void* data, void* userData) - Callback for each heap
 * @param userData void* - User data passed to the callback
 */
export const nativeGcForEachHeap = slow(() =>
    lookup('il2cpp_gc_foreach_heap', 'void', ['pointer', 'pointer'])
);

/**
 * Stops the garbage collector world (pauses all managed threads).
 */
export const nativeGcStopWorld = slow(() => lookup('il2cpp_stop_gc_world', 'void', []));

/**
 * Starts the garbage collector world (resumes all managed threads).
 */
export const nativeGcStartWorld = slow(() => lookup('il2cpp_start_gc_world', 'void', []));
