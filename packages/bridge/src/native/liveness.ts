import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === LIVENESS FUNCTIONS ===
export const getNativeLivenessCalculationBegin = memoize(() =>
    lookup('il2cpp_unity_liveness_calculation_begin', 'pointer', [
        'pointer',
        'int',
        'pointer',
        'pointer',
        'pointer',
        'pointer',
    ])
);

export const getNativeLivenessCalculationEnd = memoize(() =>
    lookup('il2cpp_unity_liveness_calculation_end', 'void', ['pointer'])
);

export const getNativeLivenessCalculationFromRoot = memoize(() =>
    lookup('il2cpp_unity_liveness_calculation_from_root', 'void', ['pointer', 'pointer'])
);

export const getNativeLivenessCalculationFromStatics = memoize(() =>
    lookup('il2cpp_unity_liveness_calculation_from_statics', 'void', ['pointer'])
);

/**
 * Allocates a liveness struct for Unity-specific functionality.
 * @param filter Il2CppObject* - Filter object
 * @param maxObjectCount int - Maximum object count
 * @param callback Il2CppLivenessCalculationCallback - Callback function
 * @param userdata void* - User data
 * @param worldChanged Il2CppLivenessWorldChangedCallback - World changed callback
 * @returns Il2CppLivenessCalculation* - The liveness calculation struct
 */
export const getNativeLivenessAllocateStruct = memoize(() =>
    lookup('il2cpp_unity_liveness_allocate_struct', 'pointer', [
        'pointer',
        'int',
        'pointer',
        'pointer',
        'pointer',
    ])
);

/**
 * Finalizes a liveness calculation.
 * @param liveness Il2CppLivenessCalculation* - The liveness calculation to finalize
 */
export const getNativeLivenessFinalize = memoize(() =>
    lookup('il2cpp_unity_liveness_finalize', 'void', ['pointer'])
);

/**
 * Frees a liveness struct.
 * @param liveness Il2CppLivenessCalculation* - The liveness calculation to free
 */
export const getNativeLivenessFreeStruct = memoize(() =>
    lookup('il2cpp_unity_liveness_free_struct', 'void', ['pointer'])
);
