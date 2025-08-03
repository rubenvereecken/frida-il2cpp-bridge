namespace Il2Cpp {
    export abstract class ObjectLike<T extends string = string> extends NativeStruct {
        constructor(
            native: NativePointerValue,
            readonly _type: Il2Cpp.Type<T> | undefined = undefined
        ) {
            super(native);

            // Shows up on Frida REPL. Useful for debugging and reverse engineering
            globalThis.Object.defineProperty(this, '__toString', {
                get: () => this.toString(),
                enumerable: true,
            });

            globalThis.Object.defineProperty(this, '_il2cpp', {
                get: () => {
                    return `${this.constructorName}<${this.type.name}>`;
                },
                enumerable: true,
            });
        }

        abstract get class(): Il2Cpp.Class<T>;
        abstract get type(): Il2Cpp.Type<T>;

        abstract get constructorName(): string;

        /** Gets the field with the given name. */
        field<T extends Il2Cpp.Il2CppValue>(name: string): Il2Cpp.BoundField<T> {
            return this.type.class.field<T>(name).bind(this);
        }

        /** Gets the method with the given name. */
        method<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            parameterCount: number = -1
        ): Il2Cpp.BoundMethod<T> {
            return this.type.class.method<T>(name, parameterCount).bind(this);
        }

        methodWithSignature<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            ...paramTypes: Il2Cpp.Type[]
        ): Il2Cpp.BoundMethod<T> {
            return this.type.class.methodForSignature<T>(name, ...paramTypes).bind(this);
        }

        methodForValues<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            ...paramValues: Il2Cpp.Parameter.Value[]
        ): Il2Cpp.BoundMethod<T> {
            return this.type.class.methodForValues<T>(name, ...paramValues).bind(this);
        }

        /** Gets the field with the given name. */
        tryField<T extends Il2Cpp.Il2CppValue>(name: string): Il2Cpp.BoundField<T> | undefined {
            return this.type.class.tryField<T>(name)?.bind(this);
        }

        /** Gets the field with the given name. */
        tryMethod<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            parameterCount: number = -1
        ): Il2Cpp.BoundMethod<T> | undefined {
            return this.type.class.tryMethod<T>(name, parameterCount)?.bind(this);
        }

        tryMethodForSignature<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            ...paramTypes: Il2Cpp.Type[]
        ): Il2Cpp.BoundMethod<T> | undefined {
            return this.type.class.methodForSignature<T>(name, ...paramTypes).bind(this);
        }

        tryMethodForValues<T extends Il2Cpp.Method.ReturnType>(
            name: string,
            ...paramValues: Il2Cpp.Parameter.Value[]
        ): Il2Cpp.BoundMethod<T> | undefined {
            return this.type.class.methodForValues<T>(name, ...paramValues).bind(this);
        }

        @lazy
        get m(): Il2Cpp.DynamicMethods {
            return Il2Cpp.DynamicMethodsLookup.from(this, false);
        }

        @lazy
        get f(): Il2Cpp.DynamicFields {
            return Il2Cpp.DynamicFieldsLookup.from(this, false);
        }

        read(): any {
            if (this.isNull()) return null;

            const fields = this.class.fields.filter(f => !f.isStatic);
            const result: Il2Cpp.JsObject = {};

            // TODO I think some child classes have access to fields that aren't showing – so check the whole tree for those
            fields.forEach(field => {
                field = field.bind(this);
                // TODO make sure this exists
                result[field.name] = (field.value as any).read();
            });

            return result;
        }
    }
}
