import { slow } from '../utils/cache.js';
import { lookup } from './common.js';

// === MEMORY SNAPSHOT FUNCTIONS ===
/**
 * Captures a memory snapshot of the IL2CPP runtime.
 * @returns Il2CppManagedMemorySnapshot* - The captured memory snapshot
 */
export const nativeMemorySnapshotCapture = slow(() =>
    lookup('il2cpp_capture_memory_snapshot', 'pointer', [])
);

/**
 * Frees a previously captured memory snapshot.
 * @param snapshot Il2CppManagedMemorySnapshot* - The snapshot to free
 */
export const nativeMemorySnapshotFree = slow(() =>
    lookup('il2cpp_free_captured_memory_snapshot', 'void', ['pointer'])
);

/**
 * Gets classes from a memory snapshot.
 * @param snapshot Il2CppManagedMemorySnapshot* - The memory snapshot
 * @param size size_t* - Output parameter for the number of classes
 * @returns Il2CppManagedMemorySnapshotClasses* - Array of classes
 */
export const nativeMemorySnapshotGetClasses = slow(() =>
    lookup('il2cpp_memory_snapshot_get_classes', 'pointer', ['pointer', 'pointer'])
);

/**
 * Gets objects from a memory snapshot.
 * @param snapshot Il2CppManagedMemorySnapshot* - The memory snapshot
 * @param size size_t* - Output parameter for the number of objects
 * @returns Il2CppManagedMemorySnapshotObjects* - Array of objects
 */
export const nativeMemorySnapshotGetObjects = slow(() =>
    lookup('il2cpp_memory_snapshot_get_objects', 'pointer', ['pointer', 'pointer'])
);
