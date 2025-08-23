export function findOffset(
    handle: NativePointer,
    predicate: (handle: NativePointer) => boolean,
    depth: number = 512
) {
    for (let i = 0; depth > 0 ? i < depth : i < -depth; i++) {
        if (predicate(depth > 0 ? handle.add(i) : handle.sub(i))) {
            return i;
        }
    }

    return null;
}

export function findPointerOffset(
    handle: NativePointer,
    pointer: NativePointer,
    depth: number = 512
) {
    return findOffset(handle, address => address.readPointer().equals(pointer), depth);
}
