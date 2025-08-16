import { recycle } from '../utils/recycle.js';
import { NativeStruct } from '../utils/native-struct.js';
import { cached } from '../utils/cache.js';
import { raise } from '../utils/error.js';
import { Image } from './image.js';
import { Object_ } from './object.js';
import { string } from './string.js';
import { nativeAssemblyGetImage } from '../native/index.js';
import { IntPtr } from './primitive.js';
import { getDomain } from './domain.js';
import { Array } from './array.js';

/**
 * ```c
 * typedef struct Il2CppAssembly
 * {
 *     Il2CppImage* image;
 *     uint32_t token;
 *     int32_t referencedAssemblyStart;
 *     int32_t referencedAssemblyCount;
 *     Il2CppAssemblyName aname;
 * } Il2CppAssembly;
 */
@recycle
export class Assembly extends NativeStruct {
    constructor(native: NativePointerValue) {
        super(native);

        // Shows up on Frida REPL. Useful for debugging and reverse engineering
        globalThis.Object.defineProperty(this, '__toString', {
            get: () => this.toString(),
            enumerable: true,
        });
        globalThis.Object.defineProperty(this, '_il2cpp', {
            get: () => 'Il2Cpp.Assembly',
            enumerable: true,
        });
    }

    toString(): string {
        return this.name;
    }

    /** Gets the image of this assembly. */
    @cached
    get image(): Image {
        if (nativeAssemblyGetImage.isNull()) {
            // We need to get the System.Reflection.Module of the current assembly;
            // System.Reflection.Assembly::GetModulesInternal, for some reason,
            // throws a NullReferenceExceptionin Unity 5.3.8f1, so we must rely on
            // System.Type::get_Module instead.
            // Now we need to get any System.Type of this assembly.
            // We cannot use System.Reflection.Assembly::GetTypes because it may
            // return an empty array; hence we use System.Reflection.Assembly::GetType
            // to retrieve <Module>, a class/type that seems to be always present
            // (despite being excluded from System.Reflection.Assembly::GetTypes).
            const runtimeModule =
                this.object
                    .tryMethod<Object_>('GetType', 1)
                    ?.invoke(string('<Module>'))
                    ?.asNullable()
                    ?.tryMethod<Object_>('get_Module')
                    ?.invoke() ??
                this.object.tryMethod<Array<Object_>>('GetModules', 1)?.invoke(false)?.get(0) ??
                raise(`couldn't find the runtime module object of assembly ${this.name}`);

            return new Image(runtimeModule.field<IntPtr>('_impl').value.read());
        }

        return new Image(nativeAssemblyGetImage(this));
    }

    /** Gets the name of this assembly. */
    @cached
    get name(): string {
        return this.image.name.replace('.dll', '');
    }

    /** Gets the encompassing object of the current assembly. */
    @cached
    get object(): Object_ {
        for (const _ of getDomain()
            .object.method<Array<Object_>>('GetAssemblies', 1)
            .invoke(false)) {
            if (_.field<IntPtr>('_mono_assembly').value.read().equals(this)) {
                return _;
            }
        }

        raise("couldn't find the object of the native assembly struct");
    }
}
