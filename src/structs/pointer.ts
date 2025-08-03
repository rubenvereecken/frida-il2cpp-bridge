namespace Il2Cpp {
    // TODO should pointer subclass ObjectLike? Should it support fields, methods, etc?
    // TODO check what broke now that Pointer extends ObjectLike – what needs overriding?
    export class Pointer<
        U extends Il2Cpp.Il2CppValue = Il2Cpp.Il2CppValue,
        S extends string = string,
    > extends ObjectLike<S> {
        get constructorName() {
            return 'Il2Cpp.Pointer';
        }

        constructor(
            handle: NativePointer,
            readonly referredType: Il2Cpp.Type<S>
        ) {
            // TODO: this is wrong, really we need the pointer version of the original type
            super(handle, referredType);
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

        @lazy
        get type() {
            // TODO: this is wrong, really we need the pointer version of the original type
            return this.referredType;
        }

        valueToString(): string {
            return this.handle.toString();
        }

        toString(): string {
            return `${this.valueToString()} (${this.type.name})`;
        }
    }
}
