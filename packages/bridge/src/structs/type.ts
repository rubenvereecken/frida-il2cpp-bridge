import { System } from '../corlib.js';
import { TypeEnum } from '../enums/type.js';
import {
    getNativeTypeEquals,
    getNativeTypeGetClass,
    getNativeTypeGetName,
    getNativeTypeGetObject,
    getNativeTypeGetTypeEnum,
    getNativeTypeIsByRef,
    getNativeTypeIsPointer,
} from '../native/index.js';
import type { ParameterLike } from '../memory.js';
import { free, isIl2Cpp } from '../memory.js';
import { memoize } from '../utils/cache.js';
import { NativeStruct } from '../utils/native-struct.js';
import { recycle } from '../utils/recycle.js';
import type {
    StripArraySuffix,
    StripByRefSuffix,
    StripPointerSuffix,
} from '../utils/type-helpers.js';
import { isArrayLike } from './array.js';
import type { ArrayClass, PointerClass } from './class.js';
import { Class } from './class.js';
import { Object_ } from './object.js';
import type { Boolean, WrappedPrimitive } from './primitive.js';
import { isPrimitiveLike } from './primitive.js';
import { isStringLike } from './string.js';

/**
 * Represents a type in Il2Cpp.
 *
 * ```c
 * typedef struct Il2CppType
 * {
 *    union
 *    {
 *       // We have this dummy field first because pre C99 compilers (MSVC) can only initializer the first value in a union.
 *        void* dummy;
 *        TypeDefinitionIndex __klassIndex; // for VALUETYPE and CLASS at startup
 *        Il2CppMetadataTypeHandle typeHandle; // for VALUETYPE and CLASS at runtime
 *        const Il2CppType *type;   // for PTR and SZARRAY
 *        Il2CppArrayType *array; // for ARRAY
 *        //MonoMethodSignature *method;
 *        GenericParameterIndex __genericParameterIndex; // for VAR and MVAR at startup
 *        Il2CppMetadataGenericParameterHandle genericParameterHandle; // for VAR and MVAR at runtime
 *        Il2CppGenericClass *generic_class; // for GENERICINST
 *    } data;
 *    unsigned int attrs    : 16; // param attributes or field flags
 *    Il2CppTypeEnum type     : 8;
 *    unsigned int num_mods : 6;  // max 64 modifiers follow at the end
 *    unsigned int byref    : 1;
 *    unsigned int pinned   : 1;  // valid when included in a local var signature
 *    //MonoCustomMod modifiers [MONO_ZERO_LEN_ARRAY]; // this may grow
 * } Il2CppType;
 */
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

    /** Gets the class of this type. */
    @memoize
    get class(): Class<T> {
        return new Class<T>(getNativeTypeGetClass()(this));
    }

    @memoize
    get fridaAlias(): NativeCallbackArgumentType {
        // Frida parses value types as an array of field values (no way to get a pointer to memory back instead)
        function getValueTypeFields(type: Type): NativeCallbackArgumentType {
            const instanceFields = type.class.fields.filter(_ => !_.isStatic);
            // TODO: test 0 instance fields case
            return instanceFields.length == 0
                ? ['char']
                : instanceFields.map(_ => _.type.fridaAlias);
        }

        // By-ref types can be edited in-place, so we need to pass a pointer to the memory location
        if (this.isByRef()) {
            return 'pointer';
        }

        switch (this._typeEnum) {
            // Note: Since Frida 17, primitives can no longer be passed as pointers
            case TypeEnum.VOID:
                return 'void';
            case TypeEnum.BOOLEAN:
                return 'int32';
            // TODO is this 1 or 2 bytes??
            case TypeEnum.CHAR:
                return 'char';
            case TypeEnum.SIGNED_BYTE:
                return 'int8';
            case TypeEnum.UNSIGNED_BYTE:
                return 'uint8';
            case TypeEnum.SHORT:
                return 'int16';
            case TypeEnum.UNSIGNED_SHORT:
                return 'uint16';
            case TypeEnum.INT:
                return 'int32';
            case TypeEnum.UNSIGNED_INT:
                return 'uint32';
            case TypeEnum.LONG:
                return 'int64';
            case TypeEnum.UNSIGNED_LONG:
                return 'uint64';
            case TypeEnum.FLOAT:
                return 'float';
            case TypeEnum.DOUBLE:
                return 'double';
            // --
            // We used to have Frida parse primitives, but now they're wrapped in an Il2Cpp.Primitive
            // So just pass a pointer and don't read it until required
            // case Il2Cpp.Type.enum.void:
            // case Il2Cpp.Type.enum.boolean:
            // case Il2Cpp.Type.enum.char:
            // case Il2Cpp.Type.enum.byte:
            // case Il2Cpp.Type.enum.unsignedByte:
            // case Il2Cpp.Type.enum.short:
            // case Il2Cpp.Type.enum.unsignedShort:
            // case Il2Cpp.Type.enum.int:
            // case Il2Cpp.Type.enum.unsignedInt:
            // case Il2Cpp.Type.enum.long:
            // case Il2Cpp.Type.enum.unsignedLong:
            // case Il2Cpp.Type.enum.float:
            // case Il2Cpp.Type.enum.double:
            // return 'pointer';
            case TypeEnum.SIGNED_NATIVE_POINTER:
            case TypeEnum.UNSIGNED_NATIVE_POINTER:
            case TypeEnum.POINTER:
            case TypeEnum.STRING:
            case TypeEnum.ARRAY:
            case TypeEnum.MULTIDIMENSIONAL_ARRAY:
                return 'pointer';
            // TODO come back for these
            case TypeEnum.VALUE_TYPE:
                return this.class._isEnum
                    ? this.class.baseType!.fridaAlias
                    : getValueTypeFields(this);
            case TypeEnum.REFERENCE_TYPE:
            case TypeEnum.OBJECT:
            case TypeEnum.GENERIC_INSTANCE:
                return this.class.isStruct
                    ? getValueTypeFields(this)
                    : this.class._isEnum
                      ? this.class.baseType!.fridaAlias
                      : 'pointer';
            default:
                return 'pointer';
        }
    }

    static fromRuntimeType<T extends string>(runtimeType: Object_) {
        // `getNativeClassFromSystemType` loses information like by-ref
        // return new Class(getNativeClassFromSystemType()(runtimeType)).type as Type<T>;
        return new Type<T>(runtimeType.handle.add(Object_.headerSize).readPointer());
    }

    @memoize
    get _isByRef(): boolean {
        // `TypeEnum.BY_REF` is unreliable – see `System.Boolean.method('TryParse').parameters[1].type`
        return !!getNativeTypeIsByRef()(this);
    }

    isByRef(): this is T extends `${string}&` ? ByRefType<T> : ByRefType<`${string}&`> {
        return this._isByRef;
    }

    @memoize
    get _isPointer(): boolean {
        return !!getNativeTypeIsPointer()(this);
    }

    isPointer(): this is T extends `${string}*` ? PointerType<T> : PointerType<`${string}*`> {
        return this._isPointer;
    }

    @memoize
    get _isArray(): boolean {
        return (
            this._typeEnum === TypeEnum.ARRAY || this._typeEnum == TypeEnum.MULTIDIMENSIONAL_ARRAY
        );
    }

    isArray(): this is T extends `${string}[]` ? ArrayType<T> : ArrayType<`${string}[]`> {
        return this._isArray;
    }

    /** Determines whether this type is primitive. */
    isPrimitive(): this is WrappedPrimitiveType {
        return this.class.isPrimitive();
    }

    /** Gets the name of this type. */
    @memoize
    get name() {
        return getNativeTypeGetName()(this).readUtf8String()! as T;
    }

    /**
     * Gets the corresponding `System.RuntimeType` of the current type.
     * Implemented in Il2Cpp as `Il2CppReflectionType`.
     *
     * ```c
     * typedef struct Il2CppReflectionType {
     * {
     *     Il2CppObject object;
     *     const Il2CppType *type;
     * } Il2CppReflectionType;
     * ```
     *
     * @example
     * ```ts
     * const intType = Il2Cpp.corlib.class("System.Int32").type;
     * const intRuntimeType = intType.runtimeType;
     * const intPtrRuntimeType = intRuntimeType.m.MakePointerType()
     * const intPtrType = (new Il2Cpp.Class(Il2Cpp.exports.getNativeClassFromSystemType()(intPtrRuntimeType))).type
     * ```
     */
    @memoize
    get runtimeType() {
        return new Object_<'System.RuntimeType'>(getNativeTypeGetObject()(this));
    }

    /**
     * Creates a pointer type of the current type.
     *
     * @example
     * ```ts
     * Il2Cpp.System.Int32.type.makePointerType(); // -> System.Int32*
     * ```
     */
    makePointerType(): PointerType<`${T}*`> {
        const pointerRuntimeType = this.runtimeType
            .method<Object_<'System.RuntimeType'>>('MakePointerType', 0)
            .invoke();
        return Type.fromRuntimeType<`${T}*`>(pointerRuntimeType) as PointerType<`${T}*`>;
    }

    /**
     * Creates a by-reference type of the current type.
     *
     * @example
     * ```ts
     * Il2Cpp.System.Int32.type.makeByRefType(); // -> System.Int32&
     * ```
     */
    makeByRefType(): ByRefType<`${T}&`> {
        const byRefRuntimeType = this.runtimeType
            .method<Object_<'System.RuntimeType'>>('MakeByRefType', 0)
            .invoke();
        return Type.fromRuntimeType<`${T}&`>(byRefRuntimeType) as ByRefType<`${T}&`>;
    }

    /**
     * Creates an array type of the current type.
     *
     * @example
     * ```ts
     * Il2Cpp.System.Int32.type.makeArrayType(); // -> System.Int32[]
     * ```
     */
    makeArrayType(): ArrayType<`${T}[]`> {
        const arrayRuntimeType = this.runtimeType
            .method<Object_<'System.RuntimeType'>>('MakeArrayType', 0)
            .invoke();
        return Type.fromRuntimeType<`${T}[]`>(arrayRuntimeType) as ArrayType<`${T}[]`>;
    }

    /**
     * Element type of either a by-ref, pointer, or array type.
     *
     * @example
     * ```ts
     * Il2Cpp.System.Int32.type.makePointerType().getElementType(); // -> System.Int32
     * Il2Cpp.System.String.type.makeByRefType().getElementType(); // -> System.String
     * Il2Cpp.System.Object.type.makeArrayType().getElementType(); // -> System.Object
     * ```
     */
    getElementType<U extends `${string}*`>(this: PointerType<U>): Type<StripPointerSuffix<U>>;
    getElementType<U extends `${string}&`>(this: ByRefType<U>): Type<StripByRefSuffix<U>>;
    getElementType<U extends `${string}[]`>(this: ArrayType<U>): Type<StripArraySuffix<U>>;
    getElementType<U extends string>(this: HasElementType<U>): Type {
        const elementRuntimeType = this.runtimeType.method<Object_>('GetElementType', 0).invoke();
        // Overloads provide the precise return type; impl can be broad
        return Type.fromRuntimeType(elementRuntimeType) as Type;
    }

    /** Gets the type enum of the current type. */
    @memoize
    get _typeEnum(): TypeEnum {
        return getNativeTypeGetTypeEnum()(this);
    }

    getTypeEnum(this: this & { readonly typeEnum: TypeEnum }): this['_typeEnum'];
    // Otherwise, fall back to the general enum:
    getTypeEnum(this: this): TypeEnum;

    getTypeEnum(this: Type<T>) {
        return this._typeEnum;
    }

    isSame<U extends string>(other: Type<U>): this is Type<U> {
        // isSame<U extends string>(other: Type<U>): boolean {
        if (getNativeTypeEquals().isNull()) {
            return !!this.runtimeType.method<Boolean>('Equals').invoke(other.runtimeType);
        }

        return !!getNativeTypeEquals()(this.handle, other.handle);
    }

    isAssignableFromType(other: Type): boolean {
        // TODO does it make a difference whether I go type -> class or should I go straight to class
        // -> do we lose anything along the way?
        return this.class.isAssignableFrom(other.class);
    }

    /**
     * Note: reason I do this in two steps and don't just wrap first, is because I don't allow
     * upcasting/type coercion between wrapped types right now.
     * So looking at the raw types gives a bit more leeway for scenarios like:
     * - pass number to System.Int16 (64 -> 16)
     * - pass Int64 to System.Int32 (64 -> 32)
     * - pass 1 to System.Boolean (64 -> 1)
     */
    isAssignableFromValue(other: ParameterLike): boolean {
        // Alright, we already know its type because it's got a wrapper
        if (isIl2Cpp(other)) {
            return this.isAssignableFromType(other.type);
        }

        // StringLike: If it's a string, easy to wrap (we already know it's not wrapped)
        if (isStringLike(other)) {
            return this.isAssignableFromType(System.String.type);
        }

        // If the required parameter is a primitive and the provided value is a JSType, it can be cast to a number (even if lossy),
        // so as long as it's a primitive on both sides for now, all good
        if (isPrimitiveLike(other) && this.isPrimitive()) {
            return true;
        }

        // ArrayLike: Assume homogeneous arrays
        if (this.isArray() && isArrayLike(other)) {
            // Empty JS array is always assignable
            // if (other.length == 0) return true;

            const firstElement = other[0];

            /** @ts-expect-error: TODO */
            return this.class.elementClass.type.isAssignableFromValue(firstElement);
        }

        // if (other instanceof ByRef) {
        //     // ✔️ Assign T& to T&
        //     // ✔️ Assign T to T&
        //     if (this.isByRef() && this.getElementType().isAssignableFromType(other.elementType)) {
        //         return true;
        //     }

        //     // raise(
        //     //     `might not have support for reference types yet: ${other.referredType.name} -> ${this.name}`
        //     // );
        // }

        return false;
    }
}

export type WrappedPrimitiveType = WrappedPrimitive['type'];

export type PointerType<T extends `${string}*`> = Type<T> & {
    _isPointer: true;
    class: PointerClass<T>;
};

export type ByRefType<T extends `${string}&`> = Type<T> & {
    _isByRef: true;
    // No such thing as a by-ref class, so strip the suffix
    class: Class<StripByRefSuffix<T>>;
};

export type ArrayType<T extends `${string}[]`> = Type<T> & {
    _isArray: true;
    class: ArrayClass<T>;
};

/** Any type that has an element type (pointer, by-ref, or array) */
export type HasElementType<T extends string = string> =
    | PointerType<Extract<T, `${string}*`>>
    | ByRefType<Extract<T, `${string}&`>>
    | ArrayType<Extract<T, `${string}[]`>>;
