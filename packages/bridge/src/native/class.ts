import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === CLASS FUNCTIONS ===
/**
 * Iterates over all loaded classes, calling a callback for each one.
 * @param func Il2CppClassForEachFunc - Callback function to call for each class
 * @param user_data void* - User data to pass to the callback
 */
export const getNativeClassForEach = memoize(() =>
    lookup('il2cpp_class_for_each', 'void', ['pointer', 'pointer'])
);

/**
 * Gets the encompassed type of this enum class.
 * @param klass Il2CppClass* - The Il2CppClass to get the base type of
 * @returns Il2CppType* - The base type of the enum, or null if not an enum
 */
export const getNativeClassGetBaseType = memoize(() =>
    lookup('il2cpp_class_enum_basetype', 'pointer', ['pointer'])
);

/**
 * Determines whether the current class is a generic one.
 * @param klass Il2CppClass* - The Il2CppClass to check
 * @returns bool - True if the class is generic
 */
export const getNativeClassIsGeneric = memoize(() =>
    lookup('il2cpp_class_is_generic', 'bool', ['pointer'])
);

/**
 * Determines whether the current class is inflated (generic instance).
 * @param klass Il2CppClass* - The Il2CppClass to check
 * @returns bool - True if the class is inflated
 */
export const getNativeClassIsInflated = memoize(() =>
    lookup('il2cpp_class_is_inflated', 'bool', ['pointer'])
);

/**
 * Determines whether an instance of other class can be assigned to a variable of klass type.
 * @param klass Il2CppClass* - The target Il2CppClass
 * @param oklass Il2CppClass* - The source Il2CppClass to check assignability from
 * @returns bool - True if oklass is assignable to klass
 * @see mono_class_is_assignable_from - Mono API equivalent
 */
export const getNativeClassIsAssignableFrom = memoize(() =>
    lookup('il2cpp_class_is_assignable_from', 'bool', ['pointer', 'pointer'])
);

/**
 * Determines whether klass derives from klassc class.
 * @param klass Il2CppClass* - The Il2CppClass to check
 * @param klassc Il2CppClass* - The potential parent Il2CppClass
 * @param check_interfaces bool - Whether to check interfaces as well
 * @returns bool - True if klass is a subclass of klassc
 */
export const getNativeClassIsSubclassOf = memoize(() =>
    lookup('il2cpp_class_is_subclass_of', 'bool', ['pointer', 'pointer', 'bool'])
);

/**
 * Determines whether klass has klassc as a parent.
 * @param klass Il2CppClass* - The Il2CppClass to check
 * @param klassc Il2CppClass* - The potential parent Il2CppClass
 * @returns bool - True if klassc is a parent of klass
 */
export const getNativeClassHasParent = memoize(() =>
    lookup('il2cpp_class_has_parent', 'bool', ['pointer', 'pointer'])
);

/**
 * Gets the class corresponding to the given Il2CppType.
 * @param type Il2CppType* - The Il2CppType to convert
 * @returns Il2CppClass* - The class corresponding to the type
 * @see mono_class_from_mono_type - Mono API equivalent
 */
export const getNativeClassFromIl2CppType = memoize(() =>
    lookup('il2cpp_class_from_il2cpp_type', 'pointer', ['pointer'])
);

/**
 * Gets the class by name from the given image.
 * @param image Il2CppImage* - The Il2CppImage to search in
 * @param namespaze const char* - The namespace of the class
 * @param name const char* - The name of the class
 * @returns Il2CppClass* - The found class, or null if not found
 */
export const getNativeClassFromName = memoize(() =>
    lookup('il2cpp_class_from_name', 'pointer', ['pointer', 'pointer', 'pointer'])
);

/**
 * Gets the class from a System.Type reflection object.
 * @param type Il2CppReflectionType* - The Il2CppReflectionType to convert
 * @returns Il2CppClass* - The class corresponding to the reflection type
 */
export const getNativeClassFromSystemType = memoize(() =>
    lookup('il2cpp_class_from_system_type', 'pointer', ['pointer'])
);

/**
 * Gets the class corresponding to the given Il2CppType (alias for classFromIl2CppType).
 * @param type Il2CppType* - The Il2CppType to convert
 * @returns Il2CppClass* - The class corresponding to the type
 */
export const getNativeClassFromType = memoize(() =>
    lookup('il2cpp_class_from_type', 'pointer', ['pointer'])
);

/**
 * Gets the class of the object encompassed or referred to by the current array, pointer or reference class.
 * @param klass Il2CppClass* - The Il2CppClass to get the element class of
 * @returns Il2CppClass* - The element class, or null if not applicable
 */
export const getNativeClassGetElementClass = memoize(() =>
    lookup('il2cpp_class_get_element_class', 'pointer', ['pointer'])
);

// TODO
/**
 * Gets the events of the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get events from
 * @param iter void** - Iterator for the events (in/out parameter)
 * @returns EventInfo* - The next event, or null when iteration is complete
 */
export const getNativeClassGetEvents = memoize(() =>
    lookup('il2cpp_class_get_events', 'pointer', ['pointer', 'pointer'])
);

/**
 * Gets the fields of the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get fields from
 * @param iter void** - Iterator for the fields (in/out parameter)
 * @returns FieldInfo* - The next field, or null when iteration is complete
 * @see mono_class_get_fields - Mono API equivalent
 */
export const getNativeClassGetFields = memoize(() =>
    lookup('il2cpp_class_get_fields', 'pointer', ['pointer', 'pointer'])
);

/**
 * Gets the nested classes of the specified class.
 * @param klass Il2CppClass* - The Il2CppClass to get nested classes from
 * @param iter void** - Iterator for the nested classes (in/out parameter)
 * @returns Il2CppClass* - The next nested class, or null when iteration is complete
 */
export const getNativeClassGetNestedClasses = memoize(() =>
    lookup('il2cpp_class_get_nested_types', 'pointer', ['pointer', 'pointer'])
);

/**
 * Gets the interfaces implemented by the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get interfaces from
 * @param iter void** - Iterator for the interfaces (in/out parameter)
 * @returns Il2CppClass* - The next interface, or null when iteration is complete
 */
export const getNativeClassGetInterfaces = memoize(() =>
    lookup('il2cpp_class_get_interfaces', 'pointer', ['pointer', 'pointer'])
);

/**
 * Gets the properties of the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get properties from
 * @param iter void** - Iterator for the properties (in/out parameter)
 * @returns PropertyInfo* - The next property, or null when iteration is complete
 * @see mono_class_get_properties - Mono API equivalent
 */
export const getNativeClassGetProperties = memoize(() =>
    lookup('il2cpp_class_get_properties', 'pointer', ['pointer', 'pointer'])
);

// TODO
/**
 * Gets the property identified by the given name.
 * @param klass Il2CppClass* - The Il2CppClass to search in
 * @param name const char* - The name of the property
 * @returns PropertyInfo* - The property, or null if not found
 */
export const getNativeClassGetPropertyFromName = memoize(() =>
    lookup('il2cpp_class_get_property_from_name', 'pointer', ['pointer', 'pointer'])
);

/**
 * Gets the field identified by the given name.
 * @param klass Il2CppClass* - The Il2CppClass to search in
 * @param name const char* - The name of the field
 * @returns FieldInfo* - The field, or null if not found
 * @see mono_class_get_field_from_name - Mono API equivalent
 */
export const getNativeClassGetFieldFromName = memoize(() =>
    lookup('il2cpp_class_get_field_from_name', 'pointer', ['pointer', 'pointer'])
);

/**
 * Gets the methods implemented by the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get methods from
 * @param iter void** - Iterator for the methods (in/out parameter)
 * @returns MethodInfo* - The next method, or null when iteration is complete
 * @see mono_class_get_methods - Mono API equivalent
 */
export const getNativeClassGetMethods = memoize(() =>
    lookup('il2cpp_class_get_methods', 'pointer', ['pointer', 'pointer'])
);

/**
 * Gets the method identified by the given name and parameter count.
 * @param klass Il2CppClass* - The Il2CppClass to search in
 * @param name const char* - The name of the method
 * @param argsCount int - The number of parameters (-1 for any)
 * @returns MethodInfo* - The method, or null if not found
 */
export const getNativeClassGetMethodFromName = memoize(() =>
    lookup('il2cpp_class_get_method_from_name', 'pointer', ['pointer', 'pointer', 'int'])
);

/**
 * Gets the name of the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get the name of
 * @returns const char* - The name of the class
 */
export const getNativeClassGetName = memoize(() =>
    lookup('il2cpp_class_get_name', 'pointer', ['pointer'])
);

/**
 * Gets the namespace of the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get the namespace of
 * @returns const char* - The namespace of the class
 */
export const getNativeClassGetNamespace = memoize(() =>
    lookup('il2cpp_class_get_namespace', 'pointer', ['pointer'])
);

/**
 * Gets the class from which the current class directly inherits.
 * @param klass Il2CppClass* - The Il2CppClass to get the parent of
 * @returns Il2CppClass* - The parent class, or null if no parent
 */
export const getNativeClassGetParent = memoize(() =>
    lookup('il2cpp_class_get_parent', 'pointer', ['pointer'])
);

/**
 * Gets the class that declares the current nested class.
 * @param klass Il2CppClass* - The Il2CppClass to get the declaring type of
 * @returns Il2CppClass* - The declaring class, or null if not nested
 */
export const getNativeClassGetDeclaringType = memoize(() =>
    lookup('il2cpp_class_get_declaring_type', 'pointer', ['pointer'])
);

/**
 * Gets the actual size of the instance of the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get the instance size of
 * @returns int32_t - The instance size in bytes
 * @see mono_class_instance_size - Mono API equivalent
 */
export const getNativeClassGetInstanceSize = memoize(() =>
    lookup('il2cpp_class_instance_size', 'int32', ['pointer'])
);

// TODO
/**
 * Gets the number of fields in the current class.
 * @param enumKlass Il2CppClass* - The Il2CppClass to count fields in
 * @returns size_t - The number of fields
 * @see mono_class_num_fields - Mono API equivalent
 */
export const getNativeClassGetNumFields = memoize(() =>
    lookup('il2cpp_class_num_fields', 'size_t', ['pointer'])
);

/**
 * Determines whether the current class is a value type.
 * @param klass Il2CppClass* - The Il2CppClass to check
 * @returns bool - True if the class is a value type
 */
export const getNativeClassIsValueType = memoize(() =>
    lookup('il2cpp_class_is_valuetype', 'bool', ['pointer'])
);

/**
 * Gets the size of the instance - as a value type - of the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get the value type size of
 * @param align uint32_t* - Pointer to store alignment information (can be null)
 * @returns int32_t - The value type size in bytes
 * @see mono_class_value_size - Mono API equivalent
 */
export const getNativeClassGetValueTypeSize = memoize(() =>
    lookup('il2cpp_class_value_size', 'int32', ['pointer', 'pointer'])
);

/**
 * Determines whether the current class is blittable.
 * @param klass Il2CppClass* - The Il2CppClass to check
 * @returns bool - True if the class is blittable
 */
export const getNativeClassIsBlittable = memoize(() =>
    lookup('il2cpp_class_is_blittable', 'bool', ['pointer'])
);

/**
 * Gets the implementation flags of the specified class.
 * @param klass Il2CppClass* - The Il2CppClass to get flags from
 * @returns int - The implementation flags
 */
export const getNativeClassGetFlags = memoize(() =>
    lookup('il2cpp_class_get_flags', 'int', ['pointer'])
);

/**
 * Determines whether the current class is abstract.
 * @param klass Il2CppClass* - The Il2CppClass to check
 * @returns bool - True if the class is abstract
 */
export const getNativeClassIsAbstract = memoize(() =>
    lookup('il2cpp_class_is_abstract', 'bool', ['pointer'])
);

/**
 * Determines whether the current class is an interface.
 * @param klass Il2CppClass* - The Il2CppClass to check
 * @returns bool - True if the class is an interface
 */
export const getNativeClassIsInterface = memoize(() =>
    lookup('il2cpp_class_is_interface', 'bool', ['pointer'])
);

/**
 * Gets the size of the array element for array classes.
 * @param klass Il2CppClass* - The array Il2CppClass to get element size of
 * @returns int - The element size in bytes
 */
export const getNativeClassGetArrayElementSize = memoize(() =>
    lookup('il2cpp_class_array_element_size', 'int', ['pointer'])
);

/**
 * Gets the by-value type of the current class. Corresponds to `byval_arg`.
 * @param klass Il2CppClass* - The Il2CppClass to get the type of
 * @returns Il2CppType* - The type corresponding to the class
 */
export const getNativeClassGetType = memoize(() =>
    lookup('il2cpp_class_get_type', 'pointer', ['pointer'])
);

/**
 * Gets the by-ref type of the current class. Corresponds to `this_arg`.
 * @param klass Il2CppClass* - The Il2CppClass to get the type of
 * @returns Il2CppType* - The type corresponding to the class
 */
export const getNativeClassGetByRefType = memoize(() =>
    lookup('mono_class_get_byref_type', 'pointer', ['pointer'])
);

// TODO
/**
 * Gets the type token of the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get the type token of
 * @returns uint32_t - The type token
 */
export const getNativeClassGetTypeToken = memoize(() =>
    lookup('il2cpp_class_get_type_token', 'uint32', ['pointer'])
);

// TODO
/**
 * Determines whether the current class has the specified attribute.
 * @param klass Il2CppClass* - The Il2CppClass to check
 * @param attr_class Il2CppClass* - The attribute class to look for
 * @returns bool - True if the class has the attribute
 */
export const getNativeClassHasAttribute = memoize(() =>
    lookup('il2cpp_class_has_attribute', 'bool', ['pointer', 'pointer'])
);

/**
 * Determines whether the GC has tracking references to the current class instances.
 * @param klass Il2CppClass* - The Il2CppClass to check
 * @returns bool - True if the class has references tracked by GC
 */
export const getNativeClassHasReferences = memoize(() =>
    lookup('il2cpp_class_has_references', 'bool', ['pointer'])
);

/**
 * Determines whether the current class is an enumeration.
 * @param klass Il2CppClass* - The Il2CppClass to check
 * @returns bool - True if the class is an enum
 */
export const getNativeClassIsEnum = memoize(() =>
    lookup('il2cpp_class_is_enum', 'bool', ['pointer'])
);

/**
 * Gets the image in which the current class is defined.
 * @param klass Il2CppClass* - The Il2CppClass to get the image of
 * @returns Il2CppImage* - The image containing the class
 */
export const getNativeClassGetImage = memoize(() =>
    lookup('il2cpp_class_get_image', 'pointer', ['pointer'])
);

/**
 * Gets the name of the assembly in which the current class is defined.
 * @param klass Il2CppClass* - The Il2CppClass to get the assembly name of
 * @returns const char* - The assembly name
 */
export const getNativeClassGetAssemblyName = memoize(() =>
    lookup('il2cpp_class_get_assemblyname', 'pointer', ['pointer'])
);

// TODO
/**
 * Gets the rank (number of dimensions) of the current array class.
 * @param klass Il2CppClass* - The array Il2CppClass to get the rank of
 * @returns int - The number of dimensions
 */
export const getNativeClassGetRank = memoize(() =>
    lookup('il2cpp_class_get_rank', 'int', ['pointer'])
);

// TODO
/**
 * Gets the data size of the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get the data size of
 * @returns uint32_t - The data size in bytes
 */
export const getNativeClassGetDataSize = memoize(() =>
    lookup('il2cpp_class_get_data_size', 'uint32', ['pointer'])
);

/**
 * Gets a pointer to the static fields of the current class.
 * @param klass Il2CppClass* - The Il2CppClass to get static field data from
 * @returns void* - Pointer to the static fields data
 */
export const getNativeClassGetStaticFieldData = memoize(() =>
    lookup('il2cpp_class_get_static_field_data', 'pointer', ['pointer'])
);

// TODO
/**
 * Gets the size of the bitmap for the current class (testing only).
 * @param klass Il2CppClass* - The Il2CppClass to get bitmap size of
 * @returns size_t - The bitmap size
 */
export const getNativeClassGetBitmapSize = memoize(() =>
    lookup('il2cpp_class_get_bitmap_size', 'size_t', ['pointer'])
);

// TODO
/**
 * Gets the bitmap for the current class (testing only).
 * @param klass Il2CppClass* - The Il2CppClass to get bitmap of
 * @param bitmap size_t* - Pointer to store the bitmap
 */
export const getNativeClassGetBitmap = memoize(() =>
    lookup('il2cpp_class_get_bitmap', 'void', ['pointer', 'pointer'])
);

// TODO
/**
 * Sets user data for the current class (for GetComponent optimization).
 * @param klass Il2CppClass* - The Il2CppClass to set user data for
 * @param userdata void* - The user data to set
 */
export const getNativeClassSetUserdata = memoize(() =>
    lookup('il2cpp_class_set_userdata', 'void', ['pointer', 'pointer'])
);

// TODO
/**
 * Gets the offset for user data in the class structure.
 * @returns int - The user data offset
 */
export const getNativeClassGetUserdataOffset = memoize(() =>
    lookup('il2cpp_class_get_userdata_offset', 'int', [])
);

/**
 * Initializes the static constructor of the specified class.
 * @param klass Il2CppClass* - The class to initialize
 */
export const getNativeClassInitialize = memoize(() =>
    lookup('il2cpp_runtime_class_init', 'void', ['pointer'])
);

// === MONO-SPECIFIC CLASS FUNCTIONS ===

/**
 * Gets the number of methods in the specified class (Mono API).
 * Note: No direct IL2CPP equivalent - this is Mono-specific.
 * @param klass Il2CppClass* - The Il2CppClass to count methods in
 * @returns int - The number of methods
 */
export const getNativeClassGetNumMethods = memoize(() =>
    lookup('mono_class_num_methods', 'int', ['pointer'])
);

/**
 * Gets the number of properties in the specified class (Mono API).
 * Note: No direct IL2CPP equivalent - this is Mono-specific.
 * @param klass Il2CppClass* - The Il2CppClass to count properties in
 * @returns int - The number of properties
 */
export const getNativeClassGetNumProperties = memoize(() =>
    lookup('mono_class_num_properties', 'int', ['pointer'])
);

/**
 * Sets up the vtable for the specified class (Mono API).
 * Note: Initializes the class vtable - Mono-specific functionality.
 * @param klass Il2CppClass* - The Il2CppClass to setup vtable for
 */
// export const getNativeClassSetupVTable = memoize(() =>
//     lookup('mono_class_setup_vtable', 'void', ['pointer'])
// );

/**
 * Sets up the methods for the specified class (Mono API).
 * Note: Initializes class methods - Mono-specific functionality.
 * @param klass Il2CppClass* - The Il2CppClass to setup methods for
 */
export const getNativeClassSetupMethods = memoize(() =>
    lookup('mono_class_setup_methods', 'void', ['pointer'])
);

/**
 * Checks if a field is special static (Mono API).
 * Note: Mono concept for special static fields (thread-static, context-static, etc).
 * @param field Il2CppClassField* - The field to check
 * @returns mono_bool - True if the field is special static
 */
export const getNativeClassFieldIsSpecialStatic = memoize(() =>
    lookup('mono_class_field_is_special_static', 'bool', ['pointer'])
);

/**
 * Gets the generic context of the specified class (Mono API).
 * Note: Returns generic context for generic classes - Mono-specific.
 * @param klass Il2CppClass* - The Il2CppClass to get context from
 * @returns MonoGenericContext* - The generic context or null
 */
export const getNativeClassGetGenericContext = memoize(() =>
    lookup('mono_class_get_context', 'pointer', ['pointer'])
);

/**
 * Inflates a generic method with full parameters (Mono API).
 * Note: Mono-specific generic method inflation with additional parameters.
 * @param method MethodInfo* - The generic method to inflate
 * @param klass_hint Il2CppClass* - Optional class hint for inflation
 * @param context MonoGenericContext* - The generic context to use
 * @param error MonoError* - Error output parameter
 * @returns MethodInfo* - The inflated method or null if error
 */
export const getNativeClassInflateGenericMethodFull = memoize(() =>
    lookup('mono_class_inflate_generic_method_full_checked', 'pointer', [
        'pointer',
        'pointer',
        'pointer',
        'pointer',
    ])
);

/**
 * Inflates a generic method (Mono API).
 * Note: Mono-specific generic method inflation.
 * @param method MethodInfo* - The generic method to inflate
 * @param context MonoGenericContext* - The generic context to use
 * @param error MonoError* - Error output parameter
 * @returns MethodInfo* - The inflated method or null if error
 */
export const getNativeClassInflateGenericMethod = memoize(() =>
    lookup('mono_class_inflate_generic_method_checked', 'pointer', [
        'pointer',
        'pointer',
        'pointer',
    ])
);

/**
 * Checks if a class is nullable (Mono API).
 * Note: Mono concept for nullable types.
 * @param klass Il2CppClass* - The class to check
 * @returns mono_bool - True if the class is nullable
 */
export const getNativeClassIsNullable = memoize(() =>
    lookup('mono_class_is_nullable', 'bool', ['pointer'])
);

/**
 * Gets the generic container of the specified class (Mono API).
 * Note: Returns generic container for generic class definitions.
 * @param klass Il2CppClass* - The Il2CppClass to get container from
 * @returns MonoGenericContainer* - The generic container or null
 */
export const getNativeClassGetGenericContainer = memoize(() =>
    lookup('mono_class_get_generic_container', 'pointer', ['pointer'])
);

/**
 * Sets up the interfaces for the specified class (Mono API).
 * Note: Initializes class interfaces - Mono-specific functionality.
 * @param klass Il2CppClass* - The Il2CppClass to setup interfaces for
 * @param error MonoError* - Error output parameter
 */
// export const getNativeClassSetupInterfaces = memoize(() =>
//     lookup('mono_class_setup_interfaces', 'void', ['pointer', 'pointer'])
// );
