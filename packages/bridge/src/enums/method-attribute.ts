/*
 * Method Attributes (22.1.9)
 */
export const enum MethodAttributeFlags {
    MEMBER_ACCESS_MASK = 0x0007,
    PRIVATE_SCOPE = 0x0000,
    PRIVATE = 0x0001,
    FAMILY_AND_ASSEMBLY = 0x0002,
    ASSEMBLY = 0x0003,
    FAMILY = 0x0004,
    FAMILY_OR_ASSEMBLY = 0x0005,
    PUBLIC = 0x0006,
    STATIC = 0x0010,
    FINAL = 0x0020,
    VIRTUAL = 0x0040,
    HIDE_BY_SIG = 0x0080,
    CHECK_ACCESS_ON_OVERRIDE = 0x0200,
    VTABLE_LAYOUT_MASK = 0x0100,
    REUSE_SLOT = 0x0000,
    NEW_SLOT = 0x0100,
    ABSTRACT = 0x0400,
    SPECIAL_NAME = 0x0800,
    PINVOKE_IMPL = 0x2000,
    UNMANAGED_EXPORT = 0x0008,
    RTSPECIALNAME = 0x1000,
    RESERVED_MASK = 0xd000,
    HAS_SECURITY = 0x4000,
    REQUIRE_SEC_OBJECT = 0x8000,

    // #define METHOD_IMPL_ATTRIBUTE_CODE_TYPE_MASK       0x0003
    // #define METHOD_IMPL_ATTRIBUTE_IL                   0x0000
    // #define METHOD_IMPL_ATTRIBUTE_NATIVE               0x0001
    // #define METHOD_IMPL_ATTRIBUTE_OPTIL                0x0002
    // #define METHOD_IMPL_ATTRIBUTE_RUNTIME              0x0003

    // #define METHOD_IMPL_ATTRIBUTE_MANAGED_MASK         0x0004
    // #define METHOD_IMPL_ATTRIBUTE_UNMANAGED            0x0004
    // #define METHOD_IMPL_ATTRIBUTE_MANAGED              0x0000

    // #define METHOD_IMPL_ATTRIBUTE_FORWARD_REF          0x0010
    // #define METHOD_IMPL_ATTRIBUTE_PRESERVE_SIG         0x0080
    // #define METHOD_IMPL_ATTRIBUTE_INTERNAL_CALL        0x1000
    // #define METHOD_IMPL_ATTRIBUTE_SYNCHRONIZED         0x0020
    // #define METHOD_IMPL_ATTRIBUTE_NOINLINING           0x0008
    // #define METHOD_IMPL_ATTRIBUTE_MAX_METHOD_IMPL_VAL  0xffff

    // #define METHOD_ATTRIBUTE_MEMBER_ACCESS_MASK        0x0007
    // #define METHOD_ATTRIBUTE_COMPILER_CONTROLLED       0x0000
    // #define METHOD_ATTRIBUTE_PRIVATE                   0x0001
    // #define METHOD_ATTRIBUTE_FAM_AND_ASSEM             0x0002
    // #define METHOD_ATTRIBUTE_ASSEM                     0x0003
    // #define METHOD_ATTRIBUTE_FAMILY                    0x0004
    // #define METHOD_ATTRIBUTE_FAM_OR_ASSEM              0x0005
    // #define METHOD_ATTRIBUTE_PUBLIC                    0x0006

    // #define METHOD_ATTRIBUTE_STATIC                    0x0010
    // #define METHOD_ATTRIBUTE_FINAL                     0x0020
    // #define METHOD_ATTRIBUTE_VIRTUAL                   0x0040
    // #define METHOD_ATTRIBUTE_HIDE_BY_SIG               0x0080

    // #define METHOD_ATTRIBUTE_VTABLE_LAYOUT_MASK        0x0100
    // #define METHOD_ATTRIBUTE_REUSE_SLOT                0x0000
    // #define METHOD_ATTRIBUTE_NEW_SLOT                  0x0100

    // #define METHOD_ATTRIBUTE_STRICT                    0x0200
    // #define METHOD_ATTRIBUTE_ABSTRACT                  0x0400
    // #define METHOD_ATTRIBUTE_SPECIAL_NAME              0x0800

    // #define METHOD_ATTRIBUTE_PINVOKE_IMPL              0x2000
    // #define METHOD_ATTRIBUTE_UNMANAGED_EXPORT          0x0008
}
