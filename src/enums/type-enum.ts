namespace Il2Cpp {
    export class TypeEnum {
        // TODO: IL2CPP_TYPE_END        = 0x00,       /* End of List */

        // IL2CPP_TYPE_VOID       = 0x01,
        // @lazy
        static get VOID() {
            // return Il2Cpp.System.Void.type.typeEnum;
            return 0x01 as const;
        }

        // IL2CPP_TYPE_BOOLEAN    = 0x02,
        static get BOOLEAN() {
            return 0x02 as const;
        }

        // IL2CPP_TYPE_CHAR       = 0x03,
        static get CHAR() {
            return 0x03 as const;
        }

        // IL2CPP_TYPE_I1         = 0x04,
        static get BYTE() {
            return 0x04 as const;
        }

        // IL2CPP_TYPE_U1         = 0x05,
        static get UNSIGNED_BYTE() {
            return 0x05 as const;
        }

        // IL2CPP_TYPE_I2         = 0x06,
        static get SHORT() {
            return 0x06 as const;
        }

        // IL2CPP_TYPE_U2         = 0x07,
        static get UNSIGNED_SHORT() {
            return 0x07 as const;
        }

        // IL2CPP_TYPE_I4         = 0x08,
        static get INT() {
            return 0x08 as const;
        }

        // IL2CPP_TYPE_U4         = 0x09,
        static get UNSIGNED_INT() {
            return 0x09 as const;
        }

        // IL2CPP_TYPE_I8         = 0x0a,
        static get LONG() {
            return 0x0a as const;
        }

        // IL2CPP_TYPE_U8         = 0x0b,
        static get UNSIGNED_LONG() {
            return 0x0b as const;
        }

        // IL2CPP_TYPE_R4         = 0x0c,
        static get FLOAT() {
            return 0x0c as const;
        }

        // IL2CPP_TYPE_R8         = 0x0d,
        static get DOUBLE() {
            return 0x0d as const;
        }

        // IL2CPP_TYPE_STRING     = 0x0e,
        static get STRING() {
            return 0x0e as const;
        }

        // TODO: using `makePointerType` leads to infinite recursion, so find another way
        // IL2CPP_TYPE_PTR        = 0x0f,       /* arg: <type> token */
        // pointer: Il2Cpp.System.Int32.type.makePointerType().typeEnum,
        static get POINTER() {
            return 0x0f as const;
        }

        // IL2CPP_TYPE_BYREF      = 0x10,       /* arg: <type> token */
        // byRef: Il2Cpp.System.Int32.type.makeByRefType().typeEnum,
        static get BY_REF() {
            return 0x10 as const;
        }

        // IL2CPP_TYPE_VALUETYPE  = 0x11,       /* arg: <type> token */
        static get VALUE_TYPE() {
            // const lookupTypeEnum = (
            //     name: string,
            //     block = (kls: Il2Cpp.Class): { type: Il2Cpp.Type } => kls
            // ) => block(Il2Cpp.corlib.class(name)).type.typeEnum;
            // return lookupTypeEnum('System.Decimal');
            return 0x11 as const;
        }

        // IL2CPP_TYPE_CLASS      = 0x12,       /* arg: <type> token */
        static get REFERENCE_TYPE() {
            // const lookupTypeEnum = (
            //     name: string,
            //     block = (kls: Il2Cpp.Class): { type: Il2Cpp.Type } => kls
            // ) => block(Il2Cpp.corlib.class(name)).type.typeEnum;
            // return lookupTypeEnum('System.Array');
            return 0x12 as const;
        }

        // TODO: IL2CPP_TYPE_VAR        = 0x13,       /* Generic parameter in a generic type definition, represented as number (compressed unsigned integer) number */

        // IL2CPP_TYPE_ARRAY      = 0x14,       /* type, rank, boundsCount, bound1, loCount, lo1 */
        static get MULTIDIMENSIONAL_ARRAY() {
            // const lookupTypeEnum = (
            //     name: string,
            //     block = (kls: Il2Cpp.Class): { type: Il2Cpp.Type } => kls
            // ) => block(Il2Cpp.corlib.class(name)).type.typeEnum;
            // return lookupTypeEnum(
            //     'System.Void',
            //     kls => new Il2Cpp.Class(Il2Cpp.exports.arrayGetClass(kls, 2))
            // );
            return 0x14 as const;
        }

        // IL2CPP_TYPE_GENERICINST = 0x15,     /* <type> <type-arg-count> <type-1> \x{2026} <type-n> */
        static get GENERIC_INSTANCE() {
            // const lookupTypeEnum = (
            //     name: string,
            //     block = (kls: Il2Cpp.Class): { type: Il2Cpp.Type } => kls
            // ) => block(Il2Cpp.corlib.class(name)).type.typeEnum;
            // return lookupTypeEnum(
            //     'System.Int32',
            //     kls => kls.interfaces.find(iface => iface.name.endsWith('`1'))!
            // );
            return 0x15 as const;
        }

        // TODO: IL2CPP_TYPE_TYPEDBYREF = 0x16,
        // TODO: IL2CPP_TYPE_FNPTR      = 0x1b,        /* arg: full method signature */

        // IL2CPP_TYPE_I          = 0x18,
        static get NATIVE_POINTER() {
            // return Il2Cpp.System.IntPtr.type.typeEnum;
            return 0x18 as const;
        }

        // IL2CPP_TYPE_U          = 0x19,
        static get UNSIGNED_NATIVE_POINTER() {
            // return Il2Cpp.System.UIntPtr.type.typeEnum;
            return 0x19 as const;
        }

        // IL2CPP_TYPE_OBJECT     = 0x1c,
        static get OBJECT() {
            // const lookupTypeEnum = (
            //     name: string,
            //     block = (kls: Il2Cpp.Class): { type: Il2Cpp.Type } => kls
            // ) => block(Il2Cpp.corlib.class(name)).type.typeEnum;
            // return lookupTypeEnum('System.Object');
            return 0x1c as const;
        }

        // IL2CPP_TYPE_SZARRAY = 0x1d /* 0-based one-dim-array */,
        // array: Il2Cpp.System.Void.type.makeArrayType().typeEnum,
        static get ARRAY() {
            return 0x1d as const;
        }

        // IL2CPP_TYPE_ENUM       = 0x55,        /* an enumeration */
        static get ENUM() {
            return 0x55 as const;
        }

        // TODO: IL2CPP_TYPE_MVAR       = 0x1e,       /* Generic parameter in a generic method definition, represented as number (compressed unsigned integer)  */
        // TODO: IL2CPP_TYPE_CMOD_REQD  = 0x1f,       /* arg: typedef or typeref token */
        // TODO: IL2CPP_TYPE_CMOD_OPT   = 0x20,       /* optional arg: typedef or typref token */
        // TODO: IL2CPP_TYPE_INTERNAL   = 0x21,       /* CLR internal type */
        // TODO: IL2CPP_TYPE_MODIFIER   = 0x40,       /* Or with the following types */
        // TODO: IL2CPP_TYPE_SENTINEL   = 0x41,       /* Sentinel for varargs method signature */
        // TODO: IL2CPP_TYPE_PINNED     = 0x45,       /* Local var that points to pinned object */
        // TODO: IL2CPP_TYPE_IL2CPP_TYPE_INDEX       = 0xff        /* an index into IL2CPP type metadata table */
    }
}
