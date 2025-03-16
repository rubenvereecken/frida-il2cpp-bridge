namespace Il2Cpp {
    export class String extends Il2Cpp.Object<'System.String'> {
        get constructorName() {
            return 'Il2Cpp.String';
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
            Il2Cpp.exports.stringGetChars(this).writeUtf16String(value ?? '');
            this.handle.add(Il2Cpp.String.lengthOffset).writeS32(value?.length ?? 0);
        }

        /**
         * For consistency with Primitive.read
         */
        read() {
            return this.content;
        }

        /**
         * For consistency with Primitive.write
         */
        write(value: string | null) {
            this.content = value;
        }

        @lazy
        static get lengthOffset(): number {
            const probe = 'vfsfitvnm';
            // prettier-ignore
            const offset = Il2Cpp.string(probe).handle.offsetOf(_ => _.readInt() == probe.length)
                ?? raise("couldn't find the length offset in the native string struct");
            return offset;
        }

        /** Gets the length of this string. */
        get length(): number {
            return Il2Cpp.exports.stringGetLength(this);
        }

        /** Gets the encompassing object of the current string. */
        get object(): Il2Cpp.Object {
            // TODO remove – just backward compatibility
            return new Il2Cpp.Object(this);
        }
    }

    /** Creates a new string with the specified content. */
    export function string(content: string | null): Il2Cpp.String {
        return new Il2Cpp.String(Il2Cpp.exports.stringNew(Memory.allocUtf8String(content ?? '')));
    }

    export type StringLike = string | Il2Cpp.String;

    export function isStringJsType(value: unknown): value is string {
        return typeof value === 'string';
    }

    export function isStringLike(value: Il2Cpp.Parameter.Value): value is StringLike {
        return typeof value === 'string' || value instanceof Il2Cpp.String;
    }
}
