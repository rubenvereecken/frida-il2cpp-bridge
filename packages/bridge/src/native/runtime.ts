import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === VM RUNTIME INFO FUNCTIONS ===
/**
 * Gets the size of the object header.
 * @returns uint32_t - The object header size in bytes
 */
export const nativeObjectHeaderSize = lazy(() => lookup('il2cpp_object_header_size', 'uint32', []));

/**
 * Gets the size of the array object header.
 * @returns uint32_t - The array object header size in bytes
 */
export const nativeArrayObjectHeaderSize = lazy(() =>
    lookup('il2cpp_array_object_header_size', 'uint32', [])
);

/**
 * Gets the offset of the array length field in the array object header.
 * @returns uint32_t - The offset of the length field
 */
export const nativeOffsetOfArrayLengthInArrayObjectHeader = lazy(() =>
    lookup('il2cpp_offset_of_array_length_in_array_object_header', 'uint32', [])
);

/**
 * Gets the offset of the array bounds field in the array object header.
 * @returns uint32_t - The offset of the bounds field
 */
export const nativeOffsetOfArrayBoundsInArrayObjectHeader = lazy(() =>
    lookup('il2cpp_offset_of_array_bounds_in_array_object_header', 'uint32', [])
);

/**
 * Gets the allocation granularity used by the runtime.
 * @returns uint32_t - The allocation granularity in bytes
 */
export const nativeAllocationGranularity = lazy(() =>
    lookup('il2cpp_allocation_granularity', 'uint32', [])
);

// === RUNTIME FUNCTIONS ===
/**
 * Invokes a method with the specified parameters and returns the result.
 * @param method Il2CppMethod* - The method to invoke
 * @param obj Il2CppObject* - The object instance (null for static methods)
 * @param params void** - Array of parameters
 * @param exc Il2CppException** - Output parameter for exceptions
 * @returns Il2CppObject* - The return value of the method
 */
export const nativeRuntimeInvoke = lazy(() =>
    lookup('il2cpp_runtime_invoke', 'pointer', ['pointer', 'pointer', 'pointer', 'pointer'])
);

/**
 * Invokes a method with automatic argument conversion.
 * @param method Il2CppMethod* - The method to invoke
 * @param obj Il2CppObject* - The object instance (null for static methods)
 * @param params void** - Array of parameters
 * @param argc int - Number of arguments
 * @param exc Il2CppException** - Output parameter for exceptions
 * @returns Il2CppObject* - The return value of the method
 */
export const nativeRuntimeInvokeConvertArgs = lazy(() =>
    lookup('il2cpp_runtime_invoke_convert_args', 'pointer', [
        'pointer',
        'pointer',
        'pointer',
        'int',
        'pointer',
    ])
);

/**
 * Sets the unhandled exception policy for the runtime.
 * @param policy int - The exception policy to set
 */
export const nativeRuntimeUnhandledExceptionPolicySet = lazy(() =>
    lookup('il2cpp_runtime_unhandled_exception_policy_set', 'void', ['int'])
);
