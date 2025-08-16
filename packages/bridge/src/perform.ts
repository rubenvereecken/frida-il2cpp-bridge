import { initializeIl2cpp } from './module.js';
import { getDomain } from './structs/domain.js';
import { getCurrentThread, getMainThread } from './structs/thread.js';

/** Attaches the caller thread to Il2Cpp domain and executes the given block.  */
export async function perform<T>(
    block: () => T | Promise<T>,
    flag: 'free' | 'bind' | 'leak' | 'main' = 'bind'
): Promise<T> {
    try {
        const isInMainThread = await initializeIl2cpp(flag == 'main');

        if (flag == 'main' && !isInMainThread) {
            return perform(() => getMainThread().schedule(block), 'free');
        }

        let thread = getCurrentThread();
        const isForeignThread = thread == null;
        thread ??= getDomain().attach();

        const result = block();

        if (isForeignThread) {
            if (flag == 'free') {
                thread.detach();
            } else if (flag == 'bind') {
                Script.bindWeak(globalThis, () => thread!.detach());
            }
        }

        return result instanceof Promise ? await result : result;
    } catch (error: any) {
        Script.nextTick(_ => { throw _; }, error); // prettier-ignore
        return Promise.reject<T>(error);
    }
}
