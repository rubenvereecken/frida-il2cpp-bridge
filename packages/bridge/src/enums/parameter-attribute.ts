/*
 * Flags for Params (22.1.12).
 * See also il2cpp-tabledefs.h
 */
export const enum ParameterFlags {
    IN = 0x0001,
    OUT = 0x0002,
    OPTIONAL = 0x0010,
    RESERVED_MASK = 0xf000,
    HAS_DEFAULT = 0x1000,
    HAS_FIELD_MARSHAL = 0x2000,
    UNUSED = 0xcfe0,

    // Flags for Generic Parameters (II.23.1.7)
    // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_NON_VARIANT                           0x00
    // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_COVARIANT                             0x01
    // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_CONTRAVARIANT                         0x02
    // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_VARIANCE_MASK                         0x03
    // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_REFERENCE_TYPE_CONSTRAINT             0x04
    // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_NOT_NULLABLE_VALUE_TYPE_CONSTRAINT    0x08
    // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_DEFAULT_CONSTRUCTOR_CONSTRAINT        0x10
    // #define IL2CPP_GENERIC_PARAMETER_ATTRIBUTE_SPECIAL_CONSTRAINT_MASK               0x1C
}
