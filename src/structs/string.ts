namespace Il2Cpp {
    export class String extends NativeStruct {
        constructor(handle: NativePointerValue) {
            super(handle);

            // Shows up on Frida REPL. Useful for debugging and reverse engineering
            globalThis.Object.defineProperty(this, '__toString', {
                get: () => this.toString(),
                enumerable: true,
            });
            globalThis.Object.defineProperty(this, '_il2cpp', {
                get: () => 'Il2Cpp.String',
                enumerable: true,
            });
        }

        valueToString(): string {
            return this.isNull() ? 'null' : `${this.content}`;
        }

        toString(): string {
            return `${this.valueToString()}`;
        }

        /** Gets the content of this string. */
        get content(): string | null {
            return Il2Cpp.exports.stringGetChars(this).readUtf16String(this.length);
        }

        /** @unsafe Sets the content of this string - it may write out of bounds! */
        set content(value: string | null) {
            // prettier-ignore
            const offset = Il2Cpp.string("vfsfitvnm").handle.offsetOf(_ => _.readInt() == 9) 
                ?? raise("couldn't find the length offset in the native string struct");

            globalThis.Object.defineProperty(Il2Cpp.String.prototype, 'content', {
                set(this: Il2Cpp.String, value: string | null) {
                    Il2Cpp.exports.stringGetChars(this).writeUtf16String(value ?? '');
                    this.handle.add(offset).writeS32(value?.length ?? 0);
                },
            });

            this.content = value;
        }

        /** Gets the length of this string. */
        get length(): number {
            return Il2Cpp.exports.stringGetLength(this);
        }

        /** Gets the encompassing object of the current string. */
        get object(): Il2Cpp.Object {
            return new Il2Cpp.Object(this);
        }
    }

    /** Creates a new string with the specified content. */
    export function string(content: string | null): Il2Cpp.String {
        return new Il2Cpp.String(Il2Cpp.exports.stringNew(Memory.allocUtf8String(content ?? '')));
    }
}
