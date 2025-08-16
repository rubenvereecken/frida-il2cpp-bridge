import { TypeEnum } from './enums/type.js';
import { nativeGetCorlib } from './native/index.js';
import { Image } from './structs/image.js';
import { cached, slow } from './utils/cache.js';

export const corlib = slow(() => new Image(nativeGetCorlib()));
export const getCorlib = () => corlib;

/**
 * Utility class for accessing System types from corlib.
 *
 * Doesn't follow ESM pattern in order to mimic qualified corlib class names.
 */
export class System {
    // === OBJECT ===

    @cached
    static get Object() {
        const c = corlib.class('System.Object');
        return c as typeof c & {
            _typeEnum: TypeEnum.OBJECT;
        };
    }

    // === PRIMITIVES ===

    @cached
    static get Void() {
        const c = corlib.class('System.Void');
        return c as typeof c & {
            _typeEnum: TypeEnum.VOID;
        };
    }

    @cached
    static get Boolean() {
        const c = corlib.class('System.Boolean');
        return c as typeof c & {
            _typeEnum: TypeEnum.BOOLEAN;
        };
    }

    @cached
    static get SByte() {
        const c = corlib.class('System.SByte');
        return c as typeof c & {
            _typeEnum: TypeEnum.BYTE;
        };
    }

    @cached
    static get Byte() {
        const c = corlib.class('System.Byte');
        return c as typeof c & {
            _typeEnum: TypeEnum.UNSIGNED_BYTE;
        };
    }

    @cached
    static get Char() {
        const c = corlib.class('System.Char');
        return c as typeof c & {
            _typeEnum: TypeEnum.CHAR;
        };
    }

    @cached
    static get Int16() {
        const c = corlib.class('System.Int16');
        return c as typeof c & {
            _typeEnum: TypeEnum.SHORT;
        };
    }

    @cached
    static get UInt16() {
        const c = corlib.class('System.UInt16');
        return c as typeof c & {
            _typeEnum: TypeEnum.UNSIGNED_SHORT;
        };
    }

    @cached
    static get Int32() {
        const c = corlib.class('System.Int32');
        return c as typeof c & {
            _typeEnum: TypeEnum.INT;
        };
    }

    @cached
    static get UInt32() {
        const c = corlib.class('System.UInt32');
        return c as typeof c & {
            _typeEnum: TypeEnum.UNSIGNED_INT;
        };
    }

    @cached
    static get Int64() {
        const c = corlib.class('System.Int64');
        return c as typeof c & {
            _typeEnum: TypeEnum.LONG;
        };
    }

    @cached
    static get UInt64() {
        const c = corlib.class('System.UInt64');
        return c as typeof c & {
            _typeEnum: TypeEnum.UNSIGNED_LONG;
        };
    }

    @cached
    static get Single() {
        const c = corlib.class('System.Single');
        return c as typeof c & {
            _typeEnum: TypeEnum.FLOAT;
        };
    }

    @cached
    static get Double() {
        const c = corlib.class('System.Double');
        return c as typeof c & {
            _typeEnum: TypeEnum.DOUBLE;
        };
    }

    @cached
    static get IntPtr() {
        const c = corlib.class('System.IntPtr');
        return c as typeof c & {
            _typeEnum: TypeEnum.NATIVE_POINTER;
        };
    }

    @cached
    static get UIntPtr() {
        const c = corlib.class('System.UIntPtr');
        return c as typeof c & {
            _typeEnum: TypeEnum.UNSIGNED_NATIVE_POINTER;
        };
    }

    @cached
    static get String() {
        const c = corlib.class('System.String');
        return c as typeof c & {
            _typeEnum: TypeEnum.STRING;
        };
    }

    @cached
    static get NativePointer() {
        const c = corlib.class('System.IntPtr');
        return c as typeof c & {
            _typeEnum: TypeEnum.NATIVE_POINTER;
        };
    }

    @cached
    static get UnsignedNativePointer() {
        const c = corlib.class('System.UIntPtr');
        return c as typeof c & {
            _typeEnum: TypeEnum.UNSIGNED_NATIVE_POINTER;
        };
    }
}
