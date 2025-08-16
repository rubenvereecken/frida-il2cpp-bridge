export function raise(message: any): never {
    const error = new Error(`\x1b[0m${message}`);
    error.name = `\x1b[0m\x1b[38;5;9mil2cpp\x1b[0m`;
    error.stack = error.stack
        ?.replace(/^Error/, error.name)
        ?.replace(/\n    at (.+) \((.+):(.+)\)/, '\x1b[3m\x1b[2m')
        ?.concat('\x1B[0m');

    throw error;
}
