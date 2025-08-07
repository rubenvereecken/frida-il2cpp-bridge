namespace Il2Cpp {
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

        /** Gets the actual size of the instance of the current class. */
        get actualInstanceSize(): number {
            const SystemString = Il2Cpp.corlib.class('System.String');

            // prettier-ignore
            const offset = SystemString.handle.offsetOf(_ => _.readInt() == Il2Cpp.System.String.instanceSize - 2) 
                ?? raise("couldn't find the actual instance size offset in the native class struct");

            // prettier-ignore
            getter(Il2Cpp.Class.prototype, "actualInstanceSize", function (this: Il2Cpp.Class) {
                return this.handle.add(offset).readS32();
            }, lazy);

            return this.actualInstanceSize;
        }

        /** Gets the array class which encompass the current class. */
        @lazy
        get arrayClass(): Il2Cpp.Class {
            return new Il2Cpp.Class(Il2Cpp.exports.arrayGetClass(this, 1));
        }

        /** Gets the size of the object encompassed by the current array class. */
        @lazy
        get arrayElementSize(): number {
            return Il2Cpp.exports.classGetArrayElementSize(this);
        }

        /** Gets the name of the assembly in which the current class is defined. */
        @lazy
        get assemblyName(): string {
            return Il2Cpp.exports.classGetAssemblyName(this).readUtf8String()!.replace('.dll', '');
        }

        /** Gets the class that declares the current nested class. */
        @lazy
        get declaringClass(): Il2Cpp.Class | null {
            return new Il2Cpp.Class(Il2Cpp.exports.classGetDeclaringType(this)).asNullable();
        }

        /** Declaring classes hierarchy, from inner to outer most */
        @lazy
        get declaringClasses(): Il2Cpp.Class[] {
            const classes: Il2Cpp.Class[] = [this];
            while (classes[classes.length - 1].declaringClass) {
                classes.push(classes[classes.length - 1].declaringClass!);
            }
            classes.shift();
            return classes;
        }

        /** Gets the encompassed type of this array, reference, pointer or enum type. */
        @lazy
        get baseType(): Il2Cpp.Type | null {
            return new Il2Cpp.Type(Il2Cpp.exports.classGetBaseType(this)).asNullable();
        }

        /**
         * Gets the class of the object encompassed or referred to by the current array, pointer or reference class.
         *
         * Examples:
         *   `System.Int32[]` -> `System.Int32`
         *   `System.Byte&` -> `System.Byte`
         *   `System.String` -> `System.String`
         */
        @lazy
        get elementClass(): Il2Cpp.Class | null {
            return new Il2Cpp.Class(Il2Cpp.exports.classGetElementClass(this)).asNullable();
        }

        /** Gets the fields of the current class. */
        @lazy
        get fields(): Il2Cpp.Field[] {
            return readNativeIterator(_ => Il2Cpp.exports.classGetFields(this, _)).map(
                _ => new Il2Cpp.Field(_)
            );
        }

        @lazy
        get flags() {
            return {
                isInterface: !!(this.flagsRaw & Il2Cpp.Class.Attributes.INTERFACE),
                isAbstract: !!(this.flagsRaw & Il2Cpp.Class.Attributes.ABSTRACT),
                isSealed: !!(this.flagsRaw & Il2Cpp.Class.Attributes.SEALED),
                isSpecialName: !!(this.flagsRaw & Il2Cpp.Class.Attributes.SPECIAL_NAME),
            };
        }

        /** Gets the flags of the current class. */
        @lazy
        get flagsRaw(): number {
            return Il2Cpp.exports.classGetFlags(this);
        }

        /** Gets the full name (namespace + name) of the current class. */
        @lazy
        get fullName(): string {
            return this.namespace ? `${this.namespace}.${this.name}` : this.name;
        }

        /** Gets the generics parameters of this generic class. */
        @lazy
        get generics(): Il2Cpp.Class[] {
            if (!this.isGeneric && !this.isInflated) {
                return [];
            }

            const types = this.type.runtimeType
                .method<Il2Cpp.Array<Il2Cpp.Object_>>('GetGenericArguments')
                .invoke();
            return globalThis.Array.from(types).map(
                _ => new Il2Cpp.Class(Il2Cpp.exports.classFromSystemType(_))
            );
        }

        /** Determines whether the GC has tracking references to the current class instances. */
        @lazy
        get hasReferences(): boolean {
            return !!Il2Cpp.exports.classHasReferences(this);
        }

        /** Determines whether ther current class has a valid static constructor. */
        @lazy
        get hasStaticConstructor(): boolean {
            const staticConstructor = this.tryMethod('.cctor');
            return staticConstructor != null && !staticConstructor.virtualAddress.isNull();
        }

        /** Gets the image in which the current class is defined. */
        @lazy
        get image(): Il2Cpp.Image {
            return new Il2Cpp.Image(Il2Cpp.exports.classGetImage(this));
        }

        /** Gets the size of the instance of the current class. */
        @lazy
        get instanceSize(): number {
            return Il2Cpp.exports.classGetInstanceSize(this);
        }

        /** Determines whether the current class is abstract. */
        @lazy
        get isAbstract(): boolean {
            return !!Il2Cpp.exports.classIsAbstract(this);
        }

        /** Determines whether the current class is blittable. */
        @lazy
        get isBlittable(): boolean {
            return !!Il2Cpp.exports.classIsBlittable(this);
        }

        @lazy
        get _isEnum(): boolean {
            return !!Il2Cpp.exports.classIsEnum(this);
        }

        /** Determines whether the current class is a generic one. */
        @lazy
        get isGeneric(): boolean {
            return !!Il2Cpp.exports.classIsGeneric(this);
        }

        /** Determines whether the current class is inflated. */
        @lazy
        get isInflated(): boolean {
            return !!Il2Cpp.exports.classIsInflated(this);
        }

        /** Determines whether the current class is an interface. */
        @lazy
        get isInterface(): boolean {
            return !!Il2Cpp.exports.classIsInterface(this);
        }

        /** Determines whether the current class is a struct. */
        get isStruct(): boolean {
            return this._isValueType && !this._isEnum;
        }

        /** Determines whether the current class is a value type. */
        @lazy
        get _isValueType(): boolean {
            return !!Il2Cpp.exports.classIsValueType(this);
        }

        isValueType(): this is Il2Cpp.ValueTypeClass<T> {
            return this._isValueType;
        }

        /** Gets the interfaces implemented or inherited by the current class. */
        @lazy
        get interfaces(): Il2Cpp.Class[] {
            return readNativeIterator(_ => Il2Cpp.exports.classGetInterfaces(this, _)).map(
                _ => new Il2Cpp.Class(_)
            );
        }

        /** Gets the methods implemented by the current class. */
        @lazy
        get methods(): Il2Cpp.Method[] {
            return readNativeIterator(_ => Il2Cpp.exports.classGetMethods(this, _)).map(
                _ => new Il2Cpp.Method(_)
            );
        }

        /** Gets the name of the current class. */
        @lazy
        get name(): string {
            return Il2Cpp.exports.classGetName(this).readUtf8String()!;
        }

        /** Gets the namespace of the current class. */
        @lazy
        get namespace(): string {
            return Il2Cpp.exports.classGetNamespace(this).readUtf8String()!;
        }

        /** Gets the classes nested inside the current class. */
        @lazy
        get nestedClasses(): Il2Cpp.Class[] {
            return readNativeIterator(_ => Il2Cpp.exports.classGetNestedClasses(this, _)).map(
                _ => new Il2Cpp.Class(_)
            );
        }

        /** Gets the class from which the current class directly inherits. */
        @lazy
        get parent(): Il2Cpp.Class | null {
            return new Il2Cpp.Class(Il2Cpp.exports.classGetParent(this)).asNullable();
        }

        /** Gets the rank (number of dimensions) of the current array class. */
        @lazy
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
        @lazy
        get staticFieldsData(): NativePointer {
            return Il2Cpp.exports.classGetStaticFieldData(this);
        }

        /** Gets the size of the instance - as a value type - of the current class. */
        @lazy
        get valueTypeSize(): number {
            return Il2Cpp.exports.classGetValueTypeSize(this, NULL);
        }

        /** Gets the type of the current class. */
        @lazy
        get type(): Il2Cpp.Type<T> {
            return new Il2Cpp.Type<T>(Il2Cpp.exports.classGetType(this));
        }

        /** Allocates a new object of the current class. */
        alloc(): Il2Cpp.Object_ {
            return new Il2Cpp.Object_(Il2Cpp.exports.objectNew(this));
        }

        /** Gets the field identified by the given name. */
        field<T extends Il2Cpp.Il2CppValue>(name: string): Il2Cpp.Field<T> {
            return (
                this.tryField<T>(name) ??
                raise(`couldn't find field ${name} in class ${this.type.name}`)
            );
        }

        /** Builds a generic instance of the current generic class. */
        inflate(...classes: Il2Cpp.Class[]): Il2Cpp.Class {
            if (!this.isGeneric) {
                raise(`cannot inflate class ${this.type.name} as it has no generic parameters`);
            }

            if (this.generics.length != classes.length) {
                raise(
                    `cannot inflate class ${this.type.name} as it needs ${this.generics.length} generic parameter(s), not ${classes.length}`
                );
            }

            const types = classes.map(_ => _.type.runtimeType);
            const typeArray = Il2Cpp.array(Il2Cpp.corlib.class('System.Type'), types);

            const inflatedType = this.type.runtimeType
                .method<Il2Cpp.Object_>('MakeGenericType', 1)
                .invoke(typeArray);
            return new Il2Cpp.Class(Il2Cpp.exports.classFromSystemType(inflatedType));
        }

        /** Calls the static constructor of the current class. */
        initialize(): Il2Cpp.Class {
            Il2Cpp.exports.classInitialize(this);
            return this;
        }

        /** Determines whether an instance of `other` class can be assigned to a variable of the current type. */
        isAssignableFrom(other: Il2Cpp.Class): boolean {
            return !!Il2Cpp.exports.classIsAssignableFrom(this, other);
        }

        /** Determines whether the current class derives from `other` class. */
        isSubclassOf(other: Il2Cpp.Class, checkInterfaces: boolean): boolean {
            return !!Il2Cpp.exports.classIsSubclassOf(this, other, +checkInterfaces);
        }

        /** Gets the method identified by the given name and parameter count. */
        method<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            parameterCount: number = -1
        ): Il2Cpp.Method<T> {
            return (
                this.tryMethod<T>(name, parameterCount) ??
                raise(`couldn't find method ${name} in class ${this.type.name}`)
            );
        }

        methodForSignature<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            ...paramTypes: Il2Cpp.Type[]
        ): Il2Cpp.Method<T> {
            return (
                this.tryMethodForSignature<T>(name, ...paramTypes) ??
                raise(
                    `couldn't find method ${name} in class ${this.type.name} for parameter types [${paramTypes.map(_ => _.name).join(', ')}]`
                )
            );
        }

        methodForValues<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            ...paramValues: Il2Cpp.Parameter.Value[]
        ): Il2Cpp.Method<T> {
            return (
                this.tryMethodForValues<T>(name, ...paramValues) ??
                raise(
                    `couldn't find method ${name} in class ${this.type.name} for parameter values [${paramValues.join(', ')}]`
                )
            );
        }

        /** Gets the nested class with the given name. */
        nested(name: string): Il2Cpp.Class {
            return (
                this.tryNested(name) ??
                raise(`couldn't find nested class ${name} in class ${this.type.name}`)
            );
        }

        /** Allocates a new object of the current class and calls its default constructor. */
        defaultNew(): Il2Cpp.Object_ {
            const object = this.alloc();

            const exceptionArray = Memory.alloc(Process.pointerSize);

            Il2Cpp.exports.objectInitializeException(object, exceptionArray);

            const exception = exceptionArray.readPointer();

            if (!exception.isNull()) {
                raise(new Il2Cpp.Object_(exception).toString());
            }

            return object;
        }

        /**
         * Finds the best fit constructor given the parameter types.
         * Doesn't cover constructors with default parameters – all parameters must be provided.
         */
        new(
            ...parameters: (Il2Cpp.Parameter.TypedValue | Il2Cpp.Parameter.Value)[]
        ): Il2Cpp.Object_ {
            if (parameters.length == 0) return this.defaultNew();

            const object = this.alloc();
            object.m['.ctor'](...parameters);

            return object;
        }

        /** Gets the field with the given name. */
        tryField<T extends Il2Cpp.Il2CppValue>(name: string): Il2Cpp.Field<T> | null {
            return new Il2Cpp.Field<T>(
                Il2Cpp.exports.classGetFieldFromName(this, Memory.allocUtf8String(name))
            ).asNullable();
        }

        /** Gets the method with the given name and parameter count. */
        tryMethod<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            parameterCount: number = -1
        ): Il2Cpp.Method<T> | null {
            return new Il2Cpp.Method<T>(
                Il2Cpp.exports.classGetMethodFromName(
                    this,
                    Memory.allocUtf8String(name),
                    parameterCount
                )
            ).asNullable();
        }

        tryMethodForSignature<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            ...paramTypes: Il2Cpp.Type[]
        ): Il2Cpp.Method<T> | undefined {
            return this.methods.find(
                m =>
                    m.name == name &&
                    // TODO look into default parameters, lengths might differ?
                    m.parameters.length == paramTypes.length &&
                    m.parameters.every((p, i) => p.type.isAssignableFromType(paramTypes[i]))
            ) as Il2Cpp.Method<T> | undefined;
        }

        tryMethodForValues<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            ...paramValues: Il2Cpp.Parameter.Value[]
        ): Il2Cpp.Method<T> | undefined {
            return this.methods.find(
                m =>
                    m.name == name &&
                    // TODO look into default parameters, lengths might differ?
                    m.parameters.length == paramValues.length &&
                    m.parameters.every((p, i) => p.type.isAssignableFromValue(paramValues[i]))
            ) as Il2Cpp.Method<T> | undefined;
        }

        /** Gets the nested class with the given name. */
        tryNested(name: string): Il2Cpp.Class | undefined {
            return this.nestedClasses.find(_ => _.name == name);
        }

        @lazy
        get m(): Il2Cpp.DynamicMethods {
            return Il2Cpp.DynamicMethodsLookup.from(this, true);
        }

        @lazy
        get f(): Il2Cpp.DynamicFields {
            return Il2Cpp.DynamicFieldsLookup.from(this, true);
        }

        /** Executes a callback for every defined class. */
        static enumerate(block: (klass: Il2Cpp.Class) => void): void {
            const callback = new NativeCallback(_ => block(new Il2Cpp.Class(_)), 'void', [
                'pointer',
                'pointer',
            ]);
            return Il2Cpp.exports.classForEach(callback, NULL);
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

    export type VoidClass = Il2Cpp.Class<'System.Void'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.VOID;
    };

    export type BooleanClass = Il2Cpp.Class<'System.Boolean'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.BOOLEAN;
    };

    export type CharClass = Il2Cpp.Class<'System.Char'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.CHAR;
    };

    export type ByteClass = Il2Cpp.Class<'System.SByte'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.BYTE;
    };

    export type UnsignedByteClass = Il2Cpp.Class<'System.Byte'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.UNSIGNED_BYTE;
    };

    export type ShortClass = Il2Cpp.Class<'System.Int16'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.SHORT;
    };

    export type UnsignedShortClass = Il2Cpp.Class<'System.UInt16'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.UNSIGNED_SHORT;
    };

    export type IntClass = Il2Cpp.Class<'System.Int32'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.INT;
    };

    export type UnsignedIntClass = Il2Cpp.Class<'System.UInt32'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.UNSIGNED_INT;
    };

    export type LongClass = Il2Cpp.Class<'System.Int64'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.LONG;
    };

    export type UnsignedLongClass = Il2Cpp.Class<'System.UInt64'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.UNSIGNED_LONG;
    };

    export type FloatClass = Il2Cpp.Class<'System.Single'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.FLOAT;
    };

    export type DoubleClass = Il2Cpp.Class<'System.Double'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.DOUBLE;
    };

    export type StringClass = Il2Cpp.Class<'System.String'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.STRING;
    };

    export type NativePointerClass = Il2Cpp.Class<'System.IntPtr'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.NATIVE_POINTER;
    };

    export type UnsignedNativePointerClass = Il2Cpp.Class<'System.UIntPtr'> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.UNSIGNED_NATIVE_POINTER;
    };

    export type ValueTypeClass<T extends string = string> = Il2Cpp.Class<T> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.VALUE_TYPE;
    };

    export type ReferenceTypeClass<T extends string = string> = Il2Cpp.Class<T> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.REFERENCE_TYPE;
    };

    export type EnumClass<T extends string = string> = Il2Cpp.Class<T> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.ENUM;
    };

    // TODO investigate whether pointer and by-ref classes have any special properties
    export type PointerClass<T extends `${string}*`> = Il2Cpp.Class<T> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.POINTER;
    };

    export type ByRefClass<T extends `${string}&`> = Il2Cpp.Class<T> & {
        _typeEnum: typeof Il2Cpp.TypeEnum.BY_REF;
    };

    // TODO look into multidimensional arrays
    export type ArrayClass<T extends `${string}[]`> = Il2Cpp.Class<T> & {
        // TODO make these not crash in non-array classes (and instead return nullable)
        arrayElementSize: number;
        elementClass: Il2Cpp.Class<Il2Cpp.StripArraySuffix<T>>;
        _typeEnum: typeof Il2Cpp.TypeEnum.ARRAY;
    };

    export class System {
        @lazy
        static get Void() {
            return Il2Cpp.corlib.class('System.Void') as Il2Cpp.VoidClass;
        }

        @lazy
        static get Boolean() {
            return Il2Cpp.corlib.class('System.Boolean') as Il2Cpp.BooleanClass;
        }

        @lazy
        static get SByte() {
            return Il2Cpp.corlib.class('System.SByte') as Il2Cpp.ByteClass;
        }

        @lazy
        static get Byte() {
            return Il2Cpp.corlib.class('System.Byte') as Il2Cpp.UnsignedByteClass;
        }

        @lazy
        static get Char() {
            return Il2Cpp.corlib.class('System.Char') as Il2Cpp.CharClass;
        }

        @lazy
        static get Int16() {
            return Il2Cpp.corlib.class('System.Int16') as Il2Cpp.ShortClass;
        }

        @lazy
        static get UInt16() {
            return Il2Cpp.corlib.class('System.UInt16') as Il2Cpp.UnsignedShortClass;
        }

        @lazy
        static get Int32() {
            return Il2Cpp.corlib.class('System.Int32') as Il2Cpp.IntClass;
        }

        @lazy
        static get UInt32() {
            return Il2Cpp.corlib.class('System.UInt32') as Il2Cpp.UnsignedIntClass;
        }

        @lazy
        static get Int64() {
            return Il2Cpp.corlib.class('System.Int64') as Il2Cpp.LongClass;
        }

        @lazy
        static get UInt64() {
            return Il2Cpp.corlib.class('System.UInt64') as Il2Cpp.UnsignedLongClass;
        }

        @lazy
        static get Single() {
            return Il2Cpp.corlib.class('System.Single') as Il2Cpp.FloatClass;
        }

        @lazy
        static get Double() {
            return Il2Cpp.corlib.class('System.Double') as Il2Cpp.DoubleClass;
        }

        @lazy
        static get IntPtr() {
            return Il2Cpp.corlib.class('System.IntPtr') as Il2Cpp.NativePointerClass;
        }

        @lazy
        static get UIntPtr() {
            return Il2Cpp.corlib.class('System.UIntPtr') as Il2Cpp.UnsignedNativePointerClass;
        }

        @lazy
        static get String() {
            return Il2Cpp.corlib.class('System.String') as Il2Cpp.StringClass;
        }
    }

    export namespace Class {
        /*
         * Type Attributes (21.1.13).
         */
        // #define TYPE_ATTRIBUTE_VISIBILITY_MASK       0x00000007
        // #define TYPE_ATTRIBUTE_NOT_PUBLIC            0x00000000
        // #define TYPE_ATTRIBUTE_PUBLIC                0x00000001
        // #define TYPE_ATTRIBUTE_NESTED_PUBLIC         0x00000002
        // #define TYPE_ATTRIBUTE_NESTED_PRIVATE        0x00000003
        // #define TYPE_ATTRIBUTE_NESTED_FAMILY         0x00000004
        // #define TYPE_ATTRIBUTE_NESTED_ASSEMBLY       0x00000005
        // #define TYPE_ATTRIBUTE_NESTED_FAM_AND_ASSEM  0x00000006
        // #define TYPE_ATTRIBUTE_NESTED_FAM_OR_ASSEM   0x00000007

        // #define TYPE_ATTRIBUTE_LAYOUT_MASK           0x00000018
        // #define TYPE_ATTRIBUTE_AUTO_LAYOUT           0x00000000
        // #define TYPE_ATTRIBUTE_SEQUENTIAL_LAYOUT     0x00000008
        // #define TYPE_ATTRIBUTE_EXPLICIT_LAYOUT       0x00000010

        // #define TYPE_ATTRIBUTE_CLASS_SEMANTIC_MASK   0x00000020
        // #define TYPE_ATTRIBUTE_CLASS                 0x00000000
        // #define TYPE_ATTRIBUTE_INTERFACE             0x00000020

        // #define TYPE_ATTRIBUTE_ABSTRACT              0x00000080
        // #define TYPE_ATTRIBUTE_SEALED                0x00000100
        // #define TYPE_ATTRIBUTE_SPECIAL_NAME          0x00000400

        // #define TYPE_ATTRIBUTE_IMPORT                0x00001000
        // #define TYPE_ATTRIBUTE_SERIALIZABLE          0x00002000

        // #define TYPE_ATTRIBUTE_STRING_FORMAT_MASK    0x00030000
        // #define TYPE_ATTRIBUTE_ANSI_CLASS            0x00000000
        // #define TYPE_ATTRIBUTE_UNICODE_CLASS         0x00010000
        // #define TYPE_ATTRIBUTE_AUTO_CLASS            0x00020000

        // #define TYPE_ATTRIBUTE_BEFORE_FIELD_INIT     0x00100000
        // #define TYPE_ATTRIBUTE_FORWARDER             0x00200000

        // #define TYPE_ATTRIBUTE_RESERVED_MASK         0x00040800
        // #define TYPE_ATTRIBUTE_RT_SPECIAL_NAME       0x00000800
        // #define TYPE_ATTRIBUTE_HAS_SECURITY          0x00040000
        export const enum Attributes {
            INTERFACE = 0x00000020,
            ABSTRACT = 0x00000080,
            SEALED = 0x00000100,
            SPECIAL_NAME = 0x00000400,
        }
    }
}
