import { isUnityVersionIsBelow201830 } from '../application.js';
import {
    getNativeClassFromName,
    getNativeClassFromSystemType,
    getNativeImageGetAssembly,
    getNativeImageGetClass,
    getNativeImageGetClassCount,
    getNativeImageGetName,
} from '../native/index.js';
import { raise } from '../utils/error.js';
import { memoize } from '../utils/cache.js';
import { NativeStruct } from '../utils/native-struct.js';
import { recycle } from '../utils/recycle.js';
import type { Array } from './array.js';
import type { Assembly } from './assembly.js';
import type { Class } from './class.js';
import { LazyAssembly, LazyClass } from './common/lazy.js';
import type { Object_ } from './object.js';

/**
 * ```c
 * typedef struct Il2CppImage
 * {
 *     const char* name;
 *     const char *nameNoExt;
 *     Il2CppAssembly* assembly;
 *
 *     uint32_t typeCount;
 *     uint32_t exportedTypeCount;
 *     uint32_t customAttributeCount;
 *
 *     Il2CppMetadataImageHandle metadataHandle;
 *
 *     Il2CppNameToTypeHandleHashTable * nameToClassHashTable;
 *
 *     const Il2CppCodeGenModule* codeGenModule;
 *
 *     uint32_t token;
 *     uint8_t dynamic;
 * } Il2CppImage;
 */
@recycle
export class Image extends NativeStruct {
    constructor(native: NativePointerValue) {
        super(native);

        // Shows up on Frida REPL. Useful for debugging and reverse engineering
        globalThis.Object.defineProperty(this, '__toString', {
            get: () => this.toString(),
            enumerable: true,
        });
        globalThis.Object.defineProperty(this, '_il2cpp', {
            get: () => 'Il2Cpp.Image',
            enumerable: true,
        });
    }

    toString(): string {
        return this.name;
    }

    /** Gets the assembly in which the current image is defined. */
    @memoize
    get assembly(): Assembly {
        return new LazyAssembly(getNativeImageGetAssembly()(this));
    }

    /** Gets the amount of classes defined in this image. */
    @memoize
    get classCount(): number {
        if (isUnityVersionIsBelow201830()) {
            return this.classes.length;
        } else {
            return getNativeImageGetClassCount()(this).toNumber();
        }
    }

    /** Gets the classes defined in this image. */
    @memoize
    get classes(): Class[] {
        if (isUnityVersionIsBelow201830()) {
            const types = this.assembly.object.method<Array<Object_>>('GetTypes').invoke(false);
            // In Unity 5.3.8f1, getting System.Reflection.Emit.OpCodes type name
            // without iterating all the classes first somehow blows things up at
            // app startup, hence the `Array.from`.
            const classes = globalThis.Array.from(
                types,
                _ => new LazyClass(getNativeClassFromSystemType()(_))
            );

            // <Module> class does not always exist
            // https://github.com/vfsfitvnm/frida-il2cpp-bridge/issues/627
            const Module = this.tryClass('<Module>');
            if (Module) {
                classes.unshift(Module);
            }

            return classes;
        } else {
            return globalThis.Array.from(
                globalThis.Array(this.classCount),
                (_, i) => new LazyClass(getNativeImageGetClass()(this, i))
            );
        }
    }

    /** Gets the name of this image. */
    @memoize
    get name(): string {
        return getNativeImageGetName()(this).readUtf8String()!;
    }

    /**
     * Gets the class with the specified name defined in this image.
     * By default, assumes the name the class was found by is also the type name.
     * This is wrong for:
     * - inner classes
     * - generic classes (I think)
     */
    class<T extends string>(name: T): Class<T> {
        return this.tryClass(name) ?? raise(`couldn't find class ${name} in assembly ${this.name}`);
    }

    /** Gets the class with the specified name defined in this image. */
    tryClass<T extends string>(name: T): Class<T> | null {
        const dotIndex = name.lastIndexOf('.');
        const classNamespace = Memory.allocUtf8String(
            dotIndex == -1 ? '' : name.slice(0, dotIndex)
        );
        const className = Memory.allocUtf8String(name.slice(dotIndex + 1));

        return new LazyClass<T>(
            getNativeClassFromName()(this, classNamespace, className)
        ).asNullable();
    }
}
