namespace Il2Cpp {
    export class String extends Il2Cpp.Object_<'System.String'> {
        get constructorName() {
            return 'Il2Cpp.String';
        }

        valueToString(): string {
            return `"${this.read()}"`;
        }

        toString(): string {
            return `${this.valueToString()}`;
        }

        /** Gets the content of this string. */
        get content(): string {
            return Il2Cpp.exports.stringGetChars(this).readUtf16String(this.length)!;
        }

        /** @unsafe Sets the content of this string - it may write out of bounds! */
        set content(value: string | null) {
            Il2Cpp.exports.stringGetChars(this).writeUtf16String(value ?? '');
            this.handle.add(Il2Cpp.String.lengthOffset).writeS32(value?.length ?? 0);
        }

        /**
         * For consistency with Primitive.read
         */
        read(): string {
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
    }

    /** Creates a new string with the specified content. */
    export function string(content: string | null): Il2Cpp.String {
        return new Il2Cpp.String(Il2Cpp.exports.stringNew(Memory.allocUtf8String(content ?? '')));
    }

    export type StringLike = string | Il2Cpp.String;

    export function isJsString(value: unknown): value is string {
        return typeof value === 'string';
    }

    export function isStringLike(value: Il2Cpp.Parameter.Value): value is StringLike {
        return typeof value === 'string' || value instanceof Il2Cpp.String;
    }
}
