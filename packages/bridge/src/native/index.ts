/**
 * The **core** object where all the necessary IL2CPP native functions are
 * held. \
 * `frida-il2cpp-bridge` is built around this object by providing an
 * easy-to-use abstraction layer: the user isn't expected to use it directly,
 * but it can in case of advanced use cases.
 *
 * The exports depends on the Unity version, hence some of them may be
 * unavailable; moreover, they are searched by **name** (e.g.
 * `il2cpp_class_from_name`) hence they might get stripped, hidden or
 * renamed by a nasty obfuscator.
 *
 * However, it is possible to override or set the handle of any of the
 * exports by using a global variable:
 * ```ts
 * declare global {
 *     let IL2CPP_EXPORTS: Record<string, () => NativePointer>;
 * }
 *
 * IL2CPP_EXPORTS = {
 *     il2cpp_image_get_class: () => Il2Cpp.module.base.add(0x1204c),
 *     il2cpp_class_get_parent: () => {
 *         return Memory.scanSync(Il2Cpp.module.base, Il2Cpp.module.size, "2f 10 ee 10 34 a8")[0].address;
 *     },
 * };
 *
 * Il2Cpp.perform(() => {
 *     // ...
 * });
 * ```
 */

// Export all IL2CPP native API functions organized by category
// Following the original API definition order
// All functions are prefixed with 'native' for clarity (e.g., getNativeInitialize, getNativeShutdown)

export * from './initialization.js';
export * from './memory.js';
export * from './array.js';
export * from './assembly.js';
export * from './class.js';
export * from './stats.js';
export * from './domain.js';
export * from './exception.js';
export * from './field.js';
export * from './gc.js';
export * from './gc-handle.js';
export * from './runtime.js';
export * from './liveness.js';
export * from './method.js';
export * from './profiler.js';
export * from './property.js';
export * from './object.js';
export * from './monitor.js';
export * from './string.js';
export * from './thread.js';
export * from './stack-trace.js';
export * from './type.js';
export * from './image.js';
export * from './memory-snapshot.js';
export * from './plugin.js';
export * from './logging.js';
export * from './debugger.js';
export * from './debug-metadata.js';
export * from './tls-module.js';
export * from './custom-attributes.js';
export * from './thread-affinity.js';
