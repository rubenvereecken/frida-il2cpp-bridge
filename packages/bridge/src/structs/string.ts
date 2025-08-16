import { nativeStringGetChars, nativeStringGetLength, nativeStringNew } from '../native/index.js';
import { cached } from '../utils/cache.js';
import { Object_ } from './object.js';
import { ParameterValue } from './parameter.js';

/**
 * ```c
 * typedef struct Il2CppString
 * {
 *     Il2CppObject object;
 *     int32_t length;                             ///< Length of string *excluding* the trailing null (which is included in 'chars').
 *     Il2CppChar chars[IL2CPP_ZERO_LEN_ARRAY];
 * } Il2CppString;
 * ```
 */
export class String extends Object_<'System.String'> {
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
        return nativeStringGetChars(this).readUtf16String(this.length)!;
    }

    /** @unsafe Sets the content of this string - it may write out of bounds! */
    set content(value: string | null) {
        nativeStringGetChars(this).writeUtf16String(value ?? '');
        this.handle.add(String.lengthOffset).writeS32(value?.length ?? 0);
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

    @cached
    static get lengthOffset(): number {
        return Object_.headerSize;
    }

    /** Gets the length of this string. */
    get length(): number {
        return nativeStringGetLength(this);
    }

    static from(content: string | null | undefined): String {
        return new String(nativeStringNew(Memory.allocUtf8String(content ?? '')));
    }
}

/** Creates a new string with the specified content. */
export function string(content: string | null): String {
    return String.from(content);
}

export type StringLike = string | String;

export function isJsString(value: unknown): value is string {
    return typeof value === 'string';
}

export function isStringLike(value: unknown): value is StringLike {
    return typeof value === 'string' || value instanceof String;
}
