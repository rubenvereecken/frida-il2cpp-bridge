import { slow } from '../utils/cache.js';
import { lookup } from './common.js';

// === MEMORY MANAGEMENT ===
/**
 * Allocates memory using the IL2CPP memory allocator.
 * @param size size_t - The number of bytes to allocate
 * @returns void* - Pointer to the allocated memory
 */
export const nativeAlloc = slow(() => lookup('il2cpp_alloc', 'pointer', ['size_t']));

/**
 * Frees memory allocated by the IL2CPP memory allocator.
 * @param ptr void* - Pointer to the memory to free
 */
export const nativeFree = slow(() => lookup('il2cpp_free', 'void', ['pointer']));
