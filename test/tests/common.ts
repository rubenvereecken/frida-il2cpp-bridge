import type { AgentDebug, AgentTap } from '../shared.js';
import { perform } from '@frida-il2cpp/bridge';

declare function send(payload: AgentTap | AgentDebug): void;

export function sendDebug(debug: unknown) {
    send({ debug } satisfies AgentDebug);
}

export function performAsync(cb: () => void) {
    return new Promise<void>(res =>
        perform(() => {
            cb();
            res();
        })
    );
}
