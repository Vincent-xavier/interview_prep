import { Question } from '../../types';

const questions: Question[] = [
{ id:"sc1", level:"intermediate", q:'Scenario: You have an API endpoint that runs slowly (2+ seconds) under load. How would you diagnose and fix it?', a:`Systematic diagnosis approach:

Step 1 — Reproduce and measure:
- Use Application Insights / Serilog + seq to find slow requests.
- Check if slow under all conditions or only specific inputs/high concurrency.

Step 2 — Profile the API:
- Add execution time logging with Stopwatch around major steps (DB call, business logic, external API).
- Check if slowness is in: DB query? External HTTP call? Business logic? Serialization?

Step 3 — Database (most common cause):
- Run EXPLAIN ANALYZE on the generated SQL.
- Check for missing indexes, N+1 queries (EF Include vs lazy loading).
- Add covering/partial indexes; optimize LINQ to generate better SQL.
- Add IMemoryCache/Redis for repeated queries on static data.

Step 4 — External dependencies:
- Are you calling external APIs synchronously? Run them in parallel with Task.WhenAll.
- Add timeout policies (Polly) to prevent indefinite waits.

Step 5 — Caching strategy:
- Add output caching for GET endpoints that return stable data.
- Consider pagination for large result sets.

Step 6 — Load testing:
- Use k6 or NBomber to simulate load and measure p95/p99 response times.` },
  { id:"sc2", level:"intermediate", q:'Scenario: A customer reports that an order was double-processed. How would you investigate and prevent it?', a:`Investigation:
1. Check logs for the order ID — look for duplicate request timestamps.
2. Check if the UI/client retried the request (network timeout caused double submit).
3. Look for missing idempotency handling on the API.

Root causes:
- User double-clicked submit.
- Network timeout caused client to retry.
- Payment webhook delivered twice.

Prevention strategies:

1. Idempotency key:
   Client generates a unique key (UUID) per order attempt.
   Server stores processed keys in DB/Redis with TTL.
   Duplicate request with same key → return the original result without re-processing.

2. Database unique constraint:
   UNIQUE constraint on (customer_id, idempotency_key) — DB-level deduplication.

3. Optimistic concurrency / state machine:
   Order can only transition from Pending → Processing once.
   Use row-level locking (SELECT FOR UPDATE) or optimistic concurrency tokens.

4. Frontend:
   Disable the submit button after first click.
   Show in-flight state.

5. Payment webhooks:
   Stripe/Razorpay deliver webhooks with an event ID — store processed event IDs.` },
  { id:"sc3", level:"advanced", q:'Scenario: You need to migrate a live SQL Server database to PostgreSQL with zero downtime. How do you approach it?', a:`Zero-downtime migration strategy:

Phase 1 — Preparation:
- Audit all SQL Server–specific syntax (T-SQL → PL/pgSQL), data types, stored procs.
- Set up PostgreSQL and test the schema conversion.
- Run full load test on PostgreSQL with production data snapshot.

Phase 2 — Dual-write (sync both databases):
- Deploy code that writes to BOTH SQL Server AND PostgreSQL.
- SQL Server remains the authoritative source for reads.

Phase 3 — Data migration:
- Backfill historical data from SQL Server → PostgreSQL.
- Use AWS DMS, pgloader, or custom ETL.
- Verify row counts and data integrity with checksums.

Phase 4 — Switch reads to PostgreSQL:
- Switch reads progressively (feature flag 5% → 25% → 100%).
- Monitor for query result discrepancies.
- Keep SQL Server in sync as fallback.

Phase 5 — Stop writing to SQL Server:
- Once PostgreSQL reads are 100%, remove dual-write.
- Keep SQL Server read-only for a rollback window (1-2 weeks).

Phase 6 — Decommission SQL Server.

Throughout: Keep a rollback plan at each phase.` },
  { id:"sc4", level:"advanced", q:'Scenario: The BBH hospital app inventory module is running slow during peak hours (7-9 AM). How would you optimize it?', a:`Specific to a hospital inventory system with procurement workflows:

Step 1 — Identify the bottleneck:
- Use Application Insights / Serilog to find which endpoints spike during 7-9 AM.
- Likely culprits: Stock availability reports, daily procurement summaries, shift-start dashboard.

Step 2 — Database layer:
- Check if there are missing indexes on high-filter columns: product_id, warehouse_id, status, created_date.
- Reporting queries (aggregations) hitting the same OLTP DB as transactional writes.
- Solution: Add a read replica; point reporting queries to replica.
- Cache frequently read reference data (product catalogue, supplier info) in Redis.

Step 3 — Query optimization:
- Replace correlated subqueries with CTEs/JOINs.
- Use materialized views for complex daily summaries (refresh nightly).
- Paginate large inventory lists (LIMIT/OFFSET or cursor-based).

Step 4 — Application layer:
- Batch stock availability checks instead of per-row calls.
- Background pre-computation: Generate daily procurement report at 6 AM via Hangfire, serve cached result at 7 AM.

Step 5 — Infrastructure:
- Consider horizontal scaling: Add more API instances behind load balancer.
- Connection pooling: PgBouncer for PostgreSQL to handle connection spikes.` },
  { id:"sc5", level:"advanced", q:'Scenario: You need to add real-time stock alerts in the hospital inventory (low stock notifications). Design the solution.', a:`Requirements: Notify pharmacy staff in real-time when any item drops below threshold.

Solution design:

1. Domain event approach:
   - In StockUpdateService, after deducting stock:
     if (item.Quantity < item.ReorderThreshold) {
       await mediator.Publish(new LowStockEvent(item));
     }

2. Real-time delivery (SignalR):
   - LowStockEventHandler sends to connected clients via Hub:
     await hub.Clients.Group("InventoryAlerts").SendAsync("LowStockAlert", item);
   - React client: connection.on("LowStockAlert", showToast);

3. Persistent notifications:
   - Store alerts in Notifications table (for users who weren't online).
   - On login, query unread alerts.

4. Email/SMS fallback via Hangfire:
   - If stock remains low after 30 min, trigger email to procurement team.
   - Scheduled job: Check critical items every 15 min as a safety net.

5. Prevent alert spam:
   - Debounce: Don't re-alert for same item within 1 hour unless quantity drops further.
   - Store last_alerted_at on the inventory record.

6. Scale-out:
   - Use Redis backplane for SignalR (multiple API instances).
   - Use Service Bus instead of MediatR for cross-service reliability.` },
  { id:"sc6", level:"advanced", q:'Scenario: You need to build a multi-tenant SaaS feature. How do you implement tenant isolation?', a:`Three main approaches:

1. Database-per-tenant (highest isolation):
   - Each tenant has their own PostgreSQL database.
   - Tenant lookup: resolve DB connection string from tenant ID.
   - Best for: Regulated industries, high isolation requirements.
   - Downside: Complex migrations (run per tenant), resource overhead.

2. Schema-per-tenant (PostgreSQL specific):
   - All tenants in same DB, different schemas (schemas = namespaces).
   - search_path = tenant_xyz at connection time.
   - EF Core: Customize schema in OnModelCreating based on tenant.

3. Shared schema + TenantId column (most common):
   - Add TenantId to every tenant-owned table.
   - EF Core Global Query Filter:
     modelBuilder.Entity<Order>().HasQueryFilter(o => o.TenantId == _currentTenantId);
   - Middleware resolves TenantId from: subdomain, JWT claim, or header.

Tenant resolution middleware:
  // Subdomain: tenant1.yourapp.com → TenantId = "tenant1"
  // JWT claim: claims["tid"] = "tenant_abc"
  // Header: X-Tenant-Id: abc

Cross-cutting: Add TenantId to all logs (Serilog enricher), audit trails, email templates.
Performance: Index every table on TenantId (partial index per tenant for huge tables).` },
  { id:"sc7", level:"expert", q:'Scenario: Razorpay webhook delivers payment confirmation. How do you design a reliable, idempotent payment processing flow?', a:`Requirements: Process payment-confirmed webhook exactly once, even with retries.

1. Receive webhook:
   - Validate Razorpay signature (HMAC-SHA256 of payload + secret).
   - Return 200 immediately to avoid Razorpay timeout → store event in DB.

  [HttpPost("webhook")]
  public async Task<IActionResult> RazorpayWebhook() {
    var payload = await Request.Body.ReadToEndAsync();
    if (!ValidateSignature(payload, Request.Headers["X-Razorpay-Signature"])) return Unauthorized();
    await eventStore.StoreAsync(payload); // fire and forget for the actual processing
    return Ok();
  }

2. Idempotent processing (via Hangfire or background service):
  - Check if event ID was already processed (events table with UNIQUE constraint on razorpay_event_id).
  - If duplicate → skip and return.
  - If new → begin DB transaction:
    a. Mark order as Paid.
    b. Trigger fulfillment (warehouse/kitchen).
    c. Send confirmation email (via Hangfire job).
    d. Mark event as processed.
    e. Commit transaction.

3. Failure handling:
  - Hangfire retries failed jobs with exponential backoff.
  - Dead-letter queue for jobs that fail all retries → alert + manual review.

4. Audit trail:
  - Log all webhook events with timestamps, processing status, payload.
  - Allows replaying missed events.` },
  { id:"sc8", level:"expert", q:'Scenario: Your team is moving from a monolith to microservices. How do you plan the migration?', a:`Strangler Fig Pattern: Incrementally replace parts of the monolith with services.

Phase 1 — Understand and modularize monolith:
- Map bounded contexts (Order, Inventory, User, Notification).
- Ensure monolith is modular internally before extracting (modular monolith first).
- Add clear internal interfaces between modules.

Phase 2 — Extract first microservice (least risky):
- Start with a standalone, low-coupling module (e.g., Notification).
- Deploy it as a separate service; monolith calls it via HTTP/message queue.
- Use Anti-Corruption Layer (adapter) to translate between monolith's model and the new service's model.

Phase 3 — API Gateway in front:
- Add YARP/Nginx gateway. Gradually route traffic: /notifications/* → notification service; rest → monolith.

Phase 4 — Database decomposition (hardest step):
- Start sharing DB (monolith + service read same tables) — quick win but tight coupling.
- Eventually: Each service owns its data. Synchronize via events (publish changes to message bus).

Phase 5 — Repeat for each bounded context.

Pitfalls to avoid:
- Don't split by technical layer (controllers, services, repos) — split by business domain.
- Don't extract everything at once — phased approach.
- Distributed transactions → use Saga pattern.
- Add observability (OpenTelemetry) from day one.` },
  { id:"sc9", level:"expert", q:'Scenario: You need to design an audit log system that tracks all data changes across the application.', a:`Requirements: Who changed what, when, from what to what value — across all entities.

Approach 1 — EF Core SaveChanges interceptor (recommended):
  public class AuditInterceptor : SaveChangesInterceptor {
    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(...) {
      var entries = context.ChangeTracker.Entries()
        .Where(e => e.State is Added or Modified or Deleted);
      
      foreach (var entry in entries) {
        var audit = new AuditLog {
          EntityName = entry.Entity.GetType().Name,
          EntityId = entry.Properties.FirstOrDefault(p => p.Metadata.IsPrimaryKey())?.CurrentValue?.ToString(),
          Action = entry.State.ToString(),
          OldValues = entry.State != EntityState.Added ? JsonSerializer.Serialize(entry.OriginalValues.ToObject()) : null,
          NewValues = entry.State != EntityState.Deleted ? JsonSerializer.Serialize(entry.CurrentValues.ToObject()) : null,
          ChangedBy = _currentUserService.UserId,
          ChangedAt = DateTime.UtcNow,
          CorrelationId = _correlationIdService.CorrelationId
        };
        context.AuditLogs.Add(audit);
      }
      return await base.SavingChangesAsync(event, data, ct);
    }
  }

Approach 2 — Database triggers (PostgreSQL):
  - Trigger writes to audit table on every INSERT/UPDATE/DELETE.
  - Pros: Cannot be bypassed by ORM. Cons: Hard to capture user context.

Approach 3 — Temporal tables (SQL Server 2016+):
  - System-versioned temporal tables store historical rows automatically.

Storage: Separate AuditLogs schema or dedicated audit DB (append-only, write-heavy optimized).
Indexing: Index on (entity_name, entity_id, changed_at) for fast lookup.
Retention: Partition by month; archive old logs to cold storage.` },
  { id:"sc10", level:"expert", q:'Scenario: Design the Equipment Rental Management System\'s availability logic to prevent double-booking.', a:`Problem: Prevent two users from booking the same equipment for overlapping dates.

Database level (core defense):
  CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    equipment_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed',
    CONSTRAINT no_overlap EXCLUDE USING gist (
      equipment_id WITH =,
      daterange(start_date, end_date, '[]') WITH &&
    ) WHERE (status != 'cancelled')
  );
  -- PostgreSQL EXCLUDE constraint with GiST prevents any overlapping booking.

Application level check (pre-validation UX):
  SELECT COUNT(*) FROM bookings
  WHERE equipment_id = @id
    AND status != 'cancelled'
    AND NOT (end_date < @start OR start_date > @end); -- overlap condition
  IF count > 0 → return 409 Conflict

Concurrent booking race condition:
  BEGIN;
  SELECT * FROM equipment WHERE id = @id FOR UPDATE; -- row-level lock
  -- Check availability
  INSERT INTO bookings (...)
  COMMIT;

Alternatively: Optimistic locking (version column) — retry on conflict.

Real-time availability (SignalR):
  - When booking is confirmed, broadcast EquipmentBooked event.
  - React client updates calendar instantly, grays out dates.

Soft block: Show "Being booked by another user" for 5 min during checkout using Redis TTL.` }
];

export default questions;
