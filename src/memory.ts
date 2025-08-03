namespace Il2Cpp {
    // TODO figure out where I want to put all these types – probably in types/*.ts files
    export type Il2CppValue =
        | Il2Cpp.Primitive
        | Il2Cpp.String
        | Il2Cpp.ByRef
        | Il2Cpp.Pointer
        | Il2Cpp.ValueType
        | Il2Cpp.ReferenceType
        | Il2Cpp.Array
        | Il2Cpp.NullReference;

    export type JsObject = {
        // TODO type this using RecursiveValuesOf (see Frida's NativeFunctionReturnValue)
        [key: string]: any;
    };

    // TODO consolidate
    export type JsPrimitive = Il2Cpp.Primitive.JsType;
    export type JsValue = Il2Cpp.JsPrimitive | Il2Cpp.JsObject;

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
        | Il2Cpp.Il2CppValue
        // And things that can be coerced to Il2Cpp types
        | Il2Cpp.PrimitiveLike
        | Il2Cpp.StringLike
        | Il2Cpp.ArrayLike;

    export function isIl2Cpp(type: Il2Cpp.Parameter.Value): type is Il2CppValue {
        return (
            type instanceof Il2Cpp.Primitive ||
            type instanceof Il2Cpp.String ||
            type instanceof Il2Cpp.ByRef ||
            type instanceof Il2Cpp.Pointer ||
            type instanceof Il2Cpp.ValueType ||
            type instanceof Il2Cpp.ReferenceType ||
            type instanceof Il2Cpp.Array
        );
    }

    type maps = [
        {
            js: boolean;
            frida: number;
            il2cpp: Il2Cpp.Primitive<'System.Boolean'>;
        },
        {
            js: number;
            frida: number;
            il2cpp: Il2Cpp.Primitive<'System.Int32'>;
        },
    ];

    /**
     * Allocates the given amount of bytes - it's equivalent to C's `malloc`. \
     * The allocated memory should be freed manually.
     */
    export function alloc(size: number | globalThis.UInt64 = Process.pointerSize): NativePointer {
        return Il2Cpp.exports.alloc(size);
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
        return Il2Cpp.exports.free(pointer);
    }

    /**
     * @param options.derefPointer If a pointer, dereference before reading? Usually `true`, but `false` for parameters for example.
     */
    export function readIl2Cpp(
        pointer: NativePointer,
        type: Il2Cpp.Type,
        options: { derefPointer?: boolean } = {}
    ): Il2Cpp.Il2CppValue {
        // reference types (classes, arrays, etc) need dereferencing,
        // while value types (primitives and value types) never do
        // TODO that might not be entirely true, so double check
        options = { derefPointer: !type.class.isValueType, ...options };
        const dereferenced = options.derefPointer ? pointer.readPointer() : pointer;

        if (type.isPrimitive()) return new Il2Cpp.Primitive(pointer, type);

        // Only reference types can be null
        if (dereferenced.isNull() && !type.class.isValueType) return new Il2Cpp.NullReference(type);

        // Value types can't be null
        if (dereferenced.isNull()) raise(`Did not expect a null pointer for ${type.name}`);

        if (!type._isByRef)
            switch (type.typeEnum) {
                case Il2Cpp.Type.enum.string:
                    return new Il2Cpp.String(dereferenced);
                case Il2Cpp.Type.enum.pointer:
                    return new Il2Cpp.Pointer(dereferenced, type.class.baseType!);
                case Il2Cpp.Type.enum.valueType:
                    // Never needs dereferencing
                    return new Il2Cpp.ValueType(dereferenced, type);
                case Il2Cpp.Type.enum.object:
                case Il2Cpp.Type.enum.referenceType:
                    return new Il2Cpp.ReferenceType(dereferenced);
                case Il2Cpp.Type.enum.genericInstance:
                    return type.class.isValueType
                        ? new Il2Cpp.ValueType(dereferenced, type)
                        : new Il2Cpp.ReferenceType(dereferenced);
                case Il2Cpp.Type.enum.array:
                case Il2Cpp.Type.enum.multidimensionalArray:
                    return new Il2Cpp.Array(dereferenced);
            }

        raise(
            `couldn't read the value from ${pointer} (->${dereferenced}) using an unhandled or unknown type "${type.name}" (${type.typeEnum}), please file an issue`
        );
    }

    function writePrimitive(
        pointer: NativePointer,
        value: Il2Cpp.PrimitiveLike,
        type: Il2Cpp.Type
    ): NativePointer {
        if (Il2Cpp.isPrimitiveJSType(value)) {
            if (type.isBoolean()) return pointer.writeS8(+coerceJSPrimitive(value, type));
            if (type.isSByte()) return pointer.writeS8(coerceJSPrimitive(value, type));
            if (type.isByte()) return pointer.writeU8(coerceJSPrimitive(value, type));
            if (type.isChar()) return pointer.writeU16(coerceJSPrimitive(value, type));
            if (type.isInt16()) return pointer.writeS16(coerceJSPrimitive(value, type));
            if (type.isUInt16()) return pointer.writeU16(coerceJSPrimitive(value, type));
            if (type.isInt32()) return pointer.writeS32(coerceJSPrimitive(value, type));
            if (type.isUInt32()) return pointer.writeU32(coerceJSPrimitive(value, type));
            if (type.isInt64()) return pointer.writeS64(coerceJSPrimitive(value, type));
            if (type.isUInt64()) return pointer.writeU64(coerceJSPrimitive(value, type));
            if (type.isSingle()) return pointer.writeFloat(coerceJSPrimitive(value, type));
            if (type.isDouble()) return pointer.writeDouble(coerceJSPrimitive(value, type));
            if (type.isIntPtr()) return pointer.writePointer(coerceJSPrimitive(value, type));
            if (type.isUIntPtr()) return pointer.writePointer(coerceJSPrimitive(value, type));
            raise(
                `couldn't write primitive value ${value} to ${pointer} using an unhandled or unknown type "${type.name}" (${type.typeEnum}), please file an issue`
            );
        } else {
            // It's already a ValueType, so just copy over the correct number of bytes
            Memory.copy(pointer, value.handle, type.class.valueTypeSize ?? type.class.instanceSize);
            return pointer;
        }
    }

    export function write(
        pointer: NativePointer,
        value: Il2Cpp.ParameterLike,
        type: Il2Cpp.Type
    ): NativePointer {
        if (Il2Cpp.isPrimitiveLike(value)) return writePrimitive(pointer, value, type);
        if (Il2Cpp.isStringLike(value)) {
            if (Il2Cpp.isJsString(value)) value = Il2Cpp.string(value);
            return pointer.writePointer(value);
        }
        if (Il2Cpp.isArrayLike(value)) {
            // It's already wrapped: easy, just write the pointer
            if (Il2Cpp.isWrappedArray(value)) return pointer.writePointer(value);

            // TODO: Handle raw JS array types like StringLike[] - needs array conversion logic
            throw new Error(
                `Raw JS arrays not yet supported in write() - got ${typeof value}: ${value}`
            );
        }

        switch (type.typeEnum) {
            case Il2Cpp.Type.enum.pointer:
            case Il2Cpp.Type.enum.array:
            case Il2Cpp.Type.enum.multidimensionalArray:
                return pointer.writePointer(value);
            case Il2Cpp.Type.enum.valueType:
                return (Memory.copy(pointer, value, type.class.valueTypeSize), pointer);
            case Il2Cpp.Type.enum.object:
            case Il2Cpp.Type.enum.referenceType:
            case Il2Cpp.Type.enum.genericInstance:
                return value instanceof Il2Cpp.ValueType
                    ? (Memory.copy(pointer, value, type.class.valueTypeSize), pointer)
                    : pointer.writePointer(value);
        }

        raise(
            `couldn't write value ${value} to ${pointer} using an unhandled or unknown type ${type.name} (${type.typeEnum}), please file an issue`
        );
    }

    export function fridaToIl2Cpp(
        value: NativeCallbackArgumentValue,
        type: Il2Cpp.Type
    ): Il2Cpp.Il2CppValue;

    export function fridaToIl2Cpp(
        value: NativeFunctionReturnValue,
        type: Il2Cpp.Type
    ): Il2Cpp.Il2CppValue;

    export function fridaToIl2Cpp(
        value: NativeFunctionArgumentValue,
        type: Il2Cpp.Type
    ): Il2Cpp.Il2CppValue;

    export function fridaToIl2Cpp(
        value:
            | NativeCallbackArgumentValue
            | NativeFunctionReturnValue
            | NativeFunctionArgumentValue,
        type: Il2Cpp.Type
    ): Il2Cpp.Parameter.Value | Il2Cpp.Method.ReturnType {
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
            const handle = Memory.alloc(type.class.valueTypeSize);
            // TODO double check use case
            if (value === undefined) {
                warn(`Got undefined for ${type.name}, returning unallocated pointer`);
                return handle;
            }
            if (!Il2Cpp.isPrimitiveJSType(value)) {
                raise(
                    `Type mismatch. Got: ${typeof value} (${value}) Expected: ${type.fridaAlias}`
                );
            }
            Il2Cpp.write(handle, value, type);
            return new Il2Cpp.Primitive(handle, type);
        }

        if (value === undefined) raise(`Expected a value, got undefined for ${type.name}`);
        if (!(value instanceof NativePointer))
            raise(
                `Expected a pointer for type ${type.name}, got ${value?.constructor?.name} (${value})`
            );

        if (type.isByRef()) {
            return new Il2Cpp.ByRef(value, type);
        }

        switch (type.typeEnum) {
            case Il2Cpp.Type.enum.pointer:
                return new Il2Cpp.Pointer(value, type.class.baseType!);
            case Il2Cpp.Type.enum.string:
                return new Il2Cpp.String(value);
            case Il2Cpp.Type.enum.valueType:
                // TODO test this
                return new Il2Cpp.ValueType(value, type);
            case Il2Cpp.Type.enum.referenceType:
            case Il2Cpp.Type.enum.genericInstance:
            case Il2Cpp.Type.enum.object:
                return new Il2Cpp.ReferenceType(value);
            case Il2Cpp.Type.enum.array:
            case Il2Cpp.Type.enum.multidimensionalArray:
                return new Il2Cpp.Array(value);
            default:
                raise(
                    `couldn't convert value ${value} to an Il2Cpp type using an unhandled or unknown type ${type.name} (${type.typeEnum}), please file an issue`
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
    export function toIl2Cpp(value: Il2Cpp.ParameterLike, type?: Il2Cpp.Type): Il2Cpp.Il2CppValue {
        if (!type) type = guessType(value);

        // TODO check if type works, or at least assert if we don't want coercion logic
        // TODO consider a base Il2Cpp class that all Il2Cpp values inherit from
        if (value instanceof Il2Cpp.ObjectLike) return value;

        if (typeof value === 'boolean' && !type.isBoolean())
            raise(`Type mismatch. Got: ${typeof value} (${value}) Expected: ${type.fridaAlias}`);
        if (
            (Il2Cpp.isJsString(value) && !type.isString()) ||
            (!Il2Cpp.isJsString(value) && type.isString())
        )
            raise(`Type mismatch. Got: ${typeof value} (${value}) Expected: ${type.fridaAlias}`);

        if (Il2Cpp.isJsString(value)) return Il2Cpp.string(value);

        if (typeof value === 'boolean') {
            // Frida doesn't have booleans, so handle those separately
            const handle = Memory.alloc(type.class.valueTypeSize);
            if (!Il2Cpp.isPrimitiveJSType(value)) {
                raise(
                    `Type mismatch. Got: ${typeof value} (${value}) Expected: ${type.fridaAlias}`
                );
            }
            Il2Cpp.write(handle, value, type);
            if (!type.isPrimitive()) raise(`Expected a primitive type, got ${type.name}`);
            return new Il2Cpp.Primitive(handle, type);
        }

        if (Il2Cpp.isJsArray(value)) raise(`Raw JS arrays not yet supported in toIl2Cpp()`);

        return fridaToIl2Cpp(value, type);
    }

    /**
     * Guess the best Il2Cpp type for a given JS or Il2Cpp value.
     */
    export function guessType(value: Il2Cpp.Parameter.Value): Il2Cpp.Type {
        const t = (kls: string) => Il2Cpp.corlib.class(kls).type;

        if (value === undefined) return Il2Cpp.System.Void.type;
        if (typeof value === 'boolean') return Il2Cpp.System.Boolean.type;
        if (typeof value === 'number')
            if (Number.isInteger(value)) return Il2Cpp.System.Int32.type;
            else return Il2Cpp.System.Double.type;
        if (value instanceof Int64) return Il2Cpp.System.Int64.type;
        if (value instanceof UInt64) return Il2Cpp.System.UInt64.type;
        if (value instanceof NativePointer) return Il2Cpp.System.IntPtr.type;
        if (typeof value === 'string') return Il2Cpp.System.String.type;
        if (value instanceof Il2Cpp.String) return Il2Cpp.System.String.type;
        if (value instanceof Il2Cpp.Array) return value.class.type;
        if (value instanceof Il2Cpp.ReferenceType) return value.class.type;

        // TODO: Handle array types properly - they don't always have a .type property
        if (value instanceof globalThis.Array) {
            throw new Error(`Array type guessing not implemented yet: ${value}`);
        }

        return (value as any).type;
    }

    export function coerceJSPrimitive(
        value: Il2Cpp.Primitive.JsType,
        type: Il2Cpp.Type<'System.Void'>
    ): undefined;
    // Any number can be coerced to a boolean (lossy)
    export function coerceJSPrimitive(
        value: Il2Cpp.Primitive.JsType,
        type: Il2Cpp.Type<'System.Boolean'>
    ): boolean;
    // All 1 to 4 byte primitives fit into a regular JS `number` (double) without loss, as do doubles
    export function coerceJSPrimitive(
        value: Il2Cpp.Primitive.JsType,
        type:
            | Il2Cpp.Type<'System.SByte'>
            | Il2Cpp.Type<'System.Byte'>
            | Il2Cpp.Type<'System.Char'>
            | Il2Cpp.Type<'System.Int16'>
            | Il2Cpp.Type<'System.UInt16'>
            | Il2Cpp.Type<'System.Int32'>
            | Il2Cpp.Type<'System.UInt32'>
            | Il2Cpp.Type<'System.Single'>
            | Il2Cpp.Type<'System.Double'>
    ): number;
    // Any primitive can be upcast to a long (signed or unsigned) without loss
    export function coerceJSPrimitive(
        value: Il2Cpp.Primitive.JsType,
        type: Il2Cpp.Type<'System.Int64'>
    ): globalThis.Int64;
    export function coerceJSPrimitive(
        value: Il2Cpp.Primitive.JsType,
        type: Il2Cpp.Type<'System.UInt64'>
    ): globalThis.UInt64;
    // Any primitive can be upcast to a pointer without loss
    export function coerceJSPrimitive(
        value: Il2Cpp.Primitive.JsType,
        type: Il2Cpp.Type<'System.IntPtr'> | Il2Cpp.Type<'System.UIntPtr'>
    ): NativePointer;
    export function coerceJSPrimitive(
        value: Il2Cpp.Primitive.JsType,
        type: Il2Cpp.WrappedPrimitiveType
    ): Il2Cpp.Primitive.JsType;
    export function coerceJSPrimitive(
        value: Il2Cpp.Primitive.JsType,
        type: Il2Cpp.WrappedPrimitiveType
    ): Il2Cpp.Primitive.JsType {
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
    /**
     * Turns either a JS or Il2Cpp value into a Frida value.
     * For use as a parameter to a native function.
     * It's useful to provide `type` to get an accurate match. For example when passing an Int64 into an Int32 (number), which frida won't like.
     */
    export function toFrida(
        value: Il2Cpp.ParameterLike,
        type?: Il2Cpp.Type
    ): NativeFunctionArgumentValue | NativeFunctionReturnValue {
        if (!type) type = Il2Cpp.guessType(value);

        if (type.name === 'System.Void') return undefined;

        if (type.isByRef()) {
            // ✔️ Assign T& to T& (probably rare, because who has a T& lying around?)
            if (value instanceof Il2Cpp.ByRef) return value;

            // ✔️ Assign T to T& (both value and reference types)
            // Note: this only works for primitives right now because I write them to a memory location first
            if (
                type.isAssignableFromValue(value) &&
                (value instanceof Il2Cpp.ValueType || value instanceof Il2Cpp.ReferenceType)
            )
                return value.handle;

            // TODO: if there are any useful use cases, gracefully create a reference
            // For example, decided not to create a reference on the fly, because there's no way to use it afterwards
            raise(
                `Got ${value} (type: ${value?.constructor?.name ?? typeof value}) for ${type.name}, expected ${type.getElementType().name}`
            );
        }

        // For now, just wrap all JS primitives in a wee pointer
        // TODO this is a memory leak! Best let Frida handle this,
        // but then I have to change the method signature on the fly – now it's pointers all the way
        if (Il2Cpp.isPrimitiveJSType(value)) {
            // Frida only supports booleans passed as numbers
            if (typeof value === 'boolean') return +value;
            return value;
            // Note: Since Frida 17, primitives can no longer be passed as pointers
            // const pointer = Memory.alloc(type.class.valueTypeSize);
            // Il2Cpp.write(pointer, value, type);
            // return pointer;
        }

        if (Il2Cpp.isWrappedPrimitive(value) && type.isPrimitive()) {
            // For cases like Int64 -> Int32, otherwise il2cpp or frida will throw
            const coerced = Il2Cpp.coerceJSPrimitive(value.read(), type);
            if (typeof coerced === 'boolean') return +coerced;
            return coerced;
        }

        // If regular JS string, wrap it first
        // TODO this is a memory leak!
        if (typeof value === 'string') {
            return Il2Cpp.string(value);
        }

        if (value instanceof Il2Cpp.ValueType && value.type.class.isEnum) {
            // return value.field<number | Int64 | UInt64>('value__').value;
            // TODO does this work? We used to unwrap the enum value first
            return value;
        }

        if (value instanceof Il2Cpp.ValueType) {
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
}
