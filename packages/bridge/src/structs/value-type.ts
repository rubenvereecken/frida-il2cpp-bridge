import { getNativeValueTypeBox } from '../native/index.js';
import { raise } from '../utils/error.js';
import type { Class, ValueTypeClass } from './class.js';
import { BaseObject } from './common/base-object.js';
import { Object_ } from './object.js';
import type { String } from './string.js';
import type { Type } from './type.js';

export class UnboxedValueType<T extends string = string> extends BaseObject<T> {
    // Re-declare as non-nullable because ValueTypes don't have a header with type info
    declare readonly _type: Type<T>;

    constructor(handle: NativePointerValue, type: Type<T>) {
        super(handle, type);
    }

    get constructorName() {
        return 'Il2Cpp.ValueType';
    }

    get class(): Class<T> {
        return this.type.class;
    }

    get type(): Type<T> {
        return this._type;
    }

    get _isBoxed() {
        return false as const;
    }

    // TODO: ensure value type includes primitives here
    // TODO: type helpers for value type objects
    isBoxed(this: UnboxedValueType & { class: ValueTypeClass }): false;
    isBoxed(this: UnboxedValueType): never;
    isBoxed() {
        if (!this.class.isValueType())
            raise(`Non-value type class '${this.class.name}' does not support isBoxed check`);
        return this._isBoxed;
    }

    /** Boxes the current value type in a object. */
    box(): Object_ {
        return new Object_(getNativeValueTypeBox()(this.class, this));
    }

    valueToString(): string {
        if (this.isNull()) return 'null';
        const ToString = this.method<String>('ToString', 0);
        // If ToString is defined within a value type class, we can
        // avoid a boxing operation.
        if (ToString.class._isValueType) return ToString.invoke().content ?? 'null';
        return this.box().toString() ?? 'null';
    }

    toString(): string {
        return this.valueToString();
    }
}
