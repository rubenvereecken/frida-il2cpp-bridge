namespace Il2Cpp {
    export class ValueType<T extends string = string> extends Il2Cpp.ObjectLike<T> {
        // Re-declare as non-nullable because ValueTypes don't have a header with type info
        declare readonly _type: Il2Cpp.Type<T>;

        constructor(handle: NativePointerValue, type: Il2Cpp.Type<T>) {
            super(handle, type);
        }

        get constructorName() {
            return 'Il2Cpp.ValueType';
        }

        get class(): Il2Cpp.Class<T> {
            return this.type.class;
        }

        get type(): Il2Cpp.Type<T> {
            return this._type;
        }

        /** Boxes the current value type in a object. */
        box(): Il2Cpp.ReferenceType {
            return new Il2Cpp.ReferenceType(Il2Cpp.exports.valueTypeBox(this.class, this));
        }

        valueToString(): string {
            if (this.isNull()) return 'null';
            const ToString = this.method<Il2Cpp.String>('ToString', 0);
            // If ToString is defined within a value type class, we can
            // avoid a boxing operation.
            if (ToString.class.isValueType) return ToString.invoke().content ?? 'null';
            return this.box().toString() ?? 'null';
        }

        toString(): string {
            return this.valueToString();
        }
    }
}
