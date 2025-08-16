import { corlib, System } from '../corlib.js';
import { nativeArrayGetLength, nativeArrayNew } from '../native/index.js';
import { Il2CppValue, ParameterLike, readIl2Cpp, write } from '../memory.js';
import { raise } from '../utils/console.js';
import { cached } from '../utils/cache.js';
import { StripArraySuffix } from '../utils/type-helpers.js';
import type { Class } from './class.js';
import { BaseObject } from './common/base-object.js';
import { Object_ } from './object.js';
import { Pointer } from './pointer.js';
import { Primitive, PrimitiveClassName, PrimitiveJSType, PrimitiveLike } from './primitive.js';
import { String, StringLike } from './string.js';
import type { Type } from './type.js';

// TODO Array now extends Object but it still doesn't support method calling
/**
 * ```c
 * typedef struct Il2CppArraySize
 * {
 *     Il2CppObject obj;
 *     Il2CppArrayBounds *bounds;
 *     il2cpp_array_size_t max_length;
 *     ALIGN_TYPE(8) void* vector[IL2CPP_ZERO_LEN_ARRAY];
 * } Il2CppArraySize;
 * ```
 */
export class Array<R extends Il2CppValue = Il2CppValue, T extends `${string}[]` = `${string}[]`>
    extends Object_<T>
    implements Iterable<R>
{
    constructor(handle: NativePointerValue, type: Type<T> | undefined = undefined) {
        super(handle, type);

        return new Proxy(this, {
            get: (target, prop) => {
                if (typeof prop === 'string') {
                    const index = Number(prop);
                    if (!isNaN(index)) {
                        return target.get(index); // Redirect array access
                    }
                }
                return (target as any)[prop]; // Default property access
            },
        });
    }

    [index: number]: T;

    get constructorName() {
        return 'Il2Cpp.Array';
    }

    valueToString(): string {
        return `[${this.read()}]`;
    }

    toString(): string {
        return this.valueToString();
    }

    /** Gets the Il2CppArray struct size. Should be equal to `Process.pointerSize * 4`. */
    @cached
    static get headerSize(): number {
        return corlib.class('System.Array').instanceSize;
    }

    @cached
    static get elementsOffset(): number {
        // Elements start at the end, so right after the whole header
        return Array.headerSize;
    }

    /** @internal Gets a pointer to the first element of the current array. */
    @cached
    get elementsPointer() {
        return Pointer.from(this.handle.add(Array.elementsOffset), this.elementType);
    }

    /** Gets the size of the object encompassed by the current array. */
    @cached
    get elementSize(): number {
        return this.elementType.class.arrayElementSize;
    }

    /** Gets the type of the object encompassed by the current array. */
    @cached
    get elementType() {
        // TODO
        raise('TODO');
        return null as unknown as Type<StripArraySuffix<T>>;
        // return this.class.type.class.baseType!;
    }

    /** Gets the total number of elements in all the dimensions of the current array. */
    @cached
    get length(): number {
        return nativeArrayGetLength(this);
    }

    /** Gets the element at the specified index of the current array. */
    get(index: number): R {
        if (index < 0 || index >= this.length) {
            raise(`cannot get element at index ${index} as the array length is ${this.length}`);
        }

        return readIl2Cpp(
            this.elementsPointer.handle.add(index * this.elementType.class.arrayElementSize),
            this.elementType
        ) as R;
    }

    /** Sets the element at the specified index of the current array. */
    set(index: number, value: R) {
        if (index < 0 || index >= this.length) {
            raise(`cannot set element at index ${index} as the array length is ${this.length}`);
        }

        write(
            this.elementsPointer.handle.add(index * this.elementType.class.arrayElementSize),
            value,
            this.elementType
        );
    }

    /** Writes the given elements starting at the given index. */
    write(values: ArrayLike<R>, offset: number = 0): void {
        if (isWrappedArray(values)) {
            values;
            const v = values.get(0);
        }
        for (let i = 0; i < values.length; i++) {
            // this.set(i + offset, values.get)i);
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
export function array<R extends Il2CppValue, T extends string>(
    klass: Class<T>,
    length: number
): Array<R, `${T}[]`>;

/** Creates a new array with the given elements. */
export function array<R extends Il2CppValue, T extends string>(
    klass: Class<T>,
    elements: R[]
): Array<R, `${T}[]`>;

export function array<R extends Il2CppValue, T extends string>(
    klass: Class<T>,
    elements: BaseObject<T>[]
): Array<R, `${T}[]`>;

/** @internal */
export function array<R extends Il2CppValue, T extends string>(
    klass: Class<T>,
    lengthOrElements: number | R[] | BaseObject<T>[]
): Array<R, `${T}[]`> {
    const length = typeof lengthOrElements == 'number' ? lengthOrElements : lengthOrElements.length;
    const array = new Array<R, `${T}[]`>(nativeArrayNew(klass, length));

    if (globalThis.Array.isArray(lengthOrElements)) {
        // TODO: Fix type compatibility between T[] and ArrayLike<T>
        array.write(lengthOrElements as any);
    }

    return array;
}

export type ArrayJSType = string[] | PrimitiveJSType[];

type StringArrayLike = StringLike[] | Array<String, 'System.String[]'>;
type PrimitiveArrayLike = PrimitiveLike[] | Array<Primitive, `${PrimitiveClassName}[]`>;
export type ArrayLike<R extends Il2CppValue = Il2CppValue> = R extends String
    ? StringArrayLike
    : R extends Primitive
      ? PrimitiveArrayLike
      : R[] | Array<R>;

export function isWrappedArray(value: ParameterLike): value is Array<Il2CppValue> {
    return value instanceof Array || (value instanceof Object_ && value.type.isArray());
}

// TODO struct arrays
export function isJsArray(value: ParameterLike): value is ParameterLike & unknown[] {
    return globalThis.Array.isArray(value);
}

export function isArrayLike(value: ParameterLike): value is ArrayLike {
    return isJsArray(value) || value instanceof Array;
}
