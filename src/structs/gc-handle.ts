namespace Il2Cpp {
    export class GCHandle {
        /** @internal */
        constructor(readonly handle: number) {}

        /** Gets the object associated to this handle. */
        get target(): Il2Cpp.ReferenceType | null {
            return new Il2Cpp.ReferenceType(
                Il2Cpp.exports.gcHandleGetTarget(this.handle)
            ).asNullable();
        }

        /** Frees this handle. */
        free(): void {
            return Il2Cpp.exports.gcHandleFree(this.handle);
        }
    }
}
