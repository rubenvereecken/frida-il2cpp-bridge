namespace Il2Cpp {
    export class Reference<T extends Il2Cpp.Wrapped = Il2Cpp.Wrapped> extends NativeStruct {
        constructor(
            handle: NativePointerValue,
            readonly type: Il2Cpp.Type
        ) {
            super(handle);

            // Shows up on Frida REPL. Useful for debugging and reverse engineering
            globalThis.Object.defineProperty(this, '__toString', {
                get: () => this.toString(),
                enumerable: true,
            });
            globalThis.Object.defineProperty(this, '_il2cpp', {
                get: () => `Il2Cpp.Reference<${this.type.name}>`,
                enumerable: true,
            });
        }

        /** Gets the element referenced by the current reference. */
        get value(): T {
            return readWrapped(this.handle, this.type) as T;
        }

        /** Sets the element referenced by the current reference. */
        set value(value: T) {
            write(this.handle, value, this.type);
        }

        /** */
        valueToString(): string {
            return this.isNull() ? 'null' : `${this.value}`;
        }

        toString(): string {
            return `->${this.valueToString()} (&${this.type.name})`;
        }
    }

    // TODO reintroduce
    // export function reference<T extends number | NativePointer>(
    //     value: T,
    //     type: Il2Cpp.Type
    // ): Il2Cpp.Reference<T>;

    export function reference<T extends Exclude<Il2Cpp.Wrapped, number | NativePointer>>(
        value: T
    ): Il2Cpp.Reference<T>;

    /** Creates a reference to the specified value. */
    export function reference<T extends Il2Cpp.Wrapped>(
        value: T,
        type?: Il2Cpp.Type
    ): Il2Cpp.Reference<T> {
        const handle = Memory.alloc(Process.pointerSize);

        switch (typeof value) {
            case 'boolean':
                return new Il2Cpp.Reference(
                    handle.writeS8(+value),
                    Il2Cpp.corlib.class('System.Boolean').type
                );
            case 'number':
                switch (type?.typeEnum) {
                    case Il2Cpp.Type.enum.unsignedByte:
                        return new Il2Cpp.Reference<T>(handle.writeU8(value), type);
                    case Il2Cpp.Type.enum.byte:
                        return new Il2Cpp.Reference<T>(handle.writeS8(value), type);
                    case Il2Cpp.Type.enum.char:
                    case Il2Cpp.Type.enum.unsignedShort:
                        return new Il2Cpp.Reference<T>(handle.writeU16(value), type);
                    case Il2Cpp.Type.enum.short:
                        return new Il2Cpp.Reference<T>(handle.writeS16(value), type);
                    case Il2Cpp.Type.enum.unsignedInt:
                        return new Il2Cpp.Reference<T>(handle.writeU32(value), type);
                    case Il2Cpp.Type.enum.int:
                        return new Il2Cpp.Reference<T>(handle.writeS32(value), type);
                    case Il2Cpp.Type.enum.unsignedLong:
                        return new Il2Cpp.Reference<T>(handle.writeU64(value), type);
                    case Il2Cpp.Type.enum.long:
                        return new Il2Cpp.Reference<T>(handle.writeS64(value), type);
                    case Il2Cpp.Type.enum.float:
                        return new Il2Cpp.Reference<T>(handle.writeFloat(value), type);
                    case Il2Cpp.Type.enum.double:
                        return new Il2Cpp.Reference<T>(handle.writeDouble(value), type);
                }
            case 'object':
                if (value instanceof Il2Cpp.ValueType || value instanceof Il2Cpp.Pointer) {
                    return new Il2Cpp.Reference<T>(value.handle, value.type);
                } else if (value instanceof Il2Cpp.String || value instanceof Il2Cpp.Array) {
                    return new Il2Cpp.Reference<T>(handle.writePointer(value), value.class.type);
                } else if (value instanceof Il2Cpp.Object) {
                    return new Il2Cpp.Reference<T>(handle.writePointer(value), value.class.type);
                } else if (value instanceof NativePointer) {
                    switch (type?.typeEnum) {
                        case Il2Cpp.Type.enum.unsignedNativePointer:
                        case Il2Cpp.Type.enum.nativePointer:
                            return new Il2Cpp.Reference<T>(handle.writePointer(value), type);
                    }
                } else if (value instanceof Int64) {
                    return new Il2Cpp.Reference<T>(
                        handle.writeS64(value),
                        Il2Cpp.corlib.class('System.Int64').type
                    );
                } else if (value instanceof UInt64) {
                    return new Il2Cpp.Reference<T>(
                        handle.writeU64(value),
                        Il2Cpp.corlib.class('System.UInt64').type
                    );
                }
            default:
                raise(
                    `couldn't create a reference to ${value} using an unhandled type ${type?.name}`
                );
        }
    }
}
