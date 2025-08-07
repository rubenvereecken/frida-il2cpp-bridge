namespace Il2Cpp {
    /**
     * Not to be confused with "passing a parameter by reference", reference types are a C# concept.
     *
     * Opposite of `Il2Cpp.ValueType`.
     */
    export class Object_<T extends string = string> extends Il2Cpp.BaseObject<T> {
        get constructorName() {
            return 'Il2Cpp.Object';
        }

        valueToString(): string {
            return this.method<Il2Cpp.String>('ToString', 0).invoke().content ?? 'null';
        }

        toString(): string {
            return this.valueToString();
        }

        /**
         * Il2CppObject struct size, which is the header all reference types and boxed value types have.
         *
         * Should be equal to `2 * Process.pointerSize`.
         *
         * ```c
         * typedef Il2CppClass Il2CppVTable;
         * typedef struct Il2CppObject
         * {
         *     union
         *     {
         *         Il2CppClass *klass;
         *         Il2CppVTable *vtable;
         *     };
         *     MonitorData *monitor;
         * } Il2CppObject;
         * ```
         */
        @lazy
        static get headerSize(): number {
            return Il2Cpp.corlib.class('System.Object').instanceSize;
        }

        @lazy
        get class(): Il2Cpp.Class<T> {
            // Can be read from the object header as the first pointer (of two)
            return new Il2Cpp.Class<T>(Il2Cpp.exports.objectGetClass(this));
        }

        @lazy
        get type(): Il2Cpp.Type<T> {
            // TODO: by default fall back on this._type if available
            // Benefit: save a ton of il2cpp calls for figuring out type when it's already known
            return this.class.type;
        }

        get monitor(): Il2Cpp.Object_.Monitor {
            // TODO revisit
            return new Il2Cpp.Object_.Monitor(this);
        }

        /** Gets the size of the current object. */
        @lazy
        get size(): number {
            return Il2Cpp.exports.objectGetSize(this);
        }

        /** Creates a reference to this object. */
        ref(pin: boolean): Il2Cpp.GCHandle {
            return new Il2Cpp.GCHandle(Il2Cpp.exports.gcHandleNew(this, +pin));
        }

        /** Gets the correct virtual method from the given virtual method. */
        virtualMethod<T extends Il2Cpp.Method.ReturnType>(
            method: Il2Cpp.Method
        ): Il2Cpp.BoundMethod<T> {
            return new Il2Cpp.Method<T>(Il2Cpp.exports.objectGetVirtualMethod(this, method)).bind(
                this
            );
        }

        /** Unboxes the value type (either a primitive, a struct or an enum) out of this object. */
        unbox(): Il2Cpp.ValueType {
            return this.class._isValueType
                ? new Il2Cpp.ValueType(Il2Cpp.exports.objectUnbox(this), this.class.type)
                : raise(
                      `couldn't unbox instances of ${this.class.type.name} as they are not value types`
                  );
        }

        /** Creates a weak reference to this object. */
        weakRef(trackResurrection: boolean): Il2Cpp.GCHandle {
            return new Il2Cpp.GCHandle(Il2Cpp.exports.gcHandleNewWeakRef(this, +trackResurrection));
        }
    }

    export namespace Object_ {
        export class Monitor {
            /** @internal */
            constructor(/** @internal */ readonly handle: NativePointerValue) {}

            /** Acquires an exclusive lock on the current object. */
            enter(): void {
                return Il2Cpp.exports.monitorEnter(this.handle);
            }

            /** Release an exclusive lock on the current object. */
            exit(): void {
                return Il2Cpp.exports.monitorExit(this.handle);
            }

            /** Notifies a thread in the waiting queue of a change in the locked object's state. */
            pulse(): void {
                return Il2Cpp.exports.monitorPulse(this.handle);
            }

            /** Notifies all waiting threads of a change in the object's state. */
            pulseAll(): void {
                return Il2Cpp.exports.monitorPulseAll(this.handle);
            }

            /** Attempts to acquire an exclusive lock on the current object. */
            tryEnter(timeout: number): boolean {
                return !!Il2Cpp.exports.monitorTryEnter(this.handle, timeout);
            }

            /** Releases the lock on an object and attempts to block the current thread until it reacquires the lock. */
            tryWait(timeout: number): boolean {
                return !!Il2Cpp.exports.monitorTryWait(this.handle, timeout);
            }

            /** Releases the lock on an object and blocks the current thread until it reacquires the lock. */
            wait(): void {
                return Il2Cpp.exports.monitorWait(this.handle);
            }
        }
    }
}
