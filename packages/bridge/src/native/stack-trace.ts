import { memoize } from '../utils/cache.js';
import { lookup } from './common.js';

// === STACK TRACE FUNCTIONS ===
/**
 * Walks the frame stack of the current thread.
 * @param func Il2CppFrameWalkFunc - The callback function for each frame
 * @param user_data void* - User data passed to the callback
 */
export const getNativeCurrentThreadWalkFrameStack = memoize(() =>
    lookup('il2cpp_current_thread_walk_frame_stack', 'void', ['pointer', 'pointer'])
);

/**
 * Walks the frame stack of the specified thread.
 * @param thread Il2CppThread* - The thread to walk
 * @param func Il2CppFrameWalkFunc - The callback function for each frame
 * @param user_data void* - User data passed to the callback
 */
export const getNativeThreadWalkFrameStack = memoize(() =>
    lookup('il2cpp_thread_walk_frame_stack', 'void', ['pointer', 'pointer', 'pointer'])
);

/**
 * Gets the top frame of the current thread.
 * @param frame Il2CppStackFrameInfo* - Output parameter for the frame info
 * @returns bool - True if a frame was found
 */
export const getNativeCurrentThreadGetTopFrame = memoize(() =>
    lookup('il2cpp_current_thread_get_top_frame', 'bool', ['pointer'])
);

/**
 * Gets the top frame of the specified thread.
 * @param thread Il2CppThread* - The thread to get the frame from
 * @param frame Il2CppStackFrameInfo* - Output parameter for the frame info
 * @returns bool - True if a frame was found
 */
export const getNativeThreadGetTopFrame = memoize(() =>
    lookup('il2cpp_thread_get_top_frame', 'bool', ['pointer', 'pointer'])
);

/**
 * Gets the frame at the specified index in the current thread.
 * @param index int32_t - The frame index
 * @param frame Il2CppStackFrameInfo* - Output parameter for the frame info
 * @returns bool - True if a frame was found at the index
 */
export const getNativeCurrentThreadGetFrameAt = memoize(() =>
    lookup('il2cpp_current_thread_get_frame_at', 'bool', ['int32', 'pointer'])
);

/**
 * Gets the frame at the specified index in the specified thread.
 * @param thread Il2CppThread* - The thread to get the frame from
 * @param index int32_t - The frame index
 * @param frame Il2CppStackFrameInfo* - Output parameter for the frame info
 * @returns bool - True if a frame was found at the index
 */
export const getNativeThreadGetFrameAt = memoize(() =>
    lookup('il2cpp_thread_get_frame_at', 'bool', ['pointer', 'int32', 'pointer'])
);

/**
 * Gets the stack depth of the current thread.
 * @returns int32_t - The number of frames in the stack
 */
export const getNativeCurrentThreadGetStackDepth = memoize(() =>
    lookup('il2cpp_current_thread_get_stack_depth', 'int32', [])
);

/**
 * Gets the stack depth of the specified thread.
 * @param thread Il2CppThread* - The thread to get the stack depth from
 * @returns int32_t - The number of frames in the stack
 */
export const getNativeThreadGetStackDepth = memoize(() =>
    lookup('il2cpp_thread_get_stack_depth', 'int32', ['pointer'])
);

/**
 * Overrides the stack backtrace functionality.
 * @param func Il2CppBacktraceFunc - The backtrace function to use
 */
export const getNativeOverrideStackBacktrace = memoize(() =>
    lookup('il2cpp_override_stack_backtrace', 'void', ['pointer'])
);
