namespace Il2Cpp {
    /**
     * As in, "pass parameter by reference". Not to be confused with C#'s `ReferenceType`
     *
     * Practical use:
     * - Prevents copies of value types.
     */
    export class ByRef<
        U extends Il2Cpp.Il2CppValue = Il2Cpp.Il2CppValue,
        T extends `${string}&` = `${string}&`,
    > extends Il2Cpp.ObjectLike<T> {
        get constructorName(): string {
            return 'Il2Cpp.ByRef';
        }

        constructor(handle: NativePointerValue, type: Il2Cpp.Type<T>) {
            super(handle, type);
        }

        /** Gets the element referenced by the current reference. */
        get value(): U {
            return readIl2Cpp(this.handle, this.type) as U;
        }

        /** Sets the element referenced by the current reference. */
        set value(value: U) {
            write(this.handle, value, this.type);
        }

        /** */
        valueToString(): string {
            return this.isNull() ? 'null' : `${this.value}`;
        }

        toString(): string {
            return `->${this.valueToString()} (&${this.type.name})`;
        }

        get type(): Il2Cpp.ByRefType<T> {
            if (!this._type || !this._type.isByRef())
                raise(`${this._type?.name} is not a by-ref type`);
            return this._type;
        }

        get class() {
            // TODO: confirm – because sometimes classes don't have the same modifiers?
            return this.type.class;
        }

        get elementType() {
            return this.type.getElementType();
        }
    }

    // TODO reintroduce
    // export function reference<T extends number | NativePointer>(
    //     value: T,
    //     type: Il2Cpp.Type
    // ): Il2Cpp.ByRef<T>;

    export function reference<T extends Exclude<Il2Cpp.Il2CppValue, number | NativePointer>>(
        value: T
    ): Il2Cpp.ByRef<T>;

    // TODO unify with other memory writing functions
    /** Creates a reference to the specified value. */
    export function reference(value: Il2Cpp.Parameter.Value, type?: Il2Cpp.Type): Il2Cpp.ByRef {
        const handle = Memory.alloc(Process.pointerSize);

        switch (typeof value) {
            case 'boolean':
                return new Il2Cpp.ByRef(
                    handle.writeS8(+value),
                    Il2Cpp.System.Boolean.type.makeByRefType()
                );
            case 'number':
                switch (type?.typeEnum) {
                    case Il2Cpp.Type.enum.unsignedByte:
                        return new Il2Cpp.ByRef(handle.writeU8(value), type.makeByRefType());
                    case Il2Cpp.Type.enum.byte:
                        return new Il2Cpp.ByRef(handle.writeS8(value), type.makeByRefType());
                    case Il2Cpp.Type.enum.char:
                    case Il2Cpp.Type.enum.unsignedShort:
                        return new Il2Cpp.ByRef(handle.writeU16(value), type.makeByRefType());
                    case Il2Cpp.Type.enum.short:
                        return new Il2Cpp.ByRef(handle.writeS16(value), type.makeByRefType());
                    case Il2Cpp.Type.enum.unsignedInt:
                        return new Il2Cpp.ByRef(handle.writeU32(value), type.makeByRefType());
                    case Il2Cpp.Type.enum.int:
                        return new Il2Cpp.ByRef(handle.writeS32(value), type.makeByRefType());
                    case Il2Cpp.Type.enum.unsignedLong:
                        return new Il2Cpp.ByRef(handle.writeU64(value), type.makeByRefType());
                    case Il2Cpp.Type.enum.long:
                        return new Il2Cpp.ByRef(handle.writeS64(value), type.makeByRefType());
                    case Il2Cpp.Type.enum.float:
                        return new Il2Cpp.ByRef(handle.writeFloat(value), type.makeByRefType());
                    case Il2Cpp.Type.enum.double:
                        return new Il2Cpp.ByRef(handle.writeDouble(value), type.makeByRefType());
                }
            case 'object':
                if (value instanceof Il2Cpp.ValueType || value instanceof Il2Cpp.Pointer) {
                    return new Il2Cpp.ByRef(value.handle, value.type.makeByRefType());
                } else if (value instanceof Il2Cpp.String || value instanceof Il2Cpp.Array) {
                    return new Il2Cpp.ByRef(
                        handle.writePointer(value),
                        value.class.type.makeByRefType()
                    );
                } else if (value instanceof Il2Cpp.ReferenceType) {
                    return new Il2Cpp.ByRef(
                        handle.writePointer(value),
                        value.class.type.makeByRefType()
                    );
                } else if (value instanceof NativePointer) {
                    switch (type?.typeEnum) {
                        case Il2Cpp.Type.enum.unsignedNativePointer:
                        case Il2Cpp.Type.enum.nativePointer:
                            return new Il2Cpp.ByRef(
                                handle.writePointer(value),
                                type.makeByRefType()
                            );
                    }
                } else if (value instanceof Int64) {
                    return new Il2Cpp.ByRef(
                        handle.writeS64(value),
                        Il2Cpp.System.Int64.type.makeByRefType()
                    );
                } else if (value instanceof UInt64) {
                    return new Il2Cpp.ByRef(
                        handle.writeU64(value),
                        Il2Cpp.System.UInt64.type.makeByRefType()
                    );
                }
            default:
                raise(
                    `couldn't create a reference to ${value} using an unhandled type ${type?.name}`
                );
        }
    }
}
