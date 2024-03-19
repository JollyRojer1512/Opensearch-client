export type Primitives = string | number | boolean;

export type NestedObject<T> = {
  [key in keyof T]: T[key] extends Primitives | Array<Primitives>
    ? T[key]
    : NestedObject<T[key]>;
};
