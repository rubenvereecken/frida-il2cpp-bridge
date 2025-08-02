namespace Il2Cpp {
    @recycle
    export class Image extends NativeStruct {
        constructor(native: NativePointerValue) {
            super(native);

            // Shows up on Frida REPL. Useful for debugging and reverse engineering
            globalThis.Object.defineProperty(this, '__toString', {
                get: () => this.toString(),
                enumerable: true,
            });
            globalThis.Object.defineProperty(this, '_il2cpp', {
                get: () => 'Il2Cpp.Image',
                enumerable: true,
            });
        }

        toString(): string {
            return this.name;
        }

        /** Gets the assembly in which the current image is defined. */
        @lazy
        get assembly(): Il2Cpp.Assembly {
            return new Il2Cpp.Assembly(Il2Cpp.exports.imageGetAssembly(this));
        }

        /** Gets the amount of classes defined in this image. */
        @lazy
        get classCount(): number {
            if (Il2Cpp.unityVersionIsBelow201830) {
                return this.classes.length;
            } else {
                return Il2Cpp.exports.imageGetClassCount(this);
            }
        }

        /** Gets the classes defined in this image. */
        @lazy
        get classes(): Il2Cpp.Class[] {
            if (Il2Cpp.unityVersionIsBelow201830) {
                const types = this.assembly.object
                    .method<Il2Cpp.Array<Il2Cpp.ReferenceType>>('GetTypes')
                    .invoke(false);
                // In Unity 5.3.8f1, getting System.Reflection.Emit.OpCodes type name
                // without iterating all the classes first somehow blows things up at
                // app startup, hence the `Array.from`.
                const classes = globalThis.Array.from(
                    types,
                    _ => new Il2Cpp.Class(Il2Cpp.exports.classFromSystemType(_))
                );

                // <Module> class does not always exist
                // https://github.com/vfsfitvnm/frida-il2cpp-bridge/issues/627
                const Module = this.tryClass('<Module>');
                if (Module) {
                    classes.unshift(Module);
                }

                return classes;
            } else {
                return globalThis.Array.from(
                    globalThis.Array(this.classCount),
                    (_, i) => new Il2Cpp.Class(Il2Cpp.exports.imageGetClass(this, i))
                );
            }
        }

        /** Gets the name of this image. */
        @lazy
        get name(): string {
            return Il2Cpp.exports.imageGetName(this).readUtf8String()!;
        }

        /**
         * Gets the class with the specified name defined in this image.
         * By default, assumes the name the class was found by is also the type name.
         * This is wrong for:
         * - inner classes
         * - generic classes (I think)
         */
        class<T extends string>(name: T): Il2Cpp.Class<T> {
            return (
                this.tryClass(name) ?? raise(`couldn't find class ${name} in assembly ${this.name}`)
            );
        }

        /** Gets the class with the specified name defined in this image. */
        tryClass<T extends string>(name: T): Il2Cpp.Class<T> | null {
            const dotIndex = name.lastIndexOf('.');
            const classNamespace = Memory.allocUtf8String(
                dotIndex == -1 ? '' : name.slice(0, dotIndex)
            );
            const className = Memory.allocUtf8String(name.slice(dotIndex + 1));

            return new Il2Cpp.Class<T>(
                Il2Cpp.exports.classFromName(this, classNamespace, className)
            ).asNullable();
        }
    }

    /** Gets the COR library. */
    export declare const corlib: Il2Cpp.Image;
    // prettier-ignore
    getter(Il2Cpp, "corlib", () => {
        return new Il2Cpp.Image(Il2Cpp.exports.getCorlib());
    }, lazy);
}
