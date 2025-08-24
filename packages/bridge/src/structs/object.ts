import { System } from '../corlib.js';
import {
    getNativeGcHandleNew,
    getNativeGcHandleNewWeakRef,
    getNativeMonitorEnter,
    getNativeMonitorExit,
    getNativeMonitorPulse,
    getNativeMonitorPulseAll,
    getNativeMonitorTryEnter,
    getNativeMonitorTryWait,
    getNativeMonitorWait,
    getNativeObjectGetClass,
    getNativeObjectGetSize,
    getNativeObjectGetVirtualMethod,
    getNativeObjectUnbox,
    getNativeValueTypeBox,
} from '../native/index.js';
import { raise } from '../utils/error.js';
import { memoize } from '../utils/cache.js';
import { BaseObject } from './common/base-object.js';
import { GCHandle } from './gc-handle.js';
import type { BoundMethod, MethodReturnType } from './method.js';
import type { String } from './string.js';
import type { Type } from './type.js';
import type { Class } from './class.js';
import type { Method } from './method.js';
import type { UnboxedValueType } from './value-type.js';
import { LazyClass, LazyUnboxedValueType, LazyMethod } from './common/lazy.js';

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
    @memoize
    static get headerSize(): number {
        return System.Object.instanceSize;
    }

    @memoize
    get class(): Class<T> {
        // Can be read from the object header as the first pointer (of two)
        return new LazyClass<T>(getNativeObjectGetClass()(this));
    }

    get klass() {
        return this.class;
    }

    @memoize
    get type(): Type<T> {
        // TODO: by default fall back on this._type if available
        // Benefit: save a ton of il2cpp calls for figuring out type when it's already known
        return this.class.type;
    }

    get monitor(): Monitor {
        // TODO revisit
        return new Monitor(this);
    }

    /** Gets the size of the current object. */
    @memoize
    get size(): number {
        return getNativeObjectGetSize()(this);
    }

    /** Creates a reference to this object. */
    ref(pin: boolean): GCHandle {
        return new GCHandle(getNativeGcHandleNew()(this, +pin));
    }

    /** Gets the correct virtual method from the given virtual method. */
    virtualMethod<T extends MethodReturnType>(method: Method): BoundMethod<T> {
        return new LazyMethod<T>(getNativeObjectGetVirtualMethod()(this, method)).bind(this);
    }

    /** Unboxes the value type (either a primitive, a struct or an enum) out of this object. */
    unbox(): UnboxedValueType {
        return this.class._isValueType
            ? new LazyUnboxedValueType(getNativeObjectUnbox()(this), this.class.type)
            : raise(
                  `couldn't unbox instances of ${this.class.type.name} as they are not value types`
              );
    }

    // TODO sort this
    box(): Object_ {
        return new Object_(getNativeValueTypeBox()(this.class, this));
    }

    /** Creates a weak reference to this object. */
    weakRef(trackResurrection: boolean): GCHandle {
        return new GCHandle(getNativeGcHandleNewWeakRef()(this, +trackResurrection));
    }
}

/** TODO: revisit */
export class Monitor {
    /** @internal */
    constructor(/** @internal */ readonly handle: NativePointerValue) {}

    /** Acquires an exclusive lock on the current object. */
    enter(): void {
        return getNativeMonitorEnter()(this.handle);
    }

    /** Release an exclusive lock on the current object. */
    exit(): void {
        return getNativeMonitorExit()(this.handle);
    }

    /** Notifies a thread in the waiting queue of a change in the locked object's state. */
    pulse(): void {
        return getNativeMonitorPulse()(this.handle);
    }

    /** Notifies all waiting threads of a change in the object's state. */
    pulseAll(): void {
        return getNativeMonitorPulseAll()(this.handle);
    }

    /** Attempts to acquire an exclusive lock on the current object. */
    tryEnter(timeout: number): boolean {
        return !!getNativeMonitorTryEnter()(this.handle, timeout);
    }

    /** Releases the lock on an object and attempts to block the current thread until it reacquires the lock. */
    tryWait(timeout: number): boolean {
        return !!getNativeMonitorTryWait()(this.handle, timeout);
    }

    /** Releases the lock on an object and blocks the current thread until it reacquires the lock. */
    wait(): void {
        return getNativeMonitorWait()(this.handle);
    }
}
