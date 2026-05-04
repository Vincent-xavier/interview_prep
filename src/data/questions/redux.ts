import { Question } from '../../types';

const questions: Question[] = [
{ id:"rx1", level:"beginner", q:'What problem does Redux solve? Explain the three core principles.', a:`Redux solves prop drilling and cross-component state sharing by centralizing state.

Three principles:
1. Single source of truth: One global store holds all application state.
2. State is read-only: The only way to change state is to dispatch an action.
3. Changes via pure functions: Reducers are pure functions — (state, action) => newState.

Data flow: UI dispatches action → Reducer produces new state → Store notifies → UI re-renders.

When to use Redux:
- State is needed by many unrelated components.
- Complex state transitions with many actions.
- Need time-travel debugging / logging middleware.` },
  { id:"rx2", level:"intermediate", q:'Explain Redux Toolkit (RTK) — createSlice, createAsyncThunk, and RTK Query.', a:`Redux Toolkit is the official, opinionated way to write Redux (eliminates boilerplate).

createSlice: Combines actions + reducer:
  const counterSlice = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
      increment: state => { state.value++; }, // uses Immer internally — can "mutate"
      incrementBy: (state, action) => { state.value += action.payload; }
    }
  });
  export const { increment, incrementBy } = counterSlice.actions;

createAsyncThunk: For async operations:
  const fetchUser = createAsyncThunk('user/fetch', async (id) => {
    const res = await api.get('/user/' + id);
    return res.data;
  });
  // Generates pending/fulfilled/rejected action types.

RTK Query: Automatic caching, invalidation, polling — replaces most of axios + slice:
  const api = createApi({ endpoints: builder => ({
    getUser: builder.query({ query: id => '/users/' + id })
  })});` },
  { id:"rx3", level:"intermediate", q:'What is the difference between useSelector and useDispatch?', a:`useSelector: Reads data from the Redux store.
  const count = useSelector(state => state.counter.value);
  // Re-renders only when the selected value changes (shallow compare).
  // Use createSelector (reselect) for memoized selectors when computing derived data.

useDispatch: Returns the dispatch function to send actions to the store.
  const dispatch = useDispatch();
  dispatch(increment());
  dispatch(fetchUser(42)); // thunk

Memoized selector with reselect:
  const selectFilteredItems = createSelector(
    [state => state.items, state => state.filter],
    (items, filter) => items.filter(i => i.category === filter) // only recomputes if inputs change
  );` },
  { id:"rx4", level:"advanced", q:'How does Redux middleware work? Write a custom logger middleware.', a:`Middleware sits between dispatch and reducer, enabling side effects (logging, async, routing).

Middleware signature: store => next => action => { ... next(action) ... }

Custom logger middleware:
  const loggerMiddleware = store => next => action => {
    console.group(action.type);
    console.log('prev state:', store.getState());
    console.log('action:', action);
    const result = next(action); // pass to next middleware / reducer
    console.log('next state:', store.getState());
    console.groupEnd();
    return result;
  };

Adding to store:
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefault => getDefault().concat(loggerMiddleware)
  });

Popular middlewares: redux-thunk (built-in to RTK), redux-saga, redux-observable.` },
  { id:"rx5", level:"advanced", q:'Explain the Redux Saga pattern and when to choose it over Thunks.', a:`Redux Saga uses ES6 generators to handle complex async workflows as a separate "saga" thread.

  function* watchFetchUser() {
    yield takeLatest('user/fetch', fetchUserSaga);
  }
  function* fetchUserSaga(action) {
    try {
      const user = yield call(api.getUser, action.payload);
      yield put({ type: 'user/set', payload: user });
    } catch (e) {
      yield put({ type: 'user/error', payload: e.message });
    }
  }

Effects: call (invoke fn), put (dispatch), take (wait for action), takeLatest (cancel prev), all (parallel), race.

Choose Saga over Thunk when:
- Complex async flows: retry logic, debounce, polling, sequences.
- Need to cancel in-flight requests (takeLatest).
- Side effects are hard to test with thunks.
- WebSocket flows.

Choose Thunk (RTK) for simple fetch + store patterns.` }
];

export default questions;
