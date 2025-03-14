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
    > extends Il2Cpp.ValueType {
        protected constructorName = 'Il2Cpp.Primitive';
        declare readonly type: Il2Cpp.Type<T>;

        read(this: Primitive<'System.Void'>): void;
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
        read(this: Primitive<PrimitiveClassName>): Il2Cpp.Primitive.JSType {
            return Il2Cpp.readJs(this.handle, this.type as any as Il2Cpp.TypeOfPrimitive);
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
        export type JSType = boolean | number | Int64 | UInt64 | NativePointer;
    }

    export type PrimitiveLike = Primitive | Primitive.JSType;

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
