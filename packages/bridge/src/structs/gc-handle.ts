import { getNativeGcHandleFree, getNativeGcHandleGetTarget } from '../native/index.js';
import { Object_ } from './object.js';

export class GCHandle {
    /** @internal */
    constructor(readonly handle: number) {}

    /** Gets the object associated to this handle. */
    get target(): Object_ | null {
        return new Object_(getNativeGcHandleGetTarget()(this.handle)).asNullable();
    }

    /** Frees this handle. */
    free(): void {
        return getNativeGcHandleFree()(this.handle);
    }
}
