import { Il2CppValue } from '../../memory.js';
import type { Class } from '../class.js';
import { BaseObject } from './base-object.js';

export type DynamicFields = {
    [K in Exclude<string, ['constructor' | '#getValue' | '#setValue']>]: unknown;
};

export class DynamicFieldsLookup {
    constructor(
        private readonly target: BaseObject | Class,
        isStatic: boolean
    ) {
        this.class.fields
            .filter(f => !f.isStatic === !isStatic)
            .forEach(f => {
                globalThis.Object.defineProperty(this, f.name, {
                    get: () => this.#getValue(f.name),
                    set: value => this.#setValue(f.name, value),
                    enumerable: true,
                    configurable: true,
                });
            });
    }

    get class(): Class {
        return this.target instanceof BaseObject ? this.target.class : this.target;
    }

    #getValue<T extends Il2CppValue = Il2CppValue>(name: string): T {
        return this.target.field<T>(name).value;
    }

    #setValue<T extends Il2CppValue = Il2CppValue>(name: string, value: T): void {
        this.target.field<T>(name).value = value;
    }

    static from(target: BaseObject | Class, isStatic: boolean): DynamicFields {
        return new DynamicFieldsLookup(target, isStatic) as unknown as DynamicFields;
    }
}
