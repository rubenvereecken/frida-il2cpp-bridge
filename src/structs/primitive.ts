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
        declare readonly type: Il2Cpp.Type<T>;

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
        read(this: Primitive<'System.Int64'>): Int64;
        read(this: Primitive<'System.UInt64'>): UInt64;
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
                    // Theory: `IntPtr` value is defined as `System.Void*`, so il2cpp incorrectly
                    // added the extra step of storing the actual value referenced by an unnecessary pointer
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
        write(this: Primitive<'System.Int64'>, value: Int64): void;
        write(this: Primitive<'System.UInt64'>, value: UInt64): void;
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

    export type VoidT = Primitive<'System.Void'>;
    export type BooleanT = Primitive<'System.Boolean'>;
    export type SByteT = Primitive<'System.SByte'>;
    export type ByteT = Primitive<'System.Byte'>;
    export type CharT = Primitive<'System.Char'>;
    export type Int16T = Primitive<'System.Int16'>;
    export type UInt16T = Primitive<'System.UInt16'>;
    export type Int32T = Primitive<'System.Int32'>;
    export type UInt32T = Primitive<'System.UInt32'>;
    export type Int64T = Primitive<'System.Int64'>;
    export type UInt64T = Primitive<'System.UInt64'>;
    export type SingleT = Primitive<'System.Single'>;
    export type DoubleT = Primitive<'System.Double'>;
    export type IntPtrT = Primitive<'System.IntPtr'>;
    export type UIntPtrT = Primitive<'System.UIntPtr'>;

    export namespace Primitive {
        export type JSType = undefined | boolean | number | Int64 | UInt64 | NativePointer;
    }

    export type WrappedPrimitive =
        | VoidT
        | BooleanT
        | SByteT
        | ByteT
        | CharT
        | Int16T
        | UInt16T
        | Int32T
        | UInt32T
        | Int64T
        | UInt64T
        | SingleT
        | DoubleT
        | IntPtrT
        | UIntPtrT;

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
        if (Il2Cpp.isPrimitiveJSType(value) || Il2Cpp.isStringJsType(value)) {
            return false;
        }

        return value.type.isPrimitive();
    }
}
