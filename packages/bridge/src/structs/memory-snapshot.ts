import {
    nativeMemorySnapshotCapture,
    nativeMemorySnapshotFree,
    nativeMemorySnapshotGetClasses,
    nativeMemorySnapshotGetObjects,
} from '../native/index.js';
import { memoize } from '../utils/cache.js';
import { NativeStruct } from '../utils/native-struct.js';
import { readNativeIterator } from '../utils/read-native-iterator.js';
import { readNativeList } from '../utils/read-native-list.js';
import { Class } from './class.js';
import { Object_ } from './object.js';

export class MemorySnapshot extends NativeStruct {
    /** Captures a memory snapshot. */
    static capture(): MemorySnapshot {
        return new MemorySnapshot();
    }

    /** Creates a memory snapshot with the given handle. */
    constructor(handle: NativePointer = nativeMemorySnapshotCapture()) {
        super(handle);
    }

    /** Gets any initialized class. */
    @memoize
    get classes(): Class[] {
        return readNativeIterator(_ => nativeMemorySnapshotGetClasses(this, _)).map(
            _ => new Class(_)
        );
    }

    /** Gets the objects tracked by this memory snapshot. */
    @memoize
    get objects(): Object_[] {
        // prettier-ignore
        return readNativeList(_ => nativeMemorySnapshotGetObjects(this, _)).filter(_ => !_.isNull()).map(_ => new Object_(_));
    }

    /** Frees this memory snapshot. */
    free(): void {
        nativeMemorySnapshotFree(this);
    }
}

/** */
export function memorySnapshot<T>(block: (memorySnapshot: Omit<MemorySnapshot, 'free'>) => T): T {
    const memorySnapshot = MemorySnapshot.capture();
    const result = block(memorySnapshot);
    memorySnapshot.free();
    return result;
}
