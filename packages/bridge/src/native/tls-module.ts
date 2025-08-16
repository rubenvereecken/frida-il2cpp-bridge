import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === TLS MODULE FUNCTIONS ===
/**
 * Installs the Unity TLS interface.
 * @param unitytlsInterfaceStruct UnityTlsInterface* - The TLS interface structure
 */
export const nativeUnityInstallUnitytlsInterface = lazy(() =>
    lookup('il2cpp_unity_install_unitytls_interface', 'void', ['pointer'])
);
