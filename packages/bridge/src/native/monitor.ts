import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === MONITOR FUNCTIONS ===
/**
 * Enters the monitor on the specified object.
 * @param obj Il2CppObject* - The object to monitor
 */
export const getNativeMonitorEnter = memoize(() =>
    lookup('il2cpp_monitor_enter', 'void', ['pointer'])
);

/**
 * Attempts to enter the monitor on the specified object with a timeout.
 * @param obj Il2CppObject* - The object to monitor
 * @param timeout uint32_t - Timeout in milliseconds
 * @returns bool - True if the monitor was entered successfully
 */
export const getNativeMonitorTryEnter = memoize(() =>
    lookup('il2cpp_monitor_try_enter', 'bool', ['pointer', 'uint32'])
);

/**
 * Exits the monitor on the specified object.
 * @param obj Il2CppObject* - The object to release monitor from
 */
export const getNativeMonitorExit = memoize(() => lookup('il2cpp_monitor_exit', 'void', ['pointer']));

/**
 * Pulses (notifies) one waiting thread on the specified object.
 * @param obj Il2CppObject* - The object to pulse
 */
export const getNativeMonitorPulse = memoize(() =>
    lookup('il2cpp_monitor_pulse', 'void', ['pointer'])
);

/**
 * Pulses (notifies) all waiting threads on the specified object.
 * @param obj Il2CppObject* - The object to pulse all threads on
 */
export const getNativeMonitorPulseAll = memoize(() =>
    lookup('il2cpp_monitor_pulse_all', 'void', ['pointer'])
);

/**
 * Waits indefinitely on the specified object's monitor.
 * @param obj Il2CppObject* - The object to wait on
 */
export const getNativeMonitorWait = memoize(() => lookup('il2cpp_monitor_wait', 'void', ['pointer']));

/**
 * Waits on the specified object's monitor with a timeout.
 * @param obj Il2CppObject* - The object to wait on
 * @param timeout uint32_t - Timeout in milliseconds
 * @returns bool - True if signaled before timeout
 */
export const getNativeMonitorTryWait = memoize(() =>
    lookup('il2cpp_monitor_try_wait', 'bool', ['pointer', 'uint32'])
);
