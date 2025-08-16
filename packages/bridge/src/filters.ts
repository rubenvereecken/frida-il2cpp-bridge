import { Class } from './structs/class.js';
import { Object_ } from './structs/object.js';
import { Type } from './structs/type.js';

namespace Il2Cpp {
    /**
     * Creates a filter to include elements whose type can be assigned to a
     * variable of the given class. \
     * It relies on {@link Class.isAssignableFrom}.
     *
     * ```ts
     * const IComparable = Il2Cpp.corlib.class("System.IComparable");
     *
     * const objects = [
     *     Il2Cpp.corlib.class("System.Object").new(),
     *     Il2Cpp.corlib.class("System.String").new()
     * ];
     *
     * const comparables = objects.filter(Il2Cpp.is(IComparable));
     * ```
     */
    export function is<T extends Class | Object_ | Type>(klass: Class): (element: T) => boolean {
        return (element: T): boolean => {
            if (element instanceof Class) {
                return klass.isAssignableFrom(element);
            } else {
                return klass.isAssignableFrom(element.class);
            }
        };
    }

    /**
     * Creates a filter to include elements whose type can be corresponds to
     * the given class. \
     * It compares the native handle of the element classes.
     *
     * ```ts
     * const String = Il2Cpp.corlib.class("System.String");
     *
     * const objects = [
     *     Il2Cpp.corlib.class("System.Object").new(),
     *     Il2Cpp.corlib.class("System.String").new()
     * ];
     *
     * const strings = objects.filter(Il2Cpp.isExactly(String));
     * ```
     */
    export function isExactly<T extends Class | Object_ | Type>(
        klass: Class
    ): (element: T) => boolean {
        return (element: T): boolean => {
            if (element instanceof Class) {
                return element.equals(klass);
            } else {
                return element.class.equals(klass);
            }
        };
    }
}
