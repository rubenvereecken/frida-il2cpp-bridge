import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === PROPERTY FUNCTIONS ===
export const nativePropertyGetFlags = lazy(() =>
    lookup('il2cpp_property_get_flags', 'uint32', ['pointer'])
);

export const nativePropertyGetGetMethod = lazy(() =>
    lookup('il2cpp_property_get_get_method', 'pointer', ['pointer'])
);

export const nativePropertyGetSetMethod = lazy(() =>
    lookup('il2cpp_property_get_set_method', 'pointer', ['pointer'])
);

export const nativePropertyGetName = lazy(() =>
    lookup('il2cpp_property_get_name', 'pointer', ['pointer'])
);

export const nativePropertyGetParent = lazy(() =>
    lookup('il2cpp_property_get_parent', 'pointer', ['pointer'])
);
