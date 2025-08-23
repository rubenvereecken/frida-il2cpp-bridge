export function warn(message: unknown): void {
    console.log(`\x1b[38;5;11mil2cpp\x1b[0m: ${message}`);
}

export function ok(message: unknown): void {
    console.log(`\x1b[38;5;10mil2cpp\x1b[0m: ${message}`);
}

export function inform(message: unknown): void {
    console.log(`\x1b[38;5;12mil2cpp\x1b[0m: ${message}`);
}

export function trace(message: unknown): void {
    // Capture stack trace without showing as error
    const stack = new Error().stack?.split('\n').slice(1).join('\n') || '';
    console.log(`\x1b[38;5;14mil2cpp\x1b[0m: ${message}\n${stack}`);
}
