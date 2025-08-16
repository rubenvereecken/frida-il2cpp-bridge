import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === LIVENESS FUNCTIONS ===
export const nativeLivenessCalculationBegin = lazy(() =>
    lookup('il2cpp_unity_liveness_calculation_begin', 'pointer', [
        'pointer',
        'int',
        'pointer',
        'pointer',
        'pointer',
        'pointer',
    ])
);

export const nativeLivenessCalculationEnd = lazy(() =>
    lookup('il2cpp_unity_liveness_calculation_end', 'void', ['pointer'])
);

export const nativeLivenessCalculationFromRoot = lazy(() =>
    lookup('il2cpp_unity_liveness_calculation_from_root', 'void', ['pointer', 'pointer'])
);

export const nativeLivenessCalculationFromStatics = lazy(() =>
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
export const nativeLivenessAllocateStruct = lazy(() =>
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
export const nativeLivenessFinalize = lazy(() =>
    lookup('il2cpp_unity_liveness_finalize', 'void', ['pointer'])
);

/**
 * Frees a liveness struct.
 * @param liveness Il2CppLivenessCalculation* - The liveness calculation to free
 */
export const nativeLivenessFreeStruct = lazy(() =>
    lookup('il2cpp_unity_liveness_free_struct', 'void', ['pointer'])
);
