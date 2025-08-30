// Shared wire-types between agent and receiver

export interface AgentOutboundMessage {
    tap: string; // Single TAP line, no trailing newline
}
