import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === ARRAY FUNCTIONS ===
/**
 * Gets the class for an array type with the specified element class and rank.
 * @param element_class Il2CppClass* - The class of the array elements
 * @param rank uint32_t - The rank (number of dimensions) of the array
 * @returns Il2CppClass* - The array class
 */
export const getNativeArrayGetClass = memoize(() =>
    lookup('il2cpp_array_class_get', 'pointer', ['pointer', 'uint32'])
);

/**
 * Gets the length (number of elements) of an array.
 * @param array Il2CppArray* - The array object
 * @returns uint32_t - The number of elements in the array
 */
export const getNativeArrayGetLength = memoize(() =>
    lookup('il2cpp_array_length', 'uint32', ['pointer'])
);

/**
 * Gets the total byte length of an array's data.
 * @param array Il2CppArray* - The array object
 * @returns uint32_t - The total size in bytes of the array data
 */
export const getNativeArrayGetByteLength = memoize(() =>
    lookup('il2cpp_array_get_byte_length', 'uint32', ['pointer'])
);

/**
 * Creates a new single-dimensional array with the specified length.
 * @param array_class Il2CppClass* - The array class (use arrayGetClass to obtain)
 * @param length uint32_t - The number of elements in the array
 * @returns Il2CppArray* - The newly created array object
 */
export const getNativeArrayNew = memoize(() =>
    lookup('il2cpp_array_new', 'pointer', ['pointer', 'uint32'])
);

/**
 * Creates a new array with the specified array class and length.
 * @param array_class Il2CppClass* - The specific array class
 * @param length uint32_t - The number of elements in the array
 * @returns Il2CppArray* - The newly created array object
 */
export const getNativeArrayNewSpecific = memoize(() =>
    lookup('il2cpp_array_new_specific', 'pointer', ['pointer', 'uint32'])
);

/**
 * Creates a new multi-dimensional array with specified dimensions and bounds.
 * @param array_class Il2CppClass* - The array class
 * @param lengths uint32_t* - Array of dimension lengths
 * @param lower_bounds int32_t* - Array of lower bounds for each dimension (can be NULL)
 * @returns Il2CppArray* - The newly created multi-dimensional array
 */
export const getNativeArrayNewFull = memoize(() =>
    lookup('il2cpp_array_new_full', 'pointer', ['pointer', 'pointer', 'pointer'])
);

/**
 * Gets the class for a bounded array type.
 * @param element_class Il2CppClass* - The class of the array elements
 * @param rank uint32_t - The rank (number of dimensions) of the array
 * @param bounded bool - Whether the array has non-zero lower bounds
 * @returns Il2CppClass* - The bounded array class
 */
export const getNativeBoundedArrayClassGet = memoize(() =>
    lookup('il2cpp_bounded_array_class_get', 'pointer', ['pointer', 'uint32', 'bool'])
);

/**
 * Gets the size in bytes of a single element in the array.
 * @param array_class Il2CppClass* - The array class
 * @returns int - The size in bytes of each array element
 */
export const getNativeArrayElementSize = memoize(() =>
    lookup('il2cpp_array_element_size', 'int', ['pointer'])
);
