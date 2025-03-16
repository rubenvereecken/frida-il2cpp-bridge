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
                // We used to have Frida parse primitives, but now they're wrapped in an Il2Cpp.Primitive
                // So just pass a pointer and don't read it until required
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
                    return 'pointer';
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
        @lazy
        get isByReference(): boolean {
            return this.name.endsWith('&');
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
        get object(): Il2Cpp.Object {
            return new Il2Cpp.Object(Il2Cpp.exports.typeGetObject(this));
        }

        /** Gets the type enum of the current type. */
        @lazy
        get typeEnum(): number {
            return Il2Cpp.exports.typeGetTypeEnum(this);
        }

        isSame(other: Il2Cpp.Type): boolean {
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
        isAssignableFromValue(other: Il2Cpp.Parameter.Value) {
            // Alright, we already know its type because it's got a wrapper
            if (Il2Cpp.isWrappedType(other)) {
                return this.isAssignableFromType(other.type);
            }

            // typeof other === Il2Cpp.Primitive.JSType || typeof other === string

            // If it's a string, easy to wrap
            if (typeof other === 'string') {
                return this.isAssignableFromType(Il2Cpp.System.String.type);
            }

            // If the required parameter is a primitive and the provided value is a JSType, it can be cast to a number (even if lossy),
            // so as long as it's a primitive on both sides for now, all good
            if (Il2Cpp.isPrimitiveJSType(other) && this.isPrimitive()) {
                return true;
            }

            if (other instanceof Il2Cpp.Reference) {
                raise(
                    `might not have support for reference types yet: ${other.type.name} -> ${this.name}`
                );
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
    }

    // export type TypeOfPrimitive = {
    //     [K in Il2Cpp.PrimitiveClassName]: Type<K>;
    // }[Il2Cpp.PrimitiveClassName];

    export type WrappedPrimitiveCSType = WrappedPrimitive['type'];
}
