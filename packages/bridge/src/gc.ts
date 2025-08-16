import { isUnityVersionIsBelow202120 } from './application.js';
import {
    nativeGcGetHeapSize,
    nativeGcGetMaxTimeSlice,
    nativeGcGetUsedSize,
    nativeGcIsDisabled,
    nativeGcIsIncremental,
    nativeGcEnable,
    nativeGcDisable,
    nativeGcSetMaxTimeSlice,
    nativeGcCollect,
    nativeGcCollectALittle,
    nativeGcStartWorld,
    nativeGcStartIncrementalCollection,
    nativeGcStopWorld,
    nativeLivenessCalculationBegin,
    nativeLivenessCalculationFromStatics,
    nativeLivenessCalculationEnd,
    nativeFree,
    nativeAlloc,
    nativeLivenessAllocateStruct,
    nativeLivenessFinalize,
    nativeLivenessFreeStruct,
} from './native/index.js';
import { Class } from './structs/class.js';
import { Object_ } from './structs/object.js';

/**
 * Gets the heap size in bytes.
 */
export const getGcHeapSize = () => nativeGcGetHeapSize();

/**
 * Determines whether the garbage collector is enabled.
 */
export const isGcEnabled = () => !nativeGcIsDisabled();

/**
 * Determines whether the garbage collector is incremental
 * ([source](https://docs.unity3d.com/Manual/performance-incremental-garbage-collection.html)).
 */
export const isGcIncremental = () => !!nativeGcIsIncremental();

/**
 * Gets the number of nanoseconds the garbage collector can spend in a
 * collection step.
 */
export const getGcMaxTimeSlice = () => nativeGcGetMaxTimeSlice();

/**
 * Gets the used heap size in bytes.
 */
export const getGcUsedSize = () => nativeGcGetUsedSize();

/**
 * Enables or disables the garbage collector.
 */
export const setGcEnabled = (value: boolean) => (value ? nativeGcEnable() : nativeGcDisable());

/**
 * Sets the number of nanoseconds the garbage collector can spend in
 * a collection step.
 */
export const setGcMaxTimeSlice = (nanoseconds: number | globalThis.Int64) =>
    nativeGcSetMaxTimeSlice(nanoseconds);

/**
 * Forces a garbage collection of the specified generation.
 */
export const gcCollect = (generation: 0 | 1 | 2) =>
    nativeGcCollect(generation < 0 ? 0 : generation > 2 ? 2 : generation);

/**
 * Forces a garbage collection.
 */
export const gcCollectALittle = () => nativeGcCollectALittle();

/**
 *  Resumes all the previously stopped threads.
 */
export const gcStartWorld = () => nativeGcStartWorld();

/**
 * Performs an incremental garbage collection.
 */
export const gcStartIncrementalCollection = () => nativeGcStartIncrementalCollection();

/**
 * Stops all threads which may access the garbage collected heap, other
 * than the caller.
 */
export const gcStopWorld = () => nativeGcStopWorld();

/**
 * Returns the heap allocated objects of the specified class. \
 * This variant reads GC descriptors.
 */
export const gcChoose = (klass: Class): Object_[] => {
    const matches: Object_[] = [];

    const callback = (objects: NativePointer, size: number) => {
        for (let i = 0; i < size; i++) {
            matches.push(new Object_(objects.add(i * Process.pointerSize).readPointer()));
        }
    };

    const chooseCallback = new NativeCallback(callback, 'void', ['pointer', 'int', 'pointer']);

    if (isUnityVersionIsBelow202120()) {
        const onWorld = new NativeCallback(() => {}, 'void', []);
        const state = nativeLivenessCalculationBegin(
            klass,
            0,
            chooseCallback,
            NULL,
            onWorld,
            onWorld
        );

        nativeLivenessCalculationFromStatics(state);
        nativeLivenessCalculationEnd(state);
    } else {
        const realloc = (handle: NativePointer, size: globalThis.UInt64) => {
            if (!handle.isNull() && size.compare(0) == 0) {
                nativeFree(handle);
                return NULL;
            } else {
                return nativeAlloc(size);
            }
        };

        const reallocCallback = new NativeCallback(realloc, 'pointer', [
            'pointer',
            'size_t',
            'pointer',
        ]);

        gcStopWorld();

        const state = nativeLivenessAllocateStruct(klass, 0, chooseCallback, NULL, reallocCallback);
        nativeLivenessCalculationFromStatics(state);
        nativeLivenessFinalize(state);

        gcStartWorld();

        nativeLivenessFreeStruct(state);
    }

    return matches;
};
