namespace Il2Cpp {
    // TODO check what broke now that Pointer extends ObjectLike – what needs overriding?
    export class Pointer<
        T extends Il2Cpp.Wrapped = Il2Cpp.Wrapped,
        S extends string = string,
    > extends ObjectLike<S> {
        protected constructorName = 'Il2Cpp.Pointer';

        constructor(
            handle: NativePointer,
            readonly type: Il2Cpp.Type<S>
        ) {
            super(handle);
        }

        // TODO check if this actually works??
        @lazy
        get object() {
            return new Il2Cpp.Object<S>(this);
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

        /** Gets the element at the given index. */
        get(index: number): T {
            return readWrapped(
                this.handle.add(index * this.type.class.arrayElementSize),
                this.type
            ) as T;
        }

        /** Reads the given amount of elements starting at the given offset. */
        read(length: number, offset: number = 0): T[] {
            const values = new globalThis.Array<T>(length);

            for (let i = 0; i < length; i++) {
                values[i] = this.get(i + offset);
            }

            return values;
        }

        /** Sets the given element at the given index */
        set(index: number, value: T): void {
            write(this.handle.add(index * this.type.class.arrayElementSize), value, this.type);
        }

        /** Writes the given elements starting at the given index. */
        write(values: T[], offset: number = 0): void {
            for (let i = 0; i < values.length; i++) {
                this.set(i + offset, values[i]);
            }
        }
    }
}
