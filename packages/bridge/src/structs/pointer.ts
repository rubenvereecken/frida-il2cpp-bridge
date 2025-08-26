// TODO should pointer subclass ObjectLike? Should it support fields, methods, etc?

import { memoize } from '../utils/cache.js';
import { raise } from '../utils/error.js';
import type { PointerClass } from './class.js';
import { BaseObject } from './common/base-object.js';
import { Object_ } from './object.js';
import type { Type } from './type.js';

// TODO check what broke now that Pointer extends ObjectLike – what needs overriding?
export class Pointer<T extends `${string}*` = `${string}*`> extends BaseObject<T> {
    // TODO add element type back in, or referred type or something
    get type(): Type<T> {
        return this._type!;
    }

    get constructorName() {
        return 'Il2Cpp.Pointer';
    }

    // TODO check if this actually works??
    @memoize
    get object() {
        return new Object_<T>(this);
    }

    @memoize
    get class() {
        return this.object.class as PointerClass<T>;
    }

    valueToString(): string {
        return this.handle.toString();
    }

    toString(): string {
        return `${this.valueToString()} (${this.type.name})`;
    }

    isBoxed(): never;
    isBoxed() {
        raise(`Pointers don't support 'isBoxed' (called on ${this.type.name})`);
    }

    static from<U extends string>(native: NativePointerValue, elementType: Type<U>) {
        return new Pointer(native, elementType.makePointerType());
    }
}
