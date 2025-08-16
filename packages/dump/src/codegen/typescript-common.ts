import { Il2CppValue } from '../memory.js';
import { StringLike } from '../structs/string.js';
import { ValueType } from '../structs/value-type.js';

namespace CS {
    class A {}
    class B {}

    export abstract class BaseObjectLike {
        constructor(public readonly $object: Il2CppValue) {}

        $get<R extends CS.BaseObjectLike, S extends Il2CppValue>(
            key: string,
            ctor: new ($object: Il2CppValue) => R
        ): R {
            const value = this.$object.class.field<S>(key).bind(this.$object).value;
            return new ctor(value);
        }

        // static $ctor(...args: Il2Cpp.Parameter.Value[]): BaseSystemObject {

        // }
    }

    export class BaseValueType extends BaseObjectLike {
        declare public readonly $object: ValueType;
        constructor($object: ValueType) {
            super($object);
        }
    }

    // interface ReferenceType extends BaseSystemObject {
    //     $object: Il2Cpp.ReferenceType;
    // }

    // class ExampleObjectClass extends BaseSystemObject implements ReferenceType {
    //     declare public readonly $object: Il2Cpp.ReferenceType;

    //     // constructor($object: Il2Cpp.ReferenceType) {
    //     //     super($object);
    //     // }
    // }

    class ExampleClass extends BaseObjectLike {
        write(buffer: StringLike[], index: number, count: number): number;
        write(val: string): boolean;
        write(...args: any[]): number | boolean {
            if (args[0] instanceof Array) {
                return 0;
            }

            return true;
        }
    }
}
