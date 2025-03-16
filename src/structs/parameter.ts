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

        /*
         * Flags for Params (22.1.12)
         */
        // #define PARAM_ATTRIBUTE_IN                 0x0001
        // #define PARAM_ATTRIBUTE_OUT                0x0002
        // #define PARAM_ATTRIBUTE_OPTIONAL           0x0010
        // #define PARAM_ATTRIBUTE_RESERVED_MASK      0xf000
        // #define PARAM_ATTRIBUTE_HAS_DEFAULT        0x1000
        // #define PARAM_ATTRIBUTE_HAS_FIELD_MARSHAL  0x2000
        // #define PARAM_ATTRIBUTE_UNUSED             0xcfe0

        // Flags for Generic Parameters (II.23.1.7)
        // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_NON_VARIANT                           0x00
        // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_COVARIANT                             0x01
        // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_CONTRAVARIANT                         0x02
        // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_VARIANCE_MASK                         0x03
        // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_REFERENCE_TYPE_CONSTRAINT             0x04
        // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_NOT_NULLABLE_VALUE_TYPE_CONSTRAINT    0x08
        // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_DEFAULT_CONSTRUCTOR_CONSTRAINT        0x10
        // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_SPECIAL_CONSTRAINT_MASK               0x1C
    }
}
