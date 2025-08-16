/** @internal */
export function cached(_: any, propertyKey: PropertyKey, descriptor: PropertyDescriptor) {
    const getter = descriptor.get;

    if (!getter) {
        throw new Error('@lazy can only be applied to getter accessors');
    }

    descriptor.get = function (this: unknown & { _propertyCache?: Record<PropertyKey, any> }) {
        if (!this._propertyCache) {
            Object.defineProperty(this, '_propertyCache', {
                value: {},
                configurable: false,
                enumerable: false,
                writable: true,
            });
        }

        if (!(propertyKey in this._propertyCache!)) {
            this._propertyCache![propertyKey] = getter.call(this);
        }

        return this._propertyCache![propertyKey];
    };

    return descriptor;
}

type KeyFn<Args extends unknown[]> = (...args: Readonly<Args>) => unknown;

/** @internal */
export interface MemoizedFunction<Args extends unknown[], R, This = unknown> {
    (this: This, ...args: Args): R;
    clear(): void;
}

/** Default key: JSON of args (fine for primitives; swap out if you pass objects). */
const defaultKey: KeyFn<unknown[]> = (...a) => (a.length ? JSON.stringify(a) : '__noargs__');

/** @internal Memoize a function without using `any`. */
export function memoize<Args extends unknown[], R, This = unknown>(
    fn: (this: This, ...args: Args) => R,
    key: KeyFn<Args> = defaultKey as KeyFn<Args>
): MemoizedFunction<Args, R, This> {
    const cache = new Map<unknown, R>();

    const wrapped = function (this: This, ...args: Args): R {
        const k = key(...args);
        if (cache.has(k)) return cache.get(k)!; // safe due to has(k)
        const res = fn.apply(this, args);
        cache.set(k, res);
        return res;
    } as MemoizedFunction<Args, R, This>;

    wrapped.clear = () => cache.clear();
    return wrapped;
}

// Lazy-load an object or function on first use.
type NonPrimitive = object | ((...args: unknown[]) => unknown);

/** @internal */
export function slow<T extends NonPrimitive>(factory: () => T): T {
    let inited = false;
    let value!: T;

    const get = (): T => {
        if (!inited) {
            value = factory();
            inited = true;
        }
        return value;
    };

    const handler: ProxyHandler<NonPrimitive> = {
        // Property access / method calls
        get(_t, p, r) {
            return Reflect.get(get() as object, p, r);
        },
        set(_t, p, v, r) {
            return Reflect.set(get() as object, p, v, r);
        },
        has(_t, p) {
            return p in (get() as object);
        },
        ownKeys() {
            return Reflect.ownKeys(get() as object);
        },
        getOwnPropertyDescriptor(_t, p) {
            return Object.getOwnPropertyDescriptor(get() as object, p);
        },
        defineProperty(_t, p, desc) {
            Object.defineProperty(get() as object, p, desc);
            return true;
        },
        deleteProperty(_t, p) {
            return Reflect.deleteProperty(get() as object, p);
        },

        // Shape/identity-ish bits (so instanceof, spreads, etc. behave)
        getPrototypeOf() {
            return Object.getPrototypeOf(get() as object);
        },
        setPrototypeOf(_t, proto) {
            return Object.setPrototypeOf(get() as object, proto);
        },
        isExtensible() {
            return Object.isExtensible(get() as object);
        },
        preventExtensions() {
            Object.preventExtensions(get() as object);
            return true;
        },

        // If T is callable/constructable, forward those too
        apply(_t, thisArg, args) {
            const fn = get() as unknown as (...a: unknown[]) => unknown;
            return Reflect.apply(fn, thisArg, args);
        },
        construct(_t, args, newTarget) {
            const ctor = get() as unknown as new (...a: unknown[]) => object;
            return Reflect.construct(ctor, args, newTarget);
        },
    };

    // Use a dummy function so apply/construct traps are allowed.
    const dummy = function () {
        /* empty */
    } as unknown as NonPrimitive;
    return new Proxy(dummy, handler) as unknown as T;
}
