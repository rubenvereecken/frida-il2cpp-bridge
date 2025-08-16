import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === STRING FUNCTIONS ===
/**
 * Gets the length of the specified string.
 * @param str Il2CppString* - The string to get the length of
 * @returns int32_t - The length of the string
 */
export const nativeStringGetLength = lazy(() =>
    lookup('il2cpp_string_length', 'int32', ['pointer'])
);

/**
 * Gets a pointer to the character data of the specified string.
 * @param str Il2CppString* - The string to get characters from
 * @returns Il2CppChar* - Pointer to the string's character data
 */
export const nativeStringGetChars = lazy(() =>
    lookup('il2cpp_string_chars', 'pointer', ['pointer'])
);

/**
 * Creates a new IL2CPP string from a null-terminated C string.
 * @param str const char* - The C string to convert
 * @returns Il2CppString* - The new IL2CPP string
 */
export const nativeStringNew = lazy(() => lookup('il2cpp_string_new', 'pointer', ['pointer']));

/**
 * Creates a new IL2CPP string from a C string with specified length.
 * @param str const char* - The C string to convert
 * @param length uint32_t - The length of the string
 * @returns Il2CppString* - The new IL2CPP string
 */
export const nativeStringNewLen = lazy(() =>
    lookup('il2cpp_string_new_len', 'pointer', ['pointer', 'uint32'])
);

/**
 * Creates a new IL2CPP string from a UTF-16 string.
 * @param text const Il2CppChar* - The UTF-16 string to convert
 * @param len int32_t - The length of the string
 * @returns Il2CppString* - The new IL2CPP string
 */
export const nativeStringNewUtf16 = lazy(() =>
    lookup('il2cpp_string_new_utf16', 'pointer', ['pointer', 'int32'])
);

/**
 * Creates a wrapper string without copying the data.
 * @param str const char* - The C string to wrap
 * @returns Il2CppString* - The wrapped string
 */
export const nativeStringNewWrapper = lazy(() =>
    lookup('il2cpp_string_new_wrapper', 'pointer', ['pointer'])
);

/**
 * Interns the specified string.
 * @param str Il2CppString* - The string to intern
 * @returns Il2CppString* - The interned string
 */
export const nativeStringIntern = lazy(() =>
    lookup('il2cpp_string_intern', 'pointer', ['pointer'])
);

/**
 * Checks if the specified string is interned.
 * @param str Il2CppString* - The string to check
 * @returns Il2CppString* - The interned string if found, null otherwise
 */
export const nativeStringIsInterned = lazy(() =>
    lookup('il2cpp_string_is_interned', 'pointer', ['pointer'])
);
