import { System } from '../corlib.js';
import {
    nativeGcHandleNew,
    nativeGcHandleNewWeakRef,
    nativeMonitorEnter,
    nativeMonitorExit,
    nativeMonitorPulse,
    nativeMonitorPulseAll,
    nativeMonitorTryEnter,
    nativeMonitorTryWait,
    nativeMonitorWait,
    nativeObjectGetClass,
    nativeObjectGetSize,
    nativeObjectGetVirtualMethod,
    nativeObjectUnbox,
} from '../native/index.js';
import { raise } from '../utils/console.js';
import { cached } from '../utils/cache.js';
import { Class } from './class.js';
import { BaseObject } from './common/base-object.js';
import { GCHandle } from './gc-handle.js';
import { BoundMethod, Method, MethodReturnType } from './method.js';
import { String } from './string.js';
import { Type } from './type.js';
import { ValueType } from './value-type.js';

/**
 * Not to be confused with "passing a parameter by reference", reference types are a C# concept.
 *
 * Opposite of `Il2Cpp.ValueType`.
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
export class Object_<T extends string = string> extends BaseObject<T> {
    get constructorName() {
        return 'Il2Cpp.Object';
    }

    valueToString(): string {
        return this.method<String>('ToString', 0).invoke().content ?? 'null';
    }

    toString(): string {
        return this.valueToString();
    }

    /**
     * Il2CppObject struct size, which is the header all reference types and boxed value types have.
     *
     * Should be equal to `2 * Process.pointerSize` (see struct definition above).
     */
    @cached
    static get headerSize(): number {
        return System.Object.instanceSize;
    }

    @cached
    get class(): Class<T> {
        // Can be read from the object header as the first pointer (of two)
        return new Class<T>(nativeObjectGetClass(this));
    }

    @cached
    get type(): Type<T> {
        // TODO: by default fall back on this._type if available
        // Benefit: save a ton of il2cpp calls for figuring out type when it's already known
        return this.class.type;
    }

    get monitor(): Object_.Monitor {
        // TODO revisit
        return new Object_.Monitor(this);
    }

    /** Gets the size of the current object. */
    @cached
    get size(): number {
        return nativeObjectGetSize(this);
    }

    /** Creates a reference to this object. */
    ref(pin: boolean): GCHandle {
        return new GCHandle(nativeGcHandleNew(this, +pin));
    }

    /** Gets the correct virtual method from the given virtual method. */
    virtualMethod<T extends MethodReturnType>(method: Method): BoundMethod<T> {
        return new Method<T>(nativeObjectGetVirtualMethod(this, method)).bind(this);
    }

    /** Unboxes the value type (either a primitive, a struct or an enum) out of this object. */
    unbox(): ValueType {
        return this.class._isValueType
            ? new ValueType(nativeObjectUnbox(this), this.class.type)
            : raise(
                  `couldn't unbox instances of ${this.class.type.name} as they are not value types`
              );
    }

    /** Creates a weak reference to this object. */
    weakRef(trackResurrection: boolean): GCHandle {
        return new GCHandle(nativeGcHandleNewWeakRef(this, +trackResurrection));
    }
}

export namespace Object_ {
    export class Monitor {
        /** @internal */
        constructor(/** @internal */ readonly handle: NativePointerValue) {}

        /** Acquires an exclusive lock on the current object. */
        enter(): void {
            return nativeMonitorEnter(this.handle);
        }

        /** Release an exclusive lock on the current object. */
        exit(): void {
            return nativeMonitorExit(this.handle);
        }

        /** Notifies a thread in the waiting queue of a change in the locked object's state. */
        pulse(): void {
            return nativeMonitorPulse(this.handle);
        }

        /** Notifies all waiting threads of a change in the object's state. */
        pulseAll(): void {
            return nativeMonitorPulseAll(this.handle);
        }

        /** Attempts to acquire an exclusive lock on the current object. */
        tryEnter(timeout: number): boolean {
            return !!nativeMonitorTryEnter(this.handle, timeout);
        }

        /** Releases the lock on an object and attempts to block the current thread until it reacquires the lock. */
        tryWait(timeout: number): boolean {
            return !!nativeMonitorTryWait(this.handle, timeout);
        }

        /** Releases the lock on an object and blocks the current thread until it reacquires the lock. */
        wait(): void {
            return nativeMonitorWait(this.handle);
        }
    }
}
