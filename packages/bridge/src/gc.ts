import { isUnityVersionIsBelow202120 } from './application.js';
import {
    getNativeGcGetHeapSize,
    getNativeGcGetMaxTimeSlice,
    getNativeGcGetUsedSize,
    getNativeGcIsDisabled,
    getNativeGcIsIncremental,
    getNativeGcEnable,
    getNativeGcDisable,
    getNativeGcSetMaxTimeSlice,
    getNativeGcCollect,
    getNativeGcCollectALittle,
    getNativeGcStartWorld,
    getNativeGcStartIncrementalCollection,
    getNativeGcStopWorld,
    getNativeLivenessCalculationBegin,
    getNativeLivenessCalculationFromStatics,
    getNativeLivenessCalculationEnd,
    getNativeFree,
    getNativeAlloc,
    getNativeLivenessAllocateStruct,
    getNativeLivenessFinalize,
    getNativeLivenessFreeStruct,
} from './native/index.js';
import type { Class } from './structs/class.js';
import { Object_ } from './structs/object.js';

/**
 * Gets the heap size in bytes.
 */
export const getGcHeapSize = () => getNativeGcGetHeapSize()();

/**
 * Determines whether the garbage collector is enabled.
 */
export const isGcEnabled = () => !getNativeGcIsDisabled()();

/**
 * Determines whether the garbage collector is incremental
 * ([source](https://docs.unity3d.com/Manual/performance-incremental-garbage-collection.html)).
 */
export const isGcIncremental = () => !!getNativeGcIsIncremental()();

/**
 * Gets the number of nanoseconds the garbage collector can spend in a
 * collection step.
 */
export const getGcMaxTimeSlice = () => getNativeGcGetMaxTimeSlice()();

/**
 * Gets the used heap size in bytes.
 */
export const getGcUsedSize = () => getNativeGcGetUsedSize()();

/**
 * Enables or disables the garbage collector.
 */
export const setGcEnabled = (value: boolean) =>
    value ? getNativeGcEnable()() : getNativeGcDisable()();

/**
 * Sets the number of nanoseconds the garbage collector can spend in
 * a collection step.
 */
export const setGcMaxTimeSlice = (nanoseconds: number | globalThis.Int64) =>
    getNativeGcSetMaxTimeSlice()(nanoseconds);

/**
 * Forces a garbage collection of the specified generation.
 */
export const gcCollect = (generation: 0 | 1 | 2) =>
    getNativeGcCollect()(generation < 0 ? 0 : generation > 2 ? 2 : generation);

/**
 * Forces a garbage collection.
 */
export const gcCollectALittle = () => getNativeGcCollectALittle()();

/**
 *  Resumes all the previously stopped threads.
 */
export const gcStartWorld = () => getNativeGcStartWorld()();

/**
 * Performs an incremental garbage collection.
 */
export const gcStartIncrementalCollection = () => getNativeGcStartIncrementalCollection()();

/**
 * Stops all threads which may access the garbage collected heap, other
 * than the caller.
 */
export const gcStopWorld = () => getNativeGcStopWorld()();

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
        const state = getNativeLivenessCalculationBegin()(
            klass,
            0,
            chooseCallback,
            NULL,
            onWorld,
            onWorld
        );

        getNativeLivenessCalculationFromStatics()(state);
        getNativeLivenessCalculationEnd()(state);
    } else {
        const realloc = (handle: NativePointer, size: globalThis.UInt64) => {
            if (!handle.isNull() && size.compare(0) == 0) {
                getNativeFree()(handle);
                return NULL;
            } else {
                return getNativeAlloc()(size);
            }
        };

        const reallocCallback = new NativeCallback(realloc, 'pointer', [
            'pointer',
            'size_t',
            'pointer',
        ]);

        gcStopWorld();

        const state = getNativeLivenessAllocateStruct()(
            klass,
            0,
            chooseCallback,
            NULL,
            reallocCallback
        );
        getNativeLivenessCalculationFromStatics()(state);
        getNativeLivenessFinalize()(state);

        gcStartWorld();

        getNativeLivenessFreeStruct()(state);
    }

    return matches;
};
