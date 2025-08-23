import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === TYPE FUNCTIONS ===
/**
 * Gets the reflection object for the specified type.
 * Note that the original signature returns a Il2CppReflectionType*, but it's a full-blown Il2CppReflectionRuntimeType* underneath.
 *
 * @param type Il2CppType* - The type to get the reflection object for
 * @returns Il2CppReflectionRuntimeType* - Reflection object of type `System.RuntimeType`
 */
export const getNativeTypeGetObject = memoize(() =>
    lookup('il2cpp_type_get_object', 'pointer', ['pointer'])
);

/**
 * Gets the type enum value for the specified type.
 * @param type Il2CppType* - The type to get the enum value for
 * @returns int - The type enum value
 */
export const getNativeTypeGetTypeEnum = memoize(() =>
    lookup('il2cpp_type_get_type', 'int', ['pointer'])
);

/**
 * Gets the class from the specified type.
 * @param type Il2CppType* - The type to get the class from
 * @returns Il2CppClass* - The class representing the type
 */
export const getNativeTypeGetClass = memoize(() =>
    lookup('il2cpp_class_from_type', 'pointer', ['pointer'])
);

/**
 * Gets the class or element class from the specified type.
 * @param type Il2CppType* - The type to get the class from
 * @returns Il2CppClass* - The class or element class
 */
export const getNativeTypeGetClassOrElementClass = memoize(() =>
    lookup('il2cpp_type_get_class_or_element_class', 'pointer', ['pointer'])
);

/**
 * Gets the name of the specified type.
 * @param type Il2CppType* - The type to get the name of
 * @returns char* - The name of the type (must be freed with il2cpp_free)
 */
export const getNativeTypeGetName = memoize(() =>
    lookup('il2cpp_type_get_name', 'pointer', ['pointer'])
);

/**
 * Determines whether the specified type is a by-reference type.
 * @param type Il2CppType* - The type to check
 * @returns bool - True if the type is by-reference
 */
export const getNativeTypeIsByRef = memoize(() => lookup('il2cpp_type_is_byref', 'bool', ['pointer']));

/**
 * Gets the attributes of the specified type.
 * @param type Il2CppType* - The type to get the attributes of
 * @returns uint32_t - The type attributes
 */
export const getNativeTypeGetAttrs = memoize(() =>
    lookup('il2cpp_type_get_attrs', 'uint32', ['pointer'])
);

/**
 * Determines whether two types are equal.
 * @param type1 Il2CppType* - The first type to compare
 * @param type2 Il2CppType* - The second type to compare
 * @returns bool - True if the types are equal
 */
export const getNativeTypeEquals = memoize(() =>
    lookup('il2cpp_type_equals', 'bool', ['pointer', 'pointer'])
);

/**
 * Gets the assembly-qualified name of the specified type.
 * @param type Il2CppType* - The type to get the name of
 * @returns char* - The assembly-qualified name (must be freed with il2cpp_free)
 */
export const getNativeTypeGetAssemblyQualifiedName = memoize(() =>
    lookup('il2cpp_type_get_assembly_qualified_name', 'pointer', ['pointer'])
);

/**
 * Determines whether the specified type is static.
 * @param type Il2CppType* - The type to check
 * @returns bool - True if the type is static
 */
export const getNativeTypeIsStatic = memoize(() =>
    lookup('il2cpp_type_is_static', 'bool', ['pointer'])
);

/**
 * Determines whether the specified type is a pointer type.
 * @param type Il2CppType* - The type to check
 * @returns bool - True if the type is a pointer type
 */
export const getNativeTypeIsPointer = memoize(() =>
    lookup('il2cpp_type_is_pointer_type', 'bool', ['pointer'])
);

/**
 * Gets the name of the type using a chunked callback approach.
 * @param type Il2CppType* - The Il2CppType to get the name of
 * @param chunkReportFunc void(*)(void* data, void* userData) - Callback for each chunk
 * @param userData void* - User data passed to the callback
 */
export const getNativeTypeGetNameChunked = memoize(() =>
    lookup('il2cpp_type_get_name_chunked', 'void', ['pointer', 'pointer', 'pointer'])
);
