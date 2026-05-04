import { Question } from '../../types';

const questions: Question[] = [
{ id:"dn1", level:"beginner", q:'What is the difference between value types and reference types in C#?', a:`Value types (struct, int, bool, double, DateTime, enum):
- Stored on the stack (usually).
- Copied on assignment — changes don't affect original.
  int a = 5; int b = a; b = 10; // a is still 5

Reference types (class, interface, delegate, string, arrays):
- Stored on the heap; variable holds a reference (pointer).
- Assignment copies the reference — both variables point to same object.
  var a = new List<int>(); var b = a; b.Add(1); // a also has 1

Exceptions:
- string is immutable reference type but behaves like value type.
- Boxing: wrapping value type in object (heap allocation).
- Structs on heap when inside class or boxed.

C# 9+ record struct: Value-type records with value equality.` },
  { id:"dn2", level:"beginner", q:'What is async/await in C# and how does it work under the hood?', a:`async/await lets you write asynchronous code that looks synchronous.

  public async Task<string> FetchDataAsync() {
    var response = await httpClient.GetAsync(url); // doesn't block thread
    var content = await response.Content.ReadAsStringAsync();
    return content;
  }

Under the hood:
- Compiler transforms async method into a state machine (IAsyncStateMachine).
- await suspends the method and returns the current thread to the pool.
- When the awaited task completes, execution resumes (possibly on a different thread).

Key types: Task (no return), Task<T> (with return), ValueTask<T> (stack-allocated for hot paths).

Common mistakes:
- async void (can't be awaited, exceptions go unhandled) — only for event handlers.
- .Result or .Wait() causes deadlocks in sync contexts.
- Forgetting await drops the exception silently.` },
  { id:"dn3", level:"beginner", q:'What is a delegate, Action, and Func in C#?', a:`Delegate: A type-safe function pointer.
  delegate int MathOp(int a, int b);
  MathOp add = (a, b) => a + b;
  add(3, 4); // 7

Action<T>: Built-in delegate with void return.
  Action<string> print = msg => Console.WriteLine(msg);

Func<T, TResult>: Built-in delegate that returns a value.
  Func<int, int, int> add = (a, b) => a + b;

Func<string, bool> isLong = s => s.Length > 10;

Events use delegates: event Action<string> OnUserAdded;

Lambda captures: Closures can capture outer variables (be careful of loop variable capture bugs).` },
  { id:"dn4", level:"intermediate", q:'Explain IEnumerable vs IQueryable — and when does LINQ query execute?', a:`IEnumerable<T>:
- Works with in-memory collections.
- LINQ operations execute in-memory after data is loaded.
- Extension methods from System.Linq.
  var result = list.Where(x => x.Age > 18); // executes on the C# object graph

IQueryable<T>:
- Works with out-of-process data (EF Core, LINQ to SQL).
- Builds an expression tree; actual SQL is only generated and sent to DB when enumerated.
- Extension methods from System.Linq.Queryable.
  var result = dbContext.Users.Where(x => x.Age > 18); // SQL: WHERE Age > 18

Deferred execution: LINQ queries don't run until you enumerate (foreach, .ToList(), .FirstOrDefault()).
Immediate execution: .ToList(), .Count(), .Sum(), .First() force execution immediately.

Key rule: Keep IQueryable for DB queries to avoid loading all data into memory.` },
  { id:"dn5", level:"intermediate", q:'What is Dependency Injection in .NET Core? How is it configured?', a:`.NET Core has a built-in DI container. Services are registered in Program.cs (or Startup.cs).

Lifetimes:
- Transient: New instance per injection. For lightweight, stateless services.
- Scoped: One instance per HTTP request. Ideal for DbContext.
- Singleton: One instance for app lifetime. For caches, configuration.

Registration:
  builder.Services.AddTransient<IEmailService, EmailService>();
  builder.Services.AddScoped<IOrderRepository, OrderRepository>();
  builder.Services.AddSingleton<ICacheService, MemoryCacheService>();

Constructor injection (preferred):
  public class OrderController(IOrderRepository repo, IEmailService email) {}

Service locator (anti-pattern — avoid):
  var svc = httpContext.RequestServices.GetService<IEmailService>();

Never inject Scoped into Singleton (captive dependency) — leads to stale instances.` },
  { id:"dn6", level:"intermediate", q:'What are C# records and how do they differ from classes?', a:`Records (C# 9+) are reference types (record class) or value types (record struct) with:
- Value-based equality (==, Equals compare all properties).
- Immutability by default (init-only properties).
- with expression for non-destructive mutation.
- Built-in ToString (prints all properties).

  record User(string Name, int Age);
  var u1 = new User("Alice", 30);
  var u2 = u1 with { Age = 31 }; // new record, u1 unchanged
  Console.WriteLine(u1 == u2); // false (value equality)

  record struct Point(int X, int Y); // value type record

vs Class:
- Class: reference equality by default, mutable, no with expression.
- Record: value equality, immutable by default, with expression.

Use records for: DTOs, value objects, immutable data models.` },
  { id:"dn7", level:"advanced", q:'Explain generics constraints in C# — where T : class, new(), interface, struct.', a:`Generic constraints restrict what types T can be:

  public class Repository<T> where T : class, IEntity, new()
  {
    public T Create() => new T(); // possible because of new()
  }

Common constraints:
- where T : class — T must be a reference type.
- where T : struct — T must be a value type (non-nullable).
- where T : new() — T must have a parameterless constructor.
- where T : SomeClass — T must inherit from SomeClass.
- where T : ISomeInterface — T must implement the interface.
- where T : notnull — T cannot be nullable.
- where T : unmanaged — T must be an unmanaged type (for Span<T>/unsafe).

Multiple constraints:
  where T : class, IComparable<T>, new()

Use constraints to gain access to members of T without reflection or boxing.` },
  { id:"dn8", level:"advanced", q:'What is Span<T> and Memory<T>? When would you use them?', a:`Span<T>: A ref struct that represents a contiguous memory region (stack, heap, or unmanaged) without allocation.
  Span<char> slice = someString.AsSpan(0, 5); // no allocation
  Span<byte> buffer = stackalloc byte[256];    // stack allocation

Key: Cannot be stored on heap, used as field, or used in async methods (ref struct restriction).

Memory<T>: Heap-safe wrapper around a memory region — can be stored, passed across async methods.
  Memory<byte> mem = new byte[1024];
  await ProcessAsync(mem); // OK in async

Use cases:
- Parsing strings/bytes without creating substrings (zero-allocation).
- High-performance binary serialization.
- Network buffers (System.IO.Pipelines).

ArraySegment<T>: Older alternative — less performant, wraps an array segment.` },
  { id:"dn9", level:"advanced", q:'Explain threading in C# — Task Parallel Library, async/await vs threads, and synchronization primitives.', a:`Threads: OS-level, expensive (1MB stack), context-switching overhead.
  new Thread(() => DoWork()).Start();

Task Parallel Library (TPL): Thread pool abstraction.
  Task.Run(() => DoWork()); // runs on thread pool
  Parallel.ForEach(items, item => Process(item)); // data parallelism

async/await: I/O-bound tasks. Doesn't block threads — uses callbacks.

Synchronization primitives:
- lock / Monitor: Mutual exclusion. Blocking.
  lock (_lock) { /* critical section */ }
- SemaphoreSlim: Allow N concurrent threads. Async-compatible.
  await semaphore.WaitAsync(); try { ... } finally { semaphore.Release(); }
- ConcurrentDictionary, ConcurrentQueue: Thread-safe collections.
- Interlocked: Atomic operations (increment, compare-exchange).

Common pitfalls: Deadlocks (circular locks), race conditions, capturing non-thread-safe objects in Tasks.` },
  { id:"dn10", level:"expert", q:'What are C# source generators and how do they work?', a:`Source generators run at compile time to produce additional C# code based on the existing code.

How they work:
1. A class implementing ISourceGenerator (or IIncrementalGenerator) is compiled into an analyzer DLL.
2. The Roslyn compiler runs it during compilation.
3. The generator receives a Compilation object (full syntax tree).
4. It adds new source files to the compilation.

Use cases:
- Auto-generate boilerplate (INotifyPropertyChanged, serialization, API clients).
- AutoMapper alternatives.
- Compile-time dependency injection (Jab, StrongInject).
- System.Text.Json's source-gen mode (AOT-friendly).

Example: [GenerateMapper] attribute on a class → generator outputs a MapTo() extension method.

Benefits: Zero runtime reflection, AOT-compatible, faster startup.` },
  { id:"dn11", level:"intermediate", q:'What are extension methods in C#? When and how do you use them?', a:`Extension methods add methods to existing types without modifying them or inheriting from them.

Syntax: static method in static class, with "this" before first parameter.
  public static class StringExtensions {
    public static bool IsNullOrEmpty(this string s) => string.IsNullOrEmpty(s);
    public static string ToPascalCase(this string s) =>
      string.IsNullOrEmpty(s) ? s : char.ToUpper(s[0]) + s[1..].ToLower();
  }

  // Usage:
  "hello".ToPascalCase(); // "Hello"
  string? name = null;
  name.IsNullOrEmpty();   // true (no NullReferenceException — this can be null)

LINQ is entirely built on extension methods for IEnumerable<T>.

Good uses:
- Adding helpers to third-party / sealed types.
- Fluent API building (method chaining).
- Domain-specific helpers on primitive types.

Avoid: Don't use for core business logic — hard to discover, can clutter intellisense.` },
  { id:"dn12", level:"intermediate", q:'What is the difference between abstract class and interface in C#? When to use each?', a:`Interface (C# 8+ can have default implementations):
- Defines a contract — WHAT to do, not HOW.
- A class can implement multiple interfaces.
- No fields (only properties), no constructors.
- Use when: Defining capability across unrelated types (IDisposable, IComparable, ISerializable).

Abstract class:
- Can have fields, constructors, implemented methods, abstract methods.
- Single inheritance only.
- Use when: Shared base implementation across related types; template method pattern.

  abstract class Animal {
    public abstract string Speak(); // must implement
    public void Sleep() => Console.WriteLine("Zzz"); // shared implementation
  }

Decision guide:
- "Can do" relationship → interface (IFlyable, ISwimmable).
- "Is a" relationship with shared code → abstract class (Animal → Dog, Cat).
- Both? Implement interface, use abstract class as default implementation base.

C# 8 default interface methods blur this distinction — but abstract classes are still preferred for shared state.` },
  { id:"dn13", level:"advanced", q:'Explain C# pattern matching — switch expressions, property patterns, positional patterns.', a:`Pattern matching (C# 7-11+) lets you match values against patterns in a readable, exhaustive way.

Type pattern:
  if (shape is Circle c) { return Math.PI * c.Radius * c.Radius; }

Switch expression (C# 8):
  double area = shape switch {
    Circle c      => Math.PI * c.Radius * c.Radius,
    Rectangle r   => r.Width * r.Height,
    null          => throw new ArgumentNullException(),
    _             => throw new NotSupportedException()
  };

Property pattern (C# 8):
  string classify = order switch {
    { Status: "Pending", Total: > 1000 } => "High-value pending",
    { Status: "Paid" }                   => "Paid order",
    _                                    => "Other"
  };

Positional pattern (deconstruct):
  var result = point switch {
    (0, 0) => "Origin",
    (var x, 0) => $"X-axis at {x}",
    (0, var y) => $"Y-axis at {y}",
    var (x, y) => $"Point({x},{y})"
  };

List patterns (C# 11):
  int[] arr = { 1, 2, 3 };
  bool match = arr is [1, .., 3]; // true` },
  { id:"dn14", level:"advanced", q:'What is the IOptions pattern in .NET Core? How do you bind configuration?', a:`IOptions<T> pattern cleanly binds appsettings.json sections to strongly-typed POCOs.

appsettings.json:
  {
    "EmailSettings": {
      "SmtpHost": "smtp.gmail.com",
      "Port": 587,
      "FromAddress": "no-reply@app.com"
    }
  }

POCO:
  public class EmailSettings {
    public string SmtpHost { get; set; } = "";
    public int Port { get; set; }
    public string FromAddress { get; set; } = "";
  }

Registration (Program.cs):
  builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));

Usage in service:
  public class EmailService(IOptions<EmailSettings> opts) {
    private readonly EmailSettings _settings = opts.Value;
  }

Variants:
- IOptions<T>: Singleton — reads once at startup.
- IOptionsSnapshot<T>: Scoped — re-reads per request (for reloadOnChange).
- IOptionsMonitor<T>: Singleton with change notification (hot reload).

Validation: Add [Required], [Range] on the POCO and call
  services.AddOptions<EmailSettings>().BindConfiguration("EmailSettings").ValidateDataAnnotations();` },
  { id:"dn15", level:"expert", q:'Explain the difference between Task, ValueTask, and IAsyncEnumerable in C#.', a:`Task<T>:
- Always allocates a heap object.
- Use for most async operations.
- Safe to await multiple times.

ValueTask<T> (C# 5.1+):
- Stack-allocated when result is available synchronously (common in caching, hot paths).
- Avoids heap allocation for the happy path.
- Should only be awaited ONCE (not stored and awaited later).
  public ValueTask<User?> GetUserAsync(int id) {
    if (_cache.TryGetValue(id, out var user)) return new ValueTask<User?>(user); // no alloc!
    return new ValueTask<User?>(FetchFromDbAsync(id));
  }

IAsyncEnumerable<T> (C# 8+):
- Async streaming — yields items one at a time without loading all into memory.
  async IAsyncEnumerable<Order> StreamOrdersAsync([EnumeratorCancellation] CancellationToken ct) {
    await foreach (var batch in db.Orders.AsAsyncEnumerable().WithCancellation(ct))
      yield return batch;
  }
  // Consumer:
  await foreach (var order in StreamOrdersAsync(ct)) Process(order);

Use IAsyncEnumerable for: Large dataset streaming, real-time data feeds, paginated APIs where you process as you go.` }
];

export default questions;
