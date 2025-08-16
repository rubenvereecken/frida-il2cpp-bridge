import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === PLUGIN CALLBACKS ===
/**
 * Sets the callback function for finding plugins.
 * @param callback Il2CppSetFindPlugInCallback - The callback function
 */
export const nativeSetFindPluginCallback = lazy(() =>
    lookup('il2cpp_set_find_plugin_callback', 'void', ['pointer'])
);
