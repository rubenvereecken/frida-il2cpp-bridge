import { slow } from '../utils/cache.js';
import { lookup } from './common.js';

// === CUSTOM ATTRIBUTES FUNCTIONS ===
/**
 * Gets custom attributes from the specified class.
 * @param klass Il2CppClass* - The class to get custom attributes from
 * @returns Il2CppArray* - Array of custom attributes
 */
export const nativeCustomAttrsFromClass = slow(() =>
    lookup('il2cpp_custom_attrs_from_class', 'pointer', ['pointer'])
);

/**
 * Gets custom attributes from the specified method.
 * @param method Il2CppMethod* - The method to get custom attributes from
 * @returns Il2CppArray* - Array of custom attributes
 */
export const nativeCustomAttrsFromMethod = slow(() =>
    lookup('il2cpp_custom_attrs_from_method', 'pointer', ['pointer'])
);

/**
 * Gets a specific custom attribute from a custom attributes array.
 * @param attributes Il2CppArray* - The custom attributes array
 * @param attrClass Il2CppClass* - The attribute class to look for
 * @returns Il2CppObject* - The custom attribute instance, or null if not found
 */
export const nativeCustomAttrsGetAttr = slow(() =>
    lookup('il2cpp_custom_attrs_get_attr', 'pointer', ['pointer', 'pointer'])
);

/**
 * Checks if a specific custom attribute exists in a custom attributes array.
 * @param attributes Il2CppArray* - The custom attributes array
 * @param attrClass Il2CppClass* - The attribute class to look for
 * @returns bool - True if the attribute exists
 */
export const nativeCustomAttrsHasAttr = slow(() =>
    lookup('il2cpp_custom_attrs_has_attr', 'bool', ['pointer', 'pointer'])
);

/**
 * Constructs custom attribute instances from raw attribute data.
 * @param attrs Il2CppCustomAttributeDataStorage* - The raw attribute data
 * @returns Il2CppArray* - Array of constructed custom attribute instances
 */
export const nativeCustomAttrsConstruct = slow(() =>
    lookup('il2cpp_custom_attrs_construct', 'pointer', ['pointer'])
);

/**
 * Frees memory associated with custom attributes.
 * @param attrs Il2CppArray* - The custom attributes array to free
 */
export const nativeCustomAttrsFree = slow(() =>
    lookup('il2cpp_custom_attrs_free', 'void', ['pointer'])
);
