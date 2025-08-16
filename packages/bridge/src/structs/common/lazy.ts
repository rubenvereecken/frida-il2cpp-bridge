import { lazy } from '../../utils/cache.js';
import { raise } from '../../utils/error.js';

function nonNullable<T>(value: T | null | undefined) {
    if (value == null) raise(`Got nullish '${value}'`);
    return value;
}

function lazyRequired<T>(fn: () => T | null | undefined) {
    return lazy(() => nonNullable(fn()));
}

let _Class: Awaited<typeof import('../class.js')>['Class'] | undefined;
(async () => {
    const { Class } = await import('../class.js');
    _Class = Class;
})();

export const LazyClass = lazyRequired(() => _Class);

let _ValueType: Awaited<typeof import('../value-type.js')>['ValueType'] | undefined;
(async () => {
    const { ValueType } = await import('../value-type.js');
    _ValueType = ValueType;
})();

export const LazyValueType = lazyRequired(() => _ValueType);
