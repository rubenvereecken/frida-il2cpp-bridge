import { TypeAttributeFlags } from '../enums/type-attribute.js';
import { TypeEnum } from '../enums/type.js';
import { raise } from '../utils/error.js';
import { memoize } from '../utils/cache.js';
import { NativeStruct } from '../utils/native-struct.js';
import { recycle } from '../utils/recycle.js';
import { Image } from './image.js';
import {
    getNativeArrayGetClass,
    getNativeClassForEach,
    getNativeClassFromSystemType,
    getNativeClassGetArrayElementSize,
    getNativeClassGetAssemblyName,
    getNativeClassGetBaseType,
    getNativeClassGetByRefType,
    getNativeClassGetDeclaringType,
    getNativeClassGetElementClass,
    getNativeClassGetFieldFromName,
    getNativeClassGetFields,
    getNativeClassGetFlags,
    getNativeClassGetImage,
    getNativeClassGetInstanceSize,
    getNativeClassGetInterfaces,
    getNativeClassGetMethodFromName,
    getNativeClassGetMethods,
    getNativeClassGetName,
    getNativeClassGetNamespace,
    getNativeClassGetNestedClasses,
    getNativeClassGetParent,
    getNativeClassGetStaticFieldData,
    getNativeClassGetType,
    getNativeClassGetValueTypeSize,
    getNativeClassHasReferences,
    getNativeClassInitialize,
    getNativeClassIsAbstract,
    getNativeClassIsAssignableFrom,
    getNativeClassIsBlittable,
    getNativeClassIsEnum,
    getNativeClassIsGeneric,
    getNativeClassIsInflated,
    getNativeClassIsInterface,
    getNativeClassIsSubclassOf,
    getNativeClassIsValueType,
    getNativeObjectInitializeException,
    getNativeObjectNew,
} from '../native/index.js';
import { Type } from './type.js';
import { Field } from './field.js';
import { readNativeIterator } from '../utils/read-native-iterator.js';
import { Object_ } from './object.js';
import type { MethodReturnType } from './method.js';
import { Method } from './method.js';
import type { Il2CppValue, ParameterLike } from '../memory.js';
import type { Array } from './array.js';
import { array } from './array.js';
import type { DynamicMethods } from './common/dynamic-methods.js';
import { DynamicMethodsLookup } from './common/dynamic-methods.js';
import type { DynamicFields } from './common/dynamic-fields.js';
import { DynamicFieldsLookup } from './common/dynamic-fields.js';
import type { StripArraySuffix } from '../utils/type-helpers.js';
import { getCorlib, System } from '../corlib.js';

/**
 * TODO: document byval_arg (the usual type) vs this_arg (for functions maybe?)
 * 
 * ```c
 * typedef struct Il2CppClass
{
    // The following fields are always valid for a Il2CppClass structure
    const Il2CppImage* image;
    void* gc_desc;
    const char* name;
    const char* namespaze;
    Il2CppType byval_arg;
    Il2CppType this_arg;
    Il2CppClass* element_class;
    Il2CppClass* castClass;
    Il2CppClass* declaringType;
    Il2CppClass* parent;
    Il2CppGenericClass *generic_class;
    Il2CppMetadataTypeHandle typeMetadataHandle; // non-NULL for Il2CppClass's constructed from type defintions
    const Il2CppInteropData* interopData;
    Il2CppClass* klass; // hack to pretend we are a MonoVTable. Points to ourself
    // End always valid fields

    // The following fields need initialized before access. This can be done per field or as an aggregate via a call to Class::Init
    FieldInfo* fields; // Initialized in SetupFields
    const EventInfo* events; // Initialized in SetupEvents
    const PropertyInfo* properties; // Initialized in SetupProperties
    const MethodInfo** methods; // Initialized in SetupMethods
    Il2CppClass** nestedTypes; // Initialized in SetupNestedTypes
    Il2CppClass** implementedInterfaces; // Initialized in SetupInterfaces
    Il2CppRuntimeInterfaceOffsetPair* interfaceOffsets; // Initialized in Init
    void* static_fields; // Initialized in Init
    const Il2CppRGCTXData* rgctx_data; // Initialized in Init
    // used for fast parent checks
    Il2CppClass** typeHierarchy; // Initialized in SetupTypeHierachy
    // End initialization required fields

    void *unity_user_data;

    uint32_t initializationExceptionGCHandle;

    uint32_t cctor_started;
    uint32_t cctor_finished;
    ALIGN_TYPE(8) size_t cctor_thread;

    // Remaining fields are always valid except where noted
    Il2CppMetadataGenericContainerHandle genericContainerHandle;
    uint32_t instance_size; // valid when size_inited is true
    uint32_t actualSize;
    uint32_t element_size;
    int32_t native_size;
    uint32_t static_fields_size;
    uint32_t thread_static_fields_size;
    int32_t thread_static_fields_offset;
    uint32_t flags;
    uint32_t token;

    uint16_t method_count; // lazily calculated for arrays, i.e. when rank > 0
    uint16_t property_count;
    uint16_t field_count;
    uint16_t event_count;
    uint16_t nested_type_count;
    uint16_t vtable_count; // lazily calculated for arrays, i.e. when rank > 0
    uint16_t interfaces_count;
    uint16_t interface_offsets_count; // lazily calculated for arrays, i.e. when rank > 0

    uint8_t typeHierarchyDepth; // Initialized in SetupTypeHierachy
    uint8_t genericRecursionDepth;
    uint8_t rank;
    uint8_t minimumAlignment; // Alignment of this type
    uint8_t naturalAligment; // Alignment of this type without accounting for packing
    uint8_t packingSize;

    // this is critical for performance of Class::InitFromCodegen. Equals to initialized && !has_initialization_error at all times.
    // Use Class::UpdateInitializedAndNoError to update
    uint8_t initialized_and_no_error : 1;

    uint8_t valuetype : 1;
    uint8_t initialized : 1;
    uint8_t enumtype : 1;
    uint8_t is_generic : 1;
    uint8_t has_references : 1; // valid when size_inited is true
    uint8_t init_pending : 1;
    uint8_t size_init_pending : 1;
    uint8_t size_inited : 1;
    uint8_t has_finalize : 1;
    uint8_t has_cctor : 1;
    uint8_t is_blittable : 1;
    uint8_t is_import_or_windows_runtime : 1;
    uint8_t is_vtable_initialized : 1;
    uint8_t has_initialization_error : 1;
    VirtualInvokeData vtable[IL2CPP_ZERO_LEN_ARRAY];
} Il2CppClass;
 ```
 */
@recycle
export class Class<T extends string = string> extends NativeStruct {
    constructor(handle: NativePointerValue) {
        super(handle);

        // Shows up on Frida REPL. Useful for debugging and reverse engineering
        globalThis.Object.defineProperty(this, '__toString', {
            get: () => this.toString(),
            enumerable: true,
        });
        globalThis.Object.defineProperty(this, '_il2cpp', {
            get: () => 'Il2Cpp.Class',
            enumerable: true,
        });
    }

    toString() {
        return `${this.image.assembly.name}::${this.fullName}`;
    }

    get type() {
        return new Type<T>(getNativeClassGetType()(this));
    }

    get byRefType() {
        return new Type(getNativeClassGetByRefType()(this));
    }

    get typeEnum(): TypeEnum {
        return this.type._typeEnum;
    }

    isArray(): this is ArrayClass<T> {
        return (
            this.type.getTypeEnum() === TypeEnum.ARRAY ||
            this.type.getTypeEnum() === TypeEnum.MULTIDIMENSIONAL_ARRAY
        );
    }

    isPrimitive(): this is PrimitiveClass {
        switch (this.typeEnum) {
            case TypeEnum.VOID:
            case TypeEnum.BOOLEAN:
            case TypeEnum.CHAR:
            case TypeEnum.SIGNED_BYTE:
            case TypeEnum.UNSIGNED_BYTE:
            case TypeEnum.SHORT:
            case TypeEnum.UNSIGNED_SHORT:
            case TypeEnum.INT:
            case TypeEnum.UNSIGNED_INT:
            case TypeEnum.LONG:
            case TypeEnum.UNSIGNED_LONG:
            case TypeEnum.FLOAT:
            case TypeEnum.DOUBLE:
            case TypeEnum.SIGNED_NATIVE_POINTER:
            case TypeEnum.UNSIGNED_NATIVE_POINTER:
                return true;
            default:
                return false;
        }
    }

    /**
     * Creates an array class with this class as the element class.
     *
     * @example
     * ```ts
     * Il2Cpp.System.Int32.makeArrayClass(); // -> System.Int32[]
     * ```
     */
    makeArrayClass(this: Class<T>) {
        return new Class<`T[]`>(getNativeArrayGetClass()(this, 1)) as ArrayClass<`T[]`>;
    }

    /** Gets the size of the object encompassed by the current array class. */
    @memoize
    getElementSize(): number {
        return getNativeClassGetArrayElementSize()(this);
    }

    /** Gets the name of the assembly in which the current class is defined. */
    @memoize
    get assemblyName(): string {
        return getNativeClassGetAssemblyName()(this).readUtf8String()!.replace('.dll', '');
    }

    /** Gets the class that declares the current nested class. */
    @memoize
    get declaringClass(): Class | null {
        return new Class(getNativeClassGetDeclaringType()(this)).asNullable();
    }

    /** Declaring classes hierarchy, from inner to outer most */
    @memoize
    get declaringClasses(): Class[] {
        const classes: Class[] = [this];
        while (classes[classes.length - 1].declaringClass) {
            classes.push(classes[classes.length - 1].declaringClass!);
        }
        classes.shift();
        return classes;
    }

    /** Gets the encompassed type of this array, reference, pointer or enum type. */
    @memoize
    get baseType(): Type | null {
        return new Type(getNativeClassGetBaseType()(this)).asNullable();
    }

    /**
     * Gets the class of the object encompassed or referred to by the current array, pointer or reference class.
     *
     * Examples:
     *   `System.Int32[]` -> `System.Int32`
     *   `System.Byte&` -> `System.Byte`
     *   `System.String` -> `System.String`
     */
    @memoize
    get elementClass(): Class | null {
        return new Class(getNativeClassGetElementClass()(this)).asNullable();
    }

    /** Gets the fields of the current class. */
    @memoize
    get fields(): Field[] {
        return readNativeIterator(_ => getNativeClassGetFields()(this, _)).map(_ => new Field(_));
    }

    @memoize
    get flags() {
        const flags = getNativeClassGetFlags()(this);
        return {
            isInterface: !!(flags & TypeAttributeFlags.INTERFACE),
            isAbstract: !!(flags & TypeAttributeFlags.ABSTRACT),
            isSealed: !!(flags & TypeAttributeFlags.SEALED),
            isSpecialName: !!(flags & TypeAttributeFlags.SPECIAL_NAME),
        };
    }

    /** Gets the full name (namespace + name) of the current class. */
    @memoize
    get fullName(): string {
        return this.namespace ? `${this.namespace}.${this.name}` : this.name;
    }

    /** Gets the generics parameters of this generic class. */
    @memoize
    get generics(): Class[] {
        if (!this.isGeneric && !this.isInflated) {
            return [];
        }

        const types = this.type.runtimeType.method<Array<Object_>>('GetGenericArguments').invoke();
        return globalThis.Array.from(types).map(_ => new Class(getNativeClassFromSystemType()(_)));
    }

    /** Determines whether the GC has tracking references to the current class instances. */
    @memoize
    get hasReferences(): boolean {
        return !!getNativeClassHasReferences()(this);
    }

    /** Determines whether the current class has a valid static constructor. */
    @memoize
    get hasStaticConstructor(): boolean {
        const staticConstructor = this.tryMethod('.cctor');
        return staticConstructor != null && !staticConstructor.virtualAddress.isNull();
    }

    /** Gets the image in which the current class is defined. */
    @memoize
    get image(): Image {
        return new Image(getNativeClassGetImage()(this));
    }

    /** Gets the size of the instance of the current class. */
    @memoize
    get instanceSize(): number {
        return getNativeClassGetInstanceSize()(this);
    }

    /** Determines whether the current class is abstract. */
    @memoize
    get isAbstract(): boolean {
        return !!getNativeClassIsAbstract()(this);
    }

    /** Determines whether the current class is blittable. */
    @memoize
    get isBlittable(): boolean {
        return !!getNativeClassIsBlittable()(this);
    }

    @memoize
    get _isEnum(): boolean {
        return !!getNativeClassIsEnum()(this);
    }

    /** Determines whether the current class is a generic one. */
    @memoize
    get isGeneric(): boolean {
        return !!getNativeClassIsGeneric()(this);
    }

    /** Determines whether the current class is inflated. */
    @memoize
    get isInflated(): boolean {
        return !!getNativeClassIsInflated()(this);
    }

    /** Determines whether the current class is an interface. */
    @memoize
    get isInterface(): boolean {
        return !!getNativeClassIsInterface()(this);
    }

    /** Determines whether the current class is a struct. */
    get isStruct(): boolean {
        return this._isValueType && !this._isEnum;
    }

    /** Determines whether the current class is a value type. */
    @memoize
    get _isValueType(): boolean {
        return !!getNativeClassIsValueType()(this);
    }

    isValueType(): this is ValueTypeClass<T> {
        return this._isValueType;
    }

    /** Gets the interfaces implemented or inherited by the current class. */
    @memoize
    get interfaces(): Class[] {
        return readNativeIterator(_ => getNativeClassGetInterfaces()(this, _)).map(
            _ => new Class(_)
        );
    }

    /** Gets the methods implemented by the current class. */
    @memoize
    get methods(): Method[] {
        return readNativeIterator(_ => getNativeClassGetMethods()(this, _)).map(_ => new Method(_));
    }

    /** Gets the name of the current class. */
    @memoize
    get name() {
        return getNativeClassGetName()(this).readUtf8String()!;
    }

    /** Gets the namespace of the current class. */
    @memoize
    get namespace(): string {
        return getNativeClassGetNamespace()(this).readUtf8String()!;
    }

    /** Gets the classes nested inside the current class. */
    @memoize
    get nestedClasses(): Class[] {
        return readNativeIterator(_ => getNativeClassGetNestedClasses()(this, _)).map(
            _ => new Class(_)
        );
    }

    /** Gets the class from which the current class directly inherits. */
    @memoize
    get parent(): Class | null {
        return new Class(getNativeClassGetParent()(this)).asNullable();
    }

    /** Gets the rank (number of dimensions) of the current array class. */
    @memoize
    get rank(): number {
        let rank = 0;
        const name = this.name;

        for (let i = this.name.length - 1; i > 0; i--) {
            const c = name[i];

            if (c == ']') rank++;
            else if (c == '[' || rank == 0) break;
            else if (c == ',') rank++;
            else break;
        }

        return rank;
    }

    /** Gets a pointer to the static fields of the current class. */
    @memoize
    get staticFieldsData(): NativePointer {
        return getNativeClassGetStaticFieldData()(this);
    }

    /** Gets the size of the instance - as a value type - of the current class. */
    @memoize
    get valueTypeSize(): number {
        // il2cpp_class_value_size returns `-8` for pointer types, so we need to handle it separately
        if (this.type.isPointer()) {
            return Process.pointerSize;
        }
        return getNativeClassGetValueTypeSize()(this, NULL);
    }

    /** Allocates a new object of the current class. */
    alloc(): Object_ {
        return new Object_(getNativeObjectNew()(this));
    }

    /** Gets the field identified by the given name. */
    field<T extends Il2CppValue>(name: string): Field<T> {
        return (
            this.tryField<T>(name) ??
            raise(`couldn't find field ${name} in class ${this.type.name}`)
        );
    }

    /** Builds a generic instance of the current generic class. */
    inflate(...classes: Class[]): Class {
        if (!this.isGeneric) {
            raise(`cannot inflate class ${this.type.name} as it has no generic parameters`);
        }

        if (this.generics.length != classes.length) {
            raise(
                `cannot inflate class ${this.type.name} as it needs ${this.generics.length} generic parameter(s), not ${classes.length}`
            );
        }

        const types = classes.map(_ => _.type.runtimeType);
        const typeArray = array(getCorlib().class('System.RuntimeType'), types);

        const inflatedType = this.type.runtimeType
            .method<Object_>('MakeGenericType', 1)
            .invoke(typeArray);
        return new Class(getNativeClassFromSystemType()(inflatedType));
    }

    /** Calls the static constructor of the current class. */
    initialize(): Class {
        getNativeClassInitialize()(this);
        return this;
    }

    /** Determines whether an instance of `other` class can be assigned to a variable of the current type. */
    isAssignableFrom(other: Class): boolean {
        return !!getNativeClassIsAssignableFrom()(this, other);
    }

    /** Determines whether the current class derives from `other` class. */
    isSubclassOf(other: Class, checkInterfaces: boolean): boolean {
        return !!getNativeClassIsSubclassOf()(this, other, +checkInterfaces);
    }

    /** Gets the method identified by the given name and parameter count. */
    method<T extends MethodReturnType>(name: string, parameterCount: number = -1): Method<T> {
        return (
            this.tryMethod<T>(name, parameterCount) ??
            raise(`couldn't find method ${name} in class ${this.type.name}`)
        );
    }

    methodForSignature<T extends MethodReturnType>(name: string, ...paramTypes: Type[]): Method<T> {
        return (
            this.tryMethodForSignature<T>(name, ...paramTypes) ??
            raise(
                `couldn't find method ${name} in class ${this.type.name} for parameter types [${paramTypes.map(_ => _.name).join(', ')}]`
            )
        );
    }

    methodForValues<T extends MethodReturnType>(
        name: string,
        ...paramValues: ParameterLike[]
    ): Method<T> {
        return (
            this.tryMethodForValues<T>(name, ...paramValues) ??
            raise(
                `couldn't find method ${name} in class ${this.type.name} for parameter values [${paramValues.join(', ')}]`
            )
        );
    }

    /** Gets the nested class with the given name. */
    nested(name: string): Class {
        return (
            this.tryNested(name) ??
            raise(`couldn't find nested class ${name} in class ${this.type.name}`)
        );
    }

    /** Allocates a new object of the current class and calls its default constructor. */
    defaultNew(): Object_ {
        const object = this.alloc();

        const exceptionArray = Memory.alloc(Process.pointerSize);

        getNativeObjectInitializeException()(object, exceptionArray);

        const exception = exceptionArray.readPointer();

        if (!exception.isNull()) {
            raise(new Object_(exception).toString());
        }

        return object;
    }

    /**
     * Finds the best fit constructor given the parameter types.
     * Doesn't cover constructors with default parameters – all parameters must be provided.
     *
     * In case of value types, returns unboxed value type.
     */
    new(...parameters: ParameterLike[]): Object_ {
        if (parameters.length == 0) return this.defaultNew();

        const object = this.alloc();
        object.m['.ctor'](...parameters);

        return object;
    }

    /** Gets the field with the given name. */
    tryField<T extends Il2CppValue>(name: string): Field<T> | null {
        return new Field<T>(
            getNativeClassGetFieldFromName()(this, Memory.allocUtf8String(name))
        ).asNullable();
    }

    /** Gets the method with the given name and parameter count. */
    tryMethod<T extends MethodReturnType>(
        name: string,
        parameterCount: number = -1
    ): Method<T> | null {
        return new Method<T>(
            getNativeClassGetMethodFromName()(this, Memory.allocUtf8String(name), parameterCount)
        ).asNullable();
    }

    tryMethodForSignature<T extends MethodReturnType>(
        name: string,
        ...paramTypes: Type[]
    ): Method<T> | undefined {
        return this.methods.find(
            m =>
                m.name == name &&
                // TODO look into default parameters, lengths might differ?
                m.parameters.length == paramTypes.length &&
                m.parameters.every((p, i) => p.type.isAssignableFromType(paramTypes[i]))
        ) as Method<T> | undefined;
    }

    tryMethodForValues<T extends MethodReturnType>(
        name: string,
        ...paramValues: ParameterLike[]
    ): Method<T> | undefined {
        return this.methods.find(
            m =>
                m.name == name &&
                // TODO look into default parameters, lengths might differ?
                m.parameters.length == paramValues.length &&
                m.parameters.every((p, i) => p.type.isAssignableFromValue(paramValues[i]))
        ) as Method<T> | undefined;
    }

    /** Gets the nested class with the given name. */
    tryNested(name: string): Class | undefined {
        return this.nestedClasses.find(_ => _.name == name);
    }

    @memoize
    get m(): DynamicMethods {
        return DynamicMethodsLookup.from(this, true);
    }

    @memoize
    get f(): DynamicFields {
        return DynamicFieldsLookup.from(this, true);
    }

    /** Executes a callback for every defined class. */
    static enumerate(block: (klass: Class) => void): void {
        const callback = new NativeCallback(_ => block(new Class(_)), 'void', [
            'pointer',
            'pointer',
        ]);
        return getNativeClassForEach()(callback, NULL);
    }

    /**
     * TODO assess need fot this function, maybe remove
     * Il2cpp lookup is a bit inconsistent. Sometimes it uses type name, sometimes class name.
     * - Generics must be formatted class-style: "System.ReadOnlySpan`1"
     */
    formatForLookup() {
        let name = `${this.namespace}.${this.name}`;

        if (this.generics.length > 0) name += '`' + this.generics.length;
        // TODO format arrays and pointers if needed

        return name;
    }
}

export type PrimitiveClass =
    | typeof System.Void
    | typeof System.Boolean
    | typeof System.SByte
    | typeof System.Byte
    | typeof System.Char
    | typeof System.Int16
    | typeof System.UInt16
    | typeof System.Int32
    | typeof System.UInt32
    | typeof System.Int64
    | typeof System.UInt64
    | typeof System.Single
    | typeof System.Double
    | typeof System.IntPtr
    | typeof System.UIntPtr;

export type ValueTypeClass<T extends string = string> = Class<T> & {
    typeEnum: TypeEnum.VALUE_TYPE;
};

export type ReferenceTypeClass<T extends string = string> = Class<T> & {
    typeEnum: TypeEnum.REFERENCE_TYPE;
};

export type EnumClass<T extends string = string> = Class<T> & {
    typeEnum: TypeEnum.ENUM;
};

export type PointerClass<T> = T extends `${string}*`
    ? Class<T> & {
          typeEnum: TypeEnum.POINTER;
      }
    : never;

// TODO look into multidimensional arrays
export type ArrayClass<T> = T extends `${string}[]`
    ? Class<T> & {
          typeEnum: TypeEnum.ARRAY;
      }
    : never;
