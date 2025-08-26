import type { ArrayLike } from './structs/array.js';
import { array, Array, isArrayLike, isJsArray, isWrappedArray } from './structs/array.js';
import { NullReference } from './structs/null-reference.js';
import { Object_ } from './structs/object.js';
import { Pointer } from './structs/pointer.js';
import type { PrimitiveJSType, PrimitiveLike } from './structs/primitive.js';
import {
    isPrimitiveJSType,
    isPrimitiveLike,
    isWrappedPrimitive,
    Primitive,
} from './structs/primitive.js';
import type { StringLike } from './structs/string.js';
import { isJsString, isStringLike, String } from './structs/string.js';
import { UnboxedValueType } from './structs/value-type.js';
import { getNativeAlloc, getNativeFree } from './native/index.js';
import type { Type, WrappedPrimitiveType } from './structs/type.js';
import { TypeEnum } from './enums/type.js';
import { inform, warn } from './utils/log.js';
import { raise } from './utils/error.js';
import { getCorlib, System } from './corlib.js';
import type { MethodReturnType } from './structs/method.js';
import { BaseObject } from './structs/common/base-object.js';

// TODO figure out where I want to put all these types – probably in types/*.ts files
export type Il2CppValue =
    | Primitive
    | String
    // TODO do we want by-ref here? Or is that a parameter-only thing?
    | Pointer
    | UnboxedValueType
    | Object_
    | Array
    | NullReference
    | BaseObject;

export type JsObject = {
    // TODO type this using RecursiveValuesOf (see Frida's NativeFunctionReturnValue)
    [key: string]: unknown;
};

// TODO consolidate
export type JsPrimitive = PrimitiveJSType;
export type JsValue = JsPrimitive | JsObject;

export type FridaValue =
    | NativeFunctionReturnValue
    | NativeFunctionArgumentValue
    | NativeCallbackArgumentValue;

// TODO: remove this line when I'm happy – when this replaces Il2Cpp.Parameter.Value
/**
 * Anything that can be passed as a parameter to an Il2Cpp method.
 */
export type ParameterLike =
    // Regular Il2Cpp types
    | Il2CppValue
    // And things that can be coerced to Il2Cpp types
    | PrimitiveLike
    | StringLike
    | ArrayLike;

export function isIl2Cpp(type: unknown): type is Il2CppValue {
    return (
        type instanceof Primitive ||
        type instanceof String ||
        type instanceof Pointer ||
        type instanceof UnboxedValueType ||
        type instanceof Object_ ||
        type instanceof Array
    );
}

type maps = [
    {
        js: boolean;
        frida: number;
        il2cpp: Primitive<'System.Boolean'>;
    },
    {
        js: number;
        frida: number;
        il2cpp: Primitive<'System.Int32'>;
    },
];

/**
 * Allocates the given amount of bytes - it's equivalent to C's `malloc`. \
 * The allocated memory should be freed manually.
 */
export function alloc(size: number | globalThis.UInt64 = Process.pointerSize): NativePointer {
    return getNativeAlloc()(size);
}

/**
 * Frees a previously allocated memory using {@link Il2Cpp.alloc} - it's
 *  equivalent to C's `free`..
 *
 * ```ts
 * const handle = Il2Cpp.alloc(64);
 *
 * // ...
 *
 * Il2Cpp.free(handle);
 * ```
 */
export function free(pointer: NativePointerValue): void {
    return getNativeFree()(pointer);
}

/**
 * @param options.derefPointer If a pointer, dereference before reading? Usually `true`, but `false` for parameters for example.
 */
export function readIl2Cpp(
    pointer: NativePointer,
    type: Type,
    options: { derefPointer?: boolean } = {}
): Il2CppValue {
    // reference types (classes, arrays, etc) need dereferencing,
    // while value types (primitives and value types) never do
    // TODO that might not be entirely true, so double check
    options = { derefPointer: !type.class._isValueType, ...options };
    const dereferenced = options.derefPointer ? pointer.readPointer() : pointer;

    if (type.isPrimitive()) return new Primitive(pointer, type);

    // Only reference types can be null
    if (dereferenced.isNull() && !type.class._isValueType) return new NullReference(type);

    // Value types can't be null
    if (dereferenced.isNull()) raise(`Did not expect a null pointer for ${type.name}`);

    // TODO use type guards
    switch (type._typeEnum) {
        case TypeEnum.STRING:
            return new String(dereferenced);
        case TypeEnum.POINTER:
            return new Pointer(dereferenced, type.class.type as Type<`${string}*`>);
        case TypeEnum.VALUE_TYPE:
            // Never needs dereferencing
            return new UnboxedValueType(dereferenced, type);
        case TypeEnum.OBJECT:
        case TypeEnum.REFERENCE_TYPE:
            return new Object_(dereferenced);
        case TypeEnum.GENERIC_INSTANCE:
            return type.class._isValueType
                ? new UnboxedValueType(dereferenced, type)
                : new Object_(dereferenced);
        case TypeEnum.ARRAY:
        case TypeEnum.MULTIDIMENSIONAL_ARRAY:
            return new Array(dereferenced);
    }

    raise(
        `couldn't read the value from ${pointer} (->${dereferenced}) using an unhandled or unknown type "${type.name}" (${type._typeEnum}), please file an issue`
    );
}

function writePrimitive(pointer: NativePointer, value: PrimitiveLike, type: Type): NativePointer {
    if (type.isSame(System.Boolean.type)) {
        type.name;
    }

    if (isPrimitiveJSType(value)) {
        if (type.isSame(System.Boolean.type))
            return pointer.writeS8(+coerceJSPrimitive(value, type));
        if (type.isSame(System.SByte.type)) return pointer.writeS8(coerceJSPrimitive(value, type));
        if (type.isSame(System.Byte.type)) return pointer.writeU8(coerceJSPrimitive(value, type));
        if (type.isSame(System.Char.type)) return pointer.writeU16(coerceJSPrimitive(value, type));
        if (type.isSame(System.Int16.type)) return pointer.writeS16(coerceJSPrimitive(value, type));
        if (type.isSame(System.UInt16.type))
            return pointer.writeU16(coerceJSPrimitive(value, type));
        if (type.isSame(System.Int32.type)) return pointer.writeS32(coerceJSPrimitive(value, type));
        if (type.isSame(System.UInt32.type))
            return pointer.writeU32(coerceJSPrimitive(value, type));
        if (type.isSame(System.Int64.type)) return pointer.writeS64(coerceJSPrimitive(value, type));
        if (type.isSame(System.UInt64.type))
            return pointer.writeU64(coerceJSPrimitive(value, type));
        if (type.isSame(System.Single.type))
            return pointer.writeFloat(coerceJSPrimitive(value, type));
        if (type.isSame(System.Double.type))
            return pointer.writeDouble(coerceJSPrimitive(value, type));
        if (type.isSame(System.IntPtr.type))
            return pointer.writePointer(coerceJSPrimitive(value, type));
        if (type.isSame(System.UIntPtr.type))
            return pointer.writePointer(coerceJSPrimitive(value, type));
        raise(
            `couldn't write primitive value ${value} to ${pointer} using an unhandled or unknown type "${type.name}" (${type._typeEnum}), please file an issue`
        );
    } else {
        // It's already a ValueType, so just copy over the correct number of bytes
        Memory.copy(pointer, value.handle, type.class.valueTypeSize ?? type.class.instanceSize);
        return pointer;
    }
}

export function write(pointer: NativePointer, value: ParameterLike, type: Type): NativePointer {
    if (isPrimitiveLike(value)) return writePrimitive(pointer, value, type);
    if (isStringLike(value)) {
        if (isJsString(value)) value = String.from(value);
        return pointer.writePointer(value);
    }
    if (isArrayLike(value)) {
        // It's already wrapped: easy, just write the pointer
        if (isWrappedArray(value)) return pointer.writePointer(value);

        // TODO: Handle raw JS array types like StringLike[] - needs array conversion logic
        throw new Error(
            `Raw JS arrays not yet supported in write() - got ${typeof value}: ${value}`
        );
    }

    switch (type._typeEnum) {
        case TypeEnum.POINTER:
        case TypeEnum.ARRAY:
        case TypeEnum.MULTIDIMENSIONAL_ARRAY:
            return pointer.writePointer(value);
        case TypeEnum.VALUE_TYPE:
            return (Memory.copy(pointer, value, type.class.valueTypeSize), pointer);
        case TypeEnum.OBJECT:
        case TypeEnum.REFERENCE_TYPE:
        case TypeEnum.GENERIC_INSTANCE:
            return value instanceof UnboxedValueType
                ? (Memory.copy(pointer, value, type.class.valueTypeSize), pointer)
                : pointer.writePointer(value);
    }

    raise(
        `couldn't write value ${value} to ${pointer} using an unhandled or unknown type ${type.name} (${type._typeEnum}), please file an issue`
    );
}

export function fridaToIl2Cpp(
    value: NativeCallbackArgumentValue,
    type: Type,
    handle?: NativePointer
): Il2CppValue;

export function fridaToIl2Cpp(
    value: NativeFunctionReturnValue,
    type: Type,
    handle?: NativePointer
): Il2CppValue;

export function fridaToIl2Cpp(
    value: NativeFunctionArgumentValue,
    type: Type,
    handle?: NativePointer
): Il2CppValue;

export function fridaToIl2Cpp(
    value: NativeCallbackArgumentValue | NativeFunctionReturnValue | NativeFunctionArgumentValue,
    type: Type,
    handle?: NativePointer
): ParameterLike | MethodReturnType {
    // Note: it's now impossible for arrays to be returned by Frida
    // TODO might be interesting to have this reading logic elsewhere?
    // if (globalThis.Array.isArray(value)) {
    //     const handle = Memory.alloc(type.class.valueTypeSize);
    //     const fields = type.class.fields.filter(_ => !_.isStatic);

    //     for (let i = 0; i < fields.length; i++) {
    //         const convertedValue = fromFridaValue(value[i], fields[i].type);
    //         write(
    //             handle.add(fields[i].offset).sub(Il2Cpp.Object.headerSize),
    //             convertedValue,
    //             fields[i].type
    //         );
    //     }

    //     return new Il2Cpp.ValueType(handle, type);
    // }

    // Note: Since Frida 17, primitives can no longer be passed as pointers
    // if (!(value instanceof NativePointer)) {
    //     raise('I thought it was pointers all the way down??');
    // }

    if (type.isPrimitive()) {
        handle ??= Memory.alloc(type.class.valueTypeSize);
        // TODO double check use case
        if (value === undefined) {
            warn(`Got undefined for ${type.name}, returning unallocated pointer`);
            return handle;
        }
        if (!isPrimitiveJSType(value)) {
            raise(`Type mismatch. Got: ${typeof value} (${value}) Expected: ${type.fridaAlias}`);
        }
        write(handle, value, type);
        return new Primitive(handle, type);
    }

    // Frida returns value types as an array of field values -> need to write back to memory ourselves
    if (type.class.isValueType()) {
        if (!globalThis.Array.isArray(value)) {
            raise(`Expected an array for value type ${type.name}, got ${typeof value} (${value})`);
        }

        handle ??= Memory.alloc(type.class.valueTypeSize);

        // TODO combine with `getValueTypeFields` from `type.ts`
        const fieldTypes = type.class.fields.filter(f => !f.isStatic).map(f => f.type);

        if (fieldTypes.length !== value.length) {
            raise(
                `Expected ${fieldTypes.length} fields for value type ${type.name}, got ${value.length} (${value})`
            );
        }

        let offset = 0;

        for (let i = 0; i < fieldTypes.length; i++) {
            const fieldType = fieldTypes[i];
            const fieldValue = value[i];
            const fieldHandle = handle.add(offset);

            // TODO: make sure this works for value types containing pointers and reference types – definitely needs tests
            // TODO: consolidate functionality between `fridaToIl2Cpp` and `write`: the former allocates, the latter simply writes
            // TODO handle typing edge case
            /** @ts-ignore */
            fridaToIl2Cpp(fieldValue, fieldType, fieldHandle);

            offset += fieldType.class.valueTypeSize;
        }

        return new UnboxedValueType(handle, type);
    }

    if (value === undefined) raise(`Expected a value, got undefined for ${type.name}`);
    if (!(value instanceof NativePointer))
        raise(
            `Expected a pointer for type ${type.name}, got ${value?.constructor?.name} (${value})`
        );

    switch (type._typeEnum) {
        case TypeEnum.POINTER:
            return new Pointer(value, type.class.baseType! as Type<`${string}*`>);
        case TypeEnum.STRING:
            return new String(value);
        case TypeEnum.VALUE_TYPE:
            // TODO test this
            return new UnboxedValueType(value, type);
        case TypeEnum.REFERENCE_TYPE:
        case TypeEnum.GENERIC_INSTANCE:
        case TypeEnum.OBJECT:
            return new Object_(value);
        case TypeEnum.ARRAY:
        case TypeEnum.MULTIDIMENSIONAL_ARRAY:
            return new Array(value);
        default:
            raise(
                `couldn't convert value ${value} to an Il2Cpp type using an unhandled or unknown type ${type.name} (${type._typeEnum}), please file an issue`
            );
    }
    // TODO test enums
    // else if (type.typeEnum == Il2Cpp.Type.enum.boolean) {
    //     return !!(value as number);
    // } else if (type.typeEnum == Il2Cpp.Type.enum.valueType && type.class.isEnum) {
    //     return fromFridaValue([value], type);
    // } else {
    //     return value;
    // }
}

// TODO clean up and simplify this whole function
/**
 * Converts a JS or Il2Cpp value to an Il2Cpp value.
 */
export function toIl2Cpp(value: ParameterLike, type?: Type): Il2CppValue {
    if (!type) type = guessType(value);

    if (!type) raise(`Expected a type, got undefined`);

    // TODO check if type works, or at least assert if we don't want coercion logic
    // TODO consider a base Il2Cpp class that all Il2Cpp values inherit from
    if (value instanceof BaseObject) return value;

    if (typeof value === 'boolean' && !type.isSame(System.Boolean.type))
        raise(`Type mismatch. Got: ${typeof value} (${value}) Expected: ${type.fridaAlias}`);

    if (
        (isJsString(value) && !type.isSame(System.String.type)) ||
        (!isJsString(value) && type.isSame(System.String.type))
    )
        raise(`Type mismatch. Got: ${typeof value} (${value}) Expected: ${type.fridaAlias}`);

    if (isJsString(value)) return String.from(value);

    if (typeof value === 'boolean') {
        // Frida doesn't have booleans, so handle those separately
        const handle = Memory.alloc(type.class.valueTypeSize);
        if (!isPrimitiveJSType(value)) {
            raise(`Type mismatch. Got: ${typeof value} (${value}) Expected: ${type.fridaAlias}`);
        }
        write(handle, value, type);
        if (!type.isPrimitive()) raise(`Expected a primitive type, got ${type.name}`);
        return new Primitive(handle, type);
    }

    if (isJsArray(value)) raise(`Raw JS arrays not yet supported in toIl2Cpp()`);

    return fridaToIl2Cpp(value, type);
}

/**
 * Guess the best Il2Cpp type for a given JS or Il2Cpp value.
 */
export function guessType(value: ParameterLike): Type {
    const t = (kls: string) => getCorlib().class(kls).type;

    if (value === undefined) return System.Void.type;
    if (typeof value === 'boolean') return System.Boolean.type;
    if (typeof value === 'number')
        if (Number.isInteger(value)) return System.Int32.type;
        else return System.Double.type;
    if (value instanceof Int64) return System.Int64.type;
    if (value instanceof UInt64) return System.UInt64.type;
    if (value instanceof NativePointer) return System.IntPtr.type;
    if (typeof value === 'string') return System.String.type;
    if (value instanceof String) return System.String.type;
    if (value instanceof Array) return value.class.type;
    if (value instanceof Object_) return value.class.type;

    // TODO: Handle array types properly - they don't always have a .type property
    if (value instanceof globalThis.Array) {
        throw new Error(`Array type guessing not implemented yet: ${value}`);
    }

    return (value as any).type;
}

export function coerceJSPrimitive(
    value: PrimitiveJSType,
    type: (typeof System.Void)['type']
): undefined;
// Any number can be coerced to a boolean (lossy)
export function coerceJSPrimitive(
    value: PrimitiveJSType,
    type: (typeof System.Boolean)['type']
): boolean;
// All 1 to 4 byte primitives fit into a regular JS `number` (double) without loss, as do doubles
export function coerceJSPrimitive(
    value: PrimitiveJSType,
    type:
        | (typeof System.SByte)['type']
        | (typeof System.Byte)['type']
        | (typeof System.Char)['type']
        | (typeof System.Int16)['type']
        | (typeof System.UInt16)['type']
        | (typeof System.Int32)['type']
        | (typeof System.UInt32)['type']
        | (typeof System.Single)['type']
        | (typeof System.Double)['type']
): number;
// Any primitive can be upcast to a long (signed or unsigned) without loss
export function coerceJSPrimitive(
    value: PrimitiveJSType,
    type: (typeof System.Int64)['type']
): globalThis.Int64;
export function coerceJSPrimitive(
    value: PrimitiveJSType,
    type: (typeof System.UInt64)['type']
): globalThis.UInt64;
// Any primitive can be upcast to a pointer without loss
export function coerceJSPrimitive(
    value: PrimitiveJSType,
    type: (typeof System.IntPtr)['type'] | (typeof System.UIntPtr)['type']
): NativePointer;
export function coerceJSPrimitive(
    value: PrimitiveJSType,
    type: WrappedPrimitiveType
): PrimitiveJSType;
export function coerceJSPrimitive(
    value: PrimitiveJSType,
    type: WrappedPrimitiveType
): PrimitiveJSType {
    if (value === undefined) return value;

    // Be sure to convert booleans manually (TODO necessary??)
    if (type.name == 'System.Boolean') return !!value;

    // Longs and pointers
    if (type.class.valueTypeSize == 8) {
        if (value instanceof NativePointer || value instanceof Int64 || value instanceof UInt64)
            return value;
        return +value;
    }

    // Assume it fits into 4 bytes or less
    if (type.class.valueTypeSize > 4) {
        raise(`cannot coerce ${value} to ${type.name} (${type.class.valueTypeSize} bytes)`);
    }

    if (value instanceof NativePointer) raise(`cannot coerce ${value} to ${type.name}`);
    if (value instanceof Int64 || value instanceof UInt64) return value.toNumber();
    return +value;
}

// TODO have a complementary function that also parses value types to plain JS objects -> toJs
// For example for Int64 -> parse to number (and warn if lossy)
/**
 * Turns either a JS or Il2Cpp value into a Frida value.
 * For use as a parameter to a native function.
 * It's useful to provide `type` to get an accurate match. For example when passing an Int64 into an Int32 (number), which frida won't like.
 */
export function toFrida(
    value: ParameterLike,
    type?: Type
): NativeFunctionArgumentValue | NativeFunctionReturnValue {
    if (!type) type = guessType(value);

    if (type.name === 'System.Void') return undefined;

    if (type.isByRef()) {
        // ✔️ Assign T to T& (both value and reference types)
        if (
            type.isAssignableFromValue(value) &&
            (value instanceof UnboxedValueType || value instanceof Object_)
        )
            return value;

        raise(
            `Got ${value} (type: ${value?.constructor?.name ?? typeof value}) for ${type.name}, expected ${type.getElementType().name}`
        );
    }

    // Note: Since Frida 17, primitives can no longer be passed as pointers
    if (isPrimitiveJSType(value)) {
        // Frida only supports booleans passed as numbers
        if (typeof value === 'boolean') return +value;
        return value;
    }

    if (isWrappedPrimitive(value) && type.isPrimitive()) {
        // For cases like Int64 -> Int32, otherwise il2cpp or frida will throw
        const coerced = coerceJSPrimitive(value.read(), type);
        if (typeof coerced === 'boolean') return +coerced;
        return coerced;
    }

    // If regular JS string, wrap it first
    // TODO this is a memory leak!
    if (typeof value === 'string') {
        return String.from(value);
    }

    if (value instanceof UnboxedValueType && value.type.class._isEnum) {
        // return value.field<number | Int64 | UInt64>('value__').value;
        // TODO does this work? We used to unwrap the enum value first
        return value;
    }

    if (value instanceof UnboxedValueType) {
        // const _ = value.type.class.fields
        //     .filter(_ => !_.isStatic)
        //     .map(_ => toFridaValue(_.bind(value).value));
        // return _.length == 0 ? [0] : _;
        // TODO does this work?
        return value;
    }

    // At this point, it's wrapped in an ObjectLike, so just return the pointer
    // TODO: Handle complex array types that cause Frida return type conflicts
    if (value instanceof globalThis.Array) {
        throw new Error(`Array return types not yet supported: ${value}`);
    }

    return value as any;
}
