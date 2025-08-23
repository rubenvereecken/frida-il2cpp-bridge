import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === ASSEMBLY FUNCTIONS ===
/**
 * Gets the image associated with an assembly.
 * @param assembly Il2CppAssembly* - The assembly
 * @returns Il2CppImage* - The image containing the assembly metadata
 */
export const getNativeAssemblyGetImage = memoize(() =>
    lookup('il2cpp_assembly_get_image', 'pointer', ['pointer'])
);
