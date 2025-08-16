export function warn(message: any): void {
    (globalThis as any).console.log(`\x1b[38;5;11mil2cpp\x1b[0m: ${message}`);
}

export function ok(message: any): void {
    (globalThis as any).console.log(`\x1b[38;5;10mil2cpp\x1b[0m: ${message}`);
}

export function inform(message: any): void {
    (globalThis as any).console.log(`\x1b[38;5;12mil2cpp\x1b[0m: ${message}`);
}

export function trace(message: any): void {
    // Capture stack trace without showing as error
    const stack = new Error().stack?.split('\n').slice(1).join('\n') || '';
    (globalThis as any).console.log(`\x1b[38;5;14mil2cpp\x1b[0m: ${message}\n${stack}`);
}
