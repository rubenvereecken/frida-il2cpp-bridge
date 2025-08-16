// TODO should pointer subclass ObjectLike? Should it support fields, methods, etc?

import { cached } from '../utils/cache.js';
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
    @cached
    get object() {
        return new Object_<T>(this);
    }

    @cached
    get class() {
        return this.object.class;
    }

    valueToString(): string {
        return this.handle.toString();
    }

    toString(): string {
        return `${this.valueToString()} (${this.type.name})`;
    }

    static from<U extends string>(native: NativePointerValue, elementType: Type<U>) {
        return new Pointer(native, elementType.makePointerType());
    }
}
