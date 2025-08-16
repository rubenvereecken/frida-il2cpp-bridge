import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === INITIALIZATION AND CONFIGURATION ===
/**
 * Initializes the IL2CPP runtime.
 * @param domain_name const char* - The name of the application domain
 * @returns int - Non-zero on success, zero on failure
 */
export const nativeInitialize = lazy(() => lookup('il2cpp_init', 'int', ['pointer']));

/**
 * Initializes the IL2CPP runtime with UTF-16 domain name.
 * @param domain_name const Il2CppChar* - The UTF-16 name of the application domain
 * @returns int - Non-zero on success, zero on failure
 */
export const nativeInitializeUtf16 = lazy(() => lookup('il2cpp_init_utf16', 'int', ['pointer']));

/**
 * Shuts down the IL2CPP runtime.
 */
export const nativeShutdown = lazy(() => lookup('il2cpp_shutdown', 'void', []));

/**
 * Sets the configuration directory for IL2CPP.
 * @param config_path const char* - Path to the configuration directory
 */
export const nativeSetConfigDir = lazy(() => lookup('il2cpp_set_config_dir', 'void', ['pointer']));

/**
 * Sets the data directory for IL2CPP.
 * @param data_path const char* - Path to the data directory
 */
export const nativeSetDataDir = lazy(() => lookup('il2cpp_set_data_dir', 'void', ['pointer']));

/**
 * Sets the temporary directory for IL2CPP.
 * @param temp_path const char* - Path to the temporary directory
 */
export const nativeSetTempDir = lazy(() => lookup('il2cpp_set_temp_dir', 'void', ['pointer']));

/**
 * Sets command line arguments for the IL2CPP runtime.
 * @param argc int - Number of arguments
 * @param argv char** - Array of argument strings
 * @param basedir const char* - Base directory path
 */
export const nativeSetCommandlineArguments = lazy(() =>
    lookup('il2cpp_set_commandline_arguments', 'void', ['int', 'pointer', 'pointer'])
);

/**
 * Sets command line arguments for the IL2CPP runtime with UTF-16 encoding.
 * @param argc int - Number of arguments
 * @param argv Il2CppChar** - Array of UTF-16 argument strings
 * @param basedir const Il2CppChar* - UTF-16 base directory path
 */
export const nativeSetCommandlineArgumentsUtf16 = lazy(() =>
    lookup('il2cpp_set_commandline_arguments_utf16', 'void', ['int', 'pointer', 'pointer'])
);

/**
 * Sets the configuration with UTF-16 encoding.
 * @param executablePath const Il2CppChar* - UTF-16 path to the executable
 */
export const nativeSetConfigUtf16 = lazy(() =>
    lookup('il2cpp_set_config_utf16', 'void', ['pointer'])
);

/**
 * Sets the configuration for IL2CPP.
 * @param executablePath const char* - Path to the executable
 */
export const nativeSetConfig = lazy(() => lookup('il2cpp_set_config', 'void', ['pointer']));

/**
 * Sets custom memory allocation callbacks.
 * @param callbacks Il2CppMemoryCallbacks* - Structure containing custom memory callbacks
 */
export const nativeSetMemoryCallbacks = lazy(() =>
    lookup('il2cpp_set_memory_callbacks', 'void', ['pointer'])
);

/**
 * Adds an internal call mapping for native method implementation.
 * @param name const char* - The method name to map
 * @param method void* - Pointer to the native implementation
 */
export const nativeAddInternalCall = lazy(() =>
    lookup('il2cpp_add_internal_call', 'void', ['pointer', 'pointer'])
);

/**
 * Resolves an internal call by name.
 * @param name const char* - The internal call name to resolve
 * @returns void* - Pointer to the resolved internal call implementation
 */
export const nativeResolveInternalCall = lazy(() =>
    lookup('il2cpp_resolve_icall', 'pointer', ['pointer'])
);

/**
 * Gets the core library (mscorlib) image.
 * @returns Il2CppImage* - The core library image
 */
export const nativeGetCorlib = lazy(() => lookup('il2cpp_get_corlib', 'pointer', []));
