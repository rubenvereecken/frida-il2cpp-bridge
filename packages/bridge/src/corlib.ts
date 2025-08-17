import type { TypeEnum } from './enums/type.js';
import { nativeGetCorlib } from './native/index.js';
import { LazyImage } from './structs/common/lazy.js';
import { memoize, lazy } from './utils/cache.js';

export const corlib = lazy(() => new LazyImage(nativeGetCorlib()));
export const getCorlib = () => corlib;

/**
 * Utility class for accessing System types from corlib.
 *
 * Doesn't follow ESM pattern in order to mimic qualified corlib class names.
 */
export class System {
    // === OBJECT ===

    @memoize
    static get Object() {
        const c = corlib.class('System.Object');
        return c as typeof c & {
            typeEnum: TypeEnum.OBJECT;
        };
    }

    // === PRIMITIVES ===

    @memoize
    static get Void() {
        const c = corlib.class('System.Void');
        return c as typeof c & {
            typeEnum: TypeEnum.VOID;
        };
    }

    @memoize
    static get Boolean() {
        const c = corlib.class('System.Boolean');
        return c as typeof c & {
            typeEnum: TypeEnum.BOOLEAN;
        };
    }

    @memoize
    static get SByte() {
        const c = corlib.class('System.SByte');
        return c as typeof c & {
            typeEnum: TypeEnum.SIGNED_BYTE;
        };
    }

    @memoize
    static get Byte() {
        const c = corlib.class('System.Byte');
        return c as typeof c & {
            typeEnum: TypeEnum.UNSIGNED_BYTE;
        };
    }

    @memoize
    static get Char() {
        const c = corlib.class('System.Char');
        return c as typeof c & {
            typeEnum: TypeEnum.CHAR;
        };
    }

    @memoize
    static get Int16() {
        const c = corlib.class('System.Int16');
        return c as typeof c & {
            typeEnum: TypeEnum.SHORT;
        };
    }

    @memoize
    static get UInt16() {
        const c = corlib.class('System.UInt16');
        return c as typeof c & {
            typeEnum: TypeEnum.UNSIGNED_SHORT;
        };
    }

    @memoize
    static get Int32() {
        const c = corlib.class('System.Int32');
        return c as typeof c & {
            typeEnum: TypeEnum.INT;
        };
    }

    @memoize
    static get UInt32() {
        const c = corlib.class('System.UInt32');
        return c as typeof c & {
            typeEnum: TypeEnum.UNSIGNED_INT;
        };
    }

    @memoize
    static get Int64() {
        const c = corlib.class('System.Int64');
        return c as typeof c & {
            typeEnum: TypeEnum.LONG;
        };
    }

    @memoize
    static get UInt64() {
        const c = corlib.class('System.UInt64');
        return c as typeof c & {
            typeEnum: TypeEnum.UNSIGNED_LONG;
        };
    }

    @memoize
    static get Single() {
        const c = corlib.class('System.Single');
        return c as typeof c & {
            typeEnum: TypeEnum.FLOAT;
        };
    }

    @memoize
    static get Double() {
        const c = corlib.class('System.Double');
        return c as typeof c & {
            typeEnum: TypeEnum.DOUBLE;
        };
    }

    @memoize
    static get IntPtr() {
        const c = corlib.class('System.IntPtr');
        return c as typeof c & {
            typeEnum: TypeEnum.SIGNED_NATIVE_POINTER;
        };
    }

    @memoize
    static get UIntPtr() {
        const c = corlib.class('System.UIntPtr');
        return c as typeof c & {
            typeEnum: TypeEnum.UNSIGNED_NATIVE_POINTER;
        };
    }

    @memoize
    static get String() {
        const c = corlib.class('System.String');
        return c as typeof c & {
            typeEnum: TypeEnum.STRING;
        };
    }
}
