namespace Il2Cpp {
    // TODO check what broke now that Pointer extends ObjectLike – what needs overriding?
    export class Pointer<
        T extends Il2Cpp.Wrapped = Il2Cpp.Wrapped,
        S extends string = string,
    > extends ObjectLike<S> {
        get constructorName() {
            return 'Il2Cpp.Pointer';
        }

        constructor(
            handle: NativePointer,
            readonly type: Il2Cpp.Type<S>
        ) {
            super(handle);
        }

        // TODO check if this actually works??
        @lazy
        get object() {
            return new Il2Cpp.ReferenceType<S>(this);
        }

        @lazy
        get class() {
            return this.object.class;
        }

        valueToString(): string {
            return this.handle.toString();
        }

        toString(): string {
            return `${this.valueToString()} (${this.type.name})`;
        }
    }
}
