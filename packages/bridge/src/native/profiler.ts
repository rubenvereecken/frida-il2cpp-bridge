import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === PROFILER FUNCTIONS ===
export const getNativeProfilerInstall = memoize(() =>
    lookup('il2cpp_profiler_install', 'void', ['pointer', 'pointer'])
);

export const getNativeProfilerSetEvents = memoize(() =>
    lookup('il2cpp_profiler_set_events', 'void', ['int'])
);

export const getNativeProfilerInstallEnterLeave = memoize(() =>
    lookup('il2cpp_profiler_install_enter_leave', 'void', ['pointer', 'pointer'])
);

export const getNativeProfilerInstallAllocation = memoize(() =>
    lookup('il2cpp_profiler_install_allocation', 'void', ['pointer'])
);

export const getNativeProfilerInstallGc = memoize(() =>
    lookup('il2cpp_profiler_install_gc', 'void', ['pointer', 'pointer'])
);

export const getNativeProfilerInstallFileio = memoize(() =>
    lookup('il2cpp_profiler_install_fileio', 'void', ['pointer'])
);

export const getNativeProfilerInstallThread = memoize(() =>
    lookup('il2cpp_profiler_install_thread', 'void', ['pointer', 'pointer'])
);
