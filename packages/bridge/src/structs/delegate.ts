import { getCorlib } from '../corlib.js';
import type { ParameterLike } from '../memory.js';
import { raise } from '../utils/error.js';
import type { Class } from './class.js';
import type { MethodReturnType } from './method.js';
import type { Object_ } from './object.js';

/** Creates a delegate object of the given delegate class. */
export function delegate<P extends ParameterLike[], R extends MethodReturnType>(
    klass: Class,
    block: (...args: P) => R
): Object_ {
    const SystemDelegate = getCorlib().class('System.Delegate');
    const SystemMulticastDelegate = getCorlib().class('System.MulticastDelegate');
    if (!SystemDelegate.isAssignableFrom(klass)) {
        raise(`cannot create a delegate for ${klass.type.name} as it's a non-delegate class`);
    }
    if (klass.equals(SystemDelegate) || klass.equals(SystemMulticastDelegate)) {
        raise(
            `cannot create a delegate for neither ${SystemDelegate.type.name} nor ${SystemMulticastDelegate.type.name}, use a subclass instead`
        );
    }
    const delegate = klass.allocateObject();
    const key = delegate.handle.toString();
    const Invoke =
        delegate.tryMethod('Invoke') ??
        raise(`cannot create a delegate for ${klass.type.name}, there is no Invoke method`);
    delegate.method('.ctor').invoke(delegate, Invoke.handle);
    const callback = Invoke.wrap(block as any);
    delegate.field('method_ptr').value = callback;
    delegate.field('invoke_impl').value = callback;
    _callbacksToKeepAlive[key] = callback;
    return delegate;
}
/** @internal Used to prevent eager garbage collection against NativeCallbacks. */
export const _callbacksToKeepAlive: Record<string, NativeCallback<'void', []> | undefined> = {};
