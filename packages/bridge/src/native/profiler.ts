import { slow } from '../utils/cache.js';
import { lookup } from './common.js';

// === PROFILER FUNCTIONS ===
export const nativeProfilerInstall = slow(() =>
    lookup('il2cpp_profiler_install', 'void', ['pointer', 'pointer'])
);

export const nativeProfilerSetEvents = slow(() =>
    lookup('il2cpp_profiler_set_events', 'void', ['int'])
);

export const nativeProfilerInstallEnterLeave = slow(() =>
    lookup('il2cpp_profiler_install_enter_leave', 'void', ['pointer', 'pointer'])
);

export const nativeProfilerInstallAllocation = slow(() =>
    lookup('il2cpp_profiler_install_allocation', 'void', ['pointer'])
);

export const nativeProfilerInstallGc = slow(() =>
    lookup('il2cpp_profiler_install_gc', 'void', ['pointer', 'pointer'])
);

export const nativeProfilerInstallFileio = slow(() =>
    lookup('il2cpp_profiler_install_fileio', 'void', ['pointer'])
);

export const nativeProfilerInstallThread = slow(() =>
    lookup('il2cpp_profiler_install_thread', 'void', ['pointer', 'pointer'])
);
