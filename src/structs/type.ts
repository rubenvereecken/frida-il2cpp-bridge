namespace Il2Cpp {
    @recycle
    export class Type<T extends string = string> extends NativeStruct {
        constructor(handle: NativePointerValue) {
            super(handle);

            // Shows up on Frida REPL. Useful for debugging and reverse engineering
            globalThis.Object.defineProperty(this, '__toString', {
                get: () => this.toString(),
                enumerable: true,
            });
            globalThis.Object.defineProperty(this, '_il2cpp', {
                get: () => 'Il2Cpp.Type',
                enumerable: true,
            });
        }

        toString(): string {
            return this.name;
        }

        /** */
        @lazy
        static get enum() {
            const lookupTypeEnum = (
                name: string,
                block = (kls: Il2Cpp.Class): { type: Il2Cpp.Type } => kls
            ) => block(Il2Cpp.corlib.class(name)).type.typeEnum;

            return {
                void: lookupTypeEnum('System.Void'),
                boolean: Il2Cpp.System.Boolean.type.typeEnum,
                char: lookupTypeEnum('System.Char'),
                byte: lookupTypeEnum('System.SByte'),
                unsignedByte: lookupTypeEnum('System.Byte'),
                short: lookupTypeEnum('System.Int16'),
                unsignedShort: lookupTypeEnum('System.UInt16'),
                int: lookupTypeEnum('System.Int32'),
                unsignedInt: lookupTypeEnum('System.UInt32'),
                long: lookupTypeEnum('System.Int64'),
                unsignedLong: lookupTypeEnum('System.UInt64'),

                nativePointer: lookupTypeEnum('System.IntPtr'),
                unsignedNativePointer: lookupTypeEnum('System.UIntPtr'),
                float: lookupTypeEnum('System.Single'),
                double: lookupTypeEnum('System.Double'),
                pointer: lookupTypeEnum('System.IntPtr', _ => _.field('m_value')),
                valueType: lookupTypeEnum('System.Decimal'),
                object: lookupTypeEnum('System.Object'),
                string: lookupTypeEnum('System.String'),
                class: lookupTypeEnum('System.Array'),
                array: lookupTypeEnum('System.Void', _ => _.arrayClass),
                multidimensionalArray: lookupTypeEnum(
                    'System.Void',
                    kls => new Il2Cpp.Class(Il2Cpp.exports.classGetArrayClass(kls, 2))
                ),
                genericInstance: lookupTypeEnum(
                    'System.Int32',
                    kls => kls.interfaces.find(iface => iface.name.endsWith('`1'))!
                ),
            };
        }

        /** Gets the class of this type. */
        @lazy
        get class(): Il2Cpp.Class<T> {
            return new Il2Cpp.Class<T>(Il2Cpp.exports.typeGetClass(this));
        }

        /** */
        @lazy
        get fridaAlias(): NativeCallbackArgumentType {
            function getValueTypeFields(type: Il2Cpp.Type): NativeCallbackArgumentType {
                const instanceFields = type.class.fields.filter(_ => !_.isStatic);
                return instanceFields.length == 0
                    ? ['char']
                    : instanceFields.map(_ => _.type.fridaAlias);
            }

            if (this.isByReference) {
                return 'pointer';
            }

            switch (this.typeEnum) {
                // Note: Since Frida 17, primitives can no longer be passed as pointers
                case Il2Cpp.Type.enum.void:
                    return 'void';
                case Il2Cpp.Type.enum.boolean:
                    return 'int32';
                // TODO is this 1 or 2 bytes??
                case Il2Cpp.Type.enum.char:
                    return 'char';
                case Il2Cpp.Type.enum.byte:
                    return 'int8';
                case Il2Cpp.Type.enum.unsignedByte:
                    return 'uint8';
                case Il2Cpp.Type.enum.short:
                    return 'int16';
                case Il2Cpp.Type.enum.unsignedShort:
                    return 'uint16';
                case Il2Cpp.Type.enum.int:
                    return 'int32';
                case Il2Cpp.Type.enum.unsignedInt:
                    return 'uint32';
                case Il2Cpp.Type.enum.long:
                    return 'int64';
                case Il2Cpp.Type.enum.unsignedLong:
                    return 'uint64';
                case Il2Cpp.Type.enum.float:
                    return 'float';
                case Il2Cpp.Type.enum.double:
                    return 'double';
                // --
                // We used to have Frida parse primitives, but now they're wrapped in an Il2Cpp.Primitive
                // So just pass a pointer and don't read it until required
                // case Il2Cpp.Type.enum.void:
                // case Il2Cpp.Type.enum.boolean:
                // case Il2Cpp.Type.enum.char:
                // case Il2Cpp.Type.enum.byte:
                // case Il2Cpp.Type.enum.unsignedByte:
                // case Il2Cpp.Type.enum.short:
                // case Il2Cpp.Type.enum.unsignedShort:
                // case Il2Cpp.Type.enum.int:
                // case Il2Cpp.Type.enum.unsignedInt:
                // case Il2Cpp.Type.enum.long:
                // case Il2Cpp.Type.enum.unsignedLong:
                // case Il2Cpp.Type.enum.float:
                // case Il2Cpp.Type.enum.double:
                // return 'pointer';
                case Il2Cpp.Type.enum.nativePointer:
                case Il2Cpp.Type.enum.unsignedNativePointer:
                case Il2Cpp.Type.enum.pointer:
                case Il2Cpp.Type.enum.string:
                case Il2Cpp.Type.enum.array:
                case Il2Cpp.Type.enum.multidimensionalArray:
                    return 'pointer';
                // TODO come back for these
                case Il2Cpp.Type.enum.valueType:
                    return this.class.isEnum
                        ? this.class.baseType!.fridaAlias
                        : getValueTypeFields(this);
                case Il2Cpp.Type.enum.class:
                case Il2Cpp.Type.enum.object:
                case Il2Cpp.Type.enum.genericInstance:
                    return this.class.isStruct
                        ? getValueTypeFields(this)
                        : this.class.isEnum
                          ? this.class.baseType!.fridaAlias
                          : 'pointer';
                default:
                    return 'pointer';
            }
        }

        /** Determines whether this type is passed by reference. */
        get isByReference(): boolean {
            return !!Il2Cpp.exports.typeIsByRef(this);
        }

        getIsByReference(): this is Il2Cpp.Type & { isByReference: true } {
            return this.isByReference;
        }

        getReferredType(this: Il2Cpp.Type & { isByReference: true }): Il2Cpp.Type {
            return this.class.type;
        }

        /** Determines whether this type is primitive. */
        // TODO add @lazy for methods
        isPrimitive(): this is Il2Cpp.WrappedPrimitiveCSType {
            switch (this.typeEnum) {
                case Il2Cpp.Type.enum.void:
                case Il2Cpp.Type.enum.boolean:
                case Il2Cpp.Type.enum.char:
                case Il2Cpp.Type.enum.byte:
                case Il2Cpp.Type.enum.unsignedByte:
                case Il2Cpp.Type.enum.short:
                case Il2Cpp.Type.enum.unsignedShort:
                case Il2Cpp.Type.enum.int:
                case Il2Cpp.Type.enum.unsignedInt:
                case Il2Cpp.Type.enum.long:
                case Il2Cpp.Type.enum.unsignedLong:
                case Il2Cpp.Type.enum.float:
                case Il2Cpp.Type.enum.double:
                case Il2Cpp.Type.enum.nativePointer:
                case Il2Cpp.Type.enum.unsignedNativePointer:
                    return true;
                default:
                    return false;
            }
        }

        /** Gets the name of this type. */
        @lazy
        get name(): T {
            const handle = Il2Cpp.exports.typeGetName(this);

            try {
                return handle.readUtf8String()! as T;
            } finally {
                Il2Cpp.free(handle);
            }
        }

        /** Gets the encompassing object of the current type. */
        @lazy
        get object(): Il2Cpp.ReferenceType {
            return new Il2Cpp.ReferenceType(Il2Cpp.exports.typeGetObject(this));
        }

        /** Gets the type enum of the current type. */
        @lazy
        get typeEnum(): number {
            return Il2Cpp.exports.typeGetTypeEnum(this);
        }

        isSame(other: Il2Cpp.Type): boolean {
            if (Il2Cpp.exports.typeEquals.isNull()) {
                return !!this.object.method<Il2Cpp.Boolean>('Equals').invoke(other.object).read();
            }

            return !!Il2Cpp.exports.typeEquals(this.handle, other.handle);
        }

        isAssignableFromType(other: Il2Cpp.Type): boolean {
            // TODO does it make a difference whether I go type -> class or should I go straight to class
            // -> do we lose anything along the way?
            return this.class.isAssignableFrom(other.class);
        }

        /**
         *
         * Note: reason I do this in two steps and don't just wrap first, is because I don't allow
         * upcasting/type coercion between wrapped types right now.
         * So looking at the raw types gives a bit more leeway for scenarios like:
         * - pass number to System.Int16 (64 -> 16)
         * - pass Int64 to System.Int32 (64 -> 32)
         * - pass 1 to System.Boolean (64 -> 1)
         */
        isAssignableFromValue(other: Il2Cpp.Parameter.Value): boolean {
            // Alright, we already know its type because it's got a wrapper
            if (Il2Cpp.isWrappedType(other)) {
                return this.isAssignableFromType(other.type);
            }

            // StringLike: If it's a string, easy to wrap (we already know it's not wrapped)
            if (Il2Cpp.isStringLike(other)) {
                return this.isAssignableFromType(Il2Cpp.System.String.type);
            }

            // If the required parameter is a primitive and the provided value is a JSType, it can be cast to a number (even if lossy),
            // so as long as it's a primitive on both sides for now, all good
            if (Il2Cpp.isPrimitiveLike(other) && this.isPrimitive()) {
                return true;
            }

            // ArrayLike: Assume homogeneous arrays
            if (this.isArray() && Il2Cpp.isArrayLike(other)) {
                // Empty JS array is always assignable
                if (other.length == 0) return true;

                const firstElement = other[0];

                return this.class.elementClass.type.isAssignableFromValue(firstElement);
            }

            if (other instanceof Il2Cpp.ByReference) {
                // ✔️ Assign T& to T&
                // ✔️ Assign T to T&
                if (
                    this.getIsByReference() &&
                    this.getReferredType().isAssignableFromType(other.referredType)
                ) {
                    return true;
                }

                // raise(
                //     `might not have support for reference types yet: ${other.referredType.name} -> ${this.name}`
                // );
            }

            return false;
        }

        isLongLike(
            this: Il2Cpp.Type
        ): this is Il2Cpp.Type<'System.Int64'> | Il2Cpp.Type<'System.UInt64'> {
            return (
                this.typeEnum === Il2Cpp.Type.enum.long ||
                this.typeEnum === Il2Cpp.Type.enum.unsignedLong
            );
        }

        isBoolean(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.Boolean'> {
            return this.typeEnum === Il2Cpp.Type.enum.boolean;
        }

        isSByte(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.SByte'> {
            return this.typeEnum === Il2Cpp.Type.enum.byte;
        }

        isByte(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.Byte'> {
            return this.typeEnum === Il2Cpp.Type.enum.unsignedByte;
        }

        isChar(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.Char'> {
            return this.typeEnum === Il2Cpp.Type.enum.char;
        }

        isInt16(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.Int16'> {
            return this.typeEnum === Il2Cpp.Type.enum.short;
        }

        isUInt16(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.UInt16'> {
            return this.typeEnum === Il2Cpp.Type.enum.unsignedShort;
        }

        isInt32(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.Int32'> {
            return this.typeEnum === Il2Cpp.Type.enum.int;
        }

        isUInt32(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.UInt32'> {
            return this.typeEnum === Il2Cpp.Type.enum.unsignedInt;
        }

        isInt64(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.Int64'> {
            return this.typeEnum === Il2Cpp.Type.enum.long;
        }

        isUInt64(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.UInt64'> {
            return this.typeEnum === Il2Cpp.Type.enum.unsignedLong;
        }

        isSingle(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.Single'> {
            return this.typeEnum === Il2Cpp.Type.enum.float;
        }

        isDouble(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.Double'> {
            return this.typeEnum === Il2Cpp.Type.enum.double;
        }

        isIntPtr(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.IntPtr'> {
            return this.typeEnum === Il2Cpp.Type.enum.nativePointer;
        }

        isUIntPtr(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.UIntPtr'> {
            return this.typeEnum === Il2Cpp.Type.enum.unsignedNativePointer;
        }

        isString(this: Il2Cpp.Type): this is Il2Cpp.Type<'System.String'> {
            return this.typeEnum === Il2Cpp.Type.enum.string;
        }

        isArray(this: Il2Cpp.Type): this is Il2Cpp.WrappedArrayCSType {
            return (
                this.typeEnum === Il2Cpp.Type.enum.array ||
                this.typeEnum == Il2Cpp.Type.enum.multidimensionalArray
            );
        }
    }

    export type WrappedArrayCSType = Il2Cpp.Type & {
        class: Il2Cpp.WrappedArrayCSClass;
    };

    export type WrappedPrimitiveCSType = WrappedPrimitive['type'];

    // IL2CPP_TYPE_END        = 0x00,       /* End of List */
    // IL2CPP_TYPE_VOID       = 0x01,
    // IL2CPP_TYPE_BOOLEAN    = 0x02,
    // IL2CPP_TYPE_CHAR       = 0x03,
    // IL2CPP_TYPE_I1         = 0x04,
    // IL2CPP_TYPE_U1         = 0x05,
    // IL2CPP_TYPE_I2         = 0x06,
    // IL2CPP_TYPE_U2         = 0x07,
    // IL2CPP_TYPE_I4         = 0x08,
    // IL2CPP_TYPE_U4         = 0x09,
    // IL2CPP_TYPE_I8         = 0x0a,
    // IL2CPP_TYPE_U8         = 0x0b,
    // IL2CPP_TYPE_R4         = 0x0c,
    // IL2CPP_TYPE_R8         = 0x0d,
    // IL2CPP_TYPE_STRING     = 0x0e,
    // IL2CPP_TYPE_PTR        = 0x0f,       /* arg: <type> token */
    // IL2CPP_TYPE_BYREF      = 0x10,       /* arg: <type> token */
    // IL2CPP_TYPE_VALUETYPE  = 0x11,       /* arg: <type> token */
    // IL2CPP_TYPE_CLASS      = 0x12,       /* arg: <type> token */
    // IL2CPP_TYPE_VAR        = 0x13,       /* Generic parameter in a generic type definition, represented as number (compressed unsigned integer) number */
    // IL2CPP_TYPE_ARRAY      = 0x14,       /* type, rank, boundsCount, bound1, loCount, lo1 */
    // IL2CPP_TYPE_GENERICINST = 0x15,     /* <type> <type-arg-count> <type-1> \x{2026} <type-n> */
    // IL2CPP_TYPE_TYPEDBYREF = 0x16,
    // IL2CPP_TYPE_I          = 0x18,
    // IL2CPP_TYPE_U          = 0x19,
    // IL2CPP_TYPE_FNPTR      = 0x1b,        /* arg: full method signature */
    // IL2CPP_TYPE_OBJECT     = 0x1c,
    // IL2CPP_TYPE_SZARRAY    = 0x1d,       /* 0-based one-dim-array */
    // IL2CPP_TYPE_MVAR       = 0x1e,       /* Generic parameter in a generic method definition, represented as number (compressed unsigned integer)  */
    // IL2CPP_TYPE_CMOD_REQD  = 0x1f,       /* arg: typedef or typeref token */
    // IL2CPP_TYPE_CMOD_OPT   = 0x20,       /* optional arg: typedef or typref token */
    // IL2CPP_TYPE_INTERNAL   = 0x21,       /* CLR internal type */

    // IL2CPP_TYPE_MODIFIER   = 0x40,       /* Or with the following types */
    // IL2CPP_TYPE_SENTINEL   = 0x41,       /* Sentinel for varargs method signature */
    // IL2CPP_TYPE_PINNED     = 0x45,       /* Local var that points to pinned object */

    // IL2CPP_TYPE_ENUM       = 0x55,        /* an enumeration */
    // IL2CPP_TYPE_IL2CPP_TYPE_INDEX       = 0xff        /* an index into IL2CPP type metadata table */
}
