import { getModule } from '../module.js';
import { raise } from '../utils/error.js';
import { memoize } from '../utils/cache.js';
import type { $INLINE_FILE } from 'ts-transformer-inline-file';
import { inform } from '../utils/log.js';

declare const $inline_file: typeof $INLINE_FILE;

export const getNativeGetMemorySnapshotExports = memoize(
    () => new CModule($inline_file('../cmodules/memory-snapshot.c'))
);

export function lookup<
    R extends NativeFunctionReturnType,
    A extends NativeFunctionArgumentType[] | [],
>(exportName: string, retType: R, argTypes: A) {
    inform(`Looking up ${exportName}`);
    const handle: NativePointer | null | undefined =
        (globalThis as any).IL2CPP_EXPORTS?.[exportName]?.() ??
        getModule().findExportByName(exportName) ??
        getNativeGetMemorySnapshotExports()[exportName];

    const target = new NativeFunction(handle ?? NULL, retType, argTypes);

    return target.isNull()
        ? new Proxy(target, {
              get(value: typeof target, name: keyof typeof target) {
                  const property = value[name];
                  return typeof property === 'function' ? property.bind(value) : property;
              },
              apply() {
                  if (handle == null) {
                      raise(`couldn't resolve export ${exportName}`);
                  } else if (handle.isNull()) {
                      raise(
                          `export ${exportName} points to NULL IL2CPP library has likely been stripped, obfuscated, or customized`
                      );
                  }
              },
          })
        : target;
}
