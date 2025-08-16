import { Assembly } from '../../bridge/src/structs/assembly.js';
import { Class } from '../../bridge/src/structs/class.js';
import { Method } from '../../bridge/src/structs/method.js';
import { Parameter } from '../../bridge/src/structs/parameter.js';
import { Thread } from '../../bridge/src/structs/thread.js';
export declare class Tracer {
    #private;
    constructor(applier: Tracer.Apply);
    /** */
    thread(thread: Thread): Pick<Tracer, 'verbose'> & Tracer.ChooseTargets;
    /** Determines whether print duplicate logs. */
    verbose(value: boolean): Tracer.ChooseTargets;
    /** Sets the application domain as the place where to find the target methods. */
    domain(): Tracer.FilterAssemblies;
    /** Sets the passed `assemblies` as the place where to find the target methods. */
    assemblies(...assemblies: Assembly[]): Tracer.FilterClasses;
    /** Sets the passed `classes` as the place where to find the target methods. */
    classes(...classes: Class[]): Tracer.FilterMethods;
    /** Sets the passed `methods` as the target methods. */
    methods(...methods: Method[]): Tracer.FilterParameters;
    /** Filters the assemblies where to find the target methods. */
    filterAssemblies(filter: (assembly: Assembly) => boolean): Tracer.FilterClasses;
    /** Filters the classes where to find the target methods. */
    filterClasses(filter: (klass: Class) => boolean): Tracer.FilterMethods;
    /** Filters the target methods. */
    filterMethods(filter: (method: Method) => boolean): Tracer.FilterParameters;
    /** Filters the target methods. */
    filterParameters(filter: (parameter: Parameter) => boolean): Pick<Tracer, 'and'>;
    /** Commits the current changes by finding the target methods. */
    and(): Tracer.ChooseTargets & Pick<Tracer, 'attach'>;
    /** Starts tracing. */
    attach(): void;
}
export declare namespace Tracer {
    type Configure = Pick<Tracer, 'thread' | 'verbose'> & Tracer.ChooseTargets;
    type ChooseTargets = Pick<Tracer, 'domain' | 'assemblies' | 'classes' | 'methods'>;
    type FilterAssemblies = FilterClasses & Pick<Tracer, 'filterAssemblies'>;
    type FilterClasses = FilterMethods & Pick<Tracer, 'filterClasses'>;
    type FilterMethods = FilterParameters & Pick<Tracer, 'filterMethods'>;
    type FilterParameters = Pick<Tracer, 'and'> & Pick<Tracer, 'filterParameters'>;
    interface State {
        depth: number;
        buffer: string[];
        history: Set<number>;
        flush: () => void;
    }
    type Apply = (method: Method, state: Tracer.State, threadId: number) => void;
}
/** */
export declare function trace(parameters?: boolean): Tracer.Configure;
/** */
export declare function backtrace(mode?: Backtracer): Tracer.Configure;
//# sourceMappingURL=tracer.d.ts.map