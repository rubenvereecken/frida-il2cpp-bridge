import { slow } from '../utils/cache.js';
import { lookup } from './common.js';

// === FIELD FUNCTIONS ===
/**
 * Gets the flags of a field.
 * @param field FieldInfo* - The field to get flags from
 * @returns int - The field flags
 */
export const nativeFieldGetFlags = slow(() => lookup('il2cpp_field_get_flags', 'int', ['pointer']));

/**
 * Gets the name of a field.
 * @param field FieldInfo* - The field to get the name of
 * @returns const char* - The field name
 */
export const nativeFieldGetName = slow(() =>
    lookup('il2cpp_field_get_name', 'pointer', ['pointer'])
);

/**
 * Gets the parent class of a field.
 * @param field FieldInfo* - The field to get the parent class of
 * @returns Il2CppClass* - The parent class
 */
export const nativeFieldGetClass = slow(() =>
    lookup('il2cpp_field_get_parent', 'pointer', ['pointer'])
);

/**
 * Gets the offset of a field within its containing object.
 * @param field FieldInfo* - The field to get the offset of
 * @returns size_t - The field offset in bytes
 */
export const nativeFieldGetOffset = slow(() =>
    lookup('il2cpp_field_get_offset', 'size_t', ['pointer'])
);

/**
 * Gets the type of a field.
 * @param field FieldInfo* - The field to get the type of
 * @returns Il2CppType* - The field type
 */
export const nativeFieldGetType = slow(() =>
    lookup('il2cpp_field_get_type', 'pointer', ['pointer'])
);

/**
 * Gets the value of a field from an object instance.
 * @param obj Il2CppObject* - The object instance
 * @param field FieldInfo* - The field to get the value from
 * @param value void* - Buffer to store the field value
 */
export const nativeFieldGetValue = slow(() =>
    lookup('il2cpp_field_get_value', 'void', ['pointer', 'pointer', 'pointer'])
);

/**
 * Gets the value of a field as a boxed object.
 * @param field FieldInfo* - The field to get the value from
 * @param obj Il2CppObject* - The object instance
 * @returns Il2CppObject* - The boxed field value
 */
export const nativeFieldGetValueObject = slow(() =>
    lookup('il2cpp_field_get_value_object', 'pointer', ['pointer', 'pointer'])
);

/**
 * Determines whether a field has the specified attribute.
 * @param field FieldInfo* - The field to check
 * @param attr_class Il2CppClass* - The attribute class to look for
 * @returns bool - True if the field has the attribute
 */
export const nativeFieldHasAttribute = slow(() =>
    lookup('il2cpp_field_has_attribute', 'bool', ['pointer', 'pointer'])
);

/**
 * Sets the value of a field on an object instance.
 * @param obj Il2CppObject* - The object instance
 * @param field FieldInfo* - The field to set the value of
 * @param value void* - Pointer to the value to set
 */
export const nativeFieldSetValue = slow(() =>
    lookup('il2cpp_field_set_value', 'void', ['pointer', 'pointer', 'pointer'])
);

/**
 * Gets the value of a static field.
 * @param field FieldInfo* - The static field to get the value from
 * @param value void* - Buffer to store the field value
 */
export const nativeFieldGetStaticValue = slow(() =>
    lookup('il2cpp_field_static_get_value', 'void', ['pointer', 'pointer'])
);

/**
 * Sets the value of a static field.
 * @param field FieldInfo* - The static field to set the value of
 * @param value void* - Pointer to the value to set
 */
export const nativeFieldSetStaticValue = slow(() =>
    lookup('il2cpp_field_static_set_value', 'void', ['pointer', 'pointer'])
);

/**
 * Sets the value of a field using a boxed object.
 * @param instance Il2CppObject* - The object instance
 * @param field FieldInfo* - The field to set the value of
 * @param value Il2CppObject* - The boxed value to set
 */
export const nativeFieldSetValueObject = slow(() =>
    lookup('il2cpp_field_set_value_object', 'void', ['pointer', 'pointer', 'pointer'])
);

/**
 * Determines whether a field is a compile-time constant.
 * @param field FieldInfo* - The field to check
 * @returns bool - True if the field is literal
 */
export const nativeFieldIsLiteral = slow(() =>
    lookup('il2cpp_field_is_literal', 'bool', ['pointer'])
);
