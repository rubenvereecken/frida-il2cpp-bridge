import type { Il2CppValue } from '../memory';
import type { ArrayLike } from './array';
import type { PrimitiveLike } from './primitive';
import type { StringLike } from './string';
import type { Type } from './type';

export class Parameter {
    constructor(
        public readonly name: string,
        public readonly position: number,
        public readonly type: Type
    ) {
        // Shows up on Frida REPL. Useful for debugging and reverse engineering
        globalThis.Object.defineProperty(this, '__toString', {
            get: () => this.toString(),
            enumerable: true,
        });
        globalThis.Object.defineProperty(this, '_il2cpp', {
            get: () => 'Il2Cpp.Parameter',
            enumerable: true,
        });
    }

    toString(): string {
        return `${this.type.name} ${this.name} (position ${this.position})`;
    }
}

export type ParameterValue = PrimitiveLike | StringLike | ArrayLike | Il2CppValue;

export type TypedValue = {
    type: Type;
    value: ParameterValue;
};

export function isTypeValue(v: TypedValue | ParameterValue): v is TypedValue {
    return (v as TypedValue).type !== undefined && (v as TypedValue).value !== undefined;
}
