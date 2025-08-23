import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === IMAGE FUNCTIONS ===
/**
 * Gets the assembly that contains the specified image.
 * @param image Il2CppImage* - The image to get the assembly from
 * @returns Il2CppAssembly* - The assembly containing the image
 */
export const getNativeImageGetAssembly = memoize(() =>
    lookup('il2cpp_image_get_assembly', 'pointer', ['pointer'])
);

/**
 * Gets the name of the specified image.
 * @param image Il2CppImage* - The image to get the name of
 * @returns const char* - The name of the image
 */
export const getNativeImageGetName = memoize(() =>
    lookup('il2cpp_image_get_name', 'pointer', ['pointer'])
);

/**
 * Gets the filename of the specified image.
 * @param image Il2CppImage* - The image to get the filename of
 * @returns const char* - The filename of the image
 * @see il2cpp_mono_image_get_filename - Mono API equivalent
 */
export const getNativeImageGetFilename = memoize(() =>
    lookup('il2cpp_image_get_filename', 'pointer', ['pointer'])
);

/**
 * Gets the entry point method of the specified image.
 * @param image Il2CppImage* - The image to get the entry point from
 * @returns Il2CppMethod* - The entry point method
 * @see il2cpp_mono_image_get_entry_point - Mono API equivalent
 */
export const getNativeImageGetEntryPoint = memoize(() =>
    lookup('il2cpp_image_get_entry_point', 'pointer', ['pointer'])
);

/**
 * Gets the number of classes in the specified image.
 * @param image Il2CppImage* - The image to get the class count from
 * @returns size_t - The number of classes in the image
 */
export const getNativeImageGetClassCount = memoize(() =>
    lookup('il2cpp_image_get_class_count', 'size_t', ['pointer'])
);

/**
 * Gets the class at the specified index in the image.
 * @param image Il2CppImage* - The image to get the class from
 * @param index size_t - The index of the class to retrieve
 * @returns Il2CppClass* - The class at the specified index
 */
export const getNativeImageGetClass = memoize(() =>
    lookup('il2cpp_image_get_class', 'pointer', ['pointer', 'size_t'])
);

// === MONO-SPECIFIC IMAGE FUNCTIONS ===

/**
 * Gets the GUID of the specified image (Mono API).
 * Note: IL2CPP doesn't have image GUIDs, returns hardcoded value.
 * @param image Il2CppImage* - The image to get the GUID from
 * @returns const char* - Hardcoded GUID "00000000-0000-0000-0000-000000000000"
 */
export const getNativeImageGetGuid = memoize(() =>
    lookup('mono_image_get_guid', 'pointer', ['pointer'])
);

/**
 * Checks if the specified image is dynamic (Mono API).
 * Note: IL2CPP images are never dynamic, always returns false.
 * @param image Il2CppImage* - The image to check
 * @returns mono_bool - Always false for IL2CPP
 */
export const getNativeImageIsDynamic = memoize(() =>
    lookup('mono_image_is_dynamic', 'bool', ['pointer'])
);
