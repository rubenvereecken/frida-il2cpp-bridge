import { nativeThreadGetCurrent } from './native/index.js';
import { getModule } from './module.js';
import { Object_ } from './structs/object.js';
import { inform } from './utils/log.js';

/**
 * Installs a listener to track any thrown (unrecoverable) C# exception. \
 * This may be useful when incurring in `abort was called` errors.
 *
 * By default, it only tracks exceptions that were thrown by the *caller*
 * thread.
 *
 * **It may not work for every platform.**
 *
 * ```ts
 * Il2Cpp.perform(() => {
 *     Il2Cpp.installExceptionListener("all");
 *
 *     // rest of the code
 * });
 * ```
 *
 * For instance, it may print something along:
 * ```
 * System.NullReferenceException: Object reference not set to an instance of an object.
 *   at AddressableLoadWrapper+<LoadGameObject>d__3[T].MoveNext () [0x00000] in <00000000000000000000000000000000>:0
 *   at UnityEngine.SetupCoroutine.InvokeMoveNext (System.Collections.IEnumerator enumerator, System.IntPtr returnValueAddress) [0x00000] in <00000000000000000000000000000000>:0
 * ```
 */
export function installExceptionListener(
    targetThread: 'current' | 'all' = 'current'
): InvocationListener {
    const currentThread = nativeThreadGetCurrent();

    return Interceptor.attach(getModule().getExportByName('__cxa_throw'), function (args) {
        if (targetThread == 'current' && !nativeThreadGetCurrent().equals(currentThread)) {
            return;
        }

        inform(new Object_(args[0].readPointer()));
    });
}
