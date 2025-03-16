namespace Il2Cpp {
    type ImplementationCallback<T extends Il2Cpp.Method.ReturnType> = (
        this: Il2Cpp.Class | Il2Cpp.Object | Il2Cpp.ValueType,
        ...parameters: Il2Cpp.Parameter.Value[]
    ) => T;
    type OnEnterCallback = (
        this: Il2Cpp.Class | Il2Cpp.Object | Il2Cpp.ValueType,
        ...parameters: Il2Cpp.Parameter.Value[]
    ) => void;
    type OnLeaveCallback<T extends Il2Cpp.Method.ReturnType> = (
        this: Il2Cpp.Class | Il2Cpp.Object | Il2Cpp.ValueType,
        retval: T
    ) => T | void;

    export class Method<T extends Il2Cpp.Wrapped = Il2Cpp.Wrapped> extends NativeStruct {
        constructor(native: NativePointerValue) {
            super(native);

            // Shows up on Frida REPL. Useful for debugging and reverse engineering
            globalThis.Object.defineProperty(this, '__toString', {
                get: () => this.toString(),
                enumerable: true,
            });
            globalThis.Object.defineProperty(this, '_il2cpp', {
                get: () =>
                    this instanceof Il2Cpp.BoundMethod
                        ? `Il2Cpp.BoundMethod<${this.returnType.name}>`
                        : `Il2Cpp.Method<${this.returnType.name}>`,
                enumerable: true,
            });
        }

        toString(): string {
            return `${this.returnType.name} ${this.class.type.name}::${this.name}(${this.parameters.map(p => p.type.name).join(', ')})`;
        }

        /** Gets the class in which this method is defined. */
        @lazy
        get class(): Il2Cpp.Class {
            return new Il2Cpp.Class(Il2Cpp.exports.methodGetClass(this));
        }

        @lazy
        get declaringClass(): Il2Cpp.Class {
            return new Il2Cpp.Class(Il2Cpp.exports.methodGetDeclaringClass(this));
        }

        @lazy
        get flags() {
            return {
                isStatic: !!(this.flagsRaw & Method.Attributes.Static),
                isFinal: !!(this.flagsRaw & Method.Attributes.Final),
                isVirtual: !!(this.flagsRaw & Method.Attributes.Virtual),
                isAbstract: !!(this.flagsRaw & Method.Attributes.Abstract),
            };
        }

        /** Gets the flags of the current method. */
        @lazy
        get flagsRaw(): number {
            return Il2Cpp.exports.methodGetFlags(this, NULL);
        }

        /** Gets the implementation flags of the current method. */
        @lazy
        get implementationFlags(): number {
            const implementationFlagsPointer = Memory.alloc(Process.pointerSize);
            Il2Cpp.exports.methodGetFlags(this, implementationFlagsPointer);

            return implementationFlagsPointer.readU32();
        }

        /** */
        @lazy
        get fridaSignature(): NativeCallbackArgumentType[] {
            const types: NativeCallbackArgumentType[] = [];

            for (const parameter of this.parameters) {
                types.push(parameter.type.fridaAlias);
            }

            if (!this.isStatic || Il2Cpp.unityVersionIsBelow201830) {
                types.unshift('pointer');
            }

            if (this.isInflated) {
                types.push('pointer');
            }

            return types;
        }

        /** Gets the generic parameters of this generic method. */
        @lazy
        get generics(): Il2Cpp.Class[] {
            if (!this.isGeneric && !this.isInflated) {
                return [];
            }

            const types = this.object
                .method<Il2Cpp.Array<Il2Cpp.Object>>('GetGenericArguments')
                .invoke();
            return globalThis.Array.from(types).map(
                _ => new Il2Cpp.Class(Il2Cpp.exports.classFromObject(_))
            );
        }

        /** Determines whether this method is external. */
        @lazy
        get isExternal(): boolean {
            return (
                (this.implementationFlags & Il2Cpp.Method.ImplementationAttribute.InternalCall) != 0
            );
        }

        /** Determines whether this method is generic. */
        @lazy
        get isGeneric(): boolean {
            return !!Il2Cpp.exports.methodIsGeneric(this);
        }

        /** Determines whether this method is inflated (generic with a concrete type parameter). */
        @lazy
        get isInflated(): boolean {
            return !!Il2Cpp.exports.methodIsInflated(this);
        }

        /** Determines whether this method is static. */
        @lazy
        get isStatic(): boolean {
            // Note: can also check using Static flag
            return !Il2Cpp.exports.methodIsInstance(this);
        }

        /** Determines whether this method is synchronized. */
        @lazy
        get isSynchronized(): boolean {
            return (
                (this.implementationFlags & Il2Cpp.Method.ImplementationAttribute.Synchronized) != 0
            );
        }

        // TODO move this to Writer classes
        /** Gets the access modifier of this method. */
        @lazy
        get accessModifierStr(): string | undefined {
            switch (this.flagsRaw & Il2Cpp.Method.Attributes.MemberAccessMask) {
                case Il2Cpp.Method.Attributes.Private:
                    return 'private';
                case Il2Cpp.Method.Attributes.FamilyAndAssembly:
                    return 'private protected';
                case Il2Cpp.Method.Attributes.Assembly:
                    return 'internal';
                case Il2Cpp.Method.Attributes.Family:
                    return 'protected';
                case Il2Cpp.Method.Attributes.FamilyOrAssembly:
                    return 'protected internal';
                case Il2Cpp.Method.Attributes.Public:
                    return 'public';
            }
        }

        /** Gets the name of this method. */
        @lazy
        get name(): string {
            return Il2Cpp.exports.methodGetName(this).readUtf8String()!;
        }

        /** @internal */
        @lazy
        get nativeFunction(): NativeFunction<any, any> {
            return new NativeFunction(
                this.virtualAddress,
                this.returnType.fridaAlias,
                this.fridaSignature as NativeFunctionArgumentType[]
            );
        }

        /** Gets the encompassing object of the current method. */
        @lazy
        get object(): Il2Cpp.Object {
            return new Il2Cpp.Object(Il2Cpp.exports.methodGetObject(this, NULL));
        }

        /** Gets the amount of parameters of this method. */
        @lazy
        get parameterCount(): number {
            return Il2Cpp.exports.methodGetParameterCount(this);
        }

        /** Gets the parameters of this method. */
        @lazy
        get parameters(): Il2Cpp.Parameter[] {
            return globalThis.Array.from(globalThis.Array(this.parameterCount), (_, i) => {
                const parameterName = Il2Cpp.exports
                    .methodGetParameterName(this, i)
                    .readUtf8String()!;
                const parameterType = Il2Cpp.exports.methodGetParameterType(this, i);
                return new Il2Cpp.Parameter(parameterName, i, new Il2Cpp.Type(parameterType));
            });
        }

        /** Gets the relative virtual address (RVA) of this method. */
        @lazy
        get relativeVirtualAddress(): NativePointer {
            return this.virtualAddress.sub(Il2Cpp.module.base);
        }

        /** Gets the return type of this method. */
        @lazy
        get returnType(): Il2Cpp.Type {
            return new Il2Cpp.Type(Il2Cpp.exports.methodGetReturnType(this));
        }

        @lazy
        static get virtualAddressOffset(): number {
            const FilterTypeName = Il2Cpp.corlib
                .class('System.Reflection.Module')
                .initialize()
                .field<Il2Cpp.Object>('FilterTypeName').value;
            const FilterTypeNameMethodPointer =
                FilterTypeName.field<Il2Cpp.IntPtrT>('method_ptr').value.read();
            const FilterTypeNameMethod =
                FilterTypeName.field<Il2Cpp.IntPtrT>('method').value.read();

            // prettier-ignore
            const offset = FilterTypeNameMethod.offsetOf(_ => _.readPointer().equals(FilterTypeNameMethodPointer))
                ?? raise("couldn't find the virtual address offset in the native method struct");

            return offset;
        }

        /** Gets the virtual address (VA) of this method. */
        get virtualAddress(): NativePointer {
            // In Unity 2017.4.40f1 (don't know about others),
            // `Il2Cpp.Class::initialize` somehow triggers a nasty bug during
            // early instrumentation, so that we aren't able to obtain the
            // offset to get the virtual address of a method when the script
            // is reloaded. A workaround consists in manually re-invoking the
            // static constructor.
            // TODO necessary still? Note: shouldn't run it here – that's an infinite loop
            // Il2Cpp.corlib.class('System.Reflection.Module').method('.cctor').invoke();
            return this.handle.add(Il2Cpp.Method.virtualAddressOffset).readPointer();
        }

        // /** Replaces the body of this method. */
        // set implementation(block: ImplementationCallback<T>) {
        //     try {
        //         Interceptor.replace(this.virtualAddress, this.wrap(block));
        //     } catch (e: any) {
        //         switch (e.message) {
        //             case 'access violation accessing 0x0':
        //                 raise(
        //                     `couldn't set implementation for method ${this.name} as it has a NULL virtual address`
        //                 );
        //             case /unable to intercept function at \w+; please file a bug/.exec(e.message)
        //                 ?.input:
        //                 warn(
        //                     `couldn't set implementation for method ${this.name} as it may be a thunk`
        //                 );
        //                 break;
        //             case 'already replaced this function':
        //                 warn(
        //                     `couldn't set implementation for method ${this.name} as it has already been replaced by a thunk`
        //                 );
        //                 break;
        //             default:
        //                 throw e;
        //         }
        //     }
        // }

        // set onEnter(block: OnEnterCallback) {
        //     Interceptor.attach(this.virtualAddress, {
        //         onEnter: this.wrapOnEnter(block),
        //     });
        // }

        // set onLeave(block: OnLeaveCallback<T>) {
        //     Interceptor.attach(this.virtualAddress, {
        //         onLeave: this.wrapOnLeave(block),
        //     });
        // }

        /** Creates a generic instance of the current generic method. */
        inflate<R extends Il2Cpp.Method.ReturnType = T>(
            ...classes: Il2Cpp.Class[]
        ): Il2Cpp.Method<R> {
            if (!this.isGeneric) {
                raise(`cannot inflate method ${this.name} as it has no generic parameters`);
            }

            if (this.generics.length != classes.length) {
                raise(
                    `cannot inflate method ${this.name} as it needs ${this.generics.length} generic parameter(s), not ${classes.length}`
                );
            }

            const types = classes.map(_ => _.type.object);
            const typeArray = Il2Cpp.array(Il2Cpp.corlib.class('System.Type'), types);

            const inflatedMethodObject = this.object
                .method<Il2Cpp.Object>('MakeGenericMethod', 1)
                .invoke(typeArray);
            return new Il2Cpp.Method(
                inflatedMethodObject.field<Il2Cpp.IntPtrT>('mhandle').value.read()
            );
        }

        /** Invokes this method. */
        invoke(...parameters: Il2Cpp.Parameter.Value[]): T {
            if (!this.isStatic) {
                raise(
                    `cannot invoke non-static method ${this.name} as it must be invoked throught a Il2Cpp.Object, not a Il2Cpp.Class`
                );
            }
            return this.invokeRaw(NULL, ...parameters);
        }

        invokeRaw(instance: NativePointerValue, ...parameters: Il2Cpp.Parameter.Value[]): T {
            const allocatedParameters = parameters.map((p, i) =>
                toFridaValue(p, this.parameters[i].type)
            );

            if (!this.isStatic || Il2Cpp.unityVersionIsBelow201830) {
                allocatedParameters.unshift(instance);
            }

            if (this.isInflated) {
                allocatedParameters.push(this.handle);
            }

            try {
                const returnValue = this.nativeFunction(...allocatedParameters);
                return fromFridaValue(returnValue, this.returnType) as T;
            } catch (e: any) {
                if (e == null) {
                    raise(
                        'an unexpected native invocation exception occurred, this is due to parameter types mismatch'
                    );
                }

                (globalThis as any).console.log(e);

                switch (e.message) {
                    case 'bad argument count':
                        raise(
                            `couldn't invoke method ${this.name} as it needs ${this.parameterCount} parameter(s), not ${parameters.length}`
                        );
                    case 'expected a pointer':
                    case 'expected number':
                    case 'expected array with fields':
                        raise(
                            `couldn't invoke method ${this.name} using incorrect parameter types`
                        );
                }

                throw e;
            }
        }

        /** Gets the overloaded method with the given parameter types. */
        overload(...parameterTypes: string[]): Il2Cpp.Method<T> {
            const result = this.tryOverload<T>(...parameterTypes);

            if (result != undefined) return result;

            raise(`couldn't find overloaded method ${this.name}(${parameterTypes})`);
        }

        /** Gets the parameter with the given name. */
        parameter(name: string): Il2Cpp.Parameter {
            return (
                this.tryParameter(name) ??
                raise(`couldn't find parameter ${name} in method ${this.name}`)
            );
        }

        /** Restore the original method implementation. */
        revert(): void {
            Interceptor.revert(this.virtualAddress);
            Interceptor.flush();
        }

        /** Gets the overloaded method with the given parameter types. */
        tryOverload<U extends Il2Cpp.Method.ReturnType = T>(
            ...parameterTypes: string[]
        ): Il2Cpp.Method<U> | undefined {
            let klass: Il2Cpp.Class | null = this.class;
            while (klass) {
                const method = klass.methods.find(method => {
                    return (
                        method.name == this.name &&
                        method.parameterCount == parameterTypes.length &&
                        method.parameters.every((e, i) => e.type.name == parameterTypes[i])
                    );
                }) as Il2Cpp.Method<U> | undefined;
                if (method) {
                    return method;
                }
                klass = klass.parent;
            }
            return undefined;
        }

        /** Gets the parameter with the given name. */
        tryParameter(name: string): Il2Cpp.Parameter | undefined {
            return this.parameters.find(_ => _.name == name);
        }

        /** Derive a BoundMethod so this method can be invoked for `instance`. */
        bind(instance: Il2Cpp.ObjectLike): Il2Cpp.BoundMethod<T> {
            if (this.isStatic) {
                raise(
                    `cannot bind static method ${this.class.type.name}::${this.name} to an object`
                );
            }

            const bound = new Il2Cpp.BoundMethod<T>(this.handle, instance);

            // Ensure this method and its bound version have a shared @lazy cache
            if (!(this as unknown & { _propertyCache?: Record<PropertyKey, any> })._propertyCache) {
                globalThis.Object.defineProperty(this, '_propertyCache', {
                    value: {},
                    configurable: false,
                    enumerable: false,
                    writable: true,
                });
            }

            globalThis.Object.defineProperty(bound, '_propertyCache', {
                value: (this as unknown & { _propertyCache?: Record<PropertyKey, any> })
                    ._propertyCache,
                configurable: false,
                enumerable: false,
                writable: true,
            });

            return bound;
        }

        // /** @internal */
        wrap(block: ImplementationCallback<T>): NativeCallback<any, any> {
            const startIndex = +!this.isStatic | +Il2Cpp.unityVersionIsBelow201830;
            return new NativeCallback(
                (...args: NativeCallbackArgumentValue[]): NativeCallbackReturnValue => {
                    const thisObject = this.isStatic
                        ? this.class
                        : this.class.isValueType
                          ? new Il2Cpp.ValueType(
                                (args[0] as NativePointer).add(
                                    Il2Cpp.Object.headerSize - maybeObjectHeaderSize()
                                ),
                                this.class.type
                            )
                          : new Il2Cpp.Object(args[0] as NativePointer);

                    const parameters = this.parameters.map((_, i) =>
                        fromFridaValue(args[i + startIndex], _.type)
                    );
                    const result = block.call(thisObject, ...parameters);
                    // TODO sort typing here
                    return toFridaValue(result) as any;
                },
                this.returnType.fridaAlias,
                this.fridaSignature
            );
        }

        // /** @internal */
        // wrapOnEnter(
        //     block: OnEnterCallback
        // ): (this: InvocationContext, args: InvocationArguments) => void {
        //     const startIndex = +!this.isStatic | +Il2Cpp.unityVersionIsBelow201830;
        //     return (args: InvocationArguments) => {
        //         const thisObject = this.isStatic
        //             ? this.class
        //             : this.class.isValueType
        //               ? new Il2Cpp.ValueType(
        //                     (args[0] as NativePointer).add(
        //                         Il2Cpp.Object.headerSize - maybeObjectHeaderSize()
        //                     ),
        //                     this.class.type
        //                 )
        //               : new Il2Cpp.Object(args[0] as NativePointer);
        //         // As opposed to `Interceptor.replace`, `Interceptor.attach` doesn't
        //         // interpret pointers, so use `read` instead of `fromFridaValue`
        //         const parameters = this.parameters.map((_, i) =>
        //             readWrapped(args[i + startIndex], _.type, { derefPointer: false })
        //         );
        //         block.call(thisObject, ...parameters);
        //     };
        // }

        // /** @internal */
        // wrapOnLeave(
        //     block: OnLeaveCallback<T>
        // ): (this: InvocationContext, retval: InvocationReturnValue) => void {
        //     return (retval: InvocationReturnValue) => {
        //         // TODO grab `this` pointer during `onEnter`
        //         const thisObject = this.class;

        //         // `retval` is always a pointer, even if a primitive type
        //         const returnValue =
        //             this.returnType.typeEnum != Il2Cpp.Type.enum.void
        //                 ? (readWrapped(retval, this.returnType) as T)
        //                 : (undefined as T);
        //         const newReturnValue = block.call(thisObject, returnValue);

        //         // If callback returned nothing, don't replace, leave the old return value
        //         if (newReturnValue === undefined) return;

        //         const handle = Memory.alloc(this.returnType.class.valueTypeSize);
        //         write(handle, newReturnValue, this.returnType);
        //         retval.replace(handle);
        //     };
        // }
    }

    export class BoundMethod<
        T extends Il2Cpp.Method.ReturnType = Il2Cpp.Method.ReturnType,
    > extends Il2Cpp.Method<T> {
        /** @internal */
        constructor(
            handle: NativePointerValue,
            public instance: Il2Cpp.ObjectLike
        ) {
            super(handle);
        }

        toString(): string {
            return `${super.toString()} (bound @ ${this.instance.handle})`;
        }

        get instanceHandle() {
            // In Unity 5.3.5f1 and >= 2021.2.0f1, value types
            // methods may assume their `this` parameter is a
            // pointer to raw data (that is how value types are
            // layed out in memory) instead of a pointer to an
            // object (that is object header + raw data).
            // In any case, they also don't use whatever there
            // is in the object header, so we can safely "skip"
            // the object header by adding the object header
            // size to the object (a boxed value type) handle.
            if (this.instance instanceof Il2Cpp.ValueType && this.class.isValueType) {
                return this.instance.handle.add(maybeObjectHeaderSize() - Il2Cpp.Object.headerSize);
            } else if (this.instance instanceof Il2Cpp.ValueType && !this.class.isValueType) {
                // TODO look into this – pretty sure unboxed methods are a thing
                raise(
                    `cannot invoke method ${this.class.type.name}::${this.name} against a value type, you must box it first`
                );
            } else if (this.class.isValueType) {
                return this.instance.handle.add(maybeObjectHeaderSize());
            } else {
                return this.instance.handle;
            }
        }

        /** Invokes this method. */
        invoke(...parameters: Il2Cpp.Parameter.Value[]): T {
            return this.invokeRaw(this.instanceHandle, ...parameters);
        }

        /** Creates a generic instance of the current generic method. */
        inflate<R extends Il2Cpp.Method.ReturnType = T>(
            ...classes: Il2Cpp.Class[]
        ): Il2Cpp.BoundMethod<R> {
            return super.inflate<R>(...classes).bind(this.instance);
        }

        /** Gets the overloaded method with the given parameter types. */
        overload(...parameterTypes: string[]): Il2Cpp.BoundMethod<T> {
            return super.overload(...parameterTypes).bind(this.instance);
        }

        /** Gets the overloaded method with the given parameter types. */
        tryOverload<U extends Il2Cpp.Method.ReturnType = T>(
            ...parameterTypes: string[]
        ): Il2Cpp.BoundMethod<U> | undefined {
            return super.tryOverload<U>(...parameterTypes)?.bind(this.instance);
        }
    }

    let maybeObjectHeaderSize = (): number => {
        const struct = Il2Cpp.corlib.class('System.RuntimeTypeHandle').initialize().alloc();
        struct.method('.ctor').invokeRaw(struct, ptr(0xdeadbeef));

        // Here we check where the sentinel value is
        // if it's not where it is supposed to be, it means struct methods
        // assume they are receiving value types (that is a pointer to raw data)
        // hence, we must "skip" the object header when invoking such methods.
        const offset = struct.field<Il2Cpp.IntPtrT>('value').value.read().equals(ptr(0xdeadbeef))
            ? 0
            : Il2Cpp.Object.headerSize;
        return (maybeObjectHeaderSize = () => offset)();
    };

    export namespace Method {
        // For backward and future compatibility
        // Different from Il2Cpp.Parameter.Value: excludes JS primitives, strings, and Il2Cpp.Rereference
        export type ReturnType = Il2Cpp.Wrapped;

        /*
         * Method Attributes (22.1.9)
         */
        // #define METHOD_IMPL_ATTRIBUTE_CODE_TYPE_MASK       0x0003
        // #define METHOD_IMPL_ATTRIBUTE_IL                   0x0000
        // #define METHOD_IMPL_ATTRIBUTE_NATIVE               0x0001
        // #define METHOD_IMPL_ATTRIBUTE_OPTIL                0x0002
        // #define METHOD_IMPL_ATTRIBUTE_RUNTIME              0x0003

        // #define METHOD_IMPL_ATTRIBUTE_MANAGED_MASK         0x0004
        // #define METHOD_IMPL_ATTRIBUTE_UNMANAGED            0x0004
        // #define METHOD_IMPL_ATTRIBUTE_MANAGED              0x0000

        // #define METHOD_IMPL_ATTRIBUTE_FORWARD_REF          0x0010
        // #define METHOD_IMPL_ATTRIBUTE_PRESERVE_SIG         0x0080
        // #define METHOD_IMPL_ATTRIBUTE_INTERNAL_CALL        0x1000
        // #define METHOD_IMPL_ATTRIBUTE_SYNCHRONIZED         0x0020
        // #define METHOD_IMPL_ATTRIBUTE_NOINLINING           0x0008
        // #define METHOD_IMPL_ATTRIBUTE_MAX_METHOD_IMPL_VAL  0xffff

        // #define METHOD_ATTRIBUTE_MEMBER_ACCESS_MASK        0x0007
        // #define METHOD_ATTRIBUTE_COMPILER_CONTROLLED       0x0000
        // #define METHOD_ATTRIBUTE_PRIVATE                   0x0001
        // #define METHOD_ATTRIBUTE_FAM_AND_ASSEM             0x0002
        // #define METHOD_ATTRIBUTE_ASSEM                     0x0003
        // #define METHOD_ATTRIBUTE_FAMILY                    0x0004
        // #define METHOD_ATTRIBUTE_FAM_OR_ASSEM              0x0005
        // #define METHOD_ATTRIBUTE_PUBLIC                    0x0006

        // #define METHOD_ATTRIBUTE_STATIC                    0x0010
        // #define METHOD_ATTRIBUTE_FINAL                     0x0020
        // #define METHOD_ATTRIBUTE_VIRTUAL                   0x0040
        // #define METHOD_ATTRIBUTE_HIDE_BY_SIG               0x0080

        // #define METHOD_ATTRIBUTE_VTABLE_LAYOUT_MASK        0x0100
        // #define METHOD_ATTRIBUTE_REUSE_SLOT                0x0000
        // #define METHOD_ATTRIBUTE_NEW_SLOT                  0x0100

        // #define METHOD_ATTRIBUTE_STRICT                    0x0200
        // #define METHOD_ATTRIBUTE_ABSTRACT                  0x0400
        // #define METHOD_ATTRIBUTE_SPECIAL_NAME              0x0800

        // #define METHOD_ATTRIBUTE_PINVOKE_IMPL              0x2000
        // #define METHOD_ATTRIBUTE_UNMANAGED_EXPORT          0x0008
        export const enum Attributes {
            MemberAccessMask = 0x0007,
            PrivateScope = 0x0000,
            Private = 0x0001,
            FamilyAndAssembly = 0x0002,
            Assembly = 0x0003,
            Family = 0x0004,
            FamilyOrAssembly = 0x0005,
            Public = 0x0006,
            Static = 0x0010,
            Final = 0x0020,
            Virtual = 0x0040,
            HideBySig = 0x0080,
            CheckAccessOnOverride = 0x0200,
            VtableLayoutMask = 0x0100,
            ReuseSlot = 0x0000,
            NewSlot = 0x0100,
            Abstract = 0x0400,
            SpecialName = 0x0800,
            PinvokeImpl = 0x2000,
            UnmanagedExport = 0x0008,
            RTSpecialName = 0x1000,
            ReservedMask = 0xd000,
            HasSecurity = 0x4000,
            RequireSecObject = 0x8000,
        }

        export const enum ImplementationAttribute {
            CodeTypeMask = 0x0003,
            IntermediateLanguage = 0x0000,
            Native = 0x0001,
            OptimizedIntermediateLanguage = 0x0002,
            Runtime = 0x0003,
            ManagedMask = 0x0004,
            Unmanaged = 0x0004,
            Managed = 0x0000,
            ForwardRef = 0x0010,
            PreserveSig = 0x0080,
            InternalCall = 0x1000,
            Synchronized = 0x0020,
            NoInlining = 0x0008,
            AggressiveInlining = 0x0100,
            NoOptimization = 0x0040,
            SecurityMitigations = 0x0400,
            MaxMethodImplVal = 0xffff,
        }
    }
}
