// TODO consider making this even more ESM-friendly
/**
 * As defined in ECMA-335, II.23.1.16.
 * See also il2cpp-blob.h.
 */
export const enum TypeEnum {
    // TODO: IL2CPP_TYPE_END        = 0x00,       /* End of List */

    // IL2CPP_TYPE_VOID       = 0x01,
    VOID = 0x01,

    // IL2CPP_TYPE_BOOLEAN    = 0x02,
    BOOLEAN = 0x02,

    // IL2CPP_TYPE_CHAR       = 0x03,
    CHAR = 0x03,

    // IL2CPP_TYPE_I1         = 0x04,
    BYTE = 0x04,

    // IL2CPP_TYPE_U1         = 0x05,
    UNSIGNED_BYTE = 0x05,

    // IL2CPP_TYPE_I2         = 0x06,
    SHORT = 0x06,

    // IL2CPP_TYPE_U2         = 0x07,
    UNSIGNED_SHORT = 0x07,

    // IL2CPP_TYPE_I4         = 0x08,
    INT = 0x08,

    // IL2CPP_TYPE_U4         = 0x09,
    UNSIGNED_INT = 0x09,

    // IL2CPP_TYPE_I8         = 0x0a,
    LONG = 0x0a,

    // IL2CPP_TYPE_U8         = 0x0b,
    UNSIGNED_LONG = 0x0b,

    // IL2CPP_TYPE_R4         = 0x0c,
    FLOAT = 0x0c,

    // IL2CPP_TYPE_R8         = 0x0d,
    DOUBLE = 0x0d,

    // IL2CPP_TYPE_STRING     = 0x0e,
    STRING = 0x0e,

    // IL2CPP_TYPE_PTR        = 0x0f,       /* arg: <type> token */
    POINTER = 0x0f,

    // IL2CPP_TYPE_BYREF      = 0x10,       /* arg: <type> token */
    BY_REF = 0x10,

    // IL2CPP_TYPE_VALUETYPE  = 0x11,       /* arg: <type> token */
    VALUE_TYPE = 0x11,

    // IL2CPP_TYPE_CLASS      = 0x12,       /* arg: <type> token */
    REFERENCE_TYPE = 0x12,

    // TODO: IL2CPP_TYPE_VAR        = 0x13,       /* Generic parameter in a generic type definition, represented as number (compressed unsigned integer) number */

    // IL2CPP_TYPE_ARRAY      = 0x14,       /* type, rank, boundsCount, bound1, loCount, lo1 */
    MULTIDIMENSIONAL_ARRAY = 0x14,

    // IL2CPP_TYPE_GENERICINST = 0x15,     /* <type> <type-arg-count> <type-1> \x{2026} <type-n> */
    GENERIC_INSTANCE = 0x15,

    // TODO: IL2CPP_TYPE_TYPEDBYREF = 0x16,
    // TODO: IL2CPP_TYPE_FNPTR      = 0x1b,        /* arg: full method signature */

    // IL2CPP_TYPE_I          = 0x18,
    NATIVE_POINTER = 0x18,

    // IL2CPP_TYPE_U          = 0x19,
    UNSIGNED_NATIVE_POINTER = 0x19,

    // IL2CPP_TYPE_OBJECT     = 0x1c,
    OBJECT = 0x1c,

    // IL2CPP_TYPE_SZARRAY = 0x1d /* 0-based one-dim-array */,
    // array: Il2Cpp.System.Void.type.makeArrayType().typeEnum,
    ARRAY = 0x1d,

    // IL2CPP_TYPE_ENUM       = 0x55,        /* an enumeration */
    ENUM = 0x55,

    // TODO: IL2CPP_TYPE_MVAR       = 0x1e,       /* Generic parameter in a generic method definition, represented as number (compressed unsigned integer)  */
    // TODO: IL2CPP_TYPE_CMOD_REQD  = 0x1f,       /* arg: typedef or typeref token */
    // TODO: IL2CPP_TYPE_CMOD_OPT   = 0x20,       /* optional arg: typedef or typref token */
    // TODO: IL2CPP_TYPE_INTERNAL   = 0x21,       /* CLR internal type */
    // TODO: IL2CPP_TYPE_MODIFIER   = 0x40,       /* Or with the following types */
    // TODO: IL2CPP_TYPE_SENTINEL   = 0x41,       /* Sentinel for varargs method signature */
    // TODO: IL2CPP_TYPE_PINNED     = 0x45,       /* Local var that points to pinned object */
    // TODO: IL2CPP_TYPE_IL2CPP_TYPE_INDEX       = 0xff        /* an index into IL2CPP type metadata table */
}
