import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === DEBUG METADATA FUNCTIONS ===
/**
 * Gets debug information for the specified method.
 * @param method Il2CppMethod* - The method to get debug info for
 * @param debugInfo Il2CppMethodDebugInfo* - Output parameter for debug information
 * @returns bool - True if debug information was found
 */
export const nativeDebugGetMethodInfo = lazy(() =>
    lookup('il2cpp_debug_get_method_info', 'bool', ['pointer', 'pointer'])
);
