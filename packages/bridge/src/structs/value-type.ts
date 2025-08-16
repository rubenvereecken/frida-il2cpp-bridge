import { nativeValueTypeBox } from '../native/index.js';
import type { Class } from './class.js';
import { BaseObject } from './common/base-object.js';
import { Object_ } from './object.js';
import type { String } from './string.js';
import type { Type } from './type.js';

export class ValueType<T extends string = string> extends BaseObject<T> {
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

    /** Boxes the current value type in a object. */
    box(): Object_ {
        return new Object_(nativeValueTypeBox(this.class, this));
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
