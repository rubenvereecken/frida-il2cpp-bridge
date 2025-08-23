declare global {
    /** Minimal Console shape for Frida scripts */
    interface Console {
        log(...args: unknown[]): void;
        debug?(...args: unknown[]): void;
        info?(...args: unknown[]): void;
        warn?(...args: unknown[]): void;
        error?(...args: unknown[]): void;
        trace?(...args: unknown[]): void;
    }

    /**
     * Console available in the Frida environment.
     */
    var console: Console;
}

export {};
