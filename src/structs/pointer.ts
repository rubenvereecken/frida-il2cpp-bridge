namespace Il2Cpp {
    export class Pointer<T extends Il2Cpp.Field.Type = Il2Cpp.Field.Type> extends NativeStruct {
        constructor(handle: NativePointer, readonly type: Il2Cpp.Type) {
            super(handle);

            // Shows up on Frida REPL. Useful for debugging and reverse engineering
            globalThis.Object.defineProperty(this, "__toString", {
                get: () => this.toString(),
                enumerable: true
            });
            globalThis.Object.defineProperty(this, "_il2cpp", {
                get: () => "Il2Cpp.Pointer",
                enumerable: true
            });
        }

        valueToString(): string {
            return this.handle.toString();
        }

        toString(): string {
            return `${this.valueToString()} (${this.type.name})`;
        }

        /** Gets the element at the given index. */
        get(index: number): T {
            return read(this.handle.add(index * this.type.class.arrayElementSize), this.type) as T;
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
