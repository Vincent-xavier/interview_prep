import { Question } from '../../types';

const questions: Question[] = [
{ id:"pf1", level:"beginner", q:'What is the difference between CPU-bound and I/O-bound operations?', a:`CPU-bound: Work that keeps the CPU busy — calculations, image processing, sorting huge arrays.
  More CPU/cores help. Use Parallel.ForEach / Task.Run.

I/O-bound: Work that WAITS on external resources — disk reads, network calls, DB queries.
  CPU is idle during wait. Use async/await — frees thread while waiting.

In .NET:
  // I/O-bound: async/await frees thread during wait
  var data = await httpClient.GetAsync(url);
  var rows = await dbContext.Orders.ToListAsync();

  // CPU-bound: Task.Run offloads to thread pool
  var result = await Task.Run(() => HeavyComputation(data));

Why: ASP.NET Core — async I/O allows one thread to handle many concurrent requests.
  Sync I/O: Each waiting request holds a thread → thread pool exhausted → 503 errors.` },
  { id:"pf2", level:"intermediate", q:'What is the N+1 query problem and how do you prevent it in EF Core?', a:`N+1: 1 query to get N records, then N queries for related data = N+1 total queries.

  var orders = await db.Orders.ToListAsync(); // 1 query
  foreach (var o in orders)
    var c = await db.Customers.FindAsync(o.CustomerId); // 100 queries!
  // Total: 101 queries — terrible!

Detection: Enable EF Core logging or use MiniProfiler.

Fixes:
  // 1. Eager loading with Include (JOIN in SQL)
  var orders = await db.Orders.Include(o => o.Customer).ToListAsync();

  // 2. Projection (best — only fetch what you need)
  var dtos = await db.Orders.Select(o => new {
    o.Id, CustomerName = o.Customer.Name
  }).ToListAsync();

  // 3. Batch loading
  var ids = orders.Select(o => o.CustomerId).Distinct();
  var customers = await db.Customers.Where(c => ids.Contains(c.Id)).ToDictionaryAsync(c => c.Id);` },
  { id:"pf3", level:"intermediate", q:'What is connection pooling and why is it critical?', a:`Connection pooling: Reuses established DB connections instead of creating new ones per request.

Why new connections are expensive:
  TCP + TLS handshake + PostgreSQL spawns OS process per connection (~5MB RAM, 20-100ms).

Without pooling: 100 concurrent requests → 100 new connections → DB overwhelmed → exhausted.
With pooling: Pool maintains N connections. Requests borrow, use, return in <1ms.

.NET: ADO.NET has built-in pooling (transparent). Configure: "Maximum Pool Size=100".

PostgreSQL + PgBouncer:
  PostgreSQL max_connections typically 100-200 (each = process = RAM).
  PgBouncer in transaction mode: 10,000 app connections → 50 actual DB connections.

Modes:
  Session: 1:1 mapping (no pooling benefit).
  Transaction: Borrow DB connection per transaction (best for stateless APIs).
  Statement: Incompatible with multi-statement transactions — avoid.

Monitor: pg_stat_activity, connection wait times, pool exhaustion alerts.` },
  { id:"pf4", level:"advanced", q:'How do you implement multi-level caching in a .NET API?', a:`Level 1 — IMemoryCache (fastest, per-server, no serialization):
  if (!_cache.TryGetValue("products", out List<Product> products)) {
    products = await _db.Products.ToListAsync();
    _cache.Set("products", products, TimeSpan.FromMinutes(5));
  }

Level 2 — IDistributedCache / Redis (shared across servers):
  var json = await _redis.GetStringAsync("products");
  if (json == null) {
    products = await _db.Products.ToListAsync();
    await _redis.SetStringAsync("products", JsonSerializer.Serialize(products),
      new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30) });
  }

Level 3 — Output Caching (.NET 7+, HTTP response level):
  [OutputCache(Duration = 60, VaryByQuery = new[]{"page"})]
  public IActionResult GetProducts([FromQuery] int page) { ... }

Level 4 — CDN/Nginx (edge caching for public content).

Cache stampede prevention:
  await _semaphore.WaitAsync(); // only one request rebuilds cache
  try { /* check → fill cache */ } finally { _semaphore.Release(); }` },
  { id:"pf5", level:"advanced", q:'What are the key performance metrics and four golden signals for production APIs?', a:`Four Golden Signals (Google SRE):

1. Latency: p50/p95/p99 response times. Separate success vs error latency.
2. Traffic: Requests per second (RPS) — capacity planning baseline.
3. Errors: Error rate (5xx / total). Error budget tracking vs SLO.
4. Saturation: CPU%, memory%, thread pool queue, DB connection pool utilization.

.NET-specific metrics (via OpenTelemetry → Prometheus → Grafana):
  dotnet_threadpool_queue_length   → thread starvation
  dotnet_gc_collections_total      → GC pressure
  dotnet_gc_heap_size_bytes        → memory pressure
  http_server_request_duration     → ASP.NET Core latency
  ef_core_queries_duration         → DB query performance

Key alerts:
  p99 latency > 2s, error rate > 1%, thread pool queue > 100,
  DB connection pool > 90% utilization, memory growing without GC reduction.

Tools: Application Insights (Azure), Datadog, Grafana + Prometheus, Seq + Serilog.` },
  { id:"pf6", level:"advanced", q:'How do you optimize .NET GC and reduce memory allocations?', a:`Understanding generations:
  Gen 0: Short-lived objects. Collected frequently, fast (~ms).
  Gen 1: Survived Gen 0. Intermediate.
  Gen 2: Long-lived objects. Least frequent, longest pause.
  LOH: Objects > 85KB — collected with Gen 2.

Signs of GC pressure: High Gen 2 collection rate, high GC pause ratio, memory profiler shows many short-lived large allocations.

Optimization strategies:

1. ArrayPool<T>: Reuse byte arrays instead of allocating.
   var buf = ArrayPool<byte>.Shared.Rent(4096);
   try { /* use */ } finally { ArrayPool<byte>.Shared.Return(buf); }

2. Span<T> / Memory<T>: Stack-allocated or slice without allocation.
   ReadOnlySpan<char> slice = bigString.AsSpan(0, 10); // no copy!

3. ValueTask<T>: Avoids Task object allocation on hot paths (caching, hot reads).

4. StringBuilder instead of string += in loops.

5. Struct for small value types (avoid boxing).

6. stackalloc for small fixed buffers: Span<byte> buf = stackalloc byte[64];

7. Avoid LINQ in extremely hot paths — allocates enumerators.

8. ObjectPool<T>: Pool expensive objects (DB connections, StringBuilder, custom objects).` },
  { id:"pf7", level:"expert", q:'Explain horizontal vs vertical scaling. When does each break down?', a:`Vertical Scaling (Scale Up): More CPU/RAM on same server.
  Pros: Simple (no app changes), works well early.
  Limits: Hardware ceiling, single point of failure, cost > linear, downtime for upgrades.

Horizontal Scaling (Scale Out): More servers, distribute load.
  Requires: Stateless app, shared state in Redis/DB, load balancer.
  Pros: Elastic, high availability, linear cost scaling.
  Limits: App must be stateless, distributed complexity, single-leader DB write bottleneck.

When vertical breaks: Hit largest instance, cost prohibitive, availability unacceptable.
When horizontal breaks: Stateful workloads that can't partition, single-node bottlenecks, coordination overhead > computation (Amdahl's Law).

Database scaling:
  Read replicas: Horizontal for reads (most apps are read-heavy).
  Write scaling: Vertical primary + sharding for extreme scale.
  CQRS: Separate read/write stores — read store can scale independently.

Amdahl's Law: If 5% of code is sequential, max speedup = 1/(0.05) = 20× regardless of cores.` },
  { id:"pf8", level:"advanced", q:'What is database indexing strategy? Explain composite, covering, partial, and functional indexes.', a:`Index types (PostgreSQL):

B-tree (default): Equality + range queries. Most common.
Hash: Equality only — slightly faster than B-tree for exact match.
GIN/GiST: JSONB, full-text search, arrays.
BRIN: Large sequentially-ordered data (timestamps, log tables).

Index strategies:

Composite: (col1, col2). Most selective column first. Queries must use leading columns.
  CREATE INDEX ON orders(customer_id, created_at DESC);
  -- Works for: WHERE customer_id=1; WHERE customer_id=1 AND created_at>...
  -- Doesn't help: WHERE created_at > ... (missing leading column)

Covering/Include: Store extra columns to avoid table lookup (index-only scan).
  CREATE INDEX ON orders(customer_id) INCLUDE (status, total);
  -- Query SELECT status,total WHERE customer_id=1 → no table access needed.

Partial: Index only rows matching a condition.
  CREATE INDEX ON orders(customer_id) WHERE status = 'active';
  -- Smaller index — faster for active orders queries.

Functional: Index on an expression.
  CREATE INDEX ON users(LOWER(email)); -- supports WHERE LOWER(email)='...'

EXPLAIN ANALYZE to verify index is used:
  EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
  -- Look for: Index Scan (good) vs Seq Scan on large table (bad).` }
];

export default questions;
