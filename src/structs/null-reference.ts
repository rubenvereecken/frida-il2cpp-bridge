namespace Il2Cpp {
    export class NullReference<T extends string = string> extends Il2Cpp.ReferenceType<T> {
        // Re-declare as non-nullable because, well... it's 0x0, so no info
        declare readonly _type: Il2Cpp.Type<T>;

        get constructorName() {
            return 'Il2Cpp.NullReference';
        }

        constructor(type: Il2Cpp.Type<T>) {
            super(ptr(0), type);
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
