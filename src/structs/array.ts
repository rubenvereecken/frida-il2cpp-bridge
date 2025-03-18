namespace Il2Cpp {
    // TODO Array now extends Object but it still doesn't support method calling
    export class Array<R extends Il2Cpp.Wrapped = Il2Cpp.Wrapped, T extends string = string>
        extends Il2Cpp.ReferenceType<T>
        implements Iterable<R>
    {
        get constructorName() {
            return 'Il2Cpp.Array';
        }

        valueToString(): string {
            return `[${this.read()}]`;
        }

        toString(): string {
            return this.valueToString();
        }

        /** Gets the Il2CppArray struct size, possibly equal to `Process.pointerSize * 4`. */
        @lazy
        static get headerSize(): number {
            return Il2Cpp.corlib.class('System.Array').instanceSize;
        }

        @lazy
        static get elementsOffset(): number {
            // We previosly obtained an array whose content is known by calling
            // 'System.String::Split(NULL)' on a known string. However, that
            // method invocation somehow blows things up in Unity 2018.3.0f1.
            const array = Il2Cpp.string('v').method<Il2Cpp.Array>('ToCharArray', 0).invoke();

            const offset =
                array.handle.offsetOf(p => p.readS16() == 118) ??
                raise("couldn't find the elements offset in the native array struct");

            return offset;
        }

        /** @internal Gets a pointer to the first element of the current array. */
        @lazy
        get elements(): Il2Cpp.Pointer<R> {
            return new Il2Cpp.Pointer(
                this.handle.add(Il2Cpp.Array.elementsOffset),
                this.elementType
            );
        }

        /** Gets the size of the object encompassed by the current array. */
        @lazy
        get elementSize(): number {
            return this.elementType.class.arrayElementSize;
        }

        /** Gets the type of the object encompassed by the current array. */
        @lazy
        get elementType(): Il2Cpp.Type {
            return this.class.type.class.baseType!;
        }

        /** Gets the total number of elements in all the dimensions of the current array. */
        @lazy
        get length(): number {
            return Il2Cpp.exports.arrayGetLength(this);
        }

        /** Gets the element at the specified index of the current array. */
        get(index: number): R {
            if (index < 0 || index >= this.length) {
                raise(`cannot get element at index ${index} as the array length is ${this.length}`);
            }

            return readWrapped(
                this.elements.handle.add(index * this.elementType.class.arrayElementSize),
                this.elementType
            ) as R;
        }

        /** Sets the element at the specified index of the current array. */
        set(index: number, value: R) {
            if (index < 0 || index >= this.length) {
                raise(`cannot set element at index ${index} as the array length is ${this.length}`);
            }

            write(
                this.elements.handle.add(index * this.elementType.class.arrayElementSize),
                value,
                this.elementType
            );
        }

        /** Writes the given elements starting at the given index. */
        write(values: R[], offset: number = 0): void {
            for (let i = 0; i < values.length; i++) {
                this.set(i + offset, values[i]);
            }
        }

        // TODO should this live elsewhere? Like Array instead of Pointer
        /** Reads the given amount of elements starting at the given offset. */
        read(offset: number = 0, length: number | undefined = undefined): R[] {
            length = this.length;
            const values = new globalThis.Array<R>(length);

            for (let i = 0; i < length; i++) {
                values[i] = this.get(i + offset);
            }

            return values;
        }

        /** Iterable. */
        *[Symbol.iterator](): IterableIterator<R> {
            for (let i = 0; i < this.length; i++) {
                yield this.get(i);
            }
        }
    }

    /** Creates a new empty array of the given length. */
    export function array<T extends Il2Cpp.Wrapped>(
        klass: Il2Cpp.Class,
        length: number
    ): Il2Cpp.Array<T>;

    /** Creates a new array with the given elements. */
    export function array<T extends Il2Cpp.Wrapped>(
        klass: Il2Cpp.Class,
        elements: T[]
    ): Il2Cpp.Array<T>;

    /** @internal */
    export function array<T extends Il2Cpp.Wrapped>(
        klass: Il2Cpp.Class,
        lengthOrElements: number | T[]
    ): Il2Cpp.Array<T> {
        const length =
            typeof lengthOrElements == 'number' ? lengthOrElements : lengthOrElements.length;
        const array = new Il2Cpp.Array<T>(Il2Cpp.exports.arrayNew(klass, length));

        if (globalThis.Array.isArray(lengthOrElements)) {
            array.write(lengthOrElements);
        }

        return array;
    }
}
