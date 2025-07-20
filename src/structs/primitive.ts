namespace Il2Cpp {
    export type PrimitiveClassName =
        | 'System.Void'
        | 'System.Boolean'
        | 'System.SByte'
        | 'System.Byte'
        | 'System.Char'
        | 'System.Int16'
        | 'System.UInt16'
        | 'System.Int32'
        | 'System.UInt32'
        | 'System.Int64'
        | 'System.UInt64'
        | 'System.Single'
        | 'System.Double'
        | 'System.IntPtr'
        | 'System.UIntPtr';

    export class Primitive<
        T extends PrimitiveClassName = PrimitiveClassName,
    > extends Il2Cpp.ValueType<T> {
        get constructorName() {
            return 'Il2Cpp.Primitive';
        }

        valueToString(this: WrappedPrimitive): string {
            const value = this.read();
            return '' + value;
        }

        read(this: Primitive<'System.Void'>): undefined;
        read(this: Primitive<'System.Boolean'>): boolean;
        read(this: Primitive<'System.Byte'>): number;
        read(this: Primitive<'System.SByte'>): number;
        read(this: Primitive<'System.Char'>): number;
        read(this: Primitive<'System.Int16'>): number;
        read(this: Primitive<'System.UInt16'>): number;
        read(this: Primitive<'System.Int32'>): number;
        read(this: Primitive<'System.UInt32'>): number;
        read(this: Primitive<'System.Int64'>): globalThis.Int64;
        read(this: Primitive<'System.UInt64'>): globalThis.UInt64;
        read(this: Primitive<'System.Single'>): number;
        read(this: Primitive<'System.Double'>): number;
        read(this: Primitive<'System.IntPtr'>): NativePointer;
        read(this: Primitive<'System.UIntPtr'>): NativePointer;
        read(this: WrappedPrimitive): Il2Cpp.Primitive.JSType;
        read(this: WrappedPrimitive): Il2Cpp.Primitive.JSType {
            const pointer = this.handle;
            switch (this.type.typeEnum) {
                case 0:
                    raise(
                        `Failed to read type enum from ${this.type.name} (except if you really wanted 0, ie "IL2CPP_TYPE_END")`
                    );
                case Il2Cpp.Type.enum.void:
                    return undefined;
                case Il2Cpp.Type.enum.boolean:
                    return !!pointer.readS8();
                case Il2Cpp.Type.enum.byte:
                    return pointer.readS8();
                case Il2Cpp.Type.enum.unsignedByte:
                    return pointer.readU8();
                case Il2Cpp.Type.enum.short:
                    return pointer.readS16();
                case Il2Cpp.Type.enum.unsignedShort:
                    return pointer.readU16();
                case Il2Cpp.Type.enum.int:
                    return pointer.readS32();
                case Il2Cpp.Type.enum.unsignedInt:
                    return pointer.readU32();
                case Il2Cpp.Type.enum.char:
                    return pointer.readU16();
                case Il2Cpp.Type.enum.long:
                    return pointer.readS64();
                case Il2Cpp.Type.enum.unsignedLong:
                    return pointer.readU64();
                case Il2Cpp.Type.enum.float:
                    return pointer.readFloat();
                case Il2Cpp.Type.enum.double:
                    return pointer.readDouble();
                case Il2Cpp.Type.enum.nativePointer:
                case Il2Cpp.Type.enum.unsignedNativePointer:
                    // TODO do we ever not need to do this?
                    // Note: pointers need to be dereferenced for
                    // - Fields
                    // In that sense, they're just like objects. Weird, because they should be primitives
                    // just like longs. Looks like a 'bug' or inconsistent design decision in il2cpp.
                    return pointer.readPointer();
            }
        }

        write(this: Primitive<'System.Boolean'>, value: boolean): void;
        write(this: Primitive<'System.SByte'>, value: number): void;
        write(this: Primitive<'System.Byte'>, value: number): void;
        write(this: Primitive<'System.Char'>, value: number): void;
        write(this: Primitive<'System.UInt16'>, value: number): void;
        write(this: Primitive<'System.Int16'>, value: number): void;
        write(this: Primitive<'System.Int32'>, value: number): void;
        write(this: Primitive<'System.UInt32'>, value: number): void;
        write(this: Primitive<'System.Int64'>, value: globalThis.Int64): void;
        write(this: Primitive<'System.UInt64'>, value: globalThis.UInt64): void;
        write(this: Primitive<'System.Single'>, value: number): void;
        write(this: Primitive<'System.Double'>, value: number): void;
        write(this: Primitive<'System.IntPtr'>, value: NativePointer): void;
        write(this: Primitive<'System.UIntPtr'>, value: NativePointer): void;
        write(this: Primitive<PrimitiveClassName>, value: Primitive.JSType): void {
            Il2Cpp.write(this.handle, value, this.type);
        }

        isAssignableFromValue(value: Il2Cpp.Parameter.Value): value is Primitive.JSType {
            return Il2Cpp.isPrimitiveJSType(value) && this.type.isPrimitive();
        }
    }

    export type Void = Primitive<'System.Void'>;
    export type Boolean = Primitive<'System.Boolean'>;
    export type SByte = Primitive<'System.SByte'>;
    export type Byte = Primitive<'System.Byte'>;
    export type Char = Primitive<'System.Char'>;
    export type Int16 = Primitive<'System.Int16'>;
    export type UInt16 = Primitive<'System.UInt16'>;
    export type Int32 = Primitive<'System.Int32'>;
    export type UInt32 = Primitive<'System.UInt32'>;
    export type Int64 = Primitive<'System.Int64'>;
    export type UInt64 = Primitive<'System.UInt64'>;
    export type Single = Primitive<'System.Single'>;
    export type Double = Primitive<'System.Double'>;
    export type IntPtr = Primitive<'System.IntPtr'>;
    export type UIntPtr = Primitive<'System.UIntPtr'>;

    export namespace Primitive {
        export type JSType =
            | undefined
            | boolean
            | number
            | globalThis.Int64
            | globalThis.UInt64
            | NativePointer;
    }

    export type WrappedPrimitive =
        | Il2Cpp.Void
        | Il2Cpp.Boolean
        | Il2Cpp.SByte
        | Il2Cpp.Byte
        | Il2Cpp.Char
        | Il2Cpp.Int16
        | Il2Cpp.UInt16
        | Il2Cpp.Int32
        | Il2Cpp.UInt32
        | Il2Cpp.Int64
        | Il2Cpp.UInt64
        | Il2Cpp.Single
        | Il2Cpp.Double
        | Il2Cpp.IntPtr
        | Il2Cpp.UIntPtr;

    export type PrimitiveLike = WrappedPrimitive | Primitive.JSType;

    // TODO find a better home for all these foundational type checker methods – perhaps memory.ts?
    export function isPrimitiveJSType(
        type: Il2Cpp.Parameter.Value
    ): type is Il2Cpp.Primitive.JSType {
        return (
            typeof type === 'boolean' ||
            typeof type === 'number' ||
            type instanceof Int64 ||
            type instanceof UInt64 ||
            type instanceof NativePointer
        );
    }

    export function isPrimitiveLike(type: Il2Cpp.Parameter.Value): type is Il2Cpp.PrimitiveLike {
        return type instanceof Il2Cpp.Primitive || Il2Cpp.isPrimitiveJSType(type);
    }

    export function isWrappedPrimitive(value: Il2Cpp.Parameter.Value): value is Il2Cpp.Primitive {
        if (!Il2Cpp.isWrappedType(value)) {
            return false;
        }

        return value.type.isPrimitive();
    }
}
