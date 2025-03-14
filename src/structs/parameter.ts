namespace Il2Cpp {
    export class Parameter {
        constructor(
            public readonly name: string,
            public readonly position: number,
            public readonly type: Il2Cpp.Type
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

    export namespace Parameter {
        export type Value =
            | Il2Cpp.PrimitiveLike
            | Il2Cpp.StringLike
            | Il2Cpp.Wrapped
            | Il2Cpp.Reference;

        export type TypeValue = {
            type: Il2Cpp.Type;
            value: Il2Cpp.Parameter.Value;
        };

        export function isTypeValue(v: TypeValue | Value): v is TypeValue {
            return (v as TypeValue).type !== undefined;
        }
    }
}
