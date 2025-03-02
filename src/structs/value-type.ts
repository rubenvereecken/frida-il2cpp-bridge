namespace Il2Cpp {
    export class ValueType extends Il2Cpp.ObjectLike {
        constructor(handle: NativePointerValue, readonly type: Il2Cpp.Type) {
            super(handle);

            // Shows up on Frida REPL. Useful for debugging and reverse engineering
            globalThis.Object.defineProperty(this, "__toString", {
                get: () => this.toString(),
                enumerable: true
            });
            globalThis.Object.defineProperty(this, "_il2cpp", {
                get: () => "Il2Cpp.ValueType",
                enumerable: true
            });
        }

        get class(): Il2Cpp.Class {
            return this.type.class;
        }

        /** Boxes the current value type in a object. */
        box(): Il2Cpp.Object {
            return new Il2Cpp.Object(Il2Cpp.exports.valueTypeBox(this.class, this));
        }

        valueToString(): string {
            if (this.isNull()) return "null";
            const ToString = this.method<Il2Cpp.String>("ToString", 0);
            // If ToString is defined within a value type class, we can
            // avoid a boxing operation.
            if (ToString.class.isValueType) return ToString.invoke().content ?? "null";
            return this.box().toString() ?? "null";
        }

        toString(): string {
            return `${this.valueToString()} (${this.type.name})`;
        }
    }
}
