import { Question } from '../../types';

const questions: Question[] = [
{ id:"rx_e1", level:"intermediate", q:'What is a Higher-Order Component (HOC)? Give a real use case.', a:`A HOC is a function that takes a component and returns a new enhanced component.

  function withAuth(WrappedComponent) {
    return function AuthGuard(props) {
      const { isAuthenticated } = useAuth();
      if (!isAuthenticated) return <Navigate to="/login" />;
      return <WrappedComponent {...props} />;
    };
  }
  const ProtectedDashboard = withAuth(Dashboard);

Real use cases:
- Authorization checks (withAuth)
- Analytics/logging (withLogger)
- Theme injection (withTheme)
- Data fetching with loading state (withData)

HOC vs Custom Hook:
- HOC wraps a component tree — affects rendering.
- Custom hook reuses logic inside a component — no JSX.
- Prefer custom hooks in modern React (simpler, no wrapper hell).

Pitfall: Don't use HOCs inside render — creates a new component type each render.` },
  { id:"rx_e2", level:"intermediate", q:'What are render props? How do they compare to HOCs and hooks?', a:`Render props: A component accepts a function as a prop and calls it to decide what to render.

  <MouseTracker render={({ x, y }) => <Tooltip x={x} y={y} />} />

  class MouseTracker extends React.Component {
    state = { x: 0, y: 0 };
    handleMouseMove = (e) => this.setState({ x: e.clientX, y: e.clientY });
    render() {
      return (
        <div onMouseMove={this.handleMouseMove}>
          {this.props.render(this.state)}
        </div>
      );
    }
  }

Comparison:
- Render props: Explicit, composable, but verbose. Good for when rendering logic varies per consumer.
- HOCs: Less verbose, good for cross-cutting concerns; harder to debug (wrapper hell).
- Custom hooks: Cleanest in functional components. Prefer hooks today.

Note: "children as a function" is the same pattern:
  <MouseTracker>{({ x, y }) => <Tooltip x={x} y={y} />}</MouseTracker>` },
  { id:"rx_e3", level:"advanced", q:'What are React Portals? When would you use them?', a:`Portals allow rendering a component's output into a different DOM node than its parent.

  ReactDOM.createPortal(children, domNode)

  function Modal({ isOpen, children }) {
    if (!isOpen) return null;
    return ReactDOM.createPortal(
      <div className="modal-overlay">{children}</div>,
      document.getElementById('modal-root') // outside #root
    );
  }

Why they exist: CSS stacking context issues — a modal inside a deeply nested div with overflow:hidden or z-index stacking would be clipped. Portals render to a different DOM location while keeping the React tree intact.

Key behaviours still hold:
- Events still bubble through the React tree (not DOM tree).
- Context still works — portal children can consume context from parent.

Use cases: Modals, tooltips, dropdown menus, toast notifications, popovers.` },
  { id:"rx_e4", level:"advanced", q:'Explain React Server Components (RSC) and how they differ from client components.', a:`React Server Components (RSC, stable in React 19 / Next.js App Router):

Server Components:
- Run ONLY on the server — never ship their JS to the client.
- Can directly access DBs, file system, env secrets.
- Cannot use useState, useEffect, event handlers, or browser APIs.
- Zero JS bundle contribution for server-rendered portions.
- File convention: No "use client" directive (default in Next.js App Router).

Client Components:
- "use client" at top of file.
- Run on client (and also pre-rendered on server for SSR).
- Can use hooks, events, browser APIs.

Mixed tree:
  // page.tsx (Server Component — fetches data server-side)
  async function ProductPage({ id }) {
    const product = await db.products.findById(id); // direct DB call!
    return <ProductDetail product={product}><AddToCartButton /></ProductDetail>;
  }
  // AddToCartButton.tsx — "use client" — interactive

Benefits: Massive performance gains — less JS shipped, faster TTI, secure data access.
Limitation: Cannot pass non-serializable values (functions, class instances) from server to client components.` },
  { id:"rx_e5", level:"intermediate", q:'How does React handle synthetic events? What is event delegation?', a:`Synthetic Events: React wraps native browser events in a cross-browser wrapper (SyntheticEvent) with the same interface as native events.

Event Delegation: Instead of attaching individual event listeners to each element, React attaches ONE event listener at the root (document or React root). All events bubble up and React routes them to the correct handler.

Benefits:
- Fewer memory-consuming listeners.
- Consistent cross-browser behavior.
- React can batch and prioritize events.

In React 17+: Event delegation moved from document to the React root container — enables multiple React roots on one page without conflicts.

Important:
- e.preventDefault() still works (prevents default browser behavior).
- e.stopPropagation() stops React synthetic event bubbling.
- Accessing event after async call: React 17- pooled events (call e.persist()); React 17+ events are not pooled — access freely.

Native events vs Synthetic events: Native listeners (addEventListener) attached in useEffect fire BEFORE React's synthetic events.` },
  { id:"rx_e6", level:"advanced", q:'What are the React Profiler API and DevTools Profiler? How do you identify performance bottlenecks?', a:`React Profiler API:
  import { Profiler } from 'react';

  function onRenderCallback(id, phase, actualDuration, baseDuration) {
    console.log({ id, phase, actualDuration, baseDuration });
  }
  <Profiler id="OrderList" onRender={onRenderCallback}>
    <OrderList />
  </Profiler>

  id: component tree identifier
  phase: "mount" or "update"
  actualDuration: time spent rendering (with memoization)
  baseDuration: estimated time without memoization

React DevTools Profiler:
1. Click Record → interact with the app → stop.
2. Flame chart: Shows which components rendered and how long.
3. Ranked chart: Sorts by render time (heaviest at top).
4. "Why did this render?": Shows which props/state changed.

What to look for:
- Components re-rendering unnecessarily (check why).
- Components with high actualDuration (optimize with memo/useMemo).
- Large gaps between actualDuration and baseDuration → memo is helping.
- Large gaps where actual ≈ base → memo isn't helping (check key stability).` },
  { id:"rx_e7", level:"intermediate", q:'What is hydration in React? What causes hydration mismatch errors?', a:`Hydration: React attaches event listeners and state to server-rendered HTML, making it interactive without re-rendering the DOM from scratch.

Process:
1. Server renders HTML string.
2. Browser receives HTML — user sees content immediately.
3. React "hydrates" — walks the DOM, reconciles with virtual DOM, attaches handlers.

Hydration mismatch: When server-rendered HTML doesn't match what React would render on the client.

Common causes:
- Date/time rendering (new Date() differs on server vs client).
- Math.random() / crypto.randomUUID() — different values.
- Browser-only APIs (window, localStorage) used in render.
- User's browser timezone vs server timezone.

Fixes:
  // Option 1: Suppress warning (use sparingly)
  <div suppressHydrationWarning>{new Date().toLocaleDateString()}</div>

  // Option 2: Client-only render with useEffect
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

React 18+ throws on mismatch in dev; in production tries to recover but may cause visual glitches.` },
  { id:"rx_e8", level:"beginner", q:'What is the difference between createElement and JSX? Why does React need to be in scope?', a:`JSX compiles to React.createElement() calls.

  // JSX
  <Button color="blue" onClick={handleClick}>Submit</Button>

  // Compiled (React 17- classic transform)
  React.createElement(Button, { color: "blue", onClick: handleClick }, "Submit")

  // React 17+ automatic transform (no React import needed)
  import { jsx as _jsx } from 'react/jsx-runtime';
  _jsx(Button, { color: "blue", onClick: handleClick, children: "Submit" });

Before React 17: React had to be in scope because JSX compiled to React.createElement. Forgetting the import caused "React is not defined" error.

After React 17+ with automatic JSX transform:
- No need to import React just for JSX.
- Still import React for hooks: import { useState } from 'react'.

React.createElement signature:
  React.createElement(type, props, ...children)
  - type: string ("div") or component function/class
  - props: object of props (or null)
  - children: any number of child nodes` },
  { id:"rx_e9", level:"intermediate", q:'How do you implement infinite scrolling in React?', a:`Two main approaches:

1. Intersection Observer (preferred — no scroll event listeners):
  function useInfiniteScroll(callback) {
    const observerRef = useRef(null);
    const lastElementRef = useCallback(node => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) callback();
      });
      if (node) observerRef.current.observe(node);
    }, [callback]);
    return lastElementRef;
  }

  // Usage:
  const lastItemRef = useInfiniteScroll(fetchNextPage);
  return items.map((item, i) =>
    <div ref={i === items.length - 1 ? lastItemRef : null}>{item.name}</div>
  );

2. Scroll event with throttle:
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.innerHeight + scrollY >= document.body.offsetHeight - 100) fetchNextPage();
    }, 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

Library option: TanStack Query's useInfiniteQuery + react-virtual for true virtualization.` },
  { id:"rx_e10", level:"expert", q:'What are React\'s rules of hooks and why do they exist?', a:`Two fundamental rules:

1. Only call hooks at the top level:
  - Never inside loops, conditions, nested functions.
  - Hooks must be called in the same order every render.

2. Only call hooks from React functions:
  - Functional components or custom hooks.
  - Never from class components, event handlers, or regular JS functions.

Why the order rule exists:
React stores hook state in a linked list per component instance. Each hook call corresponds to a slot by index.

  // React internally:
  [state_0, state_1, state_2, effect_0, ref_0, ...]

If you call hooks conditionally, the index shifts → wrong state gets assigned to wrong hook.

  // WRONG — different hooks called each render:
  if (condition) useState(0);    // slot 0 sometimes skipped
  useState('name');              // now slot 0 instead of slot 1 → WRONG

React lint rule: eslint-plugin-react-hooks enforces both rules statically.

How to "conditionally" use a hook: Put the condition INSIDE the hook, not around it.
  const value = useMyHook(); // always call
  if (!condition) return null; // condition after` },
{ id:"rx_e1", level:"intermediate", q:'What is a Higher-Order Component (HOC)? Give a real use case.', a:`A HOC is a function that takes a component and returns a new enhanced component.

  function withAuth(WrappedComponent) {
    return function AuthGuard(props) {
      const { isAuthenticated } = useAuth();
      if (!isAuthenticated) return <Navigate to="/login" />;
      return <WrappedComponent {...props} />;
    };
  }
  const ProtectedDashboard = withAuth(Dashboard);

Real use cases: Authorization (withAuth), analytics/logging (withLogger), theme injection.

HOC vs Custom Hook:
- HOC wraps a component tree — affects rendering.
- Custom hook reuses logic inside a component — no JSX.
- Prefer custom hooks in modern React (simpler, no wrapper hell).

Pitfall: Don't use HOCs inside render — creates a new component type each render.` },
  { id:"rx_e2", level:"intermediate", q:'What are render props? When do you use them over HOCs or hooks?', a:`Render props: A component accepts a function as a prop and calls it to decide what to render.

  <MouseTracker render={({ x, y }) => <Tooltip x={x} y={y} />} />

  class MouseTracker extends React.Component {
    state = { x: 0, y: 0 };
    handleMouseMove = e => this.setState({ x: e.clientX, y: e.clientY });
    render() {
      return (
        <div onMouseMove={this.handleMouseMove}>
          {this.props.render(this.state)}
        </div>
      );
    }
  }

Comparison:
- Render props: Explicit, composable, but verbose.
- HOCs: Less verbose, good for cross-cutting concerns; harder to debug (wrapper hell).
- Custom hooks: Cleanest in functional components — prefer hooks today.

"Children as function" is the same pattern:
  <MouseTracker>{({ x, y }) => <Tooltip x={x} y={y} />}</MouseTracker>` },
  { id:"rx_e3", level:"advanced", q:'What are React Portals? When and why would you use them?', a:`Portals render a component's output into a different DOM node than its parent.

  ReactDOM.createPortal(children, domNode)

  function Modal({ isOpen, children }) {
    if (!isOpen) return null;
    return ReactDOM.createPortal(
      <div className="modal-overlay">{children}</div>,
      document.getElementById('modal-root') // outside #root
    );
  }

Why: CSS stacking context issues — a modal inside a div with overflow:hidden or low z-index would be clipped. Portals escape the DOM hierarchy while keeping the React tree intact.

Key behaviors still hold:
- Events still bubble through the React tree (not the DOM tree).
- Context still works — portal children consume context from parent.

Use cases: Modals, tooltips, dropdown menus, toasts, popovers.` },
  { id:"rx_e4", level:"advanced", q:'Explain React Server Components (RSC). How do they differ from client components?', a:`Server Components (RSC, stable in React 19 / Next.js App Router):
- Run ONLY on the server — never ship their JS to the client.
- Can directly access DBs, file system, env secrets.
- Cannot use useState, useEffect, event handlers, or browser APIs.
- Zero JS bundle contribution.

Client Components:
- "use client" at top of file.
- Run on client (also pre-rendered on server for SSR).
- Can use hooks, events, browser APIs.

Mixed tree:
  // page.tsx — Server Component
  async function ProductPage({ id }) {
    const product = await db.products.findById(id); // direct DB call!
    return <ProductDetail product={product}><AddToCartButton /></ProductDetail>;
  }
  // AddToCartButton.tsx — "use client" — interactive button

Benefits: Less JS shipped, faster TTI, secure data access, no useEffect waterfall.
Limitation: Cannot pass non-serializable values (functions, class instances) to client components.` },
  { id:"rx_e5", level:"intermediate", q:'How does React handle synthetic events and event delegation?', a:`Synthetic Events: React wraps native browser events in a cross-browser SyntheticEvent wrapper.

Event Delegation: Instead of attaching listeners to each element, React attaches ONE listener at the root and routes events to correct handlers.

Benefits: Fewer listeners, consistent cross-browser behavior, batched event processing.

React 17+: Event delegation moved from document to React root — enables multiple React roots on one page.

Key points:
- e.preventDefault(): Prevents browser's default action (form submit, link navigation).
- e.stopPropagation(): Stops React synthetic event bubbling.
- Native addEventListener listeners fire BEFORE React's synthetic events.
- React 17+ no longer pools events — can access event properties after async without e.persist().` },
  { id:"rx_e6", level:"advanced", q:'What is hydration in React? What causes hydration mismatch errors?', a:`Hydration: React attaches event listeners and state to server-rendered HTML, making it interactive without re-rendering the DOM from scratch.

Process:
1. Server renders HTML string → browser receives content immediately.
2. React "hydrates" — walks DOM, reconciles with virtual DOM, attaches handlers.

Hydration mismatch: Server HTML doesn't match what React would render on client.

Common causes:
- Date/time rendering (new Date() differs on server vs client timezone).
- Math.random() — different values each run.
- Browser-only APIs (window, localStorage) used in render.

Fixes:
  // Option 1: Suppress warning (use sparingly)
  <div suppressHydrationWarning>{new Date().toLocaleDateString()}</div>

  // Option 2: Client-only render
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Skeleton />;

React 18+ throws on mismatch in dev; in production tries to recover but may cause visual glitches.` },
  { id:"rx_e7", level:"advanced", q:'How do you implement infinite scrolling in React using Intersection Observer?', a:`Intersection Observer (preferred — no scroll event overhead):

  function useInfiniteScroll(callback, hasMore) {
    const observerRef = useRef(null);
    const lastElementRef = useCallback(node => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!hasMore) return;
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) callback();
      }, { threshold: 0.1 });
      if (node) observerRef.current.observe(node);
    }, [callback, hasMore]);
    return lastElementRef;
  }

  // Usage:
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(...);
  const lastItemRef = useInfiniteScroll(fetchNextPage, hasNextPage);

  return items.map((item, i) =>
    <div ref={i === items.length - 1 ? lastItemRef : null} key={item.id}>
      {item.name}
    </div>
  );

TanStack Query's useInfiniteQuery manages pages automatically.
Combine with react-virtual for large lists to also virtualize rendered items.` },
  { id:"rx_e8", level:"expert", q:'What are React\'s rules of hooks and why do they exist?', a:`Two fundamental rules:

1. Only call hooks at the top level:
   Never inside loops, conditions, or nested functions.
   Hooks must be called in the same order every render.

2. Only call hooks from React functions:
   Functional components or custom hooks — never class components or plain JS.

Why the ORDER rule:
React stores hook state in a linked list (by index) per component instance.
If you call hooks conditionally, the index shifts → wrong state assigned to wrong hook.

  // WRONG:
  if (condition) useState(0); // slot 0 — sometimes skipped
  useState('name');           // now gets slot 0 instead of 1 → BUG

Correct pattern — condition INSIDE the hook:
  const value = useMyHook(); // always call
  if (!condition) return null; // condition after hooks

eslint-plugin-react-hooks enforces both rules statically.

Custom hooks: Any function starting with "use" that calls other hooks. Must follow same rules.` },
  { id:"rx_e9", level:"advanced", q:'What is React.useId() and when was it introduced?', a:`useId(): Hook introduced in React 18 that generates a unique, stable ID.

  function Form() {
    const id = useId();
    return (
      <>
        <label htmlFor={id + "-email"}>Email</label>
        <input id={id + "-email"} type="email" />
        <label htmlFor={id + "-password"}>Password</label>
        <input id={id + "-password"} type="password" />
      </>
    );
  }

Why it exists:
- IDs must be unique per page for accessibility (label → input association).
- Math.random() is different on server vs client → hydration mismatch.
- Counter-based IDs with useState don't survive SSR either.
- useId generates the SAME ID on server and client (based on component position in the tree).

Rules:
- Don't use as list keys (not stable across renders if list order changes).
- Don't use for CSS selectors across renders.
- Generates IDs like ":r0:", ":r1:" — not pretty but unique.` },
  { id:"rx_e10", level:"intermediate", q:'How do you optimize React context to prevent unnecessary re-renders?', a:`Problem: Every context value change re-renders ALL consumers, even if they only use part of the value.

  const ThemeContext = React.createContext(null);
  // If ThemeContext value is { theme, user }, ALL consumers re-render when user changes.

Solutions:

1. Split contexts (simplest):
  const ThemeContext = createContext(null);   // only theme
  const UserContext = createContext(null);    // only user
  // Consumers only re-render when their specific context changes.

2. Memoize the context value:
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
  <ThemeContext.Provider value={value}>

3. Use a state manager for frequent updates:
  Context is not optimized for high-frequency updates (every keystroke).
  Use Zustand, Jotai, or Redux for frequently changing global state.

4. Selector pattern with useSyncExternalStore:
  Zustand uses this internally — consumers subscribe to only the slices they need.

5. React.memo on consumer components:
  Prevents re-render if props haven't changed (context change still re-renders).

Rule: Context is great for infrequently changing global values (theme, locale, auth user). Not for frequently changing state (form values, real-time data).` }
];

export default questions;
