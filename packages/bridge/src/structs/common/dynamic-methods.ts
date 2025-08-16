import type { ParameterLike } from '../../memory.js';
import { isIl2Cpp } from '../../memory.js';
import type { Class } from '../class.js';
import type { MethodReturnType } from '../method.js';
import { isTypeValue } from '../parameter.js';
import { isWrappedPrimitive } from '../primitive.js';
import { BaseObject } from './base-object.js';

export type DynamicMethods = {
    [K in Exclude<string, ['constructor' | '#invokeMethod']>]: (
        ...parameters: ParameterLike[]
    ) => unknown;
};

export class DynamicMethodsLookup {
    constructor(
        private readonly target: BaseObject | Class,
        isStatic: boolean
    ) {
        this.class.methods
            .filter(m => !m.isStatic === !isStatic)
            .forEach(m => {
                globalThis.Object.defineProperty(this, m.name, {
                    value: this.#invokeMethod.bind(this, m.name),
                    enumerable: true,
                    configurable: true,
                });
            });
    }

    get class(): Class {
        return this.target instanceof BaseObject ? this.target.class : this.target;
    }

    #invokeMethod<T extends MethodReturnType>(name: string, ...parameters: ParameterLike[]): T {
        const paramValues = parameters.map(p => {
            if (isTypeValue(p)) return p.value;
            return p;
        });

        return this.target.methodForValues<T>(name, ...paramValues).invoke(...paramValues);
    }

    static from(target: BaseObject | Class, isStatic: boolean): DynamicMethods {
        return new DynamicMethodsLookup(target, isStatic) as unknown as DynamicMethods;
    }
}
