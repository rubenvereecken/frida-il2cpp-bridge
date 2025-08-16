import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === DEBUGGER FUNCTIONS ===
/**
 * Sets the debugger agent options.
 * @param options const char* - The debugger agent options string
 */
export const nativeDebuggerSetAgentOptions = lazy(() =>
    lookup('il2cpp_debugger_set_agent_options', 'void', ['pointer'])
);

/**
 * Checks if a debugger is currently attached.
 * @returns bool - True if a debugger is attached
 */
export const nativeIsDebuggerAttached = lazy(() =>
    lookup('il2cpp_is_debugger_attached', 'bool', [])
);

/**
 * Registers a debugger agent transport.
 * @param transport Il2CppDebuggerTransport* - The transport to register
 */
export const nativeRegisterDebuggerAgentTransport = lazy(() =>
    lookup('il2cpp_register_debugger_agent_transport', 'void', ['pointer'])
);
