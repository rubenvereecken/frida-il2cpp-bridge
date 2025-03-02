namespace Il2Cpp {
    export abstract class ObjectLike extends NativeStruct {
        abstract get class(): Il2Cpp.Class;
        abstract get type(): Il2Cpp.Type;

        /** Gets the field with the given name. */
        field<T extends Il2Cpp.Field.Type>(name: string): Il2Cpp.BoundField<T> {
            return this.type.class.field<T>(name).bind(this);
        }

        /** Gets the method with the given name. */
        method<T extends Il2Cpp.Method.ReturnType>(name: string, parameterCount: number = -1): Il2Cpp.BoundMethod<T> {
            return this.type.class.method<T>(name, parameterCount).bind(this);
        }

        methodWithSignature<T extends Il2Cpp.Method.ReturnType>(name: string, ...paramTypes: Il2Cpp.Type[]): Il2Cpp.BoundMethod<T> {
            return this.type.class.methodWithSignature<T>(name, ...paramTypes).bind(this);
        }

        /** Gets the field with the given name. */
        tryField<T extends Il2Cpp.Field.Type>(name: string): Il2Cpp.BoundField<T> | undefined {
            return this.type.class.tryField<T>(name)?.bind(this);
        }

        /** Gets the field with the given name. */
        tryMethod<T extends Il2Cpp.Method.ReturnType>(name: string, parameterCount: number = -1): Il2Cpp.BoundMethod<T> | undefined {
            return this.type.class.tryMethod<T>(name, parameterCount)?.bind(this);
        }

        tryMethodWithSignature<T extends Il2Cpp.Method.ReturnType>(name: string, ...paramTypes: Il2Cpp.Type[]): Il2Cpp.BoundMethod<T> | undefined {
            return this.type.class.methodWithSignature<T>(name, ...paramTypes).bind(this);
        }

        @lazy
        get m(): Il2Cpp.DynamicMethods {
            return Il2Cpp.DynamicMethodsLookup.from(this, false);
        }

        @lazy
        get f(): Il2Cpp.DynamicFields {
            return Il2Cpp.DynamicFieldsLookup.from(this, false);
        }
    }
}
