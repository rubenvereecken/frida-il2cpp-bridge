declare module "tap-mocha-reporter" {
  import { Writable } from "stream";

  type ReporterType =
    | "classic"
    | "doc"
    | "dot"
    | "dump"
    | "json"
    | "jsonstream"
    | "landing"
    | "list"
    | "markdown"
    | "min"
    | "nyan"
    | "progress"
    | "silent"
    | "spec"
    | "tap"
    | "xunit";

  function TapMochaReporter(type: ReporterType, options?: any): Writable;

  namespace TapMochaReporter {
    const types: ReporterType[];
  }

  export default TapMochaReporter;
}
