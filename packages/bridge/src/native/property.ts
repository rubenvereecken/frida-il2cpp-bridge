import { slow } from '../utils/cache.js';
import { lookup } from './common.js';

// === PROPERTY FUNCTIONS ===
export const nativePropertyGetFlags = slow(() =>
    lookup('il2cpp_property_get_flags', 'uint32', ['pointer'])
);

export const nativePropertyGetGetMethod = slow(() =>
    lookup('il2cpp_property_get_get_method', 'pointer', ['pointer'])
);

export const nativePropertyGetSetMethod = slow(() =>
    lookup('il2cpp_property_get_set_method', 'pointer', ['pointer'])
);

export const nativePropertyGetName = slow(() =>
    lookup('il2cpp_property_get_name', 'pointer', ['pointer'])
);

export const nativePropertyGetParent = slow(() =>
    lookup('il2cpp_property_get_parent', 'pointer', ['pointer'])
);
