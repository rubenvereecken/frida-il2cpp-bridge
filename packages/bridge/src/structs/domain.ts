import { recycle } from '../utils/recycle.js';
import { NativeStruct } from '../utils/native-struct.js';
import { cached, slow } from '../utils/cache.js';
import { raise } from '../utils/error.js';
import { Object_ } from './object.js';
import { Assembly } from './assembly.js';
import { readNativeList } from '../utils/read-native-list.js';
import {
    nativeDomainGet,
    nativeDomainGetAssemblies,
    nativeDomainGetAssemblyFromName,
    nativeThreadAttach,
} from '../native/index.js';
import { IntPtr } from './primitive.js';
import { corlib } from '../corlib.js';
import { Thread } from './thread.js';
import { Array } from './array.js';

/**
 * ```c
 * typedef struct Il2CppDomain
 * {
 *     Il2CppAppDomain* domain;
 *     Il2CppAppDomainSetup* setup;
 *     Il2CppAppContext* default_context;
 *     const char* friendly_name;
 *     uint32_t domain_id;
 *
 *     volatile int threadpool_jobs;
 *     void* agent_info;
 * } Il2CppDomain;
 * ```
 */
@recycle
export class Domain extends NativeStruct {
    /** Gets the assemblies that have been loaded into the execution context of the application domain. */
    @cached
    get assemblies(): Assembly[] {
        let handles = readNativeList(_ => nativeDomainGetAssemblies(this, _));

        if (handles.length == 0) {
            const assemblyObjects = this.object
                .method<Array<Object_>>('GetAssemblies')
                .overload()
                .invoke();
            handles = globalThis.Array.from(assemblyObjects).map(_ =>
                _.field<IntPtr>('_mono_assembly').value.read()
            );
        }

        return handles.map(_ => new Assembly(_));
    }

    /** Gets the encompassing object of the application domain. */
    @cached
    get object(): Object_ {
        return corlib.class('System.AppDomain').method<Object_>('get_CurrentDomain').invoke();
    }

    /** Opens and loads the assembly with the given name. */
    assembly(name: string): Assembly {
        return this.tryAssembly(name) ?? raise(`couldn't find assembly ${name}`);
    }

    /** Attached a new thread to the application domain. */
    attach(): Thread {
        return new Thread(nativeThreadAttach(this));
    }

    /** Opens and loads the assembly with the given name. */
    tryAssembly(name: string): Assembly | null {
        return new Assembly(
            nativeDomainGetAssemblyFromName(this, Memory.allocUtf8String(name))
        ).asNullable();
    }
}

export const domain = slow(() => new Domain(nativeDomainGet()));
export const getDomain = () => domain;
