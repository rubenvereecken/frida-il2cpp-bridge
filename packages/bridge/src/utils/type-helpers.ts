/**
 * TypeScript utility types for IL2CPP type manipulations
 */

/** Utility type to extract element type from array type string */
export type StripArraySuffix<T extends string> = T extends `${infer ElementType}[]`
    ? ElementType
    : T;

/** Utility type to extract element type from pointer type string */
export type StripPointerSuffix<T extends string> = T extends `${infer ElementType}*`
    ? ElementType
    : T;

/** Utility type to extract element type from by-reference type string */
export type StripByRefSuffix<T extends string> = T extends `${infer ElementType}&`
    ? ElementType
    : T;
