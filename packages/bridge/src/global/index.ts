// Import everything from the main ESM exports
import * as application from '../application.js';
import * as corlib from '../corlib.js';
import * as exceptionListener from '../exception-listener.js';
import * as filters from '../filters.js';
import * as gc from '../gc.js';
import * as memory from '../memory.js';
import * as module from '../module.js';
import * as perform from '../perform.js';
import * as tracer from '../tracer.js';

// Import barrel exports
import * as structs from '../structs/index.js';
import * as native from '../native/index.js';

// Export everything under the Il2Cpp namespace
const Il2Cpp = {
    ...structs,
    ...native,
    ...application,
    ...corlib,
    ...exceptionListener,
    ...filters,
    ...gc,
    ...memory,
    ...module,
    ...perform,
    ...tracer,
};

(globalThis as any).Il2Cpp = Il2Cpp;

// Default export for easy importing
export default Il2Cpp;
