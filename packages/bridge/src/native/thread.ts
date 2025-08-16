import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === THREAD FUNCTIONS ===
/**
 * Gets the current thread.
 * @returns Il2CppThread* - The current thread
 */
export const nativeThreadGetCurrent = lazy(() => lookup('il2cpp_thread_current', 'pointer', []));

/**
 * Attaches the current native thread to the IL2CPP domain.
 * @param domain Il2CppDomain* - The domain to attach to
 * @returns Il2CppThread* - The attached thread
 */
export const nativeThreadAttach = lazy(() =>
    lookup('il2cpp_thread_attach', 'pointer', ['pointer'])
);

/**
 * Detaches the specified thread from the IL2CPP domain.
 * @param thread Il2CppThread* - The thread to detach
 */
export const nativeThreadDetach = lazy(() => lookup('il2cpp_thread_detach', 'void', ['pointer']));

/**
 * Gets all threads attached to the domain.
 * @param size size_t* - Output parameter for the number of threads
 * @returns Il2CppThread** - Array of attached threads
 */
export const nativeThreadGetAttachedThreads = lazy(() =>
    lookup('il2cpp_thread_get_all_attached_threads', 'pointer', ['pointer'])
);

/**
 * Checks if the specified thread is a VM thread.
 * @param thread Il2CppThread* - The thread to check
 * @returns bool - True if the thread is a VM thread
 */
export const nativeThreadIsVm = lazy(() => lookup('il2cpp_is_vm_thread', 'bool', ['pointer']));
