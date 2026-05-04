import { Question } from '../../types';

const questions: Question[] = [
{ id:"ts1", level:"beginner", q:'What is the difference between type and interface in TypeScript?', a:`Both define shapes but have key differences:

Interface:
- Extends via "extends" keyword.
- Can be reopened (declaration merging — add new members later).
- Better for defining object shapes / class contracts.
  interface User { name: string; }
  interface User { age: number; } // ✅ Merges to { name, age }

Type Alias:
- Uses "=" assignment.
- Can represent primitives, unions, tuples, mapped types.
- Cannot be reopened/merged.
  type ID = string | number; // ✅ Union — only possible with type

Rule of thumb: Use interface for objects/classes; use type for unions, primitives, complex types.` },
  { id:"ts2", level:"beginner", q:'What are generics in TypeScript? Give a practical example.', a:`Generics allow you to write reusable code that works with multiple types while keeping type safety.

Without generics:
  function identity(x: any): any { return x; } // loses type info

With generics:
  function identity<T>(x: T): T { return x; }
  const num = identity<number>(42); // T = number, returns number
  const str = identity("hello");    // T inferred as string

Generic constraints:
  function getLength<T extends { length: number }>(arg: T): number {
    return arg.length;
  }
  getLength("hello"); // ✅  getLength(42); // ❌

Generic interfaces:
  interface ApiResponse<T> { data: T; status: number; }
  const res: ApiResponse<User[]> = await fetchUsers();` },
  { id:"ts3", level:"intermediate", q:'Explain TypeScript utility types: Partial, Required, Pick, Omit, Record, Readonly.', a:`Partial<T>: All properties become optional.
  Partial<User> → { name?: string; age?: number }

Required<T>: All optional properties become required.

Pick<T, K>: Keep only specified keys.
  Pick<User, "name" | "email"> → { name: string; email: string }

Omit<T, K>: Remove specified keys.
  Omit<User, "password"> → User without password

Record<K, V>: Creates object type with keys K and values V.
  Record<string, number> → { [key: string]: number }
  Record<"admin"|"user", Permission[]>

Readonly<T>: All properties become readonly (compile-time only).

ReturnType<T>: Extracts return type of a function.
  ReturnType<typeof fetchUser> → Promise<User>

These are all implemented using mapped types and conditional types internally.` },
  { id:"ts4", level:"intermediate", q:'What are Union and Intersection types? When to use each?', a:`Union type (|): Value can be ONE of the listed types.
  type ID = string | number;
  type Status = "active" | "inactive" | "pending";

Intersection type (&): Value MUST satisfy ALL listed types.
  type Admin = User & { permissions: string[] };

Discriminated Union (common pattern):
  type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "rect"; width: number; height: number };

  function area(s: Shape) {
    if (s.kind === "circle") return Math.PI * s.radius ** 2;
    return s.width * s.height;
  }
  
Use union for OR relationships; intersection for AND (mixins, extending types).` },
  { id:"ts5", level:"intermediate", q:'What are type guards in TypeScript?', a:`Type guards narrow a union type within a code block.

typeof guard:
  function log(x: string | number) {
    if (typeof x === "string") x.toUpperCase(); // TypeScript knows x is string here
  }

instanceof guard:
  if (error instanceof HttpError) error.statusCode;

in guard (checks if property exists):
  if ("email" in user) user.email; // User | Guest narrowed to User

Custom type predicate:
  function isUser(x: any): x is User {
    return typeof x.name === "string";
  }

never type: After all cases handled, remaining type should be never:
  function assertNever(x: never): never { throw new Error("Unhandled case"); }` },
  { id:"ts6", level:"advanced", q:'Explain conditional types and the infer keyword.', a:`Conditional types: Type-level if-else.
  T extends U ? TrueType : FalseType

Examples:
  type IsString<T> = T extends string ? "yes" : "no";
  type A = IsString<string>; // "yes"
  type B = IsString<number>; // "no"

infer: Infer a type variable from within a conditional type.
  type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
  
  type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
  type A = UnpackPromise<Promise<string>>; // string

Distributive conditional types (applies to each union member):
  type ToArray<T> = T extends any ? T[] : never;
  type A = ToArray<string | number>; // string[] | number[]
  // Wrap in [] to prevent distribution: [T] extends [any] ? T[] : never` },
  { id:"ts7", level:"advanced", q:'What are mapped types? Build a DeepReadonly type.', a:`Mapped types iterate over keys of a type and transform them:
  type Optional<T> = { [K in keyof T]?: T[K] };
  type Nullable<T> = { [K in keyof T]: T[K] | null };

Template literal types (TS 4.1+):
  type EventNames<T extends string> = \`on\${Capitalize<T>}\`;
  type A = EventNames<"click" | "hover">; // "onClick" | "onHover"

DeepReadonly:
  type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object
      ? DeepReadonly<T[K]>
      : T[K];
  };` },
  { id:"ts8", level:"expert", q:'Explain variance in TypeScript — covariance, contravariance, and bivariance.', a:`Variance describes how subtyping of a composed type relates to subtyping of its components.

Covariant (out position — return types): Dog extends Animal → () => Dog extends () => Animal.
  function getDog(): Dog is assignable to function getAnimal(): Animal ✅

Contravariant (in position — parameter types): Animal extends Dog → (dog: Dog) => void extends (animal: Animal) => void.
  A handler for Animal should accept where a Dog handler is expected — it handles MORE.

Bivariant: TypeScript is bivariant for method parameters by default (unsound, for practicality).
  interface Fn { method(x: string): void; }
  // Bivariant — both subtype and supertype accepted for method params.

Strict function types (--strictFunctionTypes): Makes function PROPERTIES contravariant (not methods in interfaces).
  type Fn = (x: string) => void; // strict: contravariant
  
Understanding variance matters when designing HOFs, event emitters, and complex generic APIs.` }
];

export default questions;
