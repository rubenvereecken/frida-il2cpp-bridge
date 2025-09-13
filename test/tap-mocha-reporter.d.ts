import { Writable } from 'stream';

type ReporterType =
    | 'classic'
    | 'doc'
    | 'dot'
    | 'dump'
    | 'json'
    | 'jsonstream'
    | 'landing'
    | 'list'
    | 'markdown'
    | 'min'
    | 'nyan'
    | 'progress'
    | 'silent'
    | 'spec'
    | 'tap'
    | 'xunit';

declare function TapMochaReporter(type: ReporterType, options?: any): Writable;

declare namespace TapMochaReporter {
    const types: ReporterType[];
}

export = TapMochaReporter;
