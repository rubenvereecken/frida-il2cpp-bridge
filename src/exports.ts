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
        get initialize() {
            return r('il2cpp_init', 'int', ['pointer']);
        },

        get initializeUtf16() {
            return r('il2cpp_init_utf16', 'int', ['pointer']);
        },

        get shutdown() {
            return r('il2cpp_shutdown', 'void', []);
        },

        get setConfigDir() {
            return r('il2cpp_set_config_dir', 'void', ['pointer']);
        },

        get setDataDir() {
            return r('il2cpp_set_data_dir', 'void', ['pointer']);
        },

        get setTempDir() {
            return r('il2cpp_set_temp_dir', 'void', ['pointer']);
        },

        get setCommandlineArguments() {
            return r('il2cpp_set_commandline_arguments', 'void', ['int', 'pointer', 'pointer']);
        },

        get setCommandlineArgumentsUtf16() {
            return r('il2cpp_set_commandline_arguments_utf16', 'void', [
                'int',
                'pointer',
                'pointer',
            ]);
        },

        get setConfigUtf16() {
            return r('il2cpp_set_config_utf16', 'void', ['pointer']);
        },

        get setConfig() {
            return r('il2cpp_set_config', 'void', ['pointer']);
        },

        get setMemoryCallbacks() {
            return r('il2cpp_set_memory_callbacks', 'void', ['pointer']);
        },

        get addInternalCall() {
            return r('il2cpp_add_internal_call', 'void', ['pointer', 'pointer']);
        },

        get resolveInternalCall() {
            return r('il2cpp_resolve_icall', 'pointer', ['pointer']);
        },

        get getCorlib() {
            return r('il2cpp_get_corlib', 'pointer', []);
        },

        // === MEMORY MANAGEMENT ===
        get alloc() {
            return r('il2cpp_alloc', 'pointer', ['size_t']);
        },

        get free() {
            return r('il2cpp_free', 'void', ['pointer']);
        },

        // === ARRAY FUNCTIONS ===
        get arrayGetClass() {
            return r('il2cpp_array_class_get', 'pointer', ['pointer', 'uint32']);
        },

        get arrayGetLength() {
            return r('il2cpp_array_length', 'uint32', ['pointer']);
        },

        // TODO

        get arrayGetByteLength() {
            return r('il2cpp_array_get_byte_length', 'uint32', ['pointer']);
        },

        get arrayNew() {
            return r('il2cpp_array_new', 'pointer', ['pointer', 'uint32']);
        },

        // TODO

        get arrayNewSpecific() {
            return r('il2cpp_array_new_specific', 'pointer', ['pointer', 'uint32']);
        },

        // TODO

        get arrayNewFull() {
            return r('il2cpp_array_new_full', 'pointer', ['pointer', 'pointer', 'pointer']);
        },

        // TODO

        get boundedArrayClassGet() {
            return r('il2cpp_bounded_array_class_get', 'pointer', ['pointer', 'uint32', 'bool']);
        },

        // TODO

        get arrayElementSize() {
            return r('il2cpp_array_element_size', 'int', ['pointer']);
        },

        // === ASSEMBLY FUNCTIONS ===
        get assemblyGetImage() {
            return r('il2cpp_assembly_get_image', 'pointer', ['pointer']);
        },

        // === CLASS FUNCTIONS ===
        get classForEach() {
            return r('il2cpp_class_for_each', 'void', ['pointer', 'pointer']);
        },

        get classGetBaseType() {
            return r('il2cpp_class_enum_basetype', 'pointer', ['pointer']);
        },

        get classIsGeneric() {
            return r('il2cpp_class_is_generic', 'bool', ['pointer']);
        },

        get classIsInflated() {
            return r('il2cpp_class_is_inflated', 'bool', ['pointer']);
        },

        get classIsAssignableFrom() {
            return r('il2cpp_class_is_assignable_from', 'bool', ['pointer', 'pointer']);
        },

        get classIsSubclassOf() {
            return r('il2cpp_class_is_subclass_of', 'bool', ['pointer', 'pointer', 'bool']);
        },

        // TODO

        get classHasParent() {
            return r('il2cpp_class_has_parent', 'bool', ['pointer', 'pointer']);
        },

        // TODO
        get classFromIl2CppType() {
            return r('il2cpp_class_from_il2cpp_type', 'pointer', ['pointer']);
        },

        get classFromName() {
            return r('il2cpp_class_from_name', 'pointer', ['pointer', 'pointer', 'pointer']);
        },

        get classFromSystemType() {
            return r('il2cpp_class_from_system_type', 'pointer', ['pointer']);
        },

        get classFromType() {
            return r('il2cpp_class_from_type', 'pointer', ['pointer']);
        },

        get classGetElementClass() {
            return r('il2cpp_class_get_element_class', 'pointer', ['pointer']);
        },

        // TODO

        get classGetEvents() {
            return r('il2cpp_class_get_events', 'pointer', ['pointer', 'pointer']);
        },

        get classGetFields() {
            return r('il2cpp_class_get_fields', 'pointer', ['pointer', 'pointer']);
        },

        get classGetNestedTypes() {
            return r('il2cpp_class_get_nested_types', 'pointer', ['pointer', 'pointer']);
        },

        get classGetInterfaces() {
            return r('il2cpp_class_get_interfaces', 'pointer', ['pointer', 'pointer']);
        },

        // TODO

        get classGetProperties() {
            return r('il2cpp_class_get_properties', 'pointer', ['pointer', 'pointer']);
        },

        // TODO

        get classGetPropertyFromName() {
            return r('il2cpp_class_get_property_from_name', 'pointer', ['pointer', 'pointer']);
        },

        get classGetFieldFromName() {
            return r('il2cpp_class_get_field_from_name', 'pointer', ['pointer', 'pointer']);
        },

        get classGetMethods() {
            return r('il2cpp_class_get_methods', 'pointer', ['pointer', 'pointer']);
        },

        get classGetMethodFromName() {
            return r('il2cpp_class_get_method_from_name', 'pointer', ['pointer', 'pointer', 'int']);
        },

        get classGetName() {
            return r('il2cpp_class_get_name', 'pointer', ['pointer']);
        },

        // TODO

        get typeGetNameChunked() {
            return r('il2cpp_type_get_name_chunked', 'void', ['pointer', 'pointer', 'pointer']);
        },

        get classGetNamespace() {
            return r('il2cpp_class_get_namespace', 'pointer', ['pointer']);
        },

        get classGetParent() {
            return r('il2cpp_class_get_parent', 'pointer', ['pointer']);
        },

        get classGetDeclaringType() {
            return r('il2cpp_class_get_declaring_type', 'pointer', ['pointer']);
        },

        get classGetInstanceSize() {
            return r('il2cpp_class_instance_size', 'int32', ['pointer']);
        },

        // TODO
        get classGetNumFields() {
            return r('il2cpp_class_num_fields', 'size_t', ['pointer']);
        },

        get classIsValueType() {
            return r('il2cpp_class_is_valuetype', 'bool', ['pointer']);
        },

        get classGetValueTypeSize() {
            return r('il2cpp_class_value_size', 'int32', ['pointer', 'pointer']);
        },

        get classIsBlittable() {
            return r('il2cpp_class_is_blittable', 'bool', ['pointer']);
        },

        get classGetFlags() {
            return r('il2cpp_class_get_flags', 'int', ['pointer']);
        },

        get classIsAbstract() {
            return r('il2cpp_class_is_abstract', 'bool', ['pointer']);
        },

        get classIsInterface() {
            return r('il2cpp_class_is_interface', 'bool', ['pointer']);
        },

        get classGetArrayElementSize() {
            return r('il2cpp_class_array_element_size', 'int', ['pointer']);
        },

        get classGetType() {
            return r('il2cpp_class_get_type', 'pointer', ['pointer']);
        },

        // TODO

        get classGetTypeToken() {
            return r('il2cpp_class_get_type_token', 'uint32', ['pointer']);
        },

        // TODO

        get classHasAttribute() {
            return r('il2cpp_class_has_attribute', 'bool', ['pointer', 'pointer']);
        },

        get classHasReferences() {
            return r('il2cpp_class_has_references', 'bool', ['pointer']);
        },

        get classIsEnum() {
            return r('il2cpp_class_is_enum', 'bool', ['pointer']);
        },

        get classGetImage() {
            return r('il2cpp_class_get_image', 'pointer', ['pointer']);
        },

        get classGetAssemblyName() {
            return r('il2cpp_class_get_assemblyname', 'pointer', ['pointer']);
        },

        // TODO

        get classGetRank() {
            return r('il2cpp_class_get_rank', 'int', ['pointer']);
        },

        // TODO

        get classGetDataSize() {
            return r('il2cpp_class_get_data_size', 'uint32', ['pointer']);
        },

        get classGetStaticFieldData() {
            return r('il2cpp_class_get_static_field_data', 'pointer', ['pointer']);
        },

        // TODO

        get classGetBitmapSize() {
            return r('il2cpp_class_get_bitmap_size', 'size_t', ['pointer']);
        },

        // TODO

        get classGetBitmap() {
            return r('il2cpp_class_get_bitmap', 'void', ['pointer', 'pointer']);
        },

        // TODO

        get classSetUserdata() {
            return r('il2cpp_class_set_userdata', 'void', ['pointer', 'pointer']);
        },

        // TODO

        get classGetUserdataOffset() {
            return r('il2cpp_class_get_userdata_offset', 'int', []);
        },

        // === STATS FUNCTIONS ===
        // TODO

        get statsDumpToFile() {
            return r('il2cpp_stats_dump_to_file', 'bool', ['pointer']);
        },

        // TODO

        get statsGetValue() {
            return r('il2cpp_stats_get_value', 'uint64', ['int']);
        },

        // === DOMAIN FUNCTIONS ===
        get domainGet() {
            return r('il2cpp_domain_get', 'pointer', []);
        },

        get domainGetAssemblyFromName() {
            return r('il2cpp_domain_assembly_open', 'pointer', ['pointer', 'pointer']);
        },

        get domainGetAssemblies() {
            return r('il2cpp_domain_get_assemblies', 'pointer', ['pointer', 'pointer']);
        },

        // === EXCEPTION FUNCTIONS ===
        // TODO

        get raiseException() {
            return r('il2cpp_raise_exception', 'void', ['pointer']);
        },

        // TODO

        get exceptionFromNameMsg() {
            return r('il2cpp_exception_from_name_msg', 'pointer', [
                'pointer',
                'pointer',
                'pointer',
                'pointer',
            ]);
        },

        // TODO

        get getExceptionArgumentNull() {
            return r('il2cpp_get_exception_argument_null', 'pointer', ['pointer']);
        },

        // TODO

        get formatException() {
            return r('il2cpp_format_exception', 'void', ['pointer', 'pointer', 'int']);
        },

        // TODO

        get formatStackTrace() {
            return r('il2cpp_format_stack_trace', 'void', ['pointer', 'pointer', 'int']);
        },

        // TODO

        get unhandledException() {
            return r('il2cpp_unhandled_exception', 'void', ['pointer']);
        },

        // TODO

        get nativeStackTrace() {
            return r('il2cpp_native_stack_trace', 'void', [
                'pointer',
                'pointer',
                'pointer',
                'pointer',
            ]);
        },

        // === FIELD FUNCTIONS ===
        get fieldGetFlags() {
            return r('il2cpp_field_get_flags', 'int', ['pointer']);
        },

        get fieldGetName() {
            return r('il2cpp_field_get_name', 'pointer', ['pointer']);
        },

        get fieldGetClass() {
            return r('il2cpp_field_get_parent', 'pointer', ['pointer']);
        },

        get fieldGetOffset() {
            return r('il2cpp_field_get_offset', 'size_t', ['pointer']);
        },

        get fieldGetType() {
            return r('il2cpp_field_get_type', 'pointer', ['pointer']);
        },

        // TODO

        get fieldGetValue() {
            return r('il2cpp_field_get_value', 'void', ['pointer', 'pointer', 'pointer']);
        },

        // TODO

        get fieldGetValueObject() {
            return r('il2cpp_field_get_value_object', 'pointer', ['pointer', 'pointer']);
        },

        // TODO

        get fieldHasAttribute() {
            return r('il2cpp_field_has_attribute', 'bool', ['pointer', 'pointer']);
        },

        // TODO

        get fieldSetValue() {
            return r('il2cpp_field_set_value', 'void', ['pointer', 'pointer', 'pointer']);
        },

        get fieldGetStaticValue() {
            return r('il2cpp_field_static_get_value', 'void', ['pointer', 'pointer']);
        },

        get fieldSetStaticValue() {
            return r('il2cpp_field_static_set_value', 'void', ['pointer', 'pointer']);
        },

        // TODO

        get fieldSetValueObject() {
            return r('il2cpp_field_set_value_object', 'void', ['pointer', 'pointer', 'pointer']);
        },

        // TODO

        get fieldIsLiteral() {
            return r('il2cpp_field_is_literal', 'bool', ['pointer']);
        },

        // === GC FUNCTIONS ===
        get gcCollect() {
            return r('il2cpp_gc_collect', 'void', ['int']);
        },

        get gcCollectALittle() {
            return r('il2cpp_gc_collect_a_little', 'int32', []);
        },

        get gcStartIncrementalCollection() {
            return r('il2cpp_gc_start_incremental_collection', 'void', []);
        },

        get gcDisable() {
            return r('il2cpp_gc_disable', 'void', []);
        },

        get gcEnable() {
            return r('il2cpp_gc_enable', 'void', []);
        },

        get gcIsDisabled() {
            return r('il2cpp_gc_is_disabled', 'bool', []);
        },

        // TODO

        get gcSetMode() {
            return r('il2cpp_gc_set_mode', 'void', ['int']);
        },

        get gcGetMaxTimeSlice() {
            return r('il2cpp_gc_get_max_time_slice_ns', 'int64', []);
        },

        get gcSetMaxTimeSlice() {
            return r('il2cpp_gc_set_max_time_slice_ns', 'void', ['int64']);
        },

        get gcIsIncremental() {
            return r('il2cpp_gc_is_incremental', 'bool', []);
        },

        get gcGetUsedSize() {
            return r('il2cpp_gc_get_used_size', 'int64', []);
        },

        get gcGetHeapSize() {
            return r('il2cpp_gc_get_heap_size', 'int64', []);
        },

        // TODO

        get gcWbarrierSetField() {
            return r('il2cpp_gc_wbarrier_set_field', 'void', ['pointer', 'pointer', 'pointer']);
        },

        // TODO

        get gcHasStrictWbarriers() {
            return r('il2cpp_gc_has_strict_wbarriers', 'bool', []);
        },

        // TODO

        get gcSetExternalAllocationTracker() {
            return r('il2cpp_gc_set_external_allocation_tracker', 'void', ['pointer']);
        },

        // TODO

        get gcSetExternalWbarrierTracker() {
            return r('il2cpp_gc_set_external_wbarrier_tracker', 'void', ['pointer']);
        },

        // TODO
        get gcForEachHeap() {
            return r('il2cpp_gc_foreach_heap', 'void', ['pointer', 'pointer']);
        },

        get gcStopWorld() {
            return r('il2cpp_stop_gc_world', 'void', []);
        },

        get gcStartWorld() {
            return r('il2cpp_start_gc_world', 'void', []);
        },

        // === GC HANDLE FUNCTIONS ===
        get gcHandleNew() {
            return r('il2cpp_gchandle_new', 'uint32', ['pointer', 'bool']);
        },

        get gcHandleNewWeakRef() {
            return r('il2cpp_gchandle_new_weakref', 'uint32', ['pointer', 'bool']);
        },

        get gcHandleGetTarget() {
            return r('il2cpp_gchandle_get_target', 'pointer', ['uint32']);
        },

        get gcHandleFree() {
            return r('il2cpp_gchandle_free', 'void', ['uint32']);
        },

        // TODO
        get gcHandleForEachGetTarget() {
            return r('il2cpp_gchandle_foreach_get_target', 'void', ['pointer', 'pointer']);
        },

        // === VM RUNTIME INFO FUNCTIONS ===
        // TODO

        get objectHeaderSize() {
            return r('il2cpp_object_header_size', 'uint32', []);
        },

        // TODO

        get arrayObjectHeaderSize() {
            return r('il2cpp_array_object_header_size', 'uint32', []);
        },

        // TODO

        get offsetOfArrayLengthInArrayObjectHeader() {
            return r('il2cpp_offset_of_array_length_in_array_object_header', 'uint32', []);
        },

        // TODO

        get offsetOfArrayBoundsInArrayObjectHeader() {
            return r('il2cpp_offset_of_array_bounds_in_array_object_header', 'uint32', []);
        },

        // TODO

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
        get methodGetReturnType() {
            return r('il2cpp_method_get_return_type', 'pointer', ['pointer']);
        },

        get methodGetDeclaringClass() {
            return r('il2cpp_method_get_declaring_type', 'pointer', ['pointer']);
        },

        get methodGetName() {
            return r('il2cpp_method_get_name', 'pointer', ['pointer']);
        },

        // TODO

        get methodGetFromReflection() {
            return r('il2cpp_method_get_from_reflection', 'pointer', ['pointer']);
        },

        get methodGetObject() {
            return r('il2cpp_method_get_object', 'pointer', ['pointer', 'pointer']);
        },

        get methodIsGeneric() {
            return r('il2cpp_method_is_generic', 'bool', ['pointer']);
        },

        get methodIsInflated() {
            return r('il2cpp_method_is_inflated', 'bool', ['pointer']);
        },

        get methodIsInstance() {
            return r('il2cpp_method_is_instance', 'bool', ['pointer']);
        },

        get methodGetParameterCount() {
            return r('il2cpp_method_get_param_count', 'uint32', ['pointer']);
        },

        get methodGetParameterType() {
            return r('il2cpp_method_get_param', 'pointer', ['pointer', 'uint32']);
        },

        get methodGetClass() {
            return r('il2cpp_method_get_class', 'pointer', ['pointer']);
        },

        // TODO

        get methodHasAttribute() {
            return r('il2cpp_method_has_attribute', 'bool', ['pointer', 'pointer']);
        },

        get methodGetFlags() {
            return r('il2cpp_method_get_flags', 'uint32', ['pointer', 'pointer']);
        },

        // TODO

        get methodGetToken() {
            return r('il2cpp_method_get_token', 'uint32', ['pointer']);
        },

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
        get objectGetClass() {
            return r('il2cpp_object_get_class', 'pointer', ['pointer']);
        },

        get objectGetSize() {
            return r('il2cpp_object_get_size', 'uint32', ['pointer']);
        },

        get objectGetVirtualMethod() {
            return r('il2cpp_object_get_virtual_method', 'pointer', ['pointer', 'pointer']);
        },

        get objectNew() {
            return r('il2cpp_object_new', 'pointer', ['pointer']);
        },

        get objectUnbox() {
            return r('il2cpp_object_unbox', 'pointer', ['pointer']);
        },

        get valueTypeBox() {
            return r('il2cpp_value_box', 'pointer', ['pointer', 'pointer']);
        },

        // === MONITOR FUNCTIONS ===
        get monitorEnter() {
            return r('il2cpp_monitor_enter', 'void', ['pointer']);
        },

        get monitorTryEnter() {
            return r('il2cpp_monitor_try_enter', 'bool', ['pointer', 'uint32']);
        },

        get monitorExit() {
            return r('il2cpp_monitor_exit', 'void', ['pointer']);
        },

        get monitorPulse() {
            return r('il2cpp_monitor_pulse', 'void', ['pointer']);
        },

        get monitorPulseAll() {
            return r('il2cpp_monitor_pulse_all', 'void', ['pointer']);
        },

        get monitorWait() {
            return r('il2cpp_monitor_wait', 'void', ['pointer']);
        },

        get monitorTryWait() {
            return r('il2cpp_monitor_try_wait', 'bool', ['pointer', 'uint32']);
        },

        // === RUNTIME FUNCTIONS ===
        // TODO

        get runtimeInvoke() {
            return r('il2cpp_runtime_invoke', 'pointer', [
                'pointer',
                'pointer',
                'pointer',
                'pointer',
            ]);
        },

        // TODO

        get runtimeInvokeConvertArgs() {
            return r('il2cpp_runtime_invoke_convert_args', 'pointer', [
                'pointer',
                'pointer',
                'pointer',
                'int',
                'pointer',
            ]);
        },

        get classInitialize() {
            return r('il2cpp_runtime_class_init', 'void', ['pointer']);
        },

        // TODO
        get objectInitialize() {
            return r('il2cpp_runtime_object_init', 'void', ['pointer']);
        },

        get objectInitializeException() {
            return r('il2cpp_runtime_object_init_exception', 'void', ['pointer', 'pointer']);
        },

        // TODO

        get runtimeUnhandledExceptionPolicySet() {
            return r('il2cpp_runtime_unhandled_exception_policy_set', 'void', ['int']);
        },

        // === STRING FUNCTIONS ===
        get stringGetLength() {
            return r('il2cpp_string_length', 'int32', ['pointer']);
        },

        get stringGetChars() {
            return r('il2cpp_string_chars', 'pointer', ['pointer']);
        },

        get stringNew() {
            return r('il2cpp_string_new', 'pointer', ['pointer']);
        },

        // TODO

        get stringNewLen() {
            return r('il2cpp_string_new_len', 'pointer', ['pointer', 'uint32']);
        },

        // TODO

        get stringNewUtf16() {
            return r('il2cpp_string_new_utf16', 'pointer', ['pointer', 'int32']);
        },

        // TODO

        get stringNewWrapper() {
            return r('il2cpp_string_new_wrapper', 'pointer', ['pointer']);
        },

        // TODO

        get stringIntern() {
            return r('il2cpp_string_intern', 'pointer', ['pointer']);
        },

        // TODO

        get stringIsInterned() {
            return r('il2cpp_string_is_interned', 'pointer', ['pointer']);
        },

        // === THREAD FUNCTIONS ===
        get threadGetCurrent() {
            return r('il2cpp_thread_current', 'pointer', []);
        },

        get threadAttach() {
            return r('il2cpp_thread_attach', 'pointer', ['pointer']);
        },

        get threadDetach() {
            return r('il2cpp_thread_detach', 'void', ['pointer']);
        },

        get threadGetAttachedThreads() {
            return r('il2cpp_thread_get_all_attached_threads', 'pointer', ['pointer']);
        },

        get threadIsVm() {
            return r('il2cpp_is_vm_thread', 'bool', ['pointer']);
        },

        // === STACK TRACE FUNCTIONS ===
        // TODO

        get currentThreadWalkFrameStack() {
            return r('il2cpp_current_thread_walk_frame_stack', 'void', ['pointer', 'pointer']);
        },

        // TODO

        get threadWalkFrameStack() {
            return r('il2cpp_thread_walk_frame_stack', 'void', ['pointer', 'pointer', 'pointer']);
        },

        // TODO

        get currentThreadGetTopFrame() {
            return r('il2cpp_current_thread_get_top_frame', 'bool', ['pointer']);
        },

        // TODO

        get threadGetTopFrame() {
            return r('il2cpp_thread_get_top_frame', 'bool', ['pointer', 'pointer']);
        },

        // TODO

        get currentThreadGetFrameAt() {
            return r('il2cpp_current_thread_get_frame_at', 'bool', ['int32', 'pointer']);
        },

        // TODO

        get threadGetFrameAt() {
            return r('il2cpp_thread_get_frame_at', 'bool', ['pointer', 'int32', 'pointer']);
        },

        // TODO

        get currentThreadGetStackDepth() {
            return r('il2cpp_current_thread_get_stack_depth', 'int32', []);
        },

        // TODO

        get threadGetStackDepth() {
            return r('il2cpp_thread_get_stack_depth', 'int32', ['pointer']);
        },

        // TODO

        get overrideStackBacktrace() {
            return r('il2cpp_override_stack_backtrace', 'void', ['pointer']);
        },

        // === TYPE FUNCTIONS ===
        get typeGetObject() {
            return r('il2cpp_type_get_object', 'pointer', ['pointer']);
        },

        get typeGetTypeEnum() {
            return r('il2cpp_type_get_type', 'int', ['pointer']);
        },

        get typeGetClass() {
            return r('il2cpp_class_from_type', 'pointer', ['pointer']);
        },

        // TODO

        get typeGetClassOrElementClass() {
            return r('il2cpp_type_get_class_or_element_class', 'pointer', ['pointer']);
        },

        get typeGetName() {
            return r('il2cpp_type_get_name', 'pointer', ['pointer']);
        },

        get typeIsByRef() {
            return r('il2cpp_type_is_byref', 'bool', ['pointer']);
        },

        // TODO

        get typeGetAttrs() {
            return r('il2cpp_type_get_attrs', 'uint32', ['pointer']);
        },

        get typeEquals() {
            return r('il2cpp_type_equals', 'bool', ['pointer', 'pointer']);
        },

        // TODO

        get typeGetAssemblyQualifiedName() {
            return r('il2cpp_type_get_assembly_qualified_name', 'pointer', ['pointer']);
        },

        // TODO

        get typeIsStatic() {
            return r('il2cpp_type_is_static', 'bool', ['pointer']);
        },

        get typeIsPointer() {
            return r('il2cpp_type_is_pointer_type', 'bool', ['pointer']);
        },

        // === IMAGE FUNCTIONS ===
        get imageGetAssembly() {
            return r('il2cpp_image_get_assembly', 'pointer', ['pointer']);
        },

        get imageGetName() {
            return r('il2cpp_image_get_name', 'pointer', ['pointer']);
        },

        // TODO

        get imageGetFilename() {
            return r('il2cpp_image_get_filename', 'pointer', ['pointer']);
        },

        // TODO

        get imageGetEntryPoint() {
            return r('il2cpp_image_get_entry_point', 'pointer', ['pointer']);
        },

        get imageGetClassCount() {
            return r('il2cpp_image_get_class_count', 'size_t', ['pointer']);
        },

        get imageGetClass() {
            return r('il2cpp_image_get_class', 'pointer', ['pointer', 'size_t']);
        },

        // === MEMORY SNAPSHOT FUNCTIONS ===
        get memorySnapshotCapture() {
            return r('il2cpp_capture_memory_snapshot', 'pointer', []);
        },

        get memorySnapshotFree() {
            return r('il2cpp_free_captured_memory_snapshot', 'void', ['pointer']);
        },

        // === PLUGIN CALLBACKS ===
        // TODO

        get setFindPluginCallback() {
            return r('il2cpp_set_find_plugin_callback', 'void', ['pointer']);
        },

        // === LOGGING FUNCTIONS ===
        // TODO

        get registerLogCallback() {
            return r('il2cpp_register_log_callback', 'void', ['pointer']);
        },

        // === DEBUGGER FUNCTIONS ===
        // TODO

        get debuggerSetAgentOptions() {
            return r('il2cpp_debugger_set_agent_options', 'void', ['pointer']);
        },

        // TODO

        get isDebuggerAttached() {
            return r('il2cpp_is_debugger_attached', 'bool', []);
        },

        // TODO

        get registerDebuggerAgentTransport() {
            return r('il2cpp_register_debugger_agent_transport', 'void', ['pointer']);
        },

        // === DEBUG METADATA FUNCTIONS ===
        // TODO

        get debugGetMethodInfo() {
            return r('il2cpp_debug_get_method_info', 'bool', ['pointer', 'pointer']);
        },

        // === TLS MODULE FUNCTIONS ===
        // TODO

        get unityInstallUnitytlsInterface() {
            return r('il2cpp_unity_install_unitytls_interface', 'void', ['pointer']);
        },

        // === CUSTOM ATTRIBUTES FUNCTIONS ===
        // TODO

        get customAttrsFromClass() {
            return r('il2cpp_custom_attrs_from_class', 'pointer', ['pointer']);
        },

        // TODO

        get customAttrsFromMethod() {
            return r('il2cpp_custom_attrs_from_method', 'pointer', ['pointer']);
        },

        // TODO

        get customAttrsGetAttr() {
            return r('il2cpp_custom_attrs_get_attr', 'pointer', ['pointer', 'pointer']);
        },

        // TODO

        get customAttrsHasAttr() {
            return r('il2cpp_custom_attrs_has_attr', 'bool', ['pointer', 'pointer']);
        },

        // TODO

        get customAttrsConstruct() {
            return r('il2cpp_custom_attrs_construct', 'pointer', ['pointer']);
        },

        // TODO

        get customAttrsFree() {
            return r('il2cpp_custom_attrs_free', 'void', ['pointer']);
        },

        // === THREAD AFFINITY FUNCTIONS ===
        // TODO

        get setDefaultThreadAffinity() {
            return r('il2cpp_set_default_thread_affinity', 'void', ['int64']);
        },

        // === LEGACY ALIASES (for backward compatibility) ===
        get classGetArrayClass() {
            return r('il2cpp_array_class_get', 'pointer', ['pointer', 'uint32']);
        },

        get classGetImplementationFlags() {
            return r('il2cpp_class_get_flags', 'int', ['pointer']);
        },

        get classGetNestedClasses() {
            return r('il2cpp_class_get_nested_types', 'pointer', ['pointer', 'pointer']);
        },

        get methodGetParameters() {
            return r('il2cpp_method_get_parameters', 'pointer', ['pointer', 'pointer']);
        },

        // === DEPRECATED/REMOVED FUNCTIONS ===
        get livenessAllocateStruct() {
            return r('il2cpp_unity_liveness_allocate_struct', 'pointer', [
                'pointer',
                'int',
                'pointer',
                'pointer',
                'pointer',
            ]);
        },

        get livenessFinalize() {
            return r('il2cpp_unity_liveness_finalize', 'void', ['pointer']);
        },

        get livenessFreeStruct() {
            return r('il2cpp_unity_liveness_free_struct', 'void', ['pointer']);
        },

        get memorySnapshotGetClasses() {
            return r('il2cpp_memory_snapshot_get_classes', 'pointer', ['pointer', 'pointer']);
        },

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
