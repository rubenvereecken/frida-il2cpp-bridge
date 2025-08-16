import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === PROFILER FUNCTIONS ===
export const nativeProfilerInstall = lazy(() =>
    lookup('il2cpp_profiler_install', 'void', ['pointer', 'pointer'])
);

export const nativeProfilerSetEvents = lazy(() =>
    lookup('il2cpp_profiler_set_events', 'void', ['int'])
);

export const nativeProfilerInstallEnterLeave = lazy(() =>
    lookup('il2cpp_profiler_install_enter_leave', 'void', ['pointer', 'pointer'])
);

export const nativeProfilerInstallAllocation = lazy(() =>
    lookup('il2cpp_profiler_install_allocation', 'void', ['pointer'])
);

export const nativeProfilerInstallGc = lazy(() =>
    lookup('il2cpp_profiler_install_gc', 'void', ['pointer', 'pointer'])
);

export const nativeProfilerInstallFileio = lazy(() =>
    lookup('il2cpp_profiler_install_fileio', 'void', ['pointer'])
);

export const nativeProfilerInstallThread = lazy(() =>
    lookup('il2cpp_profiler_install_thread', 'void', ['pointer', 'pointer'])
);
