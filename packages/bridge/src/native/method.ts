import { slow } from '../utils/cache.js';
import { lookup } from './common.js';

// === METHOD FUNCTIONS ===
/**
 * Gets the return type of a method.
 * @param method MethodInfo* - The method to get the return type of
 * @returns Il2CppType* - The return type
 */
export const nativeMethodGetReturnType = slow(() =>
    lookup('il2cpp_method_get_return_type', 'pointer', ['pointer'])
);

/**
 * Gets the class that declares a method.
 * @param method MethodInfo* - The method to get the declaring class of
 * @returns Il2CppClass* - The declaring class
 */
export const nativeMethodGetDeclaringClass = slow(() =>
    lookup('il2cpp_method_get_declaring_type', 'pointer', ['pointer'])
);

/**
 * Gets the name of a method.
 * @param method MethodInfo* - The method to get the name of
 * @returns const char* - The method name
 */
export const nativeMethodGetName = slow(() =>
    lookup('il2cpp_method_get_name', 'pointer', ['pointer'])
);

/**
 * Gets the method from a reflection method object.
 * @param method Il2CppReflectionMethod* - The reflection method
 * @returns MethodInfo* - The method info
 */
export const nativeMethodGetFromReflection = slow(() =>
    lookup('il2cpp_method_get_from_reflection', 'pointer', ['pointer'])
);

/**
 * Gets a reflection method object for a method.
 * @param method MethodInfo* - The method to get the reflection object for
 * @param refclass Il2CppClass* - The reflection class
 * @returns Il2CppReflectionMethod* - The reflection method object
 */
export const nativeMethodGetObject = slow(() =>
    lookup('il2cpp_method_get_object', 'pointer', ['pointer', 'pointer'])
);

/**
 * Determines whether a method is generic.
 * @param method MethodInfo* - The method to check
 * @returns bool - True if the method is generic
 */
export const nativeMethodIsGeneric = slow(() =>
    lookup('il2cpp_method_is_generic', 'bool', ['pointer'])
);

/**
 * Determines whether a method is inflated (generic instance).
 * @param method MethodInfo* - The method to check
 * @returns bool - True if the method is inflated
 */
export const nativeMethodIsInflated = slow(() =>
    lookup('il2cpp_method_is_inflated', 'bool', ['pointer'])
);

/**
 * Determines whether a method is an instance method.
 * @param method MethodInfo* - The method to check
 * @returns bool - True if the method is an instance method
 */
export const nativeMethodIsInstance = slow(() =>
    lookup('il2cpp_method_is_instance', 'bool', ['pointer'])
);

/**
 * Gets the number of parameters of a method.
 * @param method MethodInfo* - The method to get parameter count of
 * @returns uint32_t - The number of parameters
 */
export const nativeMethodGetParameterCount = slow(() =>
    lookup('il2cpp_method_get_param_count', 'uint32', ['pointer'])
);

/**
 * Gets the type of a method parameter at the specified index.
 * @param method MethodInfo* - The method to get parameter type from
 * @param index uint32_t - The parameter index
 * @returns Il2CppType* - The parameter type
 */
export const nativeMethodGetParameterType = slow(() =>
    lookup('il2cpp_method_get_param', 'pointer', ['pointer', 'uint32'])
);

/**
 * Gets the class that contains a method.
 * @param method MethodInfo* - The method to get the class of
 * @returns Il2CppClass* - The containing class
 */
export const nativeMethodGetClass = slow(() =>
    lookup('il2cpp_method_get_class', 'pointer', ['pointer'])
);

/**
 * Determines whether a method has the specified attribute.
 * @param method MethodInfo* - The method to check
 * @param attr_class Il2CppClass* - The attribute class to look for
 * @returns bool - True if the method has the attribute
 */
export const nativeMethodHasAttribute = slow(() =>
    lookup('il2cpp_method_has_attribute', 'bool', ['pointer', 'pointer'])
);

/**
 * Gets the flags of a method.
 * @param method MethodInfo* - The method to get flags from
 * @param iflags uint32_t* - Pointer to store implementation flags
 * @returns uint32_t - The method flags
 */
export const nativeMethodGetFlags = slow(() =>
    lookup('il2cpp_method_get_flags', 'uint32', ['pointer', 'pointer'])
);

/**
 * Gets the metadata token of a method.
 * @param method MethodInfo* - The method to get the token of
 * @returns uint32_t - The method token
 */
export const nativeMethodGetToken = slow(() =>
    lookup('il2cpp_method_get_token', 'uint32', ['pointer'])
);

/**
 * Gets the name of a method parameter at the specified index.
 * @param method MethodInfo* - The method to get parameter name from
 * @param index uint32_t - The parameter index
 * @returns const char* - The parameter name
 */
export const nativeMethodGetParameterName = slow(() =>
    lookup('il2cpp_method_get_param_name', 'pointer', ['pointer', 'uint32'])
);
