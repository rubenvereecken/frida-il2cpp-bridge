type KeyFn<Args extends unknown[]> = (...args: Readonly<Args>) => unknown;

export interface MemoizedFunction<Args extends unknown[], R, This = unknown> {
    (this: This, ...args: Args): R;
    clear(): void;
}

/** Default key: JSON of args (fine for primitives; swap out if you pass objects). */
const defaultKey: KeyFn<unknown[]> = (...a) => (a.length ? JSON.stringify(a) : '__noargs__');

// -----------------------------------------------------------------------------
// Memoization utilities
// -----------------------------------------------------------------------------

/**  Memoize a standalone function (no _propertyCache involved). */
function memoizeFunction<Args extends unknown[], R, This = unknown>(
    fn: (this: This, ...args: Args) => R,
    key: KeyFn<Args> = defaultKey as KeyFn<Args>
): MemoizedFunction<Args, R, This> {
    const cache = new Map<unknown, R>();

    const wrapped = function (this: This, ...args: Args): R {
        const k = key(...args);
        if (cache.has(k)) return cache.get(k)!; // Safe due to has(k)
        const res = fn.apply(this, args);
        cache.set(k, res);
        return res;
    } as MemoizedFunction<Args, R, This>;

    wrapped.clear = () => cache.clear();
    return wrapped;
}

/** Ensure the given object owns a _propertyCache field */
function ensurePropertyCache(host: unknown & { _propertyCache?: Record<PropertyKey, any> }) {
    if (!host._propertyCache) {
        Object.defineProperty(host, '_propertyCache', {
            value: {},
            configurable: false,
            enumerable: false,
            writable: true,
        });
    }
    return host._propertyCache!;
}

/**
 * Decorator that memoizes the result of a method (instance or static).
 * The cache lives inside `_propertyCache` so it is transferable just like `cached`.
 *
 * Usage:
 *   @memoizeMethod
 *   foo(x: number): number { ... }
 */
function memoizeMethod<Args extends unknown[], R>(
    keyFn?: KeyFn<Args>
): (target: any, propertyKey: PropertyKey, descriptor: PropertyDescriptor) => void;
// Overload so it can be used as `@memoizeMethod` without parentheses
function memoizeMethod(target: any, propertyKey: PropertyKey, descriptor: PropertyDescriptor): void;
function memoizeMethod(...allArgs: any[]): any {
    // Called as decorator factory? (first arg is keyFn)
    if (
        typeof allArgs[0] === 'function' ||
        (typeof allArgs[0] === 'object' && 'get' in allArgs[2])
    ) {
        // Direct decorator usage: @memoizeMethod
        const [target, propertyKey, descriptor] = allArgs as [any, PropertyKey, PropertyDescriptor];
        return createMethodDecorator()(target, propertyKey, descriptor);
    }

    // Called as @memoizeMethod(customKey)
    const [keyFn] = allArgs as [KeyFn<any>];
    return createMethodDecorator(keyFn);

    function createMethodDecorator(key: KeyFn<any> = defaultKey as KeyFn<any>) {
        return (target: any, propertyKey: PropertyKey, descriptor: PropertyDescriptor) => {
            // Method case ---------------------------------------------------
            if (typeof descriptor.value === 'function') {
                const original = descriptor.value;

                descriptor.value = function (this: any, ...args: unknown[]) {
                    const host = this ?? target; // for static methods `this` is the constructor
                    const cacheHost = ensurePropertyCache(host);

                    if (!(propertyKey in cacheHost)) {
                        cacheHost[propertyKey] = new Map<unknown, unknown>();
                    }

                    const map: Map<unknown, unknown> = cacheHost[propertyKey];
                    const k = key(...args);
                    if (map.has(k)) return map.get(k);

                    const res = original.apply(this, args);
                    map.set(k, res);
                    return res;
                };
                return;
            }

            // Getter case ---------------------------------------------------
            if (typeof descriptor.get === 'function') {
                const getter = descriptor.get;

                descriptor.get = function (this: any) {
                    const cacheHost = ensurePropertyCache(this ?? target);

                    if (!(propertyKey in cacheHost)) {
                        cacheHost[propertyKey] = getter.call(this);
                    }

                    return cacheHost[propertyKey];
                };
                return;
            }

            throw new Error('@memoizeMethod can only be applied to methods or getters');
        };
    }
}

// -----------------------------------------------------------------------------
// Clean public API – no ambiguities, explicit options bag
// -----------------------------------------------------------------------------

export interface MemoizeOptions<Args extends unknown[]> {
    /** Custom key function (default: JSON of args). */
    key?: KeyFn<Args>;
}

// Overload     ────────────────────────────────────────────────────────────────

/**
 * Memoize results.
 *
 * Use-cases
 * 1. Function  – `const fast = memoize(slowFn)`
 * 2. Decorator – `@memoize get heavy() { return calc() }`
 * 3. Decorator with options – `@memoize({ key: ([o]) => o.id }) lookup(o) { … }`
 */
export function memoize<Args extends unknown[], R, This = unknown>(
    fn: (this: This, ...args: Args) => R,
    opts?: MemoizeOptions<Args>
): MemoizedFunction<Args, R, This>;

export function memoize<Args extends unknown[] = unknown[]>(
    opts?: MemoizeOptions<Args>
): MethodDecorator;

export function memoize(
    target: any,
    propertyKey: PropertyKey,
    descriptor: PropertyDescriptor
): void;

// Implementation
/** @internal */
export function memoize(...args: any[]): any {
    // 1. Direct decorator form: (target, propertyKey, descriptor)
    if (
        args.length === 3 &&
        typeof args[2] === 'object' &&
        (typeof args[1] === 'string' || typeof args[1] === 'symbol')
    ) {
        return memoizeMethod()(args[0], args[1], args[2]);
    }

    // 2. memoize(fn, opts?)  ➜  wrap standalone function
    if (typeof args[0] === 'function' && (args.length === 1 || args.length === 2)) {
        const fn = args[0];
        const opts: MemoizeOptions<any> = args[1] ?? {};
        return memoizeFunction(fn, opts.key ?? defaultKey);
    }

    // 3. memoize(opts?)  ➜  returns decorator factory
    const opts: MemoizeOptions<any> = args[0] ?? {};
    return memoizeMethod(opts.key ?? defaultKey);
}

// Lazy-load an object or function on first use.
type NonPrimitive = object | ((...args: unknown[]) => unknown);

export function lazy<T extends NonPrimitive>(factory: () => T): T {
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
