import { System } from '../corlib.js';
import { TypeEnum } from '../enums/type.js';
import { Il2CppValue, ParameterLike, readIl2Cpp, write } from '../memory.js';
import { raise } from '../utils/error.js';
import { Array } from './array.js';
import { BaseObject } from './common/base-object.js';
import { Object_ } from './object.js';
import { Pointer } from './pointer.js';
import { String } from './string.js';
import { ByRefType, Type } from './type.js';
import { ValueType } from './value-type.js';

/**
 * As in, "pass parameter by reference". Not to be confused with C#'s `ReferenceType`
 *
 * Practical use:
 * - Prevents copies of value types.
 */
export class ByRef<
    U extends Il2CppValue = Il2CppValue,
    T extends `${string}&` = `${string}&`,
> extends BaseObject<T> {
    get constructorName(): string {
        return 'Il2Cpp.ByRef';
    }

    constructor(handle: NativePointerValue, type: Type<T>) {
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

    get type(): ByRefType<T> {
        if (!this._type || !this._type.isByRef()) raise(`${this._type?.name} is not a by-ref type`);
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

export function reference<T extends Exclude<Il2CppValue, number | NativePointer>>(
    value: T
): ByRef<T>;

// TODO unify with other memory writing functions
/** Creates a reference to the specified value. */
export function reference(value: ParameterLike, type?: Type): ByRef {
    const handle = Memory.alloc(Process.pointerSize);

    switch (typeof value) {
        case 'boolean':
            return new ByRef(handle.writeS8(+value), System.Boolean.type.makeByRefType());
        case 'number':
            switch (type?.typeEnum) {
                case TypeEnum.UNSIGNED_BYTE:
                    return new ByRef(handle.writeU8(value), type.makeByRefType());
                case TypeEnum.BYTE:
                    return new ByRef(handle.writeS8(value), type.makeByRefType());
                case TypeEnum.CHAR:
                case TypeEnum.UNSIGNED_SHORT:
                    return new ByRef(handle.writeU16(value), type.makeByRefType());
                case TypeEnum.SHORT:
                    return new ByRef(handle.writeS16(value), type.makeByRefType());
                case TypeEnum.UNSIGNED_INT:
                    return new ByRef(handle.writeU32(value), type.makeByRefType());
                case TypeEnum.INT:
                    return new ByRef(handle.writeS32(value), type.makeByRefType());
                case TypeEnum.UNSIGNED_LONG:
                    return new ByRef(handle.writeU64(value), type.makeByRefType());
                case TypeEnum.LONG:
                    return new ByRef(handle.writeS64(value), type.makeByRefType());
                case TypeEnum.FLOAT:
                    return new ByRef(handle.writeFloat(value), type.makeByRefType());
                case TypeEnum.DOUBLE:
                    return new ByRef(handle.writeDouble(value), type.makeByRefType());
            }
        case 'object':
            if (value instanceof ValueType || value instanceof Pointer) {
                return new ByRef(value.handle, value.type.makeByRefType());
            } else if (value instanceof String || value instanceof Array) {
                return new ByRef(handle.writePointer(value), value.class.type.makeByRefType());
            } else if (value instanceof Object_) {
                return new ByRef(handle.writePointer(value), value.class.type.makeByRefType());
            } else if (value instanceof NativePointer) {
                switch (type?.typeEnum) {
                    case TypeEnum.UNSIGNED_NATIVE_POINTER:
                    case TypeEnum.NATIVE_POINTER:
                        return new ByRef(handle.writePointer(value), type.makeByRefType());
                }
            } else if (value instanceof Int64) {
                return new ByRef(handle.writeS64(value), System.Int64.type.makeByRefType());
            } else if (value instanceof UInt64) {
                return new ByRef(handle.writeU64(value), System.UInt64.type.makeByRefType());
            }
        default:
            raise(`couldn't create a reference to ${value} using an unhandled type ${type?.name}`);
    }
}
