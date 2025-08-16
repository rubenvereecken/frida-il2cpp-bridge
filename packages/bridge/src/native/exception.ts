import { lazy } from '../utils/cache.js';
import { lookup } from './common.js';

// === EXCEPTION FUNCTIONS ===
/**
 * Raises an exception (does not return).
 * @param ex Il2CppException* - The exception to raise
 */
export const nativeRaiseException = lazy(() =>
    lookup('il2cpp_raise_exception', 'void', ['pointer'])
);

/**
 * Creates an exception from name and message.
 * @param image Il2CppImage* - The image containing the exception class
 * @param name_space const char* - The namespace of the exception class
 * @param name const char* - The name of the exception class
 * @param msg const char* - The exception message
 * @returns Il2CppException* - The created exception
 */
export const nativeExceptionFromNameMsg = lazy(() =>
    lookup('il2cpp_exception_from_name_msg', 'pointer', [
        'pointer',
        'pointer',
        'pointer',
        'pointer',
    ])
);

/**
 * Gets an ArgumentNullException for the specified argument.
 * @param arg const char* - The name of the null argument
 * @returns Il2CppException* - The ArgumentNullException
 */
export const nativeGetExceptionArgumentNull = lazy(() =>
    lookup('il2cpp_get_exception_argument_null', 'pointer', ['pointer'])
);

/**
 * Formats an exception message into a buffer.
 * @param ex Il2CppException* - The exception to format
 * @param message char* - Buffer to store the formatted message
 * @param message_size int - Size of the message buffer
 */
export const nativeFormatException = lazy(() =>
    lookup('il2cpp_format_exception', 'void', ['pointer', 'pointer', 'int'])
);

/**
 * Formats an exception stack trace into a buffer.
 * @param ex Il2CppException* - The exception to format stack trace for
 * @param output char* - Buffer to store the formatted stack trace
 * @param output_size int - Size of the output buffer
 */
export const nativeFormatStackTrace = lazy(() =>
    lookup('il2cpp_format_stack_trace', 'void', ['pointer', 'pointer', 'int'])
);

/**
 * Handles an unhandled exception.
 * @param ex Il2CppException* - The unhandled exception
 */
export const nativeUnhandledException = lazy(() =>
    lookup('il2cpp_unhandled_exception', 'void', ['pointer'])
);

/**
 * Gets the native stack trace for an exception.
 * @param ex Il2CppException* - The exception to get native stack trace for
 * @param addresses uintptr_t** - Pointer to store array of addresses
 * @param numFrames int* - Pointer to store number of frames
 * @param imageUUID char* - Buffer to store image UUID
 */
export const nativeStackTrace = lazy(() =>
    lookup('il2cpp_native_stack_trace', 'void', ['pointer', 'pointer', 'pointer', 'pointer'])
);
