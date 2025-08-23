import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === THREAD AFFINITY FUNCTIONS ===
/**
 * Sets the default thread affinity mask for new threads.
 * @param affinity int64_t - The thread affinity mask
 */
export const getNativeSetDefaultThreadAffinity = memoize(() =>
    lookup('il2cpp_set_default_thread_affinity', 'void', ['int64'])
);
