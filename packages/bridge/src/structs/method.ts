import { isUnityVersionIsBelow201830 } from '../application.js';
import { MethodAttributeFlags } from '../enums/method-attribute.js';
import { MethodImplementationAttributeFlags } from '../enums/method-implementation-attribute.js';
import {
    getNativeClassFromSystemType,
    getNativeMethodGetClass,
    getNativeMethodGetDeclaringClass,
    getNativeMethodGetFlags,
    getNativeMethodGetName,
    getNativeMethodGetObject,
    getNativeMethodGetParameterCount,
    getNativeMethodGetParameterName,
    getNativeMethodGetParameterType,
    getNativeMethodGetReturnType,
    getNativeMethodIsGeneric,
    getNativeMethodIsInflated,
    getNativeMethodIsInstance,
} from '../native/index.js';
import type { Il2CppValue, ParameterLike } from '../memory.js';
import { fridaToIl2Cpp, toFrida } from '../memory.js';
import { getModule } from '../module.js';
import { raise } from '../utils/error.js';
import { memoize } from '../utils/cache.js';
import { NativeStruct } from '../utils/native-struct.js';
import type { Array } from './array.js';
import { array } from './array.js';
import { Class } from './class.js';
import type { BaseObject } from './common/base-object.js';
import { Object_ } from './object.js';
import type { ParameterValue } from './parameter.js';
import { Parameter } from './parameter.js';
import type { IntPtr } from './primitive.js';
import { Type } from './type.js';
import { UnboxedValueType } from './value-type.js';
import { getCorlib } from '../corlib.js';
import { findPointerOffset } from '../utils/scan.js';
import { inform } from '../utils/log.js';

type ImplementationCallback<T extends MethodReturnType> = (
    this: Class | Object_ | UnboxedValueType,
    ...parameters: ParameterValue[]
) => T;
type OnEnterCallback = (
    this: Class | Object_ | UnboxedValueType,
    ...parameters: ParameterValue[]
) => void;
type OnLeaveCallback<T extends MethodReturnType> = (
    this: Class | Object_ | UnboxedValueType,
    retval: T
) => T | void;

export class Method<T extends MethodReturnType = MethodReturnType> extends NativeStruct {
    constructor(native: NativePointerValue) {
        super(native);

        // Shows up on Frida REPL. Useful for debugging and reverse engineering
        globalThis.Object.defineProperty(this, '__toString', {
            get: () => this.toString(),
            enumerable: true,
        });
        globalThis.Object.defineProperty(this, '_il2cpp', {
            get: () =>
                this instanceof BoundMethod
                    ? `Il2Cpp.BoundMethod<${this.returnType.name}>`
                    : `Il2Cpp.Method<${this.returnType.name}>`,
            enumerable: true,
        });
    }

    toString(): string {
        return `${this.returnType.name} ${this.class.type.name}::${this.name}(${this.parameters.map(p => p.type.name).join(', ')})`;
    }

    // TODO templated -> need method
    /** Gets the class in which this method is defined. */
    @memoize
    get class(): Class {
        return new Class(getNativeMethodGetClass()(this));
    }

    // TODO: difference with `class`?
    @memoize
    get declaringClass(): Class {
        return new Class(getNativeMethodGetDeclaringClass()(this));
    }

    @memoize
    get flags() {
        return {
            isStatic: !!(this.flagsRaw & MethodAttributeFlags.STATIC),
            isFinal: !!(this.flagsRaw & MethodAttributeFlags.FINAL),
            isVirtual: !!(this.flagsRaw & MethodAttributeFlags.VIRTUAL),
            isAbstract: !!(this.flagsRaw & MethodAttributeFlags.ABSTRACT),
        };
    }

    /** Gets the flags of the current method. */
    @memoize
    get flagsRaw(): number {
        return getNativeMethodGetFlags()(this, NULL);
    }

    /** Gets the implementation flags of the current method. */
    @memoize
    get implementationFlags(): number {
        const implementationFlagsPointer = Memory.alloc(Process.pointerSize);
        getNativeMethodGetFlags()(this, implementationFlagsPointer);

        return implementationFlagsPointer.readU32();
    }

    /** */
    @memoize
    get fridaSignature(): NativeCallbackArgumentType[] {
        const types: NativeCallbackArgumentType[] = [];

        for (const parameter of this.parameters) {
            types.push(parameter.type.fridaAlias);
        }

        if (!this.isStatic || isUnityVersionIsBelow201830()) {
            types.unshift('pointer');
        }

        if (this.isInflated) {
            types.push('pointer');
        }

        return types;
    }

    /** Gets the generic parameters of this generic method. */
    @memoize
    get generics(): Class[] {
        if (!this.isGeneric && !this.isInflated) {
            return [];
        }

        const types = this.object.method<Array<Object_>>('GetGenericArguments').invoke();
        return globalThis.Array.from(types).map(_ => new Class(getNativeClassFromSystemType()(_)));
    }

    /** Determines whether this method is external. */
    @memoize
    get isExternal(): boolean {
        return (this.implementationFlags & MethodImplementationAttributeFlags.INTERNAL_CALL) != 0;
    }

    /** Determines whether this method is generic. */
    @memoize
    get isGeneric(): boolean {
        return !!getNativeMethodIsGeneric()(this);
    }

    /** Determines whether this method is inflated (generic with a concrete type parameter). */
    @memoize
    get isInflated(): boolean {
        return !!getNativeMethodIsInflated()(this);
    }

    /** Determines whether this method is static. */
    @memoize
    get isStatic(): boolean {
        // Note: can also check using Static flag
        return !getNativeMethodIsInstance()(this);
    }

    /** Determines whether this method is synchronized. */
    @memoize
    get isSynchronized(): boolean {
        return (this.implementationFlags & MethodImplementationAttributeFlags.SYNCHRONIZED) != 0;
    }

    // TODO move this to Writer classes
    /** Gets the access modifier of this method. */
    @memoize
    get accessModifierStr(): string | undefined {
        switch (this.flagsRaw & MethodAttributeFlags.MEMBER_ACCESS_MASK) {
            case MethodAttributeFlags.PRIVATE:
                return 'private';
            case MethodAttributeFlags.FAMILY_AND_ASSEMBLY:
                return 'private protected';
            case MethodAttributeFlags.ASSEMBLY:
                return 'internal';
            case MethodAttributeFlags.FAMILY:
                return 'protected';
            case MethodAttributeFlags.FAMILY_OR_ASSEMBLY:
                return 'protected internal';
            case MethodAttributeFlags.PUBLIC:
                return 'public';
        }
    }

    /** Gets the name of this method. */
    @memoize
    get name(): string {
        return getNativeMethodGetName()(this).readUtf8String()!;
    }

    /** @internal */
    @memoize
    get nativeFunction(): NativeFunction<any, any> {
        return new NativeFunction(
            this.virtualAddress,
            this.returnType.fridaAlias,
            this.fridaSignature as NativeFunctionArgumentType[]
        );
    }

    /** Gets the encompassing object of the current method. */
    @memoize
    get object(): Object_ {
        return new Object_(getNativeMethodGetObject()(this, NULL));
    }

    /** Gets the amount of parameters of this method. */
    @memoize
    get parameterCount(): number {
        return getNativeMethodGetParameterCount()(this);
    }

    /** Gets the parameters of this method. */
    @memoize
    get parameters(): Parameter[] {
        return globalThis.Array.from(globalThis.Array(this.parameterCount), (_, i) => {
            const parameterName = getNativeMethodGetParameterName()(this, i).readUtf8String()!;
            const parameterType = getNativeMethodGetParameterType()(this, i);
            return new Parameter(parameterName, i, new Type(parameterType));
        });
    }

    /** Gets the relative virtual address (RVA) of this method. */
    @memoize
    get relativeVirtualAddress(): NativePointer {
        return this.virtualAddress.sub(getModule().base);
    }

    /** Gets the return type of this method. */
    @memoize
    get returnType(): Type {
        return new Type(getNativeMethodGetReturnType()(this));
    }

    @memoize
    static get virtualAddressOffset(): number {
        const FilterTypeName = getCorlib()
            .class('System.Reflection.Module')
            .initialize()
            .field<Object_>('FilterTypeName').value;
        const FilterTypeNameMethodPointer = FilterTypeName.field<IntPtr>('method_ptr').value.read();
        const FilterTypeNameMethod = FilterTypeName.field<IntPtr>('method').value.read();

        const offset =
            findPointerOffset(FilterTypeNameMethod, FilterTypeNameMethodPointer) ??
            raise("couldn't find the virtual address offset in the native method struct");

        return offset;
    }

    /** Gets the virtual address (VA) of this method. */
    get virtualAddress(): NativePointer {
        // In Unity 2017.4.40f1 (don't know about others),
        // `Il2Cpp.Class::initialize` somehow triggers a nasty bug during
        // early instrumentation, so that we aren't able to obtain the
        // offset to get the virtual address of a method when the script
        // is reloaded. A workaround consists in manually re-invoking the
        // static constructor.
        // TODO necessary still?
        // Il2Cpp.corlib.class('System.Reflection.Module').method('.cctor').invoke();
        return this.handle.add(Method.virtualAddressOffset).readPointer();
    }

    // /** Replaces the body of this method. */
    // set implementation(block: ImplementationCallback<T>) {
    //     try {
    //         Interceptor.replace(this.virtualAddress, this.wrap(block));
    //     } catch (e: any) {
    //         switch (e.message) {
    //             case 'access violation accessing 0x0':
    //                 raise(
    //                     `couldn't set implementation for method ${this.name} as it has a NULL virtual address`
    //                 );
    //             case /unable to intercept function at \w+; please file a bug/.exec(e.message)
    //                 ?.input:
    //                 warn(
    //                     `couldn't set implementation for method ${this.name} as it may be a thunk`
    //                 );
    //                 break;
    //             case 'already replaced this function':
    //                 warn(
    //                     `couldn't set implementation for method ${this.name} as it has already been replaced by a thunk`
    //                 );
    //                 break;
    //             default:
    //                 throw e;
    //         }
    //     }
    // }

    // set onEnter(block: OnEnterCallback) {
    //     Interceptor.attach(this.virtualAddress, {
    //         onEnter: this.wrapOnEnter(block),
    //     });
    // }

    // set onLeave(block: OnLeaveCallback<T>) {
    //     Interceptor.attach(this.virtualAddress, {
    //         onLeave: this.wrapOnLeave(block),
    //     });
    // }

    /** Creates a generic instance of the current generic method. */
    inflate<R extends MethodReturnType = T>(...classes: Class[]): Method<R> {
        if (!this.isGeneric) {
            raise(`cannot inflate method ${this.name} as it has no generic parameters`);
        }

        if (this.generics.length != classes.length) {
            raise(
                `cannot inflate method ${this.name} as it needs ${this.generics.length} generic parameter(s), not ${classes.length}`
            );
        }

        const types = classes.map(_ => _.type.runtimeType);
        const typeArray = array(getCorlib().class('System.RuntimeType'), types);

        const inflatedMethodObject = this.object
            .method<Object_>('MakeGenericMethod', 1)
            .invoke(typeArray);
        return new Method(inflatedMethodObject.field<IntPtr>('mhandle').value.read());
    }

    /** Invokes this method. */
    invoke(...parameters: ParameterValue[]): T {
        if (!this.isStatic) {
            raise(
                `cannot invoke non-static method ${this.name} as it must be invoked throught a Il2Cpp.Object, not a Il2Cpp.Class`
            );
        }
        return this.invokeRaw(NULL, ...parameters);
    }

    invokeRaw(instance: NativePointerValue, ...parameters: ParameterLike[]): T {
        const allocatedParameters = parameters.map((p, i) => toFrida(p, this.parameters[i].type));

        if (!this.isStatic || isUnityVersionIsBelow201830()) {
            allocatedParameters.unshift(instance);
        }

        if (this.isInflated) {
            allocatedParameters.push(this.handle);
        }

        try {
            const returnValue = this.nativeFunction(...allocatedParameters);
            inform(`returnValue: ${returnValue} (${this.returnType})`);
            // inform(`    -> ${fromFridaValue(returnValue, this.returnType)}`);
            return fridaToIl2Cpp(returnValue, this.returnType) as T;
        } catch (e: any) {
            if (e == null) {
                raise(
                    'an unexpected native invocation exception occurred, this is due to parameter types mismatch'
                );
            }

            (globalThis as any).console.log(e);

            switch (e.message) {
                case 'bad argument count':
                    raise(
                        `couldn't invoke method ${this.name} as it needs ${this.parameterCount} parameter(s), not ${parameters.length}`
                    );
                case 'expected a pointer':
                case 'expected number':
                case 'expected array with fields':
                    raise(
                        `couldn't invoke method ${this.name} using incorrect parameter types (${e.message}; got ${parameters.map(p => p).join(', ')})`
                    );
            }

            throw e;
        }
    }

    /** Gets the overloaded method with the given parameter types. */
    overload(...parameterTypes: string[]): Method<T> {
        const result = this.tryOverload<T>(...parameterTypes);

        if (result != undefined) return result;

        raise(`couldn't find overloaded method ${this.name}(${parameterTypes})`);
    }

    /** Gets the parameter with the given name. */
    parameter(name: string): Parameter {
        return (
            this.tryParameter(name) ??
            raise(`couldn't find parameter ${name} in method ${this.name}`)
        );
    }

    /** Restore the original method implementation. */
    revert(): void {
        Interceptor.revert(this.virtualAddress);
        Interceptor.flush();
    }

    /** Gets the overloaded method with the given parameter types. */
    tryOverload<U extends MethodReturnType = T>(
        ...parameterTypes: string[]
    ): Method<U> | undefined {
        let klass: Class | null = this.class;
        while (klass) {
            const method = klass.methods.find(method => {
                return (
                    method.name == this.name &&
                    method.parameterCount == parameterTypes.length &&
                    method.parameters.every((e, i) => e.type.name == parameterTypes[i])
                );
            }) as Method<U> | undefined;
            if (method) {
                return method;
            }
            klass = klass.parent;
        }
        return undefined;
    }

    /** Gets the parameter with the given name. */
    tryParameter(name: string): Parameter | undefined {
        return this.parameters.find(_ => _.name == name);
    }

    /** Derive a BoundMethod so this method can be invoked for `instance`. */
    bind(instance: BaseObject): BoundMethod<T> {
        if (this.isStatic) {
            raise(`cannot bind static method ${this.class.type.name}::${this.name} to an object`);
        }

        const bound = new BoundMethod<T>(this.handle, instance);

        // Ensure this method and its bound version have a shared @lazy cache
        if (!(this as unknown & { _propertyCache?: Record<PropertyKey, any> })._propertyCache) {
            globalThis.Object.defineProperty(this, '_propertyCache', {
                value: {},
                configurable: false,
                enumerable: false,
                writable: true,
            });
        }

        globalThis.Object.defineProperty(bound, '_propertyCache', {
            value: (this as unknown & { _propertyCache?: Record<PropertyKey, any> })._propertyCache,
            configurable: false,
            enumerable: false,
            writable: true,
        });

        return bound;
    }

    // /** @internal */
    wrap(block: ImplementationCallback<T>): NativeCallback<any, any> {
        const startIndex = +!this.isStatic | +isUnityVersionIsBelow201830();
        return new NativeCallback(
            (...args: NativeCallbackArgumentValue[]): NativeCallbackReturnValue => {
                const thisObject = this.isStatic
                    ? this.class
                    : this.class._isValueType
                      ? new UnboxedValueType(
                            (args[0] as NativePointer).add(
                                Object_.headerSize - maybeObjectHeaderSize()
                            ),
                            this.class.type
                        )
                      : new Object_(args[0] as NativePointer);

                const parameters = this.parameters.map((_, i) =>
                    fridaToIl2Cpp(args[i + startIndex], _.type)
                );
                const result = block.call(thisObject, ...parameters);
                // TODO sort typing here
                return toFrida(result) as any;
            },
            this.returnType.fridaAlias,
            this.fridaSignature
        );
    }

    // /** @internal */
    // wrapOnEnter(
    //     block: OnEnterCallback
    // ): (this: InvocationContext, args: InvocationArguments) => void {
    //     const startIndex = +!this.isStatic | +Il2Cpp.unityVersionIsBelow201830;
    //     return (args: InvocationArguments) => {
    //         const thisObject = this.isStatic
    //             ? this.class
    //             : this.class.isValueType
    //               ? new Il2Cpp.ValueType(
    //                     (args[0] as NativePointer).add(
    //                         Il2Cpp.Object.headerSize - maybeObjectHeaderSize()
    //                     ),
    //                     this.class.type
    //                 )
    //               : new Il2Cpp.Object(args[0] as NativePointer);
    //         // As opposed to `Interceptor.replace`, `Interceptor.attach` doesn't
    //         // interpret pointers, so use `read` instead of `fromFridaValue`
    //         const parameters = this.parameters.map((_, i) =>
    //             readWrapped(args[i + startIndex], _.type, { derefPointer: false })
    //         );
    //         block.call(thisObject, ...parameters);
    //     };
    // }

    // /** @internal */
    // wrapOnLeave(
    //     block: OnLeaveCallback<T>
    // ): (this: InvocationContext, retval: InvocationReturnValue) => void {
    //     return (retval: InvocationReturnValue) => {
    //         // TODO grab `this` pointer during `onEnter`
    //         const thisObject = this.class;

    //         // `retval` is always a pointer, even if a primitive type
    //         const returnValue =
    //             this.returnType.typeEnum != Il2Cpp.Type.enum.void
    //                 ? (readWrapped(retval, this.returnType) as T)
    //                 : (undefined as T);
    //         const newReturnValue = block.call(thisObject, returnValue);

    //         // If callback returned nothing, don't replace, leave the old return value
    //         if (newReturnValue === undefined) return;

    //         const handle = Memory.alloc(this.returnType.class.valueTypeSize);
    //         write(handle, newReturnValue, this.returnType);
    //         retval.replace(handle);
    //     };
    // }
}

export class BoundMethod<T extends MethodReturnType = MethodReturnType> extends Method<T> {
    /** @internal */
    constructor(
        handle: NativePointerValue,
        public instance: BaseObject
    ) {
        super(handle);
    }

    toString(): string {
        return `${super.toString()} (bound @ ${this.instance.handle})`;
    }

    get instanceHandle() {
        // TODO: support older versions of Unity
        // Note: unlike fields, value type methods expect unboxed value types
        const headerSize = this.instance.class.isValueType() ? 0 : 0;

        return this.instance.handle.sub(headerSize);

        // TODO: improve is value type check
        if (this.instance instanceof UnboxedValueType && this.class._isValueType) {
            return this.instance.handle.add(maybeObjectHeaderSize() - Object_.headerSize);
        } else if (this.instance instanceof UnboxedValueType && !this.class._isValueType) {
            // TODO look into this – pretty sure unboxed methods are a thing
            raise(
                `cannot invoke method ${this.class.type.name}::${this.name} against a value type, you must box it first`
            );
        } else if (this.class._isValueType) {
            return this.instance.handle.add(maybeObjectHeaderSize());
        } else {
            return this.instance.handle;
        }
    }

    /** Invokes this method. */
    invoke(...parameters: ParameterValue[]): T {
        return this.invokeRaw(this.instanceHandle, ...parameters);
    }

    /** Creates a generic instance of the current generic method. */
    inflate<R extends MethodReturnType = T>(...classes: Class[]): BoundMethod<R> {
        return super.inflate<R>(...classes).bind(this.instance);
    }

    /** Gets the overloaded method with the given parameter types. */
    overload(...parameterTypes: string[]): BoundMethod<T> {
        return super.overload(...parameterTypes).bind(this.instance);
    }

    /** Gets the overloaded method with the given parameter types. */
    tryOverload<U extends MethodReturnType = T>(
        ...parameterTypes: string[]
    ): BoundMethod<U> | undefined {
        return super.tryOverload<U>(...parameterTypes)?.bind(this.instance);
    }
}

const maybeObjectHeaderSize = memoize(() => {
    const struct = getCorlib().class('System.RuntimeTypeHandle').initialize().alloc();
    struct.method('.ctor').invokeRaw(struct, ptr(0xdeadbeef));

    // Here we check where the sentinel value is
    // if it's not where it is supposed to be, it means struct methods
    // assume they are receiving value types (that is a pointer to raw data)
    // hence, we must "skip" the object header when invoking such methods.
    const offset = struct.field<IntPtr>('value').value.read().equals(ptr(0xdeadbeef))
        ? 0
        : Object_.headerSize;

    return offset;
});

// Different from Il2Cpp.Parameter.Value: excludes JS primitives, strings, and ByRef
export type MethodReturnType = Il2CppValue;
