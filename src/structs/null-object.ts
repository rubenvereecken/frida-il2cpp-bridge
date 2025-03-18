namespace Il2Cpp {
    export class NullObject<T extends string = string> extends Il2Cpp.Object<T> {
        get constructorName() {
            return 'Il2Cpp.NullObject';
        }

        constructor(
            // TODO: allow passing a _type to Object too, then standardise across
            readonly _type: Il2Cpp.Type<T>
        ) {
            super(ptr(0));
        }

        valueToString(): string {
            return 'null';
        }

        get type(): Il2Cpp.Type<T> {
            return this._type;
        }

        get class(): Il2Cpp.Class<T> {
            return this.type.class;
        }
    }
}
