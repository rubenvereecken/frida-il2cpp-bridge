namespace CS {
    class A {}
    class B {}

    export abstract class BaseObjectLike {
        constructor(public readonly $object: Il2Cpp.Wrapped) {}

        $get<R extends CS.BaseObjectLike, S extends Il2Cpp.Wrapped>(
            key: string,
            ctor: new ($object: Il2Cpp.Wrapped) => R
        ): R {
            const value = this.$object.class.field<S>(key).bind(this.$object).value;
            return new ctor(value);
        }

        // static $ctor(...args: Il2Cpp.Parameter.Value[]): BaseSystemObject {

        // }
    }

    export class BaseValueType extends BaseObjectLike {
        declare public readonly $object: Il2Cpp.ValueType;
        constructor($object: Il2Cpp.ValueType) {
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
        write(buffer: Il2Cpp.StringLike[], index: number, count: number): number;
        write(val: string): boolean;
        write(...args: any[]): number | boolean {
            if (args[0] instanceof Array) {
                return 0;
            }

            return true;
        }
    }
}
