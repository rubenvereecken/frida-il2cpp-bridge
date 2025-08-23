import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === PROPERTY FUNCTIONS ===
export const getNativePropertyGetFlags = memoize(() =>
    lookup('il2cpp_property_get_flags', 'uint32', ['pointer'])
);

export const getNativePropertyGetGetMethod = memoize(() =>
    lookup('il2cpp_property_get_get_method', 'pointer', ['pointer'])
);

export const getNativePropertyGetSetMethod = memoize(() =>
    lookup('il2cpp_property_get_set_method', 'pointer', ['pointer'])
);

export const getNativePropertyGetName = memoize(() =>
    lookup('il2cpp_property_get_name', 'pointer', ['pointer'])
);

export const getNativePropertyGetParent = memoize(() =>
    lookup('il2cpp_property_get_parent', 'pointer', ['pointer'])
);
