import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === LOGGING FUNCTIONS ===
/**
 * Registers a callback function for IL2CPP log messages.
 * @param callback Il2CppLogCallback - The callback function for log messages
 */
export const nativeRegisterLogCallback = lazy(() =>
    lookup('il2cpp_register_log_callback', 'void', ['pointer'])
);
