import { NativeStruct } from '../utils/native-struct.js';
import { raise } from '../utils/error.js';
import { Int32, IntPtr, UInt64, Void } from './primitive.js';
import { cached, memoize } from '../utils/cache.js';
import { getter } from '../utils/getter.js';
import { Object_ } from './object.js';
import {
    nativeDomainGet,
    nativeThreadDetach,
    nativeThreadGetAttachedThreads,
    nativeThreadGetCurrent,
    nativeThreadIsVm,
} from '../native/index.js';
import { Class } from './class.js';
import { readNativeList } from '../utils/read-native-list.js';
import { corlib } from '../corlib.js';
import { delegate } from './delegate.js';

export class Thread extends NativeStruct {
    /** Gets the native id of the current thread. */
    get id(): number {
        let get = function (this: Thread) {
            return this.internal.field<UInt64>('thread_id').value.read().toNumber();
        };

        // https://github.com/mono/linux-packaging-mono/blob/d586f84dfea30217f34b076a616a098518aa72cd/mono/utils/mono-threads.h#L642
        if (Process.platform != 'windows') {
            const currentThreadId = Process.getCurrentThreadId();
            const currentPosixThread = ptr(get.apply(getCurrentThread()!));

            // prettier-ignore
            const offset = currentPosixThread.offsetOf(_ => _.readS32() == currentThreadId, 1024) ??
                    raise(`couldn't find the offset for determining the kernel id of a posix thread`);

            const _get = get;
            get = function (this: Thread) {
                return ptr(_get.apply(this)).add(offset).readS32();
            };
        }

        getter(Thread.prototype, 'id', get, cached);

        return this.id;
    }

    /** Gets the encompassing internal object (System.Threding.InternalThreead) of the current thread. */
    @cached
    get internal(): Object_ {
        return this.object.tryField<Object_>('internal_thread')?.value ?? this.object;
    }

    /** Determines whether the current thread is the garbage collector finalizer one. */
    @cached
    get isFinalizer(): boolean {
        return !nativeThreadIsVm(this);
    }

    /** Gets the managed id of the current thread. */
    @cached
    get managedId(): number {
        return this.object.method<Int32>('get_ManagedThreadId').invoke().read();
    }

    /** Gets the encompassing object of the current thread. */
    @cached
    get object(): Object_ {
        return new Object_(this);
    }

    /** @internal */
    @cached
    private get staticData(): NativePointer {
        return this.internal.field<IntPtr>('static_data').value.read();
    }

    /** @internal */
    @cached
    private get synchronizationContext(): Object_ {
        const get_ExecutionContext =
            this.object.tryMethod<Object_>('GetMutableExecutionContext') ??
            this.object.method('get_ExecutionContext');
        const executionContext = get_ExecutionContext.invoke();

        let synchronizationContext =
            executionContext.tryField<Object_>('_syncContext')?.value ??
            executionContext.tryMethod<Object_>('get_SynchronizationContext')?.invoke() ??
            this.tryLocalValue(corlib.class('System.Threading.SynchronizationContext'));

        if (synchronizationContext == null || synchronizationContext.isNull()) {
            if (this.handle.equals(getMainThread().handle)) {
                raise(
                    `couldn't find the synchronization context of the main thread, perhaps this is early instrumentation?`
                );
            } else {
                raise(
                    `couldn't find the synchronization context of thread #${this.managedId}, only the main thread is expected to have one`
                );
            }
        }

        return synchronizationContext;
    }

    /** Detaches the thread from the application domain. */
    detach(): void {
        return nativeThreadDetach(this);
    }

    /** Schedules a callback on the current thread. */
    schedule<T>(block: () => T | Promise<T>): Promise<T> {
        const Post = this.synchronizationContext.method('Post');

        return new Promise(resolve => {
            const delegate_ = delegate(corlib.class('System.Threading.SendOrPostCallback'), () => {
                const result = block();
                setImmediate(() => resolve(result));
                // TODO sort void typing
                return undefined as any as Void;
            });

            // This is to replace pending scheduled callbacks when the script is about to get unlaoded.
            // If we skip this cleanup, Frida's native callbacks will point to invalid memory, making
            // the application crash as soon as the IL2CPP runtime tries to execute such callbacks.
            // For instance, without the following code, this is how you can trigger a crash:
            // 1) unfocus the application;
            // 2) schedule a callback;
            // 3) reload the script;
            // 4) focus application.
            //
            // The "proper" solution consists in removing our delegates from the Unity synchroniztion
            // context, but the interface is not consisent across Unity versions - e.g. 2017.4.40f1 uses
            // a queue instead of a list, whereas newer versions do not allow null work requests.
            // The following solution, which basically redirects the invocation to a native function that
            // survives the script reloading, is much simpler, honestly.
            Script.bindWeak(globalThis, () => {
                delegate_.field('method_ptr').value = delegate_.field('invoke_impl').value =
                    nativeDomainGet;
            });

            Post.invoke(delegate_, NULL);
        });
    }

    /** @internal */
    tryLocalValue(klass: Class): Object_ | undefined {
        for (let i = 0; i < 16; i++) {
            const base = this.staticData.add(i * Process.pointerSize).readPointer();
            if (!base.isNull()) {
                const object = new Object_(base.readPointer()).asNullable();
                if (object?.class?.isSubclassOf(klass, false)) {
                    return object;
                }
            }
        }
    }
}

export const getAttachedThreads = memoize(() => {
    return readNativeList(nativeThreadGetAttachedThreads).map(_ => new Thread(_));
});

export const getCurrentThread = memoize(() => {
    return new Thread(nativeThreadGetCurrent()).asNullable();
});

export const getMainThread = memoize(() => {
    // I'm not sure if this is always the case. Typically, the main
    // thread managed id is 1, but this isn't always true: spawning
    // an Android application with Unity 5.3.8f1 will cause the Frida
    // thread to have the managed id equal to 1, whereas the main thread
    // managed id is 2.
    return getAttachedThreads()[0];
});
