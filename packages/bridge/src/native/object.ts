import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === OBJECT FUNCTIONS ===
/**
 * Gets the class of an object.
 * In practice, this is the first pointer of two in the object header.
 *
 * @param obj Il2CppObject* - The object to get the class of
 * @returns Il2CppClass* - The class of the object
 */
export const getNativeObjectGetClass = memoize(() =>
    lookup('il2cpp_object_get_class', 'pointer', ['pointer'])
);

/**
 * Gets the size of an object in bytes.
 * @param obj Il2CppObject* - The object to get the size of
 * @returns uint32_t - The object size in bytes
 */
export const getNativeObjectGetSize = memoize(() =>
    lookup('il2cpp_object_get_size', 'uint32', ['pointer'])
);

/**
 * Gets the virtual method implementation for an object.
 * @param obj Il2CppObject* - The object instance
 * @param method MethodInfo* - The virtual method to resolve
 * @returns MethodInfo* - The actual method implementation
 */
export const getNativeObjectGetVirtualMethod = memoize(() =>
    lookup('il2cpp_object_get_virtual_method', 'pointer', ['pointer', 'pointer'])
);

/**
 * Allocates a new object of the specified class, after first initializing the class.
 * @param klass Il2CppClass* - The class to instantiate
 * @returns Il2CppObject* - The newly allocated object
 */
export const getNativeObjectNew = memoize(() =>
    lookup('il2cpp_object_new', 'pointer', ['pointer'])
);

/**
 * Unboxes a boxed value type object.
 * @param obj Il2CppObject* - The boxed object to unbox
 * @returns void* - Pointer to the unboxed value
 */
export const getNativeObjectUnbox = memoize(() =>
    lookup('il2cpp_object_unbox', 'pointer', ['pointer'])
);

/**
 * Boxes a value type into an object.
 * @param klass Il2CppClass* - The value type class
 * @param data void* - Pointer to the value to box
 * @returns Il2CppObject* - The boxed object
 */
export const getNativeValueTypeBox = memoize(() =>
    lookup('il2cpp_value_box', 'pointer', ['pointer', 'pointer'])
);

/**
 * Initializes an object by calling its constructor.
 * @param obj Il2CppObject* - The object to initialize
 */
export const getNativeObjectInitialize = memoize(() =>
    lookup('il2cpp_runtime_object_init', 'void', ['pointer'])
);

/**
 * Initializes an object by calling its constructor with exception handling.
 * @param obj Il2CppObject* - The object to initialize
 * @param exc Il2CppException** - Output parameter for exceptions
 */
export const getNativeObjectInitializeException = memoize(() =>
    lookup('il2cpp_runtime_object_init_exception', 'void', ['pointer', 'pointer'])
);
