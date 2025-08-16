import { TypeAttributeFlags } from '../enums/type-attribute.js';
import { TypeEnum } from '../enums/type.js';
import { raise } from '../utils/console.js';
import { cached } from '../utils/cache.js';
import { NativeStruct } from '../utils/native-struct.js';
import { recycle } from '../utils/recycle.js';
import { Image } from './image.js';
import {
    nativeArrayGetClass,
    nativeClassForEach,
    nativeClassFromSystemType,
    nativeClassGetArrayElementSize,
    nativeClassGetAssemblyName,
    nativeClassGetBaseType,
    nativeClassGetDeclaringType,
    nativeClassGetElementClass,
    nativeClassGetFieldFromName,
    nativeClassGetFields,
    nativeClassGetFlags,
    nativeClassGetImage,
    nativeClassGetInstanceSize,
    nativeClassGetInterfaces,
    nativeClassGetMethodFromName,
    nativeClassGetMethods,
    nativeClassGetName,
    nativeClassGetNamespace,
    nativeClassGetNestedClasses,
    nativeClassGetParent,
    nativeClassGetStaticFieldData,
    nativeClassGetType,
    nativeClassGetValueTypeSize,
    nativeClassHasReferences,
    nativeClassInitialize,
    nativeClassIsAbstract,
    nativeClassIsAssignableFrom,
    nativeClassIsBlittable,
    nativeClassIsEnum,
    nativeClassIsGeneric,
    nativeClassIsInflated,
    nativeClassIsInterface,
    nativeClassIsSubclassOf,
    nativeClassIsValueType,
    nativeObjectInitializeException,
    nativeObjectNew,
} from '../native/index.js';
import { Type } from './type.js';
import { Field } from './field.js';
import { readNativeIterator } from '../utils/read-native-iterator.js';
import { Object_ } from './object.js';
import { Method, MethodReturnType } from './method.js';
import { Il2CppValue, ParameterLike } from '../memory.js';
import { Array, array } from './array.js';
import { DynamicMethods, DynamicMethodsLookup } from './common/dynamic-methods.js';
import { DynamicFields, DynamicFieldsLookup } from './common/dynamic-fields.js';
import { StripArraySuffix } from '../utils/type-helpers.js';
import { corlib } from '../corlib.js';

@recycle
export class Class<T extends string = string> extends NativeStruct {
    constructor(native: NativePointerValue) {
        super(native);

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

    toString(): string {
        return `${this.image.assembly.name}::${this.fullName}`;
    }

    /** Gets the array class which encompass the current class. */
    @cached
    get arrayClass(): Class {
        return new Class(nativeArrayGetClass(this, 1));
    }

    /** Gets the size of the object encompassed by the current array class. */
    @cached
    get arrayElementSize(): number {
        return nativeClassGetArrayElementSize(this);
    }

    /** Gets the name of the assembly in which the current class is defined. */
    @cached
    get assemblyName(): string {
        return nativeClassGetAssemblyName(this).readUtf8String()!.replace('.dll', '');
    }

    /** Gets the class that declares the current nested class. */
    @cached
    get declaringClass(): Class | null {
        return new Class(nativeClassGetDeclaringType(this)).asNullable();
    }

    /** Declaring classes hierarchy, from inner to outer most */
    @cached
    get declaringClasses(): Class[] {
        const classes: Class[] = [this];
        while (classes[classes.length - 1].declaringClass) {
            classes.push(classes[classes.length - 1].declaringClass!);
        }
        classes.shift();
        return classes;
    }

    /** Gets the encompassed type of this array, reference, pointer or enum type. */
    @cached
    get baseType(): Type | null {
        return new Type(nativeClassGetBaseType(this)).asNullable();
    }

    /**
     * Gets the class of the object encompassed or referred to by the current array, pointer or reference class.
     *
     * Examples:
     *   `System.Int32[]` -> `System.Int32`
     *   `System.Byte&` -> `System.Byte`
     *   `System.String` -> `System.String`
     */
    @cached
    get elementClass(): Class | null {
        return new Class(nativeClassGetElementClass(this)).asNullable();
    }

    /** Gets the fields of the current class. */
    @cached
    get fields(): Field[] {
        return readNativeIterator(_ => nativeClassGetFields(this, _)).map(_ => new Field(_));
    }

    @cached
    get flags() {
        return {
            isInterface: !!(this.flagsRaw & TypeAttributeFlags.INTERFACE),
            isAbstract: !!(this.flagsRaw & TypeAttributeFlags.ABSTRACT),
            isSealed: !!(this.flagsRaw & TypeAttributeFlags.SEALED),
            isSpecialName: !!(this.flagsRaw & TypeAttributeFlags.SPECIAL_NAME),
        };
    }

    /** Gets the flags of the current class. */
    @cached
    get flagsRaw(): number {
        return nativeClassGetFlags(this);
    }

    /** Gets the full name (namespace + name) of the current class. */
    @cached
    get fullName(): string {
        return this.namespace ? `${this.namespace}.${this.name}` : this.name;
    }

    /** Gets the generics parameters of this generic class. */
    @cached
    get generics(): Class[] {
        if (!this.isGeneric && !this.isInflated) {
            return [];
        }

        const types = this.type.runtimeType.method<Array<Object_>>('GetGenericArguments').invoke();
        return globalThis.Array.from(types).map(_ => new Class(nativeClassFromSystemType(_)));
    }

    /** Determines whether the GC has tracking references to the current class instances. */
    @cached
    get hasReferences(): boolean {
        return !!nativeClassHasReferences(this);
    }

    /** Determines whether ther current class has a valid static constructor. */
    @cached
    get hasStaticConstructor(): boolean {
        const staticConstructor = this.tryMethod('.cctor');
        return staticConstructor != null && !staticConstructor.virtualAddress.isNull();
    }

    /** Gets the image in which the current class is defined. */
    @cached
    get image(): Image {
        return new Image(nativeClassGetImage(this));
    }

    /** Gets the size of the instance of the current class. */
    @cached
    get instanceSize(): number {
        return nativeClassGetInstanceSize(this);
    }

    /** Determines whether the current class is abstract. */
    @cached
    get isAbstract(): boolean {
        return !!nativeClassIsAbstract(this);
    }

    /** Determines whether the current class is blittable. */
    @cached
    get isBlittable(): boolean {
        return !!nativeClassIsBlittable(this);
    }

    @cached
    get _isEnum(): boolean {
        return !!nativeClassIsEnum(this);
    }

    /** Determines whether the current class is a generic one. */
    @cached
    get isGeneric(): boolean {
        return !!nativeClassIsGeneric(this);
    }

    /** Determines whether the current class is inflated. */
    @cached
    get isInflated(): boolean {
        return !!nativeClassIsInflated(this);
    }

    /** Determines whether the current class is an interface. */
    @cached
    get isInterface(): boolean {
        return !!nativeClassIsInterface(this);
    }

    /** Determines whether the current class is a struct. */
    get isStruct(): boolean {
        return this._isValueType && !this._isEnum;
    }

    /** Determines whether the current class is a value type. */
    @cached
    get _isValueType(): boolean {
        return !!nativeClassIsValueType(this);
    }

    isValueType(): this is ValueTypeClass<T> {
        return this._isValueType;
    }

    /** Gets the interfaces implemented or inherited by the current class. */
    @cached
    get interfaces(): Class[] {
        return readNativeIterator(_ => nativeClassGetInterfaces(this, _)).map(_ => new Class(_));
    }

    /** Gets the methods implemented by the current class. */
    @cached
    get methods(): Method[] {
        return readNativeIterator(_ => nativeClassGetMethods(this, _)).map(_ => new Method(_));
    }

    /** Gets the name of the current class. */
    @cached
    get name(): string {
        return nativeClassGetName(this).readUtf8String()!;
    }

    /** Gets the namespace of the current class. */
    @cached
    get namespace(): string {
        return nativeClassGetNamespace(this).readUtf8String()!;
    }

    /** Gets the classes nested inside the current class. */
    @cached
    get nestedClasses(): Class[] {
        return readNativeIterator(_ => nativeClassGetNestedClasses(this, _)).map(_ => new Class(_));
    }

    /** Gets the class from which the current class directly inherits. */
    @cached
    get parent(): Class | null {
        return new Class(nativeClassGetParent(this)).asNullable();
    }

    /** Gets the rank (number of dimensions) of the current array class. */
    @cached
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
    @cached
    get staticFieldsData(): NativePointer {
        return nativeClassGetStaticFieldData(this);
    }

    /** Gets the size of the instance - as a value type - of the current class. */
    @cached
    get valueTypeSize(): number {
        return nativeClassGetValueTypeSize(this, NULL);
    }

    /** Gets the type of the current class. */
    @cached
    get type(): Type<T> {
        return new Type<T>(nativeClassGetType(this));
    }

    /** Allocates a new object of the current class. */
    alloc(): Object_ {
        return new Object_(nativeObjectNew(this));
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
        const typeArray = array(corlib.class('System.RuntimeType'), types);

        const inflatedType = this.type.runtimeType
            .method<Object_>('MakeGenericType', 1)
            .invoke(typeArray);
        return new Class(nativeClassFromSystemType(inflatedType));
    }

    /** Calls the static constructor of the current class. */
    initialize(): Class {
        nativeClassInitialize(this);
        return this;
    }

    /** Determines whether an instance of `other` class can be assigned to a variable of the current type. */
    isAssignableFrom(other: Class): boolean {
        return !!nativeClassIsAssignableFrom(this, other);
    }

    /** Determines whether the current class derives from `other` class. */
    isSubclassOf(other: Class, checkInterfaces: boolean): boolean {
        return !!nativeClassIsSubclassOf(this, other, +checkInterfaces);
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

        nativeObjectInitializeException(object, exceptionArray);

        const exception = exceptionArray.readPointer();

        if (!exception.isNull()) {
            raise(new Object_(exception).toString());
        }

        return object;
    }

    /**
     * Finds the best fit constructor given the parameter types.
     * Doesn't cover constructors with default parameters – all parameters must be provided.
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
            nativeClassGetFieldFromName(this, Memory.allocUtf8String(name))
        ).asNullable();
    }

    /** Gets the method with the given name and parameter count. */
    tryMethod<T extends MethodReturnType>(
        name: string,
        parameterCount: number = -1
    ): Method<T> | null {
        return new Method<T>(
            nativeClassGetMethodFromName(this, Memory.allocUtf8String(name), parameterCount)
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

    @cached
    get m(): DynamicMethods {
        return DynamicMethodsLookup.from(this, true);
    }

    @cached
    get f(): DynamicFields {
        return DynamicFieldsLookup.from(this, true);
    }

    /** Executes a callback for every defined class. */
    static enumerate(block: (klass: Class) => void): void {
        const callback = new NativeCallback(_ => block(new Class(_)), 'void', [
            'pointer',
            'pointer',
        ]);
        return nativeClassForEach(callback, NULL);
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

export type ValueTypeClass<T extends string = string> = Class<T> & {
    _typeEnum: TypeEnum.VALUE_TYPE;
};

export type ReferenceTypeClass<T extends string = string> = Class<T> & {
    _typeEnum: TypeEnum.REFERENCE_TYPE;
};

export type EnumClass<T extends string = string> = Class<T> & {
    _typeEnum: TypeEnum.ENUM;
};

// TODO investigate whether pointer and by-ref classes have any special properties
export type PointerClass<T extends `${string}*`> = Class<T> & {
    _typeEnum: TypeEnum.POINTER;
};

export type ByRefClass<T extends `${string}&`> = Class<T> & {
    _typeEnum: TypeEnum.BY_REF;
};

// TODO look into multidimensional arrays
export type ArrayClass<T extends `${string}[]`> = Class<T> & {
    // TODO make these not crash in non-array classes (and instead return nullable)
    arrayElementSize: number;
    elementClass: Class<StripArraySuffix<T>>;
    _typeEnum: TypeEnum.ARRAY;
};
