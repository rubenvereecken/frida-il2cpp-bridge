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

let _Object: Awaited<typeof import('../object.js')>['Object_'] | undefined;
(async () => {
    const { Object_ } = await import('../object.js');
    _Object = Object_;
})();

export const LazyObject = lazyRequired(() => _Object);

let _Assembly: Awaited<typeof import('../assembly.js')>['Assembly'] | undefined;
(async () => {
    const { Assembly } = await import('../assembly.js');
    _Assembly = Assembly;
})();

export const LazyAssembly = lazyRequired(() => _Assembly);

let _Image: Awaited<typeof import('../image.js')>['Image'] | undefined;
(async () => {
    const { Image } = await import('../image.js');
    _Image = Image;
})();

export const LazyImage = lazyRequired(() => _Image);

let _Method: Awaited<typeof import('../method.js')>['Method'] | undefined;
(async () => {
    const { Method } = await import('../method.js');
    _Method = Method;
})();

export const LazyMethod = lazyRequired(() => _Method);
