// Shared wire-types between agent and receiver

export type AgentTap = {
    tap: string; // Single TAP line, no trailing newline
};

export function isAgentTap(obj: unknown): obj is AgentTap {
    return !!obj && typeof obj === 'object' && 'tap' in obj;
}

export type AgentDebug = {
    debug: any;
};

export function isAgentDebug(obj: unknown): obj is AgentDebug {
    return !!obj && typeof obj === 'object' && 'debug' in obj;
}
