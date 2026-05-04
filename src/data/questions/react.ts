import { Question } from '../../types';

const questions: Question[] = [
{ id:"r1", level:"beginner", q:'What is the Virtual DOM and how does React use it?', a:`The Virtual DOM is an in-memory JavaScript object that mirrors the real DOM structure.

How React uses it:
1. When state/props change, React builds a new Virtual DOM tree.
2. React diffs (reconciles) the new tree with the previous one — this is called "reconciliation".
3. React computes the minimal set of changes (patch) needed.
4. Only those changes are applied to the real DOM (batch update).

Why it matters: Real DOM manipulation is expensive; virtual DOM keeps it minimal and predictable.` },
  { id:"r2", level:"beginner", q:'Explain the difference between props and state.', a:`Props (properties):
- Passed from parent to child — read-only from the child's perspective.
- Changing props in parent re-renders child.
- External data the component receives.

State:
- Managed inside the component via useState/useReducer.
- Mutable — component controls its own state.
- Changing state triggers a re-render of that component and its children.

Key rule: "Props flow down, events bubble up."` },
  { id:"r3", level:"beginner", q:'What is JSX and how does Babel transform it?', a:`JSX is a syntax extension that lets you write HTML-like markup in JavaScript files.

Babel transforms JSX into React.createElement() calls:
  <div className="box">Hello</div>
  ↓
  React.createElement("div", { className: "box" }, "Hello")

In React 17+, the new JSX transform imports from 'react/jsx-runtime', so you no longer need to import React just to use JSX.` },
  { id:"r4", level:"beginner", q:'What are React hooks and what problem do they solve?', a:`Hooks are functions that let function components use React features like state and lifecycle methods — previously only available in class components.

Key built-in hooks:
- useState: local state
- useEffect: side effects (data fetching, subscriptions)
- useContext: consuming context
- useRef: mutable ref / DOM access
- useMemo, useCallback: memoization
- useReducer: complex state logic

Problem solved: Eliminated class component boilerplate, made logic reusable via custom hooks, fixed the confusion of "this" in classes.` },
  { id:"r5", level:"intermediate", q:'Explain useEffect dependencies array — what happens with [], no deps, and specific deps?', a:`useEffect(fn, deps) behavior:

- No deps array: runs after EVERY render (like componentDidUpdate + componentDidMount).
- []: runs ONCE after first render (like componentDidMount). Never reruns.
- [a, b]: runs after first render, and whenever a or b changes (shallow comparison).

Cleanup: Return a function from the effect to clean up subscriptions, timers, etc.:
  useEffect(() => {
    const sub = store.subscribe(fn);
    return () => sub.unsubscribe(); // cleanup
  }, []);

Common mistakes: Omitting dependencies causes stale closures; adding too many causes infinite loops.` },
  { id:"r6", level:"intermediate", q:'What is the difference between useMemo and useCallback?', a:`Both memoize values to avoid recalculation on every render.

useMemo: memoizes the RESULT of a function.
  const sorted = useMemo(() => items.sort(), [items]);

useCallback: memoizes the FUNCTION REFERENCE itself.
  const handleClick = useCallback(() => setCount(c+1), []);

When to use:
- useMemo: expensive computations (filtering 10k items, complex derivations).
- useCallback: passing callbacks to memoized child components to prevent unnecessary re-renders.

Both are performance tools — don't overuse them; they add overhead for the memo comparison.` },
  { id:"r7", level:"intermediate", q:'Explain React.memo — how does it work and when should you use it?', a:`React.memo is a HOC that wraps a component and shallowly compares props before re-rendering:
  const Child = React.memo(({ name }) => <div>{name}</div>);

If props haven't changed (shallow equality), React skips the re-render and reuses the last rendered output.

When to use:
- A pure component receives the same props often but its parent re-renders frequently.
- Passing object/array/function props requires you to also use useMemo/useCallback to keep references stable.

When NOT to use:
- The component almost always receives different props.
- The component is cheap to render.` },
  { id:"r8", level:"intermediate", q:'Controlled vs Uncontrolled components — what is the difference?', a:`Controlled: React state is the single source of truth.
  const [val, setVal] = useState('');
  <input value={val} onChange={e => setVal(e.target.value)} />

Uncontrolled: DOM manages its own state; you read it via ref.
  const ref = useRef();
  <input ref={ref} defaultValue="hello" />
  // access: ref.current.value

Controlled is preferred for:
- Validation, conditionally disabling submit, formatted input, dynamic forms.

Uncontrolled is useful for:
- File inputs, integrating with non-React libraries, simple cases where you only need value on submit.` },
  { id:"r9", level:"intermediate", q:'What is the Context API and when should you prefer it over Redux?', a:`Context API: Built-in React mechanism to share values across the component tree without prop drilling.
  const ThemeCtx = React.createContext('light');
  // Provider wraps tree, Consumer or useContext reads the value.

Use Context for:
- Theme, locale, auth user — global but infrequently changing values.
- Avoiding prop drilling in medium-sized apps.

Use Redux when:
- Complex state with many interactions.
- Time-travel debugging / Redux DevTools needed.
- Frequent state updates from many components.

Context + useReducer can replace Redux for mid-complexity apps; Redux (Toolkit) shines at scale.` },
  { id:"r10", level:"advanced", q:'Explain React\'s reconciliation algorithm and the "key" prop.', a:`Reconciliation is how React updates the DOM efficiently when state changes.

Algorithm (Fiber-based):
1. Diffs two trees level by level (top-down, O(n) not O(n³)).
2. Same element type → update props, reuse the node.
3. Different element type → unmount old subtree, mount new one.
4. Lists: React uses the key prop to match old and new items.

key prop:
- Helps React identify which items changed, were added, or removed.
- Without keys in lists → React has to guess → buggy animations or state.
- Keys should be stable, unique IDs — NOT array indexes (unless list is static).

Bad: key={index} on a reorderable list will cause bugs.
Good: key={item.id}` },
  { id:"r11", level:"advanced", q:'Explain React code-splitting with React.lazy and Suspense.', a:`Code splitting splits your JS bundle so users don't download everything upfront.

React.lazy: Dynamically imports a component.
  const Settings = React.lazy(() => import('./Settings'));

Suspense: Renders a fallback while the lazy component loads.
  <Suspense fallback={<Spinner />}>
    <Settings />
  </Suspense>

With React Router v6:
  const router = createBrowserRouter([
    { path: '/settings', element: <Suspense fallback={<Loading/>}><Settings/></Suspense> }
  ]);

Result: Initial bundle is smaller; Settings.js is only fetched when the user navigates there.
Combine with route-based splitting for maximum impact.` },
  { id:"r12", level:"advanced", q:'How do Error Boundaries work and what can they catch?', a:`Error Boundaries are class components (currently) that catch JS errors in their child component tree during rendering, lifecycle methods, and constructors.

  class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError(err) { return { hasError: true }; }
    componentDidCatch(err, info) { logErrorToService(err, info); }
    render() { return this.state.hasError ? <Fallback/> : this.props.children; }
  }

What they DON'T catch:
- Errors in event handlers (use try/catch inside).
- Async errors (setTimeout, fetch).
- Errors in the error boundary itself.

In React 18+, you can use useErrorBoundary (react-error-boundary library) to use hooks-based approach.` },
  { id:"r13", level:"advanced", q:'What is a custom hook? Design a useDebounce hook.', a:`A custom hook is a function that starts with "use" and can call other hooks to reuse stateful logic across components.

useDebounce implementation:
  function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timer); // cleanup on each change
    }, [value, delay]);
    
    return debouncedValue;
  }

Usage:
  const debouncedSearch = useDebounce(searchQuery, 500);
  useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);

Rules: Cannot call hooks conditionally; custom hooks must follow the Rules of Hooks.` },
  { id:"r14", level:"expert", q:'Explain React Fiber architecture — what changed from the stack reconciler?', a:`Old stack reconciler (React <16): Recursively walked the component tree synchronously. Couldn't be interrupted, causing jank on slow renders.

React Fiber (React 16+): Reimplemented the reconciler as an incremental rendering engine.

Key concepts:
- Fiber node: a JS object representing a unit of work (one per component/DOM element).
- Work loop: breaks rendering into chunks (units of work), can pause, abort, reuse.
- Two phases:
  1. Render phase (interruptible): Traverse fiber tree, compute changes. Pure, no side effects.
  2. Commit phase (synchronous): Apply changes to real DOM, run useLayoutEffect.

Benefits:
- Can pause work, yield to browser, resume later (enables Concurrent Mode).
- Priority lanes: high-priority updates (user input) can interrupt low-priority ones.
- Enables Suspense, transitions, streaming SSR.` },
  { id:"r15", level:"expert", q:'What is React 18 Concurrent Mode, automatic batching, and the useTransition hook?', a:`Concurrent Mode (React 18 default with createRoot):
- React can work on multiple versions of the UI simultaneously.
- Can interrupt renders to handle higher-priority updates.

Automatic Batching:
- Pre-18: Only batched state updates inside React event handlers.
- React 18: Batches ALL updates (inside setTimeout, promises, native events too).
  // Pre-18: two renders. React 18: ONE render.
  setTimeout(() => { setA(1); setB(2); }, 0);

useTransition:
  const [isPending, startTransition] = useTransition();
  startTransition(() => setSearchQuery(value)); // marks as non-urgent
  // React can interrupt this to handle more urgent updates

useDeferredValue: Similar to debounce but React-aware:
  const deferred = useDeferredValue(searchQuery);

Use case: Keeping input responsive while a heavy filtered list re-renders.` },
  { id:"r16", level:"beginner", q:'What is the difference between useLayoutEffect and useEffect?', a:`Both run after render, but timing differs:

useEffect:
- Runs AFTER the browser has painted the screen (asynchronous).
- Safe for most side effects: data fetching, subscriptions, logging.
- Does NOT block visual update.

useLayoutEffect:
- Runs synchronously AFTER DOM mutations but BEFORE the browser paints.
- Blocks painting until it completes.
- Use for: reading DOM layout (getBoundingClientRect), preventing visual flicker.

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setHeight(height); // update before paint — no flicker
  }, []);

Rule: Default to useEffect. Switch to useLayoutEffect only when you see visual flickering from a DOM measurement/mutation.

SSR warning: useLayoutEffect causes a warning in SSR environments — use useEffect or guard with typeof window !== 'undefined'.` },
  { id:"r17", level:"intermediate", q:'What is useReducer and when should you use it over useState?', a:`useReducer manages complex state with a reducer function (same concept as Redux).

  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action) {
    switch (action.type) {
      case 'increment': return { ...state, count: state.count + 1 };
      case 'setUser':   return { ...state, user: action.payload };
      case 'reset':     return initialState;
      default: throw new Error('Unknown action: ' + action.type);
    }
  }
  // Usage:
  dispatch({ type: 'increment' });
  dispatch({ type: 'setUser', payload: { name: 'Vincent' } });

Use useReducer when:
- Multiple state values that update together.
- Next state depends on previous state in complex ways.
- State transitions have multiple cases (form wizard, multi-step flow).
- You want to keep state logic in one place (testable pure function).

useState is simpler for single values; useReducer shines for objects/complex logic.` },
  { id:"r18", level:"intermediate", q:'Explain React\'s key reconciliation gotchas — when using index as key causes bugs.', a:`Using index as key causes bugs when the list is REORDERED or items are INSERTED/DELETED from the middle.

Why: React uses the key to match old vs new component instances. If key = index:
- Insert item at position 0 → all keys shift → React thinks ALL items changed → remounts everything.
- Stateful components (input with typed value, animation state) lose their state.

Bug example:
  // Items: ["Alice", "Bob", "Charlie"]
  // Delete "Alice" → ["Bob", "Charlie"]
  // With index keys: "Bob" gets key=0 (was "Alice's" key) → React REUSES "Alice's" DOM → stale state!

Safe to use index as key ONLY when:
- List is purely static (never reordered/filtered).
- Items have no internal state.
- List is just display-only.

Always prefer a stable, unique ID:
  items.map(item => <Card key={item.id} {...item} />)` },
  { id:"r19", level:"advanced", q:'How do you implement virtualization for a list with 100,000 items in React?', a:`Rendering 100k DOM nodes is impossible. Virtualization only renders what's visible in the viewport.

Libraries:
- react-window (lightweight) — most common
- react-virtual (TanStack Virtual) — hooks-based, flexible
- react-virtuoso — easiest to use

react-window example:
  import { FixedSizeList } from 'react-window';

  const Row = ({ index, style }) => (
    <div style={style}>Item {index}: {data[index].name}</div>
  );

  <FixedSizeList
    height={600}      // viewport height
    itemCount={100000}
    itemSize={50}     // each row height
    width="100%"
  >
    {Row}
  </FixedSizeList>

VariableSizeList: For rows of different heights.

How it works:
- Calculates which indices are visible based on scroll position.
- Only renders those rows + a small overscan buffer (e.g., 3 rows above/below).
- Positions rows absolutely using transform/top.
- Total scroll height = itemCount × itemSize (creates scrollable container).

Combined with React.memo + useMemo for row data → blazing fast lists.` },
  { id:"r20", level:"advanced", q:'What is React\'s StrictMode and what does it do in development?', a:`React.StrictMode is a development-only tool that helps find potential problems.

  <React.StrictMode>
    <App />
  </React.StrictMode>

What it does in React 18 (development mode only):
1. Double-invokes render functions, state updater functions, and reducers — to detect side effects in unexpected places.
2. Double-invokes useEffect setup AND cleanup — to verify effects are idempotent and clean up properly.
3. Warns about deprecated APIs (legacy context, findDOMNode, componentWillMount, etc.).
4. Warns about missing key props.

Why double-invoke: Helps surface bugs where functions have unintended side effects or effects don't clean up properly.

Tip: If your effect runs twice in development, it's StrictMode. Fix: ensure cleanup function reverses the effect completely. In production, effects run once.

Does NOT affect production builds.` },
  { id:"r21", level:"intermediate", q:'How does React handle forms? Explain form libraries and validation.', a:`Controlled forms (pure React):
  const [form, setForm] = useState({ email: '', password: '' });
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  <input name="email" value={form.email} onChange={handle} />

Downsides: Lots of boilerplate, re-renders on every keystroke.

React Hook Form (most popular):
  const { register, handleSubmit, formState: { errors } } = useForm();
  <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
  <form onSubmit={handleSubmit(onSubmit)}>
  // Only re-renders on submit, not every keystroke — much better performance.

Formik: Older alternative, heavier, more re-renders.

Zod + React Hook Form (production standard):
  const schema = z.object({ email: z.string().email(), age: z.number().min(18) });
  const { register } = useForm({ resolver: zodResolver(schema) });
  // Type-safe validation matching your TypeScript types.

Yup: Similar to Zod, older ecosystem.` },
  { id:"r22", level:"advanced", q:'Explain React Query (TanStack Query) — what problem does it solve over useEffect + fetch?', a:`Problems with useEffect + fetch:
- Manual loading/error/data state management.
- No caching — same data fetched again on remount.
- No background refresh.
- Race conditions on fast navigation.
- No deduplication of concurrent requests.

React Query solves all of these:
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['orders', customerId],   // cache key
    queryFn: () => api.getOrders(customerId),
    staleTime: 1000 * 60 * 5,          // treat as fresh for 5 min
    refetchOnWindowFocus: true,         // refetch when user returns to tab
  });

Mutations:
  const mutation = useMutation({
    mutationFn: (newOrder) => api.createOrder(newOrder),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }), // refresh list
  });
  mutation.mutate({ productId: 1, qty: 2 });

Benefits: Server state separate from client state; optimistic updates; pagination; infinite scroll; prefetching.` },
  { id:"r23", level:"expert", q:'How do you test React components? Explain unit vs integration testing strategy.', a:`Testing pyramid for React:

Unit tests (React Testing Library + Vitest/Jest):
  import { render, screen, fireEvent } from '@testing-library/react';

  test('shows error when email is empty', () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

Philosophy (Testing Library): Test behavior from user's perspective, not implementation details. Query by role/text, not CSS selectors.

Integration tests: Render component tree with real Redux store/context, mock API calls with msw (Mock Service Worker).

  // msw intercepts HTTP at network level — realistic but no real server needed
  server.use(rest.get('/api/orders', (req, res, ctx) => res(ctx.json(mockOrders))));

E2E tests (Playwright/Cypress): Actual browser, real app, real API or seeded DB.

Rule: Don't test implementation — test observable behavior. Avoid testing state directly; test what the user sees.

For your stack: Vitest + React Testing Library (fast, ESM native) for units; Playwright for E2E.` }
];

export default questions;
