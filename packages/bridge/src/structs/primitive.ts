import { TypeEnum } from '../enums/type.js';
import type { ParameterLike} from '../memory.js';
import { isIl2Cpp, write } from '../memory.js';
import { raise } from '../utils/error.js';
import { Type } from './type.js';
import { ValueType } from './value-type.js';

// TODO combine in some way with the new corlib.ts -> System.Void etc?
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

export class Primitive<T extends PrimitiveClassName = PrimitiveClassName> extends ValueType<T> {
    get constructorName() {
        return 'Il2Cpp.Primitive';
    }

    valueToString(this: WrappedPrimitive): string {
        const value = this.read();
        return '' + value;
    }

    // TODO any combining with memory.ts ?
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
    read(this: WrappedPrimitive): PrimitiveJSType;
    read(this: WrappedPrimitive): PrimitiveJSType {
        const pointer = this.handle;
        switch (this.type.typeEnum) {
            case 0:
                raise(
                    `Failed to read type enum from ${this.type.name} (except if you really wanted 0, ie "IL2CPP_TYPE_END")`
                );
            case TypeEnum.VOID:
                return undefined;
            case TypeEnum.BOOLEAN:
                return !!pointer.readS8();
            case TypeEnum.BYTE:
                return pointer.readS8();
            case TypeEnum.UNSIGNED_BYTE:
                return pointer.readU8();
            case TypeEnum.SHORT:
                return pointer.readS16();
            case TypeEnum.UNSIGNED_SHORT:
                return pointer.readU16();
            case TypeEnum.INT:
                return pointer.readS32();
            case TypeEnum.UNSIGNED_INT:
                return pointer.readU32();
            case TypeEnum.CHAR:
                return pointer.readU16();
            case TypeEnum.LONG:
                return pointer.readS64();
            case TypeEnum.UNSIGNED_LONG:
                return pointer.readU64();
            case TypeEnum.FLOAT:
                return pointer.readFloat();
            case TypeEnum.DOUBLE:
                return pointer.readDouble();
            case TypeEnum.NATIVE_POINTER:
            case TypeEnum.UNSIGNED_NATIVE_POINTER:
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
    write(this: Primitive<PrimitiveClassName>, value: PrimitiveJSType): void {
        write(this.handle, value, this.type);
    }

    isAssignableFromValue(value: ParameterLike): value is PrimitiveJSType {
        return isPrimitiveJSType(value) && this.type.isPrimitive();
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

export type PrimitiveJSType =
    | undefined
    | boolean
    | number
    | globalThis.Int64
    | globalThis.UInt64
    | NativePointer;

export type WrappedPrimitive =
    | Void
    | Boolean
    | SByte
    | Byte
    | Char
    | Int16
    | UInt16
    | Int32
    | UInt32
    | Int64
    | UInt64
    | Single
    | Double
    | IntPtr
    | UIntPtr;

export type PrimitiveLike = WrappedPrimitive | PrimitiveJSType;

// TODO find a better home for all these foundational type checker methods – perhaps memory.ts?
export function isPrimitiveJSType(value: unknown): value is PrimitiveJSType {
    return (
        typeof value === 'boolean' ||
        typeof value === 'number' ||
        value instanceof Int64 ||
        value instanceof UInt64 ||
        value instanceof NativePointer
    );
}

export function isPrimitiveLike(type: ParameterLike): type is PrimitiveLike {
    return isWrappedPrimitive(type) || isPrimitiveJSType(type);
}

export function isWrappedPrimitive(value: ParameterLike): value is WrappedPrimitive {
    if (!isIl2Cpp(value)) {
        return false;
    }

    return value.type.isPrimitive();
}
