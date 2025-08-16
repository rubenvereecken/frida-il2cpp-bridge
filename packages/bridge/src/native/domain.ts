import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === DOMAIN FUNCTIONS ===
/**
 * Gets the current application domain.
 * @returns Il2CppDomain* - The current domain
 */
export const nativeDomainGet = lazy(() => lookup('il2cpp_domain_get', 'pointer', []));

/**
 * Opens an assembly by name in the specified domain.
 * @param domain Il2CppDomain* - The domain to search in
 * @param name const char* - The name of the assembly
 * @returns Il2CppAssembly* - The opened assembly, or null if not found
 */
export const nativeDomainGetAssemblyFromName = lazy(() =>
    lookup('il2cpp_domain_assembly_open', 'pointer', ['pointer', 'pointer'])
);

/**
 * Gets all assemblies in the specified domain.
 * @param domain Il2CppDomain* - The domain to get assemblies from
 * @param size size_t* - Pointer to store the number of assemblies
 * @returns Il2CppAssembly** - Array of assemblies
 */
export const nativeDomainGetAssemblies = lazy(() =>
    lookup('il2cpp_domain_get_assemblies', 'pointer', ['pointer', 'pointer'])
);
