import { Question } from '../../types';

const questions: Question[] = [
{ id:"js1", level:"beginner", q:'What is the difference between var, let, and const?', a:`var: Function-scoped. Hoisted and initialized to undefined. Can be re-declared. Avoid.

let: Block-scoped. Hoisted but NOT initialized (Temporal Dead Zone). Can be re-assigned.

const: Block-scoped. Must be initialized. Cannot be re-assigned (binding). Objects/arrays can still be mutated:
  const obj = { a: 1 }; obj.a = 2; // ✅ mutation
  obj = {};               // ❌ reassignment

Best practice: Use const by default, let when reassignment needed, never var.` },
  { id:"js2", level:"beginner", q:'Explain closures in JavaScript with a practical example.', a:`A closure is a function that "remembers" variables from its outer scope after the outer function returns.

  function makeCounter() {
    let count = 0;
    return {
      increment: () => ++count,
      getCount:  () => count,
    };
  }
  const counter = makeCounter();
  counter.increment(); // 1
  counter.increment(); // 2
  counter.getCount();  // 2 — count survives makeCounter's return

Uses: Data privacy, memoization, currying, event handlers retaining context.

Classic loop bug with var:
  for (var i = 0; i < 3; i++)
    setTimeout(() => console.log(i), 100); // 3 3 3
  // Fix: use let (block-scoped per iteration) → 0 1 2` },
  { id:"js3", level:"beginner", q:'Explain JavaScript hoisting — what gets hoisted and how?', a:`Function declarations: Fully hoisted — callable before declaration.
  greet(); // works
  function greet() { console.log("hi"); }

var: Declaration hoisted, initialization NOT. Value is undefined until assigned.
  console.log(x); // undefined
  var x = 5;

let/const: In Temporal Dead Zone (TDZ) — accessing before declaration → ReferenceError.
  console.log(y); // ReferenceError
  let y = 10;

Function expressions: Not hoisted (assigned to var/let).
  foo(); // TypeError: foo is not a function
  var foo = function() {};

Class declarations: In TDZ like let.` },
  { id:"js4", level:"intermediate", q:'What is the JavaScript event loop? Explain call stack, Web APIs, microtask vs macrotask queue.', a:`JS is single-threaded. Event loop manages async.

Components:
1. Call Stack: Executes sync code. LIFO.
2. Web APIs: Browser handles async (setTimeout, fetch, DOM events).
3. Microtask Queue: Promise .then, queueMicrotask. HIGH priority.
4. Macrotask Queue: setTimeout, setInterval callbacks. Lower priority.

Order: Sync → ALL microtasks → ONE macrotask → ALL microtasks → ONE macrotask...

  console.log("1");
  setTimeout(() => console.log("2"), 0); // macrotask
  Promise.resolve().then(() => console.log("3")); // microtask
  console.log("4");
  // Output: 1, 4, 3, 2

Implication: Promise.then ALWAYS runs before setTimeout(fn, 0).` },
  { id:"js5", level:"intermediate", q:'What is prototypal inheritance in JavaScript?', a:`Every JS object has [[Prototype]] link to another object (or null). Property lookup walks the chain.

  const animal = { breathe() { return "breathing"; } };
  const dog = Object.create(animal);
  dog.bark = () => "woof";
  dog.bark();    // own property
  dog.breathe(); // found on prototype

ES6 class syntax (syntactic sugar over prototypal inheritance):
  class Animal { speak() {} }
  class Dog extends Animal { bark() {} }
  // Dog.prototype.__proto__ === Animal.prototype

hasOwnProperty: Only own properties (not inherited).
Object.create(null): Object with NO prototype — true hash map.` },
  { id:"js6", level:"intermediate", q:'Explain "this" in JavaScript and how arrow functions change it.', a:`"this" depends on HOW a function is called:
1. Global: window/global.
2. Object method: the calling object.
3. Explicit: call/apply/bind set this explicitly.
4. new: the new object being created.
5. Arrow: NO own "this" — inherits from lexical enclosing scope.

  class Timer {
    start() {
      setInterval(() => {
        this.tick(); // arrow → this = Timer instance ✅
      }, 1000);
      setInterval(function() {
        this.tick(); // regular → this = window ❌
      }, 1000);
    }
  }

Strict mode: this is undefined in plain function calls.` },
  { id:"js7", level:"intermediate", q:'Explain Promise.all, Promise.allSettled, Promise.race, and Promise.any.', a:`Promise.all: Wait for ALL. Fast-reject if any fails.
  const [user, orders] = await Promise.all([fetchUser(), fetchOrders()]); // parallel

Promise.allSettled: Wait for ALL to settle (never rejects). Good for independent operations.
  const results = await Promise.allSettled([p1, p2]);
  // [{status:'fulfilled', value:...}, {status:'rejected', reason:...}]

Promise.race: First settled (resolve OR reject) wins.
  const result = await Promise.race([fetchData(), timeout(5000)]); // timeout pattern

Promise.any: First RESOLVED wins. Rejects only if ALL reject (AggregateError).
  const fastest = await Promise.any([server1.fetch(), server2.fetch()]);` },
  { id:"js8", level:"intermediate", q:'What is the difference between shallow copy and deep copy? How do you achieve each?', a:`Shallow copy: Top-level copied; nested objects are shared references.
  const shallow = { ...obj }; // or Object.assign({}, obj)
  shallow.nested.x = 99; // original.nested.x ALSO 99 — shared!

Deep copy: Fully independent clone.
  const deep = structuredClone(obj);    // ✅ ES2022+ handles Date, Map, Set
  const deep2 = JSON.parse(JSON.stringify(obj)); // ❌ Loses undefined, functions, Date→string
  const deep3 = _.cloneDeep(obj);       // ✅ Lodash (most compatible)

React: Always return new objects from state updates — never mutate in place.` },
  { id:"js9", level:"intermediate", q:'What is debouncing vs throttling? Implement both.', a:`Debounce: Delay execution until N ms of inactivity. Last call wins.
  function debounce(fn, delay) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
  }
  const search = debounce(fetchResults, 300); // fires 300ms after last keystroke

Throttle: At most once per N ms. First call wins.
  function throttle(fn, limit) {
    let last = 0;
    return (...args) => { const now = Date.now(); if (now - last >= limit) { last = now; fn(...args); } };
  }
  window.addEventListener('scroll', throttle(handleScroll, 200));

Debounce = "wait until quiet". Throttle = "fire at regular intervals".` },
  { id:"js10", level:"advanced", q:'What is a WeakMap and WeakSet? When would you use them?', a:`WeakMap: Keys must be objects; holds WEAK references — keys can be garbage collected.
WeakSet: Contains objects; weak references. NOT iterable, no .size.

WeakMap use cases:
1. Private data without memory leaks:
   const priv = new WeakMap();
   class Foo { constructor() { priv.set(this, { secret: 42 }); } }
   // When Foo instance is GC'd, WeakMap entry auto-removed.

2. Caching per object:
   const cache = new WeakMap();
   function compute(obj) {
     if (cache.has(obj)) return cache.get(obj);
     const result = expensive(obj);
     cache.set(obj, result);
     return result;
   }
   // obj GC'd → cache entry removed — no memory leak.

vs Map: Map holds strong references → objects can't be GC'd → potential leak.` },
  { id:"js11", level:"advanced", q:'Explain JavaScript generators and how Redux Saga uses them.', a:`Generators: Functions that can pause (yield) and resume, producing values lazily.

  function* fibonacci() {
    let [a, b] = [0, 1];
    while (true) { yield a; [a, b] = [b, a+b]; }
  }
  const fib = fibonacci();
  fib.next().value; // 0
  fib.next().value; // 1
  fib.next().value; // 1

Can receive values: const val = yield somePromise;

Redux Saga uses generators for complex async flows:
  function* fetchUserSaga(action) {
    try {
      const user = yield call(api.getUser, action.id); // pause, await result
      yield put({ type: 'USER_LOADED', user });         // dispatch action
    } catch (e) {
      yield put({ type: 'USER_FAILED', error: e });
    }
  }
  function* rootSaga() {
    yield takeLatest('FETCH_USER', fetchUserSaga); // cancel prev on new action
  }

async/await is syntactic sugar over generators + Promise resolution.` },
  { id:"js12", level:"intermediate", q:'What is event bubbling and capturing? Explain stopPropagation vs preventDefault.', a:`Event phases: Capture (down: window→target) → Target → Bubble (up: target→window).
Handlers fire in BUBBLE phase by default. Add { capture: true } for capture.

Bubbling: Click button inside div → both handlers fire.
  <div onClick={() => log("div")}>
    <button onClick={() => log("button")}>Click</button>
  </div>
  // "button" then "div"

e.stopPropagation(): Stops event from bubbling up — parent handlers don't fire.
e.stopImmediatePropagation(): Also stops other listeners on SAME element.
e.preventDefault(): Prevents browser default action (form submit, link navigate). Does NOT stop propagation.

Event delegation: Attach ONE listener on parent, check e.target.
  list.addEventListener('click', e => {
    if (e.target.matches('li')) handle(e.target);
  });` },
  { id:"js13", level:"intermediate", q:'What is optional chaining (?.) and nullish coalescing (??)? How do they differ from || and &&?', a:`Optional Chaining (?.) — safely access nested properties; returns undefined instead of throwing.
  user?.address?.city      // undefined if user/address is null/undefined
  arr?.[0]                 // safe array indexing
  func?.()                 // call only if func exists

Nullish Coalescing (??) — returns right side ONLY if left is null or undefined.
  const name = user.name ?? "Anonymous"; // "Anonymous" if null/undefined
  0  ?? 42    // 0   (0 is not null/undefined)
  "" ?? "hi"  // ""

vs || (logical OR) — returns right side for ANY falsy value:
  0  || 42    // 42  (treats 0 as falsy — might be wrong!)
  "" || "hi"  // "hi"

Combined:
  const city = user?.address?.city ?? "Unknown";

Nullish Assignment: user.name ??= "default"; // assign only if currently null/undefined` },
  { id:"js14", level:"advanced", q:'What is the Proxy object in JavaScript and how is it used?', a:`Proxy wraps an object and intercepts fundamental operations.

  const handler = {
    get(target, prop) {
      return prop in target ? target[prop] : "default";
    },
    set(target, prop, value) {
      if (typeof value !== "number") throw TypeError("Numbers only!");
      target[prop] = value;
      return true;
    }
  };
  const proxy = new Proxy({}, handler);
  proxy.x = 5;  // set trap
  proxy.y;      // get trap → "default"

Use cases:
- Validation (enforce types on assignment).
- Logging/debugging (intercept all property access).
- Vue 3's reactivity system is built on Proxy.
- Immutability enforcement.
- Default property values.

Reflect: Methods matching Proxy traps for invoking default behavior:
  get(target, prop, receiver) { return Reflect.get(target, prop, receiver); }` },
  { id:"js15", level:"advanced", q:'Explain JavaScript memory management and common memory leak patterns.', a:`JS uses Mark-and-Sweep GC: Starting from roots (globals, stack), marks all reachable objects. Unreachable objects are swept.

Common memory leak patterns:

1. Unremoved event listeners:
   el.addEventListener('click', handler);
   el.remove(); // DOM removed but listener still holds reference
   // Fix: el.removeEventListener or use AbortController

2. Closure retaining large objects:
   function setup() {
     const bigData = fetchHuge();
     return () => bigData.id; // bigData never GC'd even though only .id needed
   }

3. Timers not cleared:
   const id = setInterval(fn, 100); // fn captures component state → leak
   // Fix: clearInterval(id) in cleanup

4. Global variables:
   window.myCache = hugeArray; // lives forever

5. Detached DOM nodes: Remove from DOM but keep JS reference.

Detect: Chrome DevTools → Memory → Heap Snapshot, Allocation Timeline.
WeakMap/WeakRef: Hold weak references that don't prevent GC.` },
  { id:"js16", level:"intermediate", q:'What are JavaScript modules (ESM vs CommonJS)? What is tree shaking?', a:`CommonJS (Node.js, older):
  const express = require("express"); // synchronous
  module.exports = { myFn };

ES Modules (ESM, browser + modern Node):
  import express from "express"; // async, static analysis possible
  export const myFn = () => {};
  export default MyClass;

Key differences:
  CJS: Synchronous, dynamic (can require in conditions), no tree shaking.
  ESM: Async, static (imports at top level only), enables tree shaking.

Named vs default exports:
  // Named: import { useState, useEffect } from 'react';
  // Default: import React from 'react';
  // Both: import React, { useState } from 'react';

Tree shaking: Bundler (Webpack, Rollup, Vite) removes unused exports from final bundle.
  // You import only { debounce } from lodash-es → only debounce shipped, not all of lodash.
  // Only works with ESM (static analysis of import/export).
  // CJS: require() is dynamic — bundler can't know what's used.

Side effects: package.json "sideEffects": false tells bundler the package is tree-shakeable.` },
  { id:"js17", level:"advanced", q:'What is the difference between Object.freeze, Object.seal, and Object.preventExtensions?', a:`Object.preventExtensions: Cannot ADD new properties. Can modify/delete existing.
Object.seal: Cannot ADD or DELETE. Can modify values. Properties become non-configurable.
Object.freeze: Cannot ADD, DELETE, or MODIFY. Shallow only — nested objects NOT frozen.

  const obj = { a: 1, nested: { b: 2 } };
  Object.freeze(obj);
  obj.a = 99;         // silently fails (TypeError in strict mode)
  obj.nested.b = 99;  // ✅ nested NOT frozen!

Deep freeze:
  function deepFreeze(obj) {
    Object.values(obj).forEach(v => v && typeof v === 'object' && deepFreeze(v));
    return Object.freeze(obj);
  }

Check: Object.isFrozen(), Object.isSealed(), Object.isExtensible().` },
  { id:"js18", level:"intermediate", q:'What are iterators and the iterable protocol in JavaScript?', a:`Iterable: Object implementing [Symbol.iterator]() that returns an iterator.
Iterator: Object with a .next() method returning { value, done }.

Built-in iterables: Array, String, Map, Set, arguments, NodeList, generators.

Custom iterable:
  const range = {
    from: 1, to: 5,
    [Symbol.iterator]() {
      let current = this.from;
      const last = this.to;
      return {
        next() {
          return current <= last
            ? { value: current++, done: false }
            : { value: undefined, done: true };
        }
      };
    }
  };
  for (const num of range) console.log(num); // 1 2 3 4 5
  const arr = [...range]; // [1, 2, 3, 4, 5]

for...of works with any iterable.
Spread (...), destructuring, Array.from all use the iterable protocol.
for...in: Iterates over enumerable property KEYS (different — avoid for arrays).` },
  { id:"js19", level:"advanced", q:'What is tail call optimization (TCO)? How does it affect recursion in JavaScript?', a:`Tail call: A function call that is the last operation in a function.

  function factorial(n, acc = 1) {
    if (n <= 1) return acc;
    return factorial(n - 1, n * acc); // tail call — no work after it returns
  }

TCO: Engine reuses the current stack frame for a tail call instead of adding a new one.
Benefit: Recursive functions with tail calls run in O(1) stack space — no stack overflow.

Without TCO (non-tail call):
  function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1); // NOT a tail call — must wait for result to multiply
  }
  factorial(100000); // Stack overflow!

TCO in JavaScript:
- ES2015 spec mandates TCO in strict mode.
- Reality: Only Safari implements it. V8 (Chrome/Node) does NOT.
- So in practice, deep recursion in Node.js still overflows.

Workaround for Node.js: Use trampolining (convert recursion to iteration manually).
  function trampoline(fn) {
    return (...args) => {
      let result = fn(...args);
      while (typeof result === 'function') result = result();
      return result;
    };
  }` },
  { id:"js20", level:"intermediate", q:'What is Symbol in JavaScript? When would you use it?', a:`Symbol: Primitive type that is always unique. Created with Symbol().

  const s1 = Symbol("description");
  const s2 = Symbol("description");
  s1 === s2; // false — always unique even with same description

Use as unique property key (no collision with string keys):
  const ID = Symbol("id");
  class User {
    [ID] = Math.random(); // private-ish, not enumerable in for...in
    getId() { return this[ID]; }
  }

Well-known symbols (hooks into JS engine):
  Symbol.iterator    — makes object iterable (for...of)
  Symbol.toPrimitive — custom type conversion
  Symbol.hasInstance — customize instanceof
  Symbol.toStringTag — customize Object.prototype.toString

Global symbol registry (shared across realms):
  const s = Symbol.for("shared"); // creates or retrieves from registry
  Symbol.keyFor(s); // "shared"

Symbols are NOT enumerable: Object.keys(), JSON.stringify() skip them.
Access: Object.getOwnPropertySymbols() or Reflect.ownKeys().` }
];

export default questions;
