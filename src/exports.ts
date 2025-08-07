namespace Il2Cpp {
    /**
     * The **core** object where all the necessary IL2CPP native functions are
     * held. \
     * `frida-il2cpp-bridge` is built around this object by providing an
     * easy-to-use abstraction layer: the user isn't expected to use it directly,
     * but it can in case of advanced use cases.
     *
     * The exports depends on the Unity version, hence some of them may be
     * unavailable; moreover, they are searched by **name** (e.g.
     * `il2cpp_class_from_name`) hence they might get stripped, hidden or
     * renamed by a nasty obfuscator.
     *
     * However, it is possible to override or set the handle of any of the
     * exports by using a global variable:
     * ```ts
     * declare global {
     *     let IL2CPP_EXPORTS: Record<string, () => NativePointer>;
     * }
     *
     * IL2CPP_EXPORTS = {
     *     il2cpp_image_get_class: () => Il2Cpp.module.base.add(0x1204c),
     *     il2cpp_class_get_parent: () => {
     *         return Memory.scanSync(Il2Cpp.module.base, Il2Cpp.module.size, "2f 10 ee 10 34 a8")[0].address;
     *     },
     * };
     *
     * Il2Cpp.perform(() => {
     *     // ...
     * });
     * ```
     */
    export const exports = {
        // === INITIALIZATION AND CONFIGURATION ===
        /**
         * Initializes the IL2CPP runtime.
         * @param domain_name const char* - The name of the application domain
         * @returns int - Non-zero on success, zero on failure
         */
        get initialize() {
            return r('il2cpp_init', 'int', ['pointer']);
        },

        /**
         * Initializes the IL2CPP runtime with UTF-16 domain name.
         * @param domain_name const Il2CppChar* - The UTF-16 name of the application domain
         * @returns int - Non-zero on success, zero on failure
         */
        get initializeUtf16() {
            return r('il2cpp_init_utf16', 'int', ['pointer']);
        },

        /**
         * Shuts down the IL2CPP runtime.
         */
        get shutdown() {
            return r('il2cpp_shutdown', 'void', []);
        },

        /**
         * Sets the configuration directory for IL2CPP.
         * @param config_path const char* - Path to the configuration directory
         */
        get setConfigDir() {
            return r('il2cpp_set_config_dir', 'void', ['pointer']);
        },

        /**
         * Sets the data directory for IL2CPP.
         * @param data_path const char* - Path to the data directory
         */
        get setDataDir() {
            return r('il2cpp_set_data_dir', 'void', ['pointer']);
        },

        /**
         * Sets the temporary directory for IL2CPP.
         * @param temp_path const char* - Path to the temporary directory
         */
        get setTempDir() {
            return r('il2cpp_set_temp_dir', 'void', ['pointer']);
        },

        /**
         * Sets command line arguments for the IL2CPP runtime.
         * @param argc int - Number of arguments
         * @param argv char** - Array of argument strings
         * @param basedir const char* - Base directory path
         */
        get setCommandlineArguments() {
            return r('il2cpp_set_commandline_arguments', 'void', ['int', 'pointer', 'pointer']);
        },

        /**
         * Sets command line arguments for the IL2CPP runtime with UTF-16 encoding.
         * @param argc int - Number of arguments
         * @param argv Il2CppChar** - Array of UTF-16 argument strings
         * @param basedir const Il2CppChar* - UTF-16 base directory path
         */
        get setCommandlineArgumentsUtf16() {
            return r('il2cpp_set_commandline_arguments_utf16', 'void', [
                'int',
                'pointer',
                'pointer',
            ]);
        },

        /**
         * Sets the configuration with UTF-16 encoding.
         * @param executablePath const Il2CppChar* - UTF-16 path to the executable
         */
        get setConfigUtf16() {
            return r('il2cpp_set_config_utf16', 'void', ['pointer']);
        },

        /**
         * Sets the configuration for IL2CPP.
         * @param executablePath const char* - Path to the executable
         */
        get setConfig() {
            return r('il2cpp_set_config', 'void', ['pointer']);
        },

        /**
         * Sets custom memory allocation callbacks.
         * @param callbacks Il2CppMemoryCallbacks* - Structure containing custom memory callbacks
         */
        get setMemoryCallbacks() {
            return r('il2cpp_set_memory_callbacks', 'void', ['pointer']);
        },

        /**
         * Adds an internal call mapping for native method implementation.
         * @param name const char* - The method name to map
         * @param method void* - Pointer to the native implementation
         */
        get addInternalCall() {
            return r('il2cpp_add_internal_call', 'void', ['pointer', 'pointer']);
        },

        /**
         * Resolves an internal call by name.
         * @param name const char* - The internal call name to resolve
         * @returns void* - Pointer to the resolved internal call implementation
         */
        get resolveInternalCall() {
            return r('il2cpp_resolve_icall', 'pointer', ['pointer']);
        },

        /**
         * Gets the core library (mscorlib) image.
         * @returns Il2CppImage* - The core library image
         */
        get getCorlib() {
            return r('il2cpp_get_corlib', 'pointer', []);
        },

        // === MEMORY MANAGEMENT ===
        /**
         * Allocates memory using the IL2CPP memory allocator.
         * @param size size_t - The number of bytes to allocate
         * @returns void* - Pointer to the allocated memory
         */
        get alloc() {
            return r('il2cpp_alloc', 'pointer', ['size_t']);
        },

        /**
         * Frees memory allocated by the IL2CPP memory allocator.
         * @param ptr void* - Pointer to the memory to free
         */
        get free() {
            return r('il2cpp_free', 'void', ['pointer']);
        },

        // === ARRAY FUNCTIONS ===
        /**
         * Gets the class for an array type with the specified element class and rank.
         * @param element_class Il2CppClass* - The class of the array elements
         * @param rank uint32_t - The rank (number of dimensions) of the array
         * @returns Il2CppClass* - The array class
         */
        get arrayGetClass() {
            return r('il2cpp_array_class_get', 'pointer', ['pointer', 'uint32']);
        },

        /**
         * Gets the length (number of elements) of an array.
         * @param array Il2CppArray* - The array object
         * @returns uint32_t - The number of elements in the array
         */
        get arrayGetLength() {
            return r('il2cpp_array_length', 'uint32', ['pointer']);
        },

        // TODO

        /**
         * Gets the total byte length of an array's data.
         * @param array Il2CppArray* - The array object
         * @returns uint32_t - The total size in bytes of the array data
         */
        get arrayGetByteLength() {
            return r('il2cpp_array_get_byte_length', 'uint32', ['pointer']);
        },

        /**
         * Creates a new single-dimensional array with the specified length.
         * @param array_class Il2CppClass* - The array class (use arrayGetClass to obtain)
         * @param length uint32_t - The number of elements in the array
         * @returns Il2CppArray* - The newly created array object
         */
        get arrayNew() {
            return r('il2cpp_array_new', 'pointer', ['pointer', 'uint32']);
        },

        // TODO

        /**
         * Creates a new array with the specified array class and length.
         * @param array_class Il2CppClass* - The specific array class
         * @param length uint32_t - The number of elements in the array
         * @returns Il2CppArray* - The newly created array object
         */
        get arrayNewSpecific() {
            return r('il2cpp_array_new_specific', 'pointer', ['pointer', 'uint32']);
        },

        // TODO

        /**
         * Creates a new multi-dimensional array with specified dimensions and bounds.
         * @param array_class Il2CppClass* - The array class
         * @param lengths uint32_t* - Array of dimension lengths
         * @param lower_bounds int32_t* - Array of lower bounds for each dimension (can be NULL)
         * @returns Il2CppArray* - The newly created multi-dimensional array
         */
        get arrayNewFull() {
            return r('il2cpp_array_new_full', 'pointer', ['pointer', 'pointer', 'pointer']);
        },

        // TODO

        /**
         * Gets the class for a bounded array type.
         * @param element_class Il2CppClass* - The class of the array elements
         * @param rank uint32_t - The rank (number of dimensions) of the array
         * @param bounded bool - Whether the array has non-zero lower bounds
         * @returns Il2CppClass* - The bounded array class
         */
        get boundedArrayClassGet() {
            return r('il2cpp_bounded_array_class_get', 'pointer', ['pointer', 'uint32', 'bool']);
        },

        // TODO

        /**
         * Gets the size in bytes of a single element in the array.
         * @param array_class Il2CppClass* - The array class
         * @returns int - The size in bytes of each array element
         */
        get arrayElementSize() {
            return r('il2cpp_array_element_size', 'int', ['pointer']);
        },

        // === ASSEMBLY FUNCTIONS ===
        /**
         * Gets the image associated with an assembly.
         * @param assembly Il2CppAssembly* - The assembly
         * @returns Il2CppImage* - The image containing the assembly metadata
         */
        get assemblyGetImage() {
            return r('il2cpp_assembly_get_image', 'pointer', ['pointer']);
        },

        // === CLASS FUNCTIONS ===
        /**
         * Iterates over all loaded classes, calling a callback for each one.
         * @param func Il2CppClassForEachFunc - Callback function to call for each class
         * @param user_data void* - User data to pass to the callback
         */
        get classForEach() {
            return r('il2cpp_class_for_each', 'void', ['pointer', 'pointer']);
        },

        /**
         * Gets the encompassed type of this enum class.
         * @param klass Il2CppClass* - The Il2CppClass to get the base type of
         * @returns Il2CppType* - The base type of the enum, or null if not an enum
         */
        get classGetBaseType() {
            return r('il2cpp_class_enum_basetype', 'pointer', ['pointer']);
        },

        /**
         * Determines whether the current class is a generic one.
         * @param klass Il2CppClass* - The Il2CppClass to check
         * @returns bool - True if the class is generic
         */
        get classIsGeneric() {
            return r('il2cpp_class_is_generic', 'bool', ['pointer']);
        },

        /**
         * Determines whether the current class is inflated (generic instance).
         * @param klass Il2CppClass* - The Il2CppClass to check
         * @returns bool - True if the class is inflated
         */
        get classIsInflated() {
            return r('il2cpp_class_is_inflated', 'bool', ['pointer']);
        },

        /**
         * Determines whether an instance of other class can be assigned to a variable of klass type.
         * @param klass Il2CppClass* - The target Il2CppClass
         * @param oklass Il2CppClass* - The source Il2CppClass to check assignability from
         * @returns bool - True if oklass is assignable to klass
         */
        get classIsAssignableFrom() {
            return r('il2cpp_class_is_assignable_from', 'bool', ['pointer', 'pointer']);
        },

        /**
         * Determines whether klass derives from klassc class.
         * @param klass Il2CppClass* - The Il2CppClass to check
         * @param klassc Il2CppClass* - The potential parent Il2CppClass
         * @param check_interfaces bool - Whether to check interfaces as well
         * @returns bool - True if klass is a subclass of klassc
         */
        get classIsSubclassOf() {
            return r('il2cpp_class_is_subclass_of', 'bool', ['pointer', 'pointer', 'bool']);
        },

        /**
         * Determines whether klass has klassc as a parent.
         * @param klass Il2CppClass* - The Il2CppClass to check
         * @param klassc Il2CppClass* - The potential parent Il2CppClass
         * @returns bool - True if klassc is a parent of klass
         */
        get classHasParent() {
            return r('il2cpp_class_has_parent', 'bool', ['pointer', 'pointer']);
        },

        /**
         * Gets the class corresponding to the given Il2CppType.
         * @param type Il2CppType* - The Il2CppType to convert
         * @returns Il2CppClass* - The class corresponding to the type
         */
        get classFromIl2CppType() {
            return r('il2cpp_class_from_il2cpp_type', 'pointer', ['pointer']);
        },

        /**
         * Gets the class by name from the given image.
         * @param image Il2CppImage* - The Il2CppImage to search in
         * @param namespaze const char* - The namespace of the class
         * @param name const char* - The name of the class
         * @returns Il2CppClass* - The found class, or null if not found
         */
        get classFromName() {
            return r('il2cpp_class_from_name', 'pointer', ['pointer', 'pointer', 'pointer']);
        },

        /**
         * Gets the class from a System.Type reflection object.
         * @param type Il2CppReflectionType* - The Il2CppReflectionType to convert
         * @returns Il2CppClass* - The class corresponding to the reflection type
         */
        get classFromSystemType() {
            return r('il2cpp_class_from_system_type', 'pointer', ['pointer']);
        },

        /**
         * Gets the class corresponding to the given Il2CppType (alias for classFromIl2CppType).
         * @param type Il2CppType* - The Il2CppType to convert
         * @returns Il2CppClass* - The class corresponding to the type
         */
        get classFromType() {
            return r('il2cpp_class_from_type', 'pointer', ['pointer']);
        },

        /**
         * Gets the class of the object encompassed or referred to by the current array, pointer or reference class.
         * @param klass Il2CppClass* - The Il2CppClass to get the element class of
         * @returns Il2CppClass* - The element class, or null if not applicable
         */
        get classGetElementClass() {
            return r('il2cpp_class_get_element_class', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets the events of the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get events from
         * @param iter void** - Iterator for the events (in/out parameter)
         * @returns EventInfo* - The next event, or null when iteration is complete
         */
        get classGetEvents() {
            return r('il2cpp_class_get_events', 'pointer', ['pointer', 'pointer']);
        },

        /**
         * Gets the fields of the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get fields from
         * @param iter void** - Iterator for the fields (in/out parameter)
         * @returns FieldInfo* - The next field, or null when iteration is complete
         */
        get classGetFields() {
            return r('il2cpp_class_get_fields', 'pointer', ['pointer', 'pointer']);
        },

        /**
         * Gets the nested classes of the specified class.
         * @param klass Il2CppClass* - The Il2CppClass to get nested classes from
         * @param iter void** - Iterator for the nested classes (in/out parameter)
         * @returns Il2CppClass* - The next nested class, or null when iteration is complete
         */
        get classGetNestedClasses() {
            return r('il2cpp_class_get_nested_types', 'pointer', ['pointer', 'pointer']);
        },

        /**
         * Gets the interfaces implemented by the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get interfaces from
         * @param iter void** - Iterator for the interfaces (in/out parameter)
         * @returns Il2CppClass* - The next interface, or null when iteration is complete
         */
        get classGetInterfaces() {
            return r('il2cpp_class_get_interfaces', 'pointer', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Gets the properties of the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get properties from
         * @param iter void** - Iterator for the properties (in/out parameter)
         * @returns PropertyInfo* - The next property, or null when iteration is complete
         */
        get classGetProperties() {
            return r('il2cpp_class_get_properties', 'pointer', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Gets the property identified by the given name.
         * @param klass Il2CppClass* - The Il2CppClass to search in
         * @param name const char* - The name of the property
         * @returns PropertyInfo* - The property, or null if not found
         */
        get classGetPropertyFromName() {
            return r('il2cpp_class_get_property_from_name', 'pointer', ['pointer', 'pointer']);
        },

        /**
         * Gets the field identified by the given name.
         * @param klass Il2CppClass* - The Il2CppClass to search in
         * @param name const char* - The name of the field
         * @returns FieldInfo* - The field, or null if not found
         */
        get classGetFieldFromName() {
            return r('il2cpp_class_get_field_from_name', 'pointer', ['pointer', 'pointer']);
        },

        /**
         * Gets the methods implemented by the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get methods from
         * @param iter void** - Iterator for the methods (in/out parameter)
         * @returns MethodInfo* - The next method, or null when iteration is complete
         */
        get classGetMethods() {
            return r('il2cpp_class_get_methods', 'pointer', ['pointer', 'pointer']);
        },

        /**
         * Gets the method identified by the given name and parameter count.
         * @param klass Il2CppClass* - The Il2CppClass to search in
         * @param name const char* - The name of the method
         * @param argsCount int - The number of parameters (-1 for any)
         * @returns MethodInfo* - The method, or null if not found
         */
        get classGetMethodFromName() {
            return r('il2cpp_class_get_method_from_name', 'pointer', ['pointer', 'pointer', 'int']);
        },

        /**
         * Gets the name of the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get the name of
         * @returns const char* - The name of the class
         */
        get classGetName() {
            return r('il2cpp_class_get_name', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets the name of the type using a chunked callback approach.
         * @param type Il2CppType* - The Il2CppType to get the name of
         * @param chunkReportFunc void(*)(void* data, void* userData) - Callback for each chunk
         * @param userData void* - User data passed to the callback
         */
        get typeGetNameChunked() {
            return r('il2cpp_type_get_name_chunked', 'void', ['pointer', 'pointer', 'pointer']);
        },

        /**
         * Gets the namespace of the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get the namespace of
         * @returns const char* - The namespace of the class
         */
        get classGetNamespace() {
            return r('il2cpp_class_get_namespace', 'pointer', ['pointer']);
        },

        /**
         * Gets the class from which the current class directly inherits.
         * @param klass Il2CppClass* - The Il2CppClass to get the parent of
         * @returns Il2CppClass* - The parent class, or null if no parent
         */
        get classGetParent() {
            return r('il2cpp_class_get_parent', 'pointer', ['pointer']);
        },

        /**
         * Gets the class that declares the current nested class.
         * @param klass Il2CppClass* - The Il2CppClass to get the declaring type of
         * @returns Il2CppClass* - The declaring class, or null if not nested
         */
        get classGetDeclaringType() {
            return r('il2cpp_class_get_declaring_type', 'pointer', ['pointer']);
        },

        /**
         * Gets the actual size of the instance of the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get the instance size of
         * @returns int32_t - The instance size in bytes
         */
        get classGetInstanceSize() {
            return r('il2cpp_class_instance_size', 'int32', ['pointer']);
        },

        // TODO
        /**
         * Gets the number of fields in the current class.
         * @param enumKlass Il2CppClass* - The Il2CppClass to count fields in
         * @returns size_t - The number of fields
         */
        get classGetNumFields() {
            return r('il2cpp_class_num_fields', 'size_t', ['pointer']);
        },

        /**
         * Determines whether the current class is a value type.
         * @param klass Il2CppClass* - The Il2CppClass to check
         * @returns bool - True if the class is a value type
         */
        get classIsValueType() {
            return r('il2cpp_class_is_valuetype', 'bool', ['pointer']);
        },

        /**
         * Gets the size of the instance - as a value type - of the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get the value type size of
         * @param align uint32_t* - Pointer to store alignment information (can be null)
         * @returns int32_t - The value type size in bytes
         */
        get classGetValueTypeSize() {
            return r('il2cpp_class_value_size', 'int32', ['pointer', 'pointer']);
        },

        /**
         * Determines whether the current class is blittable.
         * @param klass Il2CppClass* - The Il2CppClass to check
         * @returns bool - True if the class is blittable
         */
        get classIsBlittable() {
            return r('il2cpp_class_is_blittable', 'bool', ['pointer']);
        },

        /**
         * Gets the implementation flags of the specified class.
         * @param klass Il2CppClass* - The Il2CppClass to get flags from
         * @returns int - The implementation flags
         */
        get classGetFlags() {
            return r('il2cpp_class_get_flags', 'int', ['pointer']);
        },

        /**
         * Determines whether the current class is abstract.
         * @param klass Il2CppClass* - The Il2CppClass to check
         * @returns bool - True if the class is abstract
         */
        get classIsAbstract() {
            return r('il2cpp_class_is_abstract', 'bool', ['pointer']);
        },

        /**
         * Determines whether the current class is an interface.
         * @param klass Il2CppClass* - The Il2CppClass to check
         * @returns bool - True if the class is an interface
         */
        get classIsInterface() {
            return r('il2cpp_class_is_interface', 'bool', ['pointer']);
        },

        /**
         * Gets the size of the array element for array classes.
         * @param klass Il2CppClass* - The array Il2CppClass to get element size of
         * @returns int - The element size in bytes
         */
        get classGetArrayElementSize() {
            return r('il2cpp_class_array_element_size', 'int', ['pointer']);
        },

        /**
         * Gets the type of the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get the type of
         * @returns Il2CppType* - The type corresponding to the class
         */
        get classGetType() {
            return r('il2cpp_class_get_type', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets the type token of the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get the type token of
         * @returns uint32_t - The type token
         */
        get classGetTypeToken() {
            return r('il2cpp_class_get_type_token', 'uint32', ['pointer']);
        },

        // TODO
        /**
         * Determines whether the current class has the specified attribute.
         * @param klass Il2CppClass* - The Il2CppClass to check
         * @param attr_class Il2CppClass* - The attribute class to look for
         * @returns bool - True if the class has the attribute
         */
        get classHasAttribute() {
            return r('il2cpp_class_has_attribute', 'bool', ['pointer', 'pointer']);
        },

        /**
         * Determines whether the GC has tracking references to the current class instances.
         * @param klass Il2CppClass* - The Il2CppClass to check
         * @returns bool - True if the class has references tracked by GC
         */
        get classHasReferences() {
            return r('il2cpp_class_has_references', 'bool', ['pointer']);
        },

        /**
         * Determines whether the current class is an enumeration.
         * @param klass Il2CppClass* - The Il2CppClass to check
         * @returns bool - True if the class is an enum
         */
        get classIsEnum() {
            return r('il2cpp_class_is_enum', 'bool', ['pointer']);
        },

        /**
         * Gets the image in which the current class is defined.
         * @param klass Il2CppClass* - The Il2CppClass to get the image of
         * @returns Il2CppImage* - The image containing the class
         */
        get classGetImage() {
            return r('il2cpp_class_get_image', 'pointer', ['pointer']);
        },

        /**
         * Gets the name of the assembly in which the current class is defined.
         * @param klass Il2CppClass* - The Il2CppClass to get the assembly name of
         * @returns const char* - The assembly name
         */
        get classGetAssemblyName() {
            return r('il2cpp_class_get_assemblyname', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets the rank (number of dimensions) of the current array class.
         * @param klass Il2CppClass* - The array Il2CppClass to get the rank of
         * @returns int - The number of dimensions
         */
        get classGetRank() {
            return r('il2cpp_class_get_rank', 'int', ['pointer']);
        },

        // TODO
        /**
         * Gets the data size of the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get the data size of
         * @returns uint32_t - The data size in bytes
         */
        get classGetDataSize() {
            return r('il2cpp_class_get_data_size', 'uint32', ['pointer']);
        },

        /**
         * Gets a pointer to the static fields of the current class.
         * @param klass Il2CppClass* - The Il2CppClass to get static field data from
         * @returns void* - Pointer to the static fields data
         */
        get classGetStaticFieldData() {
            return r('il2cpp_class_get_static_field_data', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets the size of the bitmap for the current class (testing only).
         * @param klass Il2CppClass* - The Il2CppClass to get bitmap size of
         * @returns size_t - The bitmap size
         */
        get classGetBitmapSize() {
            return r('il2cpp_class_get_bitmap_size', 'size_t', ['pointer']);
        },

        // TODO
        /**
         * Gets the bitmap for the current class (testing only).
         * @param klass Il2CppClass* - The Il2CppClass to get bitmap of
         * @param bitmap size_t* - Pointer to store the bitmap
         */
        get classGetBitmap() {
            return r('il2cpp_class_get_bitmap', 'void', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Sets user data for the current class (for GetComponent optimization).
         * @param klass Il2CppClass* - The Il2CppClass to set user data for
         * @param userdata void* - The user data to set
         */
        get classSetUserdata() {
            return r('il2cpp_class_set_userdata', 'void', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Gets the offset for user data in the class structure.
         * @returns int - The user data offset
         */
        get classGetUserdataOffset() {
            return r('il2cpp_class_get_userdata_offset', 'int', []);
        },

        // === STATS FUNCTIONS ===
        // TODO
        /**
         * Dumps statistics to a file.
         * @param path const char* - The file path to dump stats to
         * @returns bool - True if successful
         */
        get statsDumpToFile() {
            return r('il2cpp_stats_dump_to_file', 'bool', ['pointer']);
        },

        // TODO
        /**
         * Gets a specific statistic value.
         * @param stat Il2CppStat - The statistic to retrieve
         * @returns uint64_t - The statistic value
         */
        get statsGetValue() {
            return r('il2cpp_stats_get_value', 'uint64', ['int']);
        },

        // === DOMAIN FUNCTIONS ===
        /**
         * Gets the current application domain.
         * @returns Il2CppDomain* - The current domain
         */
        get domainGet() {
            return r('il2cpp_domain_get', 'pointer', []);
        },

        /**
         * Opens an assembly by name in the specified domain.
         * @param domain Il2CppDomain* - The domain to search in
         * @param name const char* - The name of the assembly
         * @returns Il2CppAssembly* - The opened assembly, or null if not found
         */
        get domainGetAssemblyFromName() {
            return r('il2cpp_domain_assembly_open', 'pointer', ['pointer', 'pointer']);
        },

        /**
         * Gets all assemblies in the specified domain.
         * @param domain Il2CppDomain* - The domain to get assemblies from
         * @param size size_t* - Pointer to store the number of assemblies
         * @returns Il2CppAssembly** - Array of assemblies
         */
        get domainGetAssemblies() {
            return r('il2cpp_domain_get_assemblies', 'pointer', ['pointer', 'pointer']);
        },

        // === EXCEPTION FUNCTIONS ===
        // TODO
        /**
         * Raises an exception (does not return).
         * @param ex Il2CppException* - The exception to raise
         */
        get raiseException() {
            return r('il2cpp_raise_exception', 'void', ['pointer']);
        },

        // TODO
        /**
         * Creates an exception from name and message.
         * @param image Il2CppImage* - The image containing the exception class
         * @param name_space const char* - The namespace of the exception class
         * @param name const char* - The name of the exception class
         * @param msg const char* - The exception message
         * @returns Il2CppException* - The created exception
         */
        get exceptionFromNameMsg() {
            return r('il2cpp_exception_from_name_msg', 'pointer', [
                'pointer',
                'pointer',
                'pointer',
                'pointer',
            ]);
        },

        // TODO
        /**
         * Gets an ArgumentNullException for the specified argument.
         * @param arg const char* - The name of the null argument
         * @returns Il2CppException* - The ArgumentNullException
         */
        get getExceptionArgumentNull() {
            return r('il2cpp_get_exception_argument_null', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Formats an exception message into a buffer.
         * @param ex Il2CppException* - The exception to format
         * @param message char* - Buffer to store the formatted message
         * @param message_size int - Size of the message buffer
         */
        get formatException() {
            return r('il2cpp_format_exception', 'void', ['pointer', 'pointer', 'int']);
        },

        // TODO
        /**
         * Formats an exception stack trace into a buffer.
         * @param ex Il2CppException* - The exception to format stack trace for
         * @param output char* - Buffer to store the formatted stack trace
         * @param output_size int - Size of the output buffer
         */
        get formatStackTrace() {
            return r('il2cpp_format_stack_trace', 'void', ['pointer', 'pointer', 'int']);
        },

        // TODO
        /**
         * Handles an unhandled exception.
         * @param ex Il2CppException* - The unhandled exception
         */
        get unhandledException() {
            return r('il2cpp_unhandled_exception', 'void', ['pointer']);
        },

        // TODO
        /**
         * Gets the native stack trace for an exception.
         * @param ex Il2CppException* - The exception to get native stack trace for
         * @param addresses uintptr_t** - Pointer to store array of addresses
         * @param numFrames int* - Pointer to store number of frames
         * @param imageUUID char* - Buffer to store image UUID
         */
        get nativeStackTrace() {
            return r('il2cpp_native_stack_trace', 'void', [
                'pointer',
                'pointer',
                'pointer',
                'pointer',
            ]);
        },

        // === FIELD FUNCTIONS ===
        /**
         * Gets the flags of a field.
         * @param field FieldInfo* - The field to get flags from
         * @returns int - The field flags
         */
        get fieldGetFlags() {
            return r('il2cpp_field_get_flags', 'int', ['pointer']);
        },

        /**
         * Gets the name of a field.
         * @param field FieldInfo* - The field to get the name of
         * @returns const char* - The field name
         */
        get fieldGetName() {
            return r('il2cpp_field_get_name', 'pointer', ['pointer']);
        },

        /**
         * Gets the parent class of a field.
         * @param field FieldInfo* - The field to get the parent class of
         * @returns Il2CppClass* - The parent class
         */
        get fieldGetClass() {
            return r('il2cpp_field_get_parent', 'pointer', ['pointer']);
        },

        /**
         * Gets the offset of a field within its containing object.
         * @param field FieldInfo* - The field to get the offset of
         * @returns size_t - The field offset in bytes
         */
        get fieldGetOffset() {
            return r('il2cpp_field_get_offset', 'size_t', ['pointer']);
        },

        /**
         * Gets the type of a field.
         * @param field FieldInfo* - The field to get the type of
         * @returns Il2CppType* - The field type
         */
        get fieldGetType() {
            return r('il2cpp_field_get_type', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets the value of a field from an object instance.
         * @param obj Il2CppObject* - The object instance
         * @param field FieldInfo* - The field to get the value from
         * @param value void* - Buffer to store the field value
         */
        get fieldGetValue() {
            return r('il2cpp_field_get_value', 'void', ['pointer', 'pointer', 'pointer']);
        },

        // TODO
        /**
         * Gets the value of a field as a boxed object.
         * @param field FieldInfo* - The field to get the value from
         * @param obj Il2CppObject* - The object instance
         * @returns Il2CppObject* - The boxed field value
         */
        get fieldGetValueObject() {
            return r('il2cpp_field_get_value_object', 'pointer', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Determines whether a field has the specified attribute.
         * @param field FieldInfo* - The field to check
         * @param attr_class Il2CppClass* - The attribute class to look for
         * @returns bool - True if the field has the attribute
         */
        get fieldHasAttribute() {
            return r('il2cpp_field_has_attribute', 'bool', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Sets the value of a field on an object instance.
         * @param obj Il2CppObject* - The object instance
         * @param field FieldInfo* - The field to set the value of
         * @param value void* - Pointer to the value to set
         */
        get fieldSetValue() {
            return r('il2cpp_field_set_value', 'void', ['pointer', 'pointer', 'pointer']);
        },

        /**
         * Gets the value of a static field.
         * @param field FieldInfo* - The static field to get the value from
         * @param value void* - Buffer to store the field value
         */
        get fieldGetStaticValue() {
            return r('il2cpp_field_static_get_value', 'void', ['pointer', 'pointer']);
        },

        /**
         * Sets the value of a static field.
         * @param field FieldInfo* - The static field to set the value of
         * @param value void* - Pointer to the value to set
         */
        get fieldSetStaticValue() {
            return r('il2cpp_field_static_set_value', 'void', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Sets the value of a field using a boxed object.
         * @param instance Il2CppObject* - The object instance
         * @param field FieldInfo* - The field to set the value of
         * @param value Il2CppObject* - The boxed value to set
         */
        get fieldSetValueObject() {
            return r('il2cpp_field_set_value_object', 'void', ['pointer', 'pointer', 'pointer']);
        },

        // TODO
        /**
         * Determines whether a field is a compile-time constant.
         * @param field FieldInfo* - The field to check
         * @returns bool - True if the field is literal
         */
        get fieldIsLiteral() {
            return r('il2cpp_field_is_literal', 'bool', ['pointer']);
        },

        // === GC FUNCTIONS ===
        /**
         * Forces garbage collection up to the specified generation.
         * @param maxGenerations int - Maximum generation to collect
         */
        get gcCollect() {
            return r('il2cpp_gc_collect', 'void', ['int']);
        },

        /**
         * Performs a small incremental garbage collection.
         * @returns int32_t - Result of the collection
         */
        get gcCollectALittle() {
            return r('il2cpp_gc_collect_a_little', 'int32', []);
        },

        /**
         * Starts an incremental garbage collection.
         */
        get gcStartIncrementalCollection() {
            return r('il2cpp_gc_start_incremental_collection', 'void', []);
        },

        /**
         * Disables garbage collection.
         */
        get gcDisable() {
            return r('il2cpp_gc_disable', 'void', []);
        },

        /**
         * Enables garbage collection.
         */
        get gcEnable() {
            return r('il2cpp_gc_enable', 'void', []);
        },

        /**
         * Determines whether garbage collection is disabled.
         * @returns bool - True if GC is disabled
         */
        get gcIsDisabled() {
            return r('il2cpp_gc_is_disabled', 'bool', []);
        },

        // TODO
        /**
         * Sets the garbage collection mode.
         * @param mode Il2CppGCMode - The GC mode to set
         */
        get gcSetMode() {
            return r('il2cpp_gc_set_mode', 'void', ['int']);
        },

        /**
         * Gets the maximum time slice for incremental GC in nanoseconds.
         * @returns int64_t - The maximum time slice in nanoseconds
         */
        get gcGetMaxTimeSlice() {
            return r('il2cpp_gc_get_max_time_slice_ns', 'int64', []);
        },

        /**
         * Sets the maximum time slice for incremental GC in nanoseconds.
         * @param maxTimeSlice int64_t - The maximum time slice in nanoseconds
         */
        get gcSetMaxTimeSlice() {
            return r('il2cpp_gc_set_max_time_slice_ns', 'void', ['int64']);
        },

        /**
         * Determines whether incremental garbage collection is enabled.
         * @returns bool - True if incremental GC is enabled
         */
        get gcIsIncremental() {
            return r('il2cpp_gc_is_incremental', 'bool', []);
        },

        /**
         * Gets the amount of memory currently used by the GC heap.
         * @returns int64_t - The used heap size in bytes
         */
        get gcGetUsedSize() {
            return r('il2cpp_gc_get_used_size', 'int64', []);
        },

        /**
         * Gets the total size of the GC heap.
         * @returns int64_t - The heap size in bytes
         */
        get gcGetHeapSize() {
            return r('il2cpp_gc_get_heap_size', 'int64', []);
        },

        // TODO
        /**
         * Sets a field with write barrier for garbage collection.
         * @param obj Il2CppObject* - The object containing the field
         * @param targetAddress void** - Address of the field to set
         * @param object void* - The value to assign
         */
        get gcWbarrierSetField() {
            return r('il2cpp_gc_wbarrier_set_field', 'void', ['pointer', 'pointer', 'pointer']);
        },

        // TODO
        /**
         * Determines whether the GC has strict write barriers.
         * @returns bool - True if GC has strict write barriers
         */
        get gcHasStrictWbarriers() {
            return r('il2cpp_gc_has_strict_wbarriers', 'bool', []);
        },

        // TODO
        /**
         * Sets an external allocation tracker for the GC.
         * @param func void(*)(void*, size_t, int) - The tracker function
         */
        get gcSetExternalAllocationTracker() {
            return r('il2cpp_gc_set_external_allocation_tracker', 'void', ['pointer']);
        },

        // TODO
        /**
         * Sets an external write barrier tracker for the GC.
         * @param func void(*)(void**) - The tracker function
         */
        get gcSetExternalWbarrierTracker() {
            return r('il2cpp_gc_set_external_wbarrier_tracker', 'void', ['pointer']);
        },

        // TODO
        /**
         * Iterates over each heap with a callback.
         * @param func void(*)(void* data, void* userData) - Callback for each heap
         * @param userData void* - User data passed to the callback
         */
        get gcForEachHeap() {
            return r('il2cpp_gc_foreach_heap', 'void', ['pointer', 'pointer']);
        },

        /**
         * Stops the garbage collector world (pauses all managed threads).
         */
        get gcStopWorld() {
            return r('il2cpp_stop_gc_world', 'void', []);
        },

        /**
         * Starts the garbage collector world (resumes all managed threads).
         */
        get gcStartWorld() {
            return r('il2cpp_start_gc_world', 'void', []);
        },

        // === GC HANDLE FUNCTIONS ===
        /**
         * Creates a new GC handle for an object.
         * @param obj Il2CppObject* - The object to create a handle for
         * @param pinned bool - Whether to pin the object in memory
         * @returns uint32_t - The GC handle
         */
        get gcHandleNew() {
            return r('il2cpp_gchandle_new', 'uint32', ['pointer', 'bool']);
        },

        /**
         * Creates a new weak reference GC handle for an object.
         * @param obj Il2CppObject* - The object to create a weak reference for
         * @param track_resurrection bool - Whether to track resurrection
         * @returns uint32_t - The weak GC handle
         */
        get gcHandleNewWeakRef() {
            return r('il2cpp_gchandle_new_weakref', 'uint32', ['pointer', 'bool']);
        },

        /**
         * Gets the target object from a GC handle.
         * @param gchandle uint32_t - The GC handle
         * @returns Il2CppObject* - The target object, or null if collected
         */
        get gcHandleGetTarget() {
            return r('il2cpp_gchandle_get_target', 'pointer', ['uint32']);
        },

        /**
         * Frees a GC handle.
         * @param gchandle uint32_t - The GC handle to free
         */
        get gcHandleFree() {
            return r('il2cpp_gchandle_free', 'void', ['uint32']);
        },

        // TODO
        /**
         * Iterates over all GC handles with a callback.
         * @param func void(*)(void* data, void* userData) - Callback for each handle
         * @param userData void* - User data passed to the callback
         */
        get gcHandleForEachGetTarget() {
            return r('il2cpp_gchandle_foreach_get_target', 'void', ['pointer', 'pointer']);
        },

        // === VM RUNTIME INFO FUNCTIONS ===
        // TODO
        /**
         * Gets the size of the object header.
         * @returns uint32_t - The object header size in bytes
         */
        get objectHeaderSize() {
            return r('il2cpp_object_header_size', 'uint32', []);
        },

        // TODO
        /**
         * Gets the size of the array object header.
         * @returns uint32_t - The array object header size in bytes
         */
        get arrayObjectHeaderSize() {
            return r('il2cpp_array_object_header_size', 'uint32', []);
        },

        // TODO
        /**
         * Gets the offset of the array length field in the array object header.
         * @returns uint32_t - The offset of the length field
         */
        get offsetOfArrayLengthInArrayObjectHeader() {
            return r('il2cpp_offset_of_array_length_in_array_object_header', 'uint32', []);
        },

        // TODO
        /**
         * Gets the offset of the array bounds field in the array object header.
         * @returns uint32_t - The offset of the bounds field
         */
        get offsetOfArrayBoundsInArrayObjectHeader() {
            return r('il2cpp_offset_of_array_bounds_in_array_object_header', 'uint32', []);
        },

        // TODO
        /**
         * Gets the allocation granularity used by the runtime.
         * @returns uint32_t - The allocation granularity in bytes
         */
        get allocationGranularity() {
            return r('il2cpp_allocation_granularity', 'uint32', []);
        },

        // === LIVENESS FUNCTIONS ===
        get livenessCalculationBegin() {
            return r('il2cpp_unity_liveness_calculation_begin', 'pointer', [
                'pointer',
                'int',
                'pointer',
                'pointer',
                'pointer',
                'pointer',
            ]);
        },

        get livenessCalculationEnd() {
            return r('il2cpp_unity_liveness_calculation_end', 'void', ['pointer']);
        },

        // TODO
        get livenessCalculationFromRoot() {
            return r('il2cpp_unity_liveness_calculation_from_root', 'void', ['pointer', 'pointer']);
        },

        get livenessCalculationFromStatics() {
            return r('il2cpp_unity_liveness_calculation_from_statics', 'void', ['pointer']);
        },

        // === METHOD FUNCTIONS ===
        /**
         * Gets the return type of a method.
         * @param method MethodInfo* - The method to get the return type of
         * @returns Il2CppType* - The return type
         */
        get methodGetReturnType() {
            return r('il2cpp_method_get_return_type', 'pointer', ['pointer']);
        },

        /**
         * Gets the class that declares a method.
         * @param method MethodInfo* - The method to get the declaring class of
         * @returns Il2CppClass* - The declaring class
         */
        get methodGetDeclaringClass() {
            return r('il2cpp_method_get_declaring_type', 'pointer', ['pointer']);
        },

        /**
         * Gets the name of a method.
         * @param method MethodInfo* - The method to get the name of
         * @returns const char* - The method name
         */
        get methodGetName() {
            return r('il2cpp_method_get_name', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets the method from a reflection method object.
         * @param method Il2CppReflectionMethod* - The reflection method
         * @returns MethodInfo* - The method info
         */
        get methodGetFromReflection() {
            return r('il2cpp_method_get_from_reflection', 'pointer', ['pointer']);
        },

        /**
         * Gets a reflection method object for a method.
         * @param method MethodInfo* - The method to get the reflection object for
         * @param refclass Il2CppClass* - The reflection class
         * @returns Il2CppReflectionMethod* - The reflection method object
         */
        get methodGetObject() {
            return r('il2cpp_method_get_object', 'pointer', ['pointer', 'pointer']);
        },

        /**
         * Determines whether a method is generic.
         * @param method MethodInfo* - The method to check
         * @returns bool - True if the method is generic
         */
        get methodIsGeneric() {
            return r('il2cpp_method_is_generic', 'bool', ['pointer']);
        },

        /**
         * Determines whether a method is inflated (generic instance).
         * @param method MethodInfo* - The method to check
         * @returns bool - True if the method is inflated
         */
        get methodIsInflated() {
            return r('il2cpp_method_is_inflated', 'bool', ['pointer']);
        },

        /**
         * Determines whether a method is an instance method.
         * @param method MethodInfo* - The method to check
         * @returns bool - True if the method is an instance method
         */
        get methodIsInstance() {
            return r('il2cpp_method_is_instance', 'bool', ['pointer']);
        },

        /**
         * Gets the number of parameters of a method.
         * @param method MethodInfo* - The method to get parameter count of
         * @returns uint32_t - The number of parameters
         */
        get methodGetParameterCount() {
            return r('il2cpp_method_get_param_count', 'uint32', ['pointer']);
        },

        /**
         * Gets the type of a method parameter at the specified index.
         * @param method MethodInfo* - The method to get parameter type from
         * @param index uint32_t - The parameter index
         * @returns Il2CppType* - The parameter type
         */
        get methodGetParameterType() {
            return r('il2cpp_method_get_param', 'pointer', ['pointer', 'uint32']);
        },

        /**
         * Gets the class that contains a method.
         * @param method MethodInfo* - The method to get the class of
         * @returns Il2CppClass* - The containing class
         */
        get methodGetClass() {
            return r('il2cpp_method_get_class', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Determines whether a method has the specified attribute.
         * @param method MethodInfo* - The method to check
         * @param attr_class Il2CppClass* - The attribute class to look for
         * @returns bool - True if the method has the attribute
         */
        get methodHasAttribute() {
            return r('il2cpp_method_has_attribute', 'bool', ['pointer', 'pointer']);
        },

        /**
         * Gets the flags of a method.
         * @param method MethodInfo* - The method to get flags from
         * @param iflags uint32_t* - Pointer to store implementation flags
         * @returns uint32_t - The method flags
         */
        get methodGetFlags() {
            return r('il2cpp_method_get_flags', 'uint32', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Gets the metadata token of a method.
         * @param method MethodInfo* - The method to get the token of
         * @returns uint32_t - The method token
         */
        get methodGetToken() {
            return r('il2cpp_method_get_token', 'uint32', ['pointer']);
        },

        /**
         * Gets the name of a method parameter at the specified index.
         * @param method MethodInfo* - The method to get parameter name from
         * @param index uint32_t - The parameter index
         * @returns const char* - The parameter name
         */
        get methodGetParameterName() {
            return r('il2cpp_method_get_param_name', 'pointer', ['pointer', 'uint32']);
        },

        // === PROFILER FUNCTIONS ===
        // TODO
        get profilerInstall() {
            return r('il2cpp_profiler_install', 'void', ['pointer', 'pointer']);
        },

        // TODO
        get profilerSetEvents() {
            return r('il2cpp_profiler_set_events', 'void', ['int']);
        },

        // TODO
        get profilerInstallEnterLeave() {
            return r('il2cpp_profiler_install_enter_leave', 'void', ['pointer', 'pointer']);
        },

        // TODO
        get profilerInstallAllocation() {
            return r('il2cpp_profiler_install_allocation', 'void', ['pointer']);
        },

        // TODO
        get profilerInstallGc() {
            return r('il2cpp_profiler_install_gc', 'void', ['pointer', 'pointer']);
        },

        // TODO
        get profilerInstallFileio() {
            return r('il2cpp_profiler_install_fileio', 'void', ['pointer']);
        },

        // TODO
        get profilerInstallThread() {
            return r('il2cpp_profiler_install_thread', 'void', ['pointer', 'pointer']);
        },

        // === PROPERTY FUNCTIONS ===
        // TODO

        get propertyGetFlags() {
            return r('il2cpp_property_get_flags', 'uint32', ['pointer']);
        },

        // TODO

        get propertyGetGetMethod() {
            return r('il2cpp_property_get_get_method', 'pointer', ['pointer']);
        },

        // TODO

        get propertyGetSetMethod() {
            return r('il2cpp_property_get_set_method', 'pointer', ['pointer']);
        },

        // TODO

        get propertyGetName() {
            return r('il2cpp_property_get_name', 'pointer', ['pointer']);
        },

        // TODO

        get propertyGetParent() {
            return r('il2cpp_property_get_parent', 'pointer', ['pointer']);
        },

        // === OBJECT FUNCTIONS ===
        /**
         * Gets the class of an object.
         * In practice, this is the first pointer of two in the object header.
         *
         * @param obj Il2CppObject* - The object to get the class of
         * @returns Il2CppClass* - The class of the object
         */
        get objectGetClass() {
            return r('il2cpp_object_get_class', 'pointer', ['pointer']);
        },

        /**
         * Gets the size of an object in bytes.
         * @param obj Il2CppObject* - The object to get the size of
         * @returns uint32_t - The object size in bytes
         */
        get objectGetSize() {
            return r('il2cpp_object_get_size', 'uint32', ['pointer']);
        },

        /**
         * Gets the virtual method implementation for an object.
         * @param obj Il2CppObject* - The object instance
         * @param method MethodInfo* - The virtual method to resolve
         * @returns MethodInfo* - The actual method implementation
         */
        get objectGetVirtualMethod() {
            return r('il2cpp_object_get_virtual_method', 'pointer', ['pointer', 'pointer']);
        },

        /**
         * Allocates a new object of the specified class.
         * @param klass Il2CppClass* - The class to instantiate
         * @returns Il2CppObject* - The newly allocated object
         */
        get objectNew() {
            return r('il2cpp_object_new', 'pointer', ['pointer']);
        },

        /**
         * Unboxes a boxed value type object.
         * @param obj Il2CppObject* - The boxed object to unbox
         * @returns void* - Pointer to the unboxed value
         */
        get objectUnbox() {
            return r('il2cpp_object_unbox', 'pointer', ['pointer']);
        },

        /**
         * Boxes a value type into an object.
         * @param klass Il2CppClass* - The value type class
         * @param data void* - Pointer to the value to box
         * @returns Il2CppObject* - The boxed object
         */
        get valueTypeBox() {
            return r('il2cpp_value_box', 'pointer', ['pointer', 'pointer']);
        },

        // === MONITOR FUNCTIONS ===
        /**
         * Enters the monitor on the specified object.
         * @param obj Il2CppObject* - The object to monitor
         */
        get monitorEnter() {
            return r('il2cpp_monitor_enter', 'void', ['pointer']);
        },

        /**
         * Attempts to enter the monitor on the specified object with a timeout.
         * @param obj Il2CppObject* - The object to monitor
         * @param timeout uint32_t - Timeout in milliseconds
         * @returns bool - True if the monitor was entered successfully
         */
        get monitorTryEnter() {
            return r('il2cpp_monitor_try_enter', 'bool', ['pointer', 'uint32']);
        },

        /**
         * Exits the monitor on the specified object.
         * @param obj Il2CppObject* - The object to release monitor from
         */
        get monitorExit() {
            return r('il2cpp_monitor_exit', 'void', ['pointer']);
        },

        /**
         * Pulses (notifies) one waiting thread on the specified object.
         * @param obj Il2CppObject* - The object to pulse
         */
        get monitorPulse() {
            return r('il2cpp_monitor_pulse', 'void', ['pointer']);
        },

        /**
         * Pulses (notifies) all waiting threads on the specified object.
         * @param obj Il2CppObject* - The object to pulse all threads on
         */
        get monitorPulseAll() {
            return r('il2cpp_monitor_pulse_all', 'void', ['pointer']);
        },

        /**
         * Waits indefinitely on the specified object's monitor.
         * @param obj Il2CppObject* - The object to wait on
         */
        get monitorWait() {
            return r('il2cpp_monitor_wait', 'void', ['pointer']);
        },

        /**
         * Waits on the specified object's monitor with a timeout.
         * @param obj Il2CppObject* - The object to wait on
         * @param timeout uint32_t - Timeout in milliseconds
         * @returns bool - True if signaled before timeout
         */
        get monitorTryWait() {
            return r('il2cpp_monitor_try_wait', 'bool', ['pointer', 'uint32']);
        },

        // === RUNTIME FUNCTIONS ===
        // TODO
        /**
         * Invokes a method with the specified parameters and returns the result.
         * @param method Il2CppMethod* - The method to invoke
         * @param obj Il2CppObject* - The object instance (null for static methods)
         * @param params void** - Array of parameters
         * @param exc Il2CppException** - Output parameter for exceptions
         * @returns Il2CppObject* - The return value of the method
         */
        get runtimeInvoke() {
            return r('il2cpp_runtime_invoke', 'pointer', [
                'pointer',
                'pointer',
                'pointer',
                'pointer',
            ]);
        },

        // TODO
        /**
         * Invokes a method with automatic argument conversion.
         * @param method Il2CppMethod* - The method to invoke
         * @param obj Il2CppObject* - The object instance (null for static methods)
         * @param params void** - Array of parameters
         * @param argc int - Number of arguments
         * @param exc Il2CppException** - Output parameter for exceptions
         * @returns Il2CppObject* - The return value of the method
         */
        get runtimeInvokeConvertArgs() {
            return r('il2cpp_runtime_invoke_convert_args', 'pointer', [
                'pointer',
                'pointer',
                'pointer',
                'int',
                'pointer',
            ]);
        },

        /**
         * Initializes the static constructor of the specified class.
         * @param klass Il2CppClass* - The class to initialize
         */
        get classInitialize() {
            return r('il2cpp_runtime_class_init', 'void', ['pointer']);
        },

        // TODO
        /**
         * Initializes an object by calling its constructor.
         * @param obj Il2CppObject* - The object to initialize
         */
        get objectInitialize() {
            return r('il2cpp_runtime_object_init', 'void', ['pointer']);
        },

        /**
         * Initializes an object by calling its constructor with exception handling.
         * @param obj Il2CppObject* - The object to initialize
         * @param exc Il2CppException** - Output parameter for exceptions
         */
        get objectInitializeException() {
            return r('il2cpp_runtime_object_init_exception', 'void', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Sets the unhandled exception policy for the runtime.
         * @param policy int - The exception policy to set
         */
        get runtimeUnhandledExceptionPolicySet() {
            return r('il2cpp_runtime_unhandled_exception_policy_set', 'void', ['int']);
        },

        // === STRING FUNCTIONS ===
        /**
         * Gets the length of the specified string.
         * @param str Il2CppString* - The string to get the length of
         * @returns int32_t - The length of the string
         */
        get stringGetLength() {
            return r('il2cpp_string_length', 'int32', ['pointer']);
        },

        /**
         * Gets a pointer to the character data of the specified string.
         * @param str Il2CppString* - The string to get characters from
         * @returns Il2CppChar* - Pointer to the string's character data
         */
        get stringGetChars() {
            return r('il2cpp_string_chars', 'pointer', ['pointer']);
        },

        /**
         * Creates a new IL2CPP string from a null-terminated C string.
         * @param str const char* - The C string to convert
         * @returns Il2CppString* - The new IL2CPP string
         */
        get stringNew() {
            return r('il2cpp_string_new', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Creates a new IL2CPP string from a C string with specified length.
         * @param str const char* - The C string to convert
         * @param length uint32_t - The length of the string
         * @returns Il2CppString* - The new IL2CPP string
         */
        get stringNewLen() {
            return r('il2cpp_string_new_len', 'pointer', ['pointer', 'uint32']);
        },

        // TODO
        /**
         * Creates a new IL2CPP string from a UTF-16 string.
         * @param text const Il2CppChar* - The UTF-16 string to convert
         * @param len int32_t - The length of the string
         * @returns Il2CppString* - The new IL2CPP string
         */
        get stringNewUtf16() {
            return r('il2cpp_string_new_utf16', 'pointer', ['pointer', 'int32']);
        },

        // TODO
        /**
         * Creates a wrapper string without copying the data.
         * @param str const char* - The C string to wrap
         * @returns Il2CppString* - The wrapped string
         */
        get stringNewWrapper() {
            return r('il2cpp_string_new_wrapper', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Interns the specified string.
         * @param str Il2CppString* - The string to intern
         * @returns Il2CppString* - The interned string
         */
        get stringIntern() {
            return r('il2cpp_string_intern', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Checks if the specified string is interned.
         * @param str Il2CppString* - The string to check
         * @returns Il2CppString* - The interned string if found, null otherwise
         */
        get stringIsInterned() {
            return r('il2cpp_string_is_interned', 'pointer', ['pointer']);
        },

        // === THREAD FUNCTIONS ===
        /**
         * Gets the current thread.
         * @returns Il2CppThread* - The current thread
         */
        get threadGetCurrent() {
            return r('il2cpp_thread_current', 'pointer', []);
        },

        /**
         * Attaches the current native thread to the IL2CPP domain.
         * @param domain Il2CppDomain* - The domain to attach to
         * @returns Il2CppThread* - The attached thread
         */
        get threadAttach() {
            return r('il2cpp_thread_attach', 'pointer', ['pointer']);
        },

        /**
         * Detaches the specified thread from the IL2CPP domain.
         * @param thread Il2CppThread* - The thread to detach
         */
        get threadDetach() {
            return r('il2cpp_thread_detach', 'void', ['pointer']);
        },

        /**
         * Gets all threads attached to the domain.
         * @param size size_t* - Output parameter for the number of threads
         * @returns Il2CppThread** - Array of attached threads
         */
        get threadGetAttachedThreads() {
            return r('il2cpp_thread_get_all_attached_threads', 'pointer', ['pointer']);
        },

        /**
         * Checks if the specified thread is a VM thread.
         * @param thread Il2CppThread* - The thread to check
         * @returns bool - True if the thread is a VM thread
         */
        get threadIsVm() {
            return r('il2cpp_is_vm_thread', 'bool', ['pointer']);
        },

        // === STACK TRACE FUNCTIONS ===
        // TODO
        /**
         * Walks the frame stack of the current thread.
         * @param func Il2CppFrameWalkFunc - The callback function for each frame
         * @param user_data void* - User data passed to the callback
         */
        get currentThreadWalkFrameStack() {
            return r('il2cpp_current_thread_walk_frame_stack', 'void', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Walks the frame stack of the specified thread.
         * @param thread Il2CppThread* - The thread to walk
         * @param func Il2CppFrameWalkFunc - The callback function for each frame
         * @param user_data void* - User data passed to the callback
         */
        get threadWalkFrameStack() {
            return r('il2cpp_thread_walk_frame_stack', 'void', ['pointer', 'pointer', 'pointer']);
        },

        // TODO
        /**
         * Gets the top frame of the current thread.
         * @param frame Il2CppStackFrameInfo* - Output parameter for the frame info
         * @returns bool - True if a frame was found
         */
        get currentThreadGetTopFrame() {
            return r('il2cpp_current_thread_get_top_frame', 'bool', ['pointer']);
        },

        // TODO
        /**
         * Gets the top frame of the specified thread.
         * @param thread Il2CppThread* - The thread to get the frame from
         * @param frame Il2CppStackFrameInfo* - Output parameter for the frame info
         * @returns bool - True if a frame was found
         */
        get threadGetTopFrame() {
            return r('il2cpp_thread_get_top_frame', 'bool', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Gets the frame at the specified index in the current thread.
         * @param index int32_t - The frame index
         * @param frame Il2CppStackFrameInfo* - Output parameter for the frame info
         * @returns bool - True if a frame was found at the index
         */
        get currentThreadGetFrameAt() {
            return r('il2cpp_current_thread_get_frame_at', 'bool', ['int32', 'pointer']);
        },

        // TODO
        /**
         * Gets the frame at the specified index in the specified thread.
         * @param thread Il2CppThread* - The thread to get the frame from
         * @param index int32_t - The frame index
         * @param frame Il2CppStackFrameInfo* - Output parameter for the frame info
         * @returns bool - True if a frame was found at the index
         */
        get threadGetFrameAt() {
            return r('il2cpp_thread_get_frame_at', 'bool', ['pointer', 'int32', 'pointer']);
        },

        // TODO
        /**
         * Gets the stack depth of the current thread.
         * @returns int32_t - The number of frames in the stack
         */
        get currentThreadGetStackDepth() {
            return r('il2cpp_current_thread_get_stack_depth', 'int32', []);
        },

        // TODO
        /**
         * Gets the stack depth of the specified thread.
         * @param thread Il2CppThread* - The thread to get the stack depth from
         * @returns int32_t - The number of frames in the stack
         */
        get threadGetStackDepth() {
            return r('il2cpp_thread_get_stack_depth', 'int32', ['pointer']);
        },

        // TODO
        /**
         * Overrides the stack backtrace functionality.
         * @param func Il2CppBacktraceFunc - The backtrace function to use
         */
        get overrideStackBacktrace() {
            return r('il2cpp_override_stack_backtrace', 'void', ['pointer']);
        },

        // === TYPE FUNCTIONS ===
        /**
         * Gets the reflection object for the specified type.
         * Note that the original signature returns a Il2CppReflectionType*, but it's a full-blown Il2CppReflectionRuntimeType* underneath.
         *
         * @param type Il2CppType* - The type to get the reflection object for
         * @returns Il2CppReflectionRuntimeType* - Reflection object of type `System.RuntimeType`
         */
        get typeGetObject() {
            return r('il2cpp_type_get_object', 'pointer', ['pointer']);
        },

        /**
         * Gets the type enum value for the specified type.
         * @param type Il2CppType* - The type to get the enum value for
         * @returns int - The type enum value
         */
        get typeGetTypeEnum() {
            return r('il2cpp_type_get_type', 'int', ['pointer']);
        },

        /**
         * Gets the class from the specified type.
         * @param type Il2CppType* - The type to get the class from
         * @returns Il2CppClass* - The class representing the type
         */
        get typeGetClass() {
            return r('il2cpp_class_from_type', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets the class or element class from the specified type.
         * @param type Il2CppType* - The type to get the class from
         * @returns Il2CppClass* - The class or element class
         */
        get typeGetClassOrElementClass() {
            return r('il2cpp_type_get_class_or_element_class', 'pointer', ['pointer']);
        },

        /**
         * Gets the name of the specified type.
         * @param type Il2CppType* - The type to get the name of
         * @returns char* - The name of the type (must be freed with il2cpp_free)
         */
        get typeGetName() {
            return r('il2cpp_type_get_name', 'pointer', ['pointer']);
        },

        /**
         * Determines whether the specified type is a by-reference type.
         * @param type Il2CppType* - The type to check
         * @returns bool - True if the type is by-reference
         */
        get typeIsByRef() {
            return r('il2cpp_type_is_byref', 'bool', ['pointer']);
        },

        // TODO
        /**
         * Gets the attributes of the specified type.
         * @param type Il2CppType* - The type to get the attributes of
         * @returns uint32_t - The type attributes
         */
        get typeGetAttrs() {
            return r('il2cpp_type_get_attrs', 'uint32', ['pointer']);
        },

        /**
         * Determines whether two types are equal.
         * @param type1 Il2CppType* - The first type to compare
         * @param type2 Il2CppType* - The second type to compare
         * @returns bool - True if the types are equal
         */
        get typeEquals() {
            return r('il2cpp_type_equals', 'bool', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Gets the assembly-qualified name of the specified type.
         * @param type Il2CppType* - The type to get the name of
         * @returns char* - The assembly-qualified name (must be freed with il2cpp_free)
         */
        get typeGetAssemblyQualifiedName() {
            return r('il2cpp_type_get_assembly_qualified_name', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Determines whether the specified type is static.
         * @param type Il2CppType* - The type to check
         * @returns bool - True if the type is static
         */
        get typeIsStatic() {
            return r('il2cpp_type_is_static', 'bool', ['pointer']);
        },

        /**
         * Determines whether the specified type is a pointer type.
         * @param type Il2CppType* - The type to check
         * @returns bool - True if the type is a pointer type
         */
        get typeIsPointer() {
            return r('il2cpp_type_is_pointer_type', 'bool', ['pointer']);
        },

        // === IMAGE FUNCTIONS ===
        /**
         * Gets the assembly that contains the specified image.
         * @param image Il2CppImage* - The image to get the assembly from
         * @returns Il2CppAssembly* - The assembly containing the image
         */
        get imageGetAssembly() {
            return r('il2cpp_image_get_assembly', 'pointer', ['pointer']);
        },

        /**
         * Gets the name of the specified image.
         * @param image Il2CppImage* - The image to get the name of
         * @returns const char* - The name of the image
         */
        get imageGetName() {
            return r('il2cpp_image_get_name', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets the filename of the specified image.
         * @param image Il2CppImage* - The image to get the filename of
         * @returns const char* - The filename of the image
         */
        get imageGetFilename() {
            return r('il2cpp_image_get_filename', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets the entry point method of the specified image.
         * @param image Il2CppImage* - The image to get the entry point from
         * @returns Il2CppMethod* - The entry point method
         */
        get imageGetEntryPoint() {
            return r('il2cpp_image_get_entry_point', 'pointer', ['pointer']);
        },

        /**
         * Gets the number of classes in the specified image.
         * @param image Il2CppImage* - The image to get the class count from
         * @returns size_t - The number of classes in the image
         */
        get imageGetClassCount() {
            return r('il2cpp_image_get_class_count', 'size_t', ['pointer']);
        },

        /**
         * Gets the class at the specified index in the image.
         * @param image Il2CppImage* - The image to get the class from
         * @param index size_t - The index of the class to retrieve
         * @returns Il2CppClass* - The class at the specified index
         */
        get imageGetClass() {
            return r('il2cpp_image_get_class', 'pointer', ['pointer', 'size_t']);
        },

        // === MEMORY SNAPSHOT FUNCTIONS ===
        /**
         * Captures a memory snapshot of the IL2CPP runtime.
         * @returns Il2CppManagedMemorySnapshot* - The captured memory snapshot
         */
        get memorySnapshotCapture() {
            return r('il2cpp_capture_memory_snapshot', 'pointer', []);
        },

        /**
         * Frees a previously captured memory snapshot.
         * @param snapshot Il2CppManagedMemorySnapshot* - The snapshot to free
         */
        get memorySnapshotFree() {
            return r('il2cpp_free_captured_memory_snapshot', 'void', ['pointer']);
        },

        // === PLUGIN CALLBACKS ===
        // TODO
        /**
         * Sets the callback function for finding plugins.
         * @param callback Il2CppSetFindPlugInCallback - The callback function
         */
        get setFindPluginCallback() {
            return r('il2cpp_set_find_plugin_callback', 'void', ['pointer']);
        },

        // === LOGGING FUNCTIONS ===
        // TODO
        /**
         * Registers a callback function for IL2CPP log messages.
         * @param callback Il2CppLogCallback - The callback function for log messages
         */
        get registerLogCallback() {
            return r('il2cpp_register_log_callback', 'void', ['pointer']);
        },

        // === DEBUGGER FUNCTIONS ===
        // TODO
        /**
         * Sets the debugger agent options.
         * @param options const char* - The debugger agent options string
         */
        get debuggerSetAgentOptions() {
            return r('il2cpp_debugger_set_agent_options', 'void', ['pointer']);
        },

        // TODO
        /**
         * Checks if a debugger is currently attached.
         * @returns bool - True if a debugger is attached
         */
        get isDebuggerAttached() {
            return r('il2cpp_is_debugger_attached', 'bool', []);
        },

        // TODO
        /**
         * Registers a debugger agent transport.
         * @param transport Il2CppDebuggerTransport* - The transport to register
         */
        get registerDebuggerAgentTransport() {
            return r('il2cpp_register_debugger_agent_transport', 'void', ['pointer']);
        },

        // === DEBUG METADATA FUNCTIONS ===
        // TODO
        /**
         * Gets debug information for the specified method.
         * @param method Il2CppMethod* - The method to get debug info for
         * @param debugInfo Il2CppMethodDebugInfo* - Output parameter for debug information
         * @returns bool - True if debug information was found
         */
        get debugGetMethodInfo() {
            return r('il2cpp_debug_get_method_info', 'bool', ['pointer', 'pointer']);
        },

        // === TLS MODULE FUNCTIONS ===
        // TODO
        /**
         * Installs the Unity TLS interface.
         * @param unitytlsInterfaceStruct UnityTlsInterface* - The TLS interface structure
         */
        get unityInstallUnitytlsInterface() {
            return r('il2cpp_unity_install_unitytls_interface', 'void', ['pointer']);
        },

        // === CUSTOM ATTRIBUTES FUNCTIONS ===
        // TODO
        /**
         * Gets custom attributes from the specified class.
         * @param klass Il2CppClass* - The class to get custom attributes from
         * @returns Il2CppArray* - Array of custom attributes
         */
        get customAttrsFromClass() {
            return r('il2cpp_custom_attrs_from_class', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets custom attributes from the specified method.
         * @param method Il2CppMethod* - The method to get custom attributes from
         * @returns Il2CppArray* - Array of custom attributes
         */
        get customAttrsFromMethod() {
            return r('il2cpp_custom_attrs_from_method', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Gets a specific custom attribute from a custom attributes array.
         * @param attributes Il2CppArray* - The custom attributes array
         * @param attrClass Il2CppClass* - The attribute class to look for
         * @returns Il2CppObject* - The custom attribute instance, or null if not found
         */
        get customAttrsGetAttr() {
            return r('il2cpp_custom_attrs_get_attr', 'pointer', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Checks if a specific custom attribute exists in a custom attributes array.
         * @param attributes Il2CppArray* - The custom attributes array
         * @param attrClass Il2CppClass* - The attribute class to look for
         * @returns bool - True if the attribute exists
         */
        get customAttrsHasAttr() {
            return r('il2cpp_custom_attrs_has_attr', 'bool', ['pointer', 'pointer']);
        },

        // TODO
        /**
         * Constructs custom attribute instances from raw attribute data.
         * @param attrs Il2CppCustomAttributeDataStorage* - The raw attribute data
         * @returns Il2CppArray* - Array of constructed custom attribute instances
         */
        get customAttrsConstruct() {
            return r('il2cpp_custom_attrs_construct', 'pointer', ['pointer']);
        },

        // TODO
        /**
         * Frees memory associated with custom attributes.
         * @param attrs Il2CppArray* - The custom attributes array to free
         */
        get customAttrsFree() {
            return r('il2cpp_custom_attrs_free', 'void', ['pointer']);
        },

        // === THREAD AFFINITY FUNCTIONS ===
        // TODO
        /**
         * Sets the default thread affinity mask for new threads.
         * @param affinity int64_t - The thread affinity mask
         */
        get setDefaultThreadAffinity() {
            return r('il2cpp_set_default_thread_affinity', 'void', ['int64']);
        },

        /**
         * Allocates a liveness struct for Unity-specific functionality.
         * @param filter Il2CppObject* - Filter object
         * @param maxObjectCount int - Maximum object count
         * @param callback Il2CppLivenessCalculationCallback - Callback function
         * @param userdata void* - User data
         * @param worldChanged Il2CppLivenessWorldChangedCallback - World changed callback
         * @returns Il2CppLivenessCalculation* - The liveness calculation struct
         */
        get livenessAllocateStruct() {
            return r('il2cpp_unity_liveness_allocate_struct', 'pointer', [
                'pointer',
                'int',
                'pointer',
                'pointer',
                'pointer',
            ]);
        },

        /**
         * Finalizes a liveness calculation.
         * @param liveness Il2CppLivenessCalculation* - The liveness calculation to finalize
         */
        get livenessFinalize() {
            return r('il2cpp_unity_liveness_finalize', 'void', ['pointer']);
        },

        /**
         * Frees a liveness struct.
         * @param liveness Il2CppLivenessCalculation* - The liveness calculation to free
         */
        get livenessFreeStruct() {
            return r('il2cpp_unity_liveness_free_struct', 'void', ['pointer']);
        },

        /**
         * Gets classes from a memory snapshot.
         * @param snapshot Il2CppManagedMemorySnapshot* - The memory snapshot
         * @param size size_t* - Output parameter for the number of classes
         * @returns Il2CppManagedMemorySnapshotClasses* - Array of classes
         */
        get memorySnapshotGetClasses() {
            return r('il2cpp_memory_snapshot_get_classes', 'pointer', ['pointer', 'pointer']);
        },

        /**
         * Gets objects from a memory snapshot.
         * @param snapshot Il2CppManagedMemorySnapshot* - The memory snapshot
         * @param size size_t* - Output parameter for the number of objects
         * @returns Il2CppManagedMemorySnapshotObjects* - Array of objects
         */
        get memorySnapshotGetObjects() {
            return r('il2cpp_memory_snapshot_get_objects', 'pointer', ['pointer', 'pointer']);
        },
    };

    decorate(exports, lazy);

    /** @internal */
    export declare const memorySnapshotExports: CModule;
    getter(
        Il2Cpp,
        'memorySnapshotExports',
        () => new CModule($inline_file('cmodules/memory-snapshot.c')),
        lazy
    );

    function r<R extends NativeFunctionReturnType, A extends NativeFunctionArgumentType[] | []>(
        exportName: string,
        retType: R,
        argTypes: A
    ) {
        const handle: NativePointer | null | undefined =
            (globalThis as any).IL2CPP_EXPORTS?.[exportName]?.() ??
            Il2Cpp.module.findExportByName(exportName) ??
            memorySnapshotExports[exportName];

        const target = new NativeFunction(handle ?? NULL, retType, argTypes);

        return target.isNull()
            ? new Proxy(target, {
                  get(value: typeof target, name: keyof typeof target) {
                      const property = value[name];
                      return typeof property === 'function' ? property.bind(value) : property;
                  },
                  apply() {
                      if (handle == null) {
                          raise(`couldn't resolve export ${exportName}`);
                      } else if (handle.isNull()) {
                          raise(
                              `export ${exportName} points to NULL IL2CPP library has likely been stripped, obfuscated, or customized`
                          );
                      }
                  },
              })
            : target;
    }

    declare const $inline_file: typeof import('ts-transformer-inline-file').$INLINE_FILE;
}
