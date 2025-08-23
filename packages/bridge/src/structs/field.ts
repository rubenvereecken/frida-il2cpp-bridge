import { getCorlib } from '../corlib.js';
import { FieldAttributeFlags } from '../enums/field-attribute.js';
import {
    getNativeFieldGetClass,
    getNativeFieldGetFlags,
    getNativeFieldGetName,
    getNativeFieldGetOffset,
    getNativeFieldGetStaticValue,
    getNativeFieldGetType,
    getNativeFieldSetStaticValue,
} from '../native/index.js';
import type { Il2CppValue, ParameterLike } from '../memory.js';
import { readIl2Cpp, write } from '../memory.js';
import { raise } from '../utils/error.js';
import { memoize } from '../utils/cache.js';
import { NativeStruct } from '../utils/native-struct.js';
import { Class } from './class.js';
import type { BaseObject } from './common/base-object.js';
import { Object_ } from './object.js';
import { Type } from './type.js';
import { ValueType } from './value-type.js';

export class Field<T extends Il2CppValue = Il2CppValue> extends NativeStruct {
    constructor(native: NativePointerValue) {
        super(native);

        // Shows up on Frida REPL. Useful for debugging and reverse engineering
        globalThis.Object.defineProperty(this, '__toString', {
            get: () => this.toString(),
            enumerable: true,
        });
        globalThis.Object.defineProperty(this, '_il2cpp', {
            get: () => (this instanceof BoundField ? 'Il2Cpp.BoundField' : 'Il2Cpp.Field'),
            enumerable: true,
        });
    }

    /** */
    toString(): string {
        return `${this.type.name} ${this.class.type.name}::${this.name}`;
    }

    /** Gets the class in which this field is defined. */
    @memoize
    get class(): Class {
        return new Class(getNativeFieldGetClass()(this));
    }

    /** Gets the flags of the current field. */
    @memoize
    get flags(): number {
        return getNativeFieldGetFlags()(this);
    }

    /** Determines whether this field value is known at compile time. */
    @memoize
    get isLiteral(): boolean {
        return (this.flags & FieldAttributeFlags.LITERAL) != 0;
    }

    /** Determines whether this field is static. */
    @memoize
    get isStatic(): boolean {
        return (this.flags & FieldAttributeFlags.STATIC) != 0;
    }

    /** Determines whether this field is thread static. */
    @memoize
    get isThreadStatic(): boolean {
        const offset = getCorlib()
            .class('System.AppDomain')
            .field('type_resolve_in_progress').offset;

        return this.offset == offset;
    }

    /** Gets the access modifier of this field. */
    @memoize
    get modifier(): string | undefined {
        switch (this.flags & FieldAttributeFlags.FIELD_ACCESS_MASK) {
            case FieldAttributeFlags.PRIVATE:
                return 'private';
            case FieldAttributeFlags.FAMILY_AND_ASSEMBLY:
                return 'private protected';
            case FieldAttributeFlags.ASSEMBLY:
                return 'internal';
            case FieldAttributeFlags.FAMILY:
                return 'protected';
            case FieldAttributeFlags.FAMILY_OR_ASSEMBLY:
                return 'protected internal';
            case FieldAttributeFlags.PUBLIC:
                return 'public';
        }
    }

    /** Gets the name of this field. */
    @memoize
    get name(): string {
        return getNativeFieldGetName()(this).readUtf8String()!;
    }

    /** Gets the offset of this field, calculated as the difference with its owner virtual address. */
    @memoize
    get offset(): number {
        return getNativeFieldGetOffset()(this).toNumber();
    }

    /** Gets the type of this field. */
    @memoize
    get type(): Type {
        return new Type(getNativeFieldGetType()(this));
    }

    /** Gets the value of this field. */
    get value(): T {
        if (!this.isStatic) {
            raise(
                `cannot access instance field ${this.class.type.name}::${this.name} from a class, use an object instead`
            );
        }

        // In case of value types, allocate how much is needed to fit all fields
        // Otherwise, valueTypeSize == Process.pointerSize
        const handle = Memory.alloc(this.type.class.valueTypeSize);
        getNativeFieldGetStaticValue()(this.handle, handle);

        return readIl2Cpp(handle, this.type) as T;
    }

    /** Sets the value of this field. Thread static or literal values cannot be altered yet. */
    set value(value: ParameterLike) {
        if (!this.isStatic) {
            raise(
                `cannot access instance field ${this.class.type.name}::${this.name} from a class, use an object instead`
            );
        }

        if (this.isThreadStatic || this.isLiteral) {
            raise(`cannot write the value of field ${this.name} as it's thread static or literal`);
        }

        const handle =
            // pointer-like values should be passed as-is, but boxed
            // value types (primitives included) must be unboxed first
            value instanceof Object_ && this.type.class._isValueType
                ? value.unbox()
                : value instanceof NativeStruct
                  ? value.handle
                  : value instanceof NativePointer
                    ? value
                    : write(Memory.alloc(this.type.class.valueTypeSize), value, this.type);

        getNativeFieldSetStaticValue()(this.handle, handle);
    }

    /** Derive a BoundField for access to this field's value for `instance`. */
    bind(instance: BaseObject): BoundField<T> {
        if (this.isStatic) {
            raise(`cannot bind static field ${this.class.type.name}::${this.name} to an object`);
        }

        const bound = new BoundField<T>(this.handle, instance);

        // Ensure this field and its bound version have a shared @lazy cache
        if (!(this as unknown & { _propertyCache?: Record<PropertyKey, any> })._propertyCache) {
            globalThis.Object.defineProperty(this, '_propertyCache', {
                value: {},
                configurable: false,
                enumerable: false,
                writable: true,
            });
        }

        globalThis.Object.defineProperty(bound, '_propertyCache', {
            value: (this as unknown & { _propertyCache?: Record<PropertyKey, any> })._propertyCache,
            configurable: false,
            enumerable: false,
            writable: true,
        });

        return bound;
    }
}

export class BoundField<T extends Il2CppValue = Il2CppValue> extends Field<T> {
    /** @internal */
    constructor(
        handle: NativePointerValue,
        public instance: BaseObject
    ) {
        super(handle);
    }

    toString(): string {
        return `${super.toString()} (bound @ ${this.instance.handle})`;
    }

    get valueHandle(): NativePointer {
        return this.instance.handle.add(
            this.offset - (this.instance instanceof ValueType ? Object_.headerSize : 0)
        );
    }

    /** Gets the value of this field. */
    get value(): T {
        return readIl2Cpp(this.valueHandle, this.type) as T;
    }

    /** Sets the value of this field. Thread static or literal values cannot be altered yet. */
    set value(value: ParameterLike) {
        write(this.valueHandle, value, this.type);
    }
}
