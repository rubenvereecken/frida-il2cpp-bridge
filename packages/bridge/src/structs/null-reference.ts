import { Object_ } from './object.js';
import type { Class } from './class.js';
import type { Type } from './type.js';

export class NullReference<T extends string = string> extends Object_<T> {
    // Re-declare as non-nullable because, well... it's 0x0, so no info
    declare readonly _type: Type<T>;

    get constructorName() {
        return 'Il2Cpp.NullReference';
    }

    constructor(type: Type<T>) {
        super(ptr(0), type);
    }

    valueToString(): string {
        return 'null';
    }

    get type(): Type<T> {
        return this._type;
    }

    get class(): Class<T> {
        return this.type.class;
    }
}
