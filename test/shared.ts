// Shared wire-types between agent and receiver

export type AgentTap = {
    tap: string; // Single TAP line, no trailing newline
};

export type AgentDebug = {
    debug: any;
};

export type AgentDone = {
    done: true;
};

export type AgentComplete = {
    complete: true;
};
