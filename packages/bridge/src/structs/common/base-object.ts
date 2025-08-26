import type { Il2CppValue, JsObject } from '../../memory.js';
import { memoize } from '../../utils/cache.js';
import { NativeStruct } from '../../utils/native-struct.js';
import type { Class } from '../class.js';
import type { BoundField } from '../field.js';
import type { BoundMethod, MethodReturnType } from '../method.js';
import type { ParameterValue } from '../parameter.js';
import type { Type } from '../type.js';
import type { DynamicFields } from './dynamic-fields.js';
import { DynamicFieldsLookup } from './dynamic-fields.js';
import type { DynamicMethods } from './dynamic-methods.js';
import { DynamicMethodsLookup } from './dynamic-methods.js';

export abstract class BaseObject<T extends string = string> extends NativeStruct {
    constructor(
        native: NativePointerValue,
        readonly _type: Type<T> | undefined = undefined
    ) {
        super(native);

        // Shows up on Frida REPL. Useful for debugging and reverse engineering
        globalThis.Object.defineProperty(this, '__toString', {
            get: () => this.toString(),
            enumerable: true,
        });

        globalThis.Object.defineProperty(this, '_il2cpp', {
            get: () => {
                return `${this.constructorName}<${this.type.name}>`;
            },
            enumerable: true,
        });
    }

    abstract get class(): Class<T>;
    abstract get type(): Type<T>;
    abstract get constructorName(): string;

    abstract isBoxed(): boolean;

    /** Gets the field with the given name. */
    field<T extends Il2CppValue>(name: string): BoundField<T> {
        return this.type.class.field<T>(name).bind(this);
    }

    /** Gets the method with the given name. */
    method<T extends MethodReturnType>(name: string, parameterCount: number = -1): BoundMethod<T> {
        return this.type.class.method<T>(name, parameterCount).bind(this);
    }

    methodWithSignature<T extends MethodReturnType>(
        name: string,
        ...paramTypes: Type[]
    ): BoundMethod<T> {
        return this.type.class.methodForSignature<T>(name, ...paramTypes).bind(this);
    }

    methodForValues<T extends MethodReturnType>(
        name: string,
        ...paramValues: ParameterValue[]
    ): BoundMethod<T> {
        return this.type.class.methodForValues<T>(name, ...paramValues).bind(this);
    }

    /** Gets the field with the given name. */
    tryField<T extends Il2CppValue>(name: string): BoundField<T> | undefined {
        return this.type.class.tryField<T>(name)?.bind(this);
    }

    /** Gets the field with the given name. */
    tryMethod<T extends MethodReturnType>(
        name: string,
        parameterCount: number = -1
    ): BoundMethod<T> | undefined {
        return this.type.class.tryMethod<T>(name, parameterCount)?.bind(this);
    }

    tryMethodForSignature<T extends MethodReturnType>(
        name: string,
        ...paramTypes: Type[]
    ): BoundMethod<T> | undefined {
        return this.type.class.methodForSignature<T>(name, ...paramTypes).bind(this);
    }

    tryMethodForValues<T extends MethodReturnType>(
        name: string,
        ...paramValues: ParameterValue[]
    ): BoundMethod<T> | undefined {
        return this.type.class.methodForValues<T>(name, ...paramValues).bind(this);
    }

    @memoize
    get m(): DynamicMethods {
        return DynamicMethodsLookup.from(this, false);
    }

    @memoize
    get f(): DynamicFields {
        return DynamicFieldsLookup.from(this, false);
    }

    read(): any {
        if (this.isNull()) return null;

        const fields = this.class.fields.filter(f => !f.isStatic);
        const result: JsObject = {};

        // TODO I think some child classes have access to fields that aren't showing – so check the whole tree for those
        fields.forEach(field => {
            field = field.bind(this);
            // TODO make sure this exists
            result[field.name] = (field.value as any).read();
        });

        return result;
    }
}
