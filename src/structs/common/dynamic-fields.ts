namespace Il2Cpp {
    export type DynamicFields = {
        [K in Exclude<string, ['constructor' | '#getValue' | '#setValue']>]: unknown;
    };

    export class DynamicFieldsLookup {
        constructor(
            private readonly target: Il2Cpp.ObjectLike | Il2Cpp.Class,
            isStatic: boolean
        ) {
            this.class.fields
                .filter(f => !f.isStatic === !isStatic)
                .forEach(f => {
                    globalThis.Object.defineProperty(this, f.name, {
                        get: () => this.#getValue(f.name),
                        set: value => this.#setValue(f.name, value),
                        enumerable: true,
                        configurable: true,
                    });
                });
        }

        get class(): Il2Cpp.Class {
            return this.target instanceof Il2Cpp.ObjectLike ? this.target.class : this.target;
        }

        #getValue<T extends Il2Cpp.Field.Type = Il2Cpp.Field.Type>(name: string): T {
            return this.target.field<T>(name).value;
        }

        #setValue<T extends Il2Cpp.Field.Type = Il2Cpp.Field.Type>(name: string, value: T): void {
            this.target.field<T>(name).value = value;
        }

        static from(
            target: Il2Cpp.ObjectLike | Il2Cpp.Class,
            isStatic: boolean
        ): Il2Cpp.DynamicFields {
            return new DynamicFieldsLookup(target, isStatic) as unknown as Il2Cpp.DynamicFields;
        }
    }
}
