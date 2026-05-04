import { Question } from '../../types';

const questions: Question[] = [
{ id:"ef1", level:"beginner", q:'What is Entity Framework Core? Explain Code-First vs Database-First approaches.', a:`EF Core is an ORM (Object-Relational Mapper) that maps C# classes to database tables.

Code-First:
- You write C# entity classes and DbContext.
- EF generates migrations to create/update the database.
- Preferred in greenfield projects; schema controlled by code.

  public class Order {
    public int Id { get; set; }
    public string Status { get; set; }
    public List<OrderItem> Items { get; set; }
  }
  public class AppDbContext : DbContext {
    public DbSet<Order> Orders { get; set; }
  }

Database-First:
- DB already exists; scaffold generates entity classes from schema.
  dotnet ef dbcontext scaffold "ConnectionString" Microsoft.EntityFrameworkCore.SqlServer

Migration workflow:
  dotnet ef migrations add AddStatusIndex
  dotnet ef database update` },
  { id:"ef2", level:"intermediate", q:'Explain eager loading, lazy loading, and explicit loading in EF Core.', a:`Eager Loading: Load related data in the same query using Include().
  var orders = db.Orders
    .Include(o => o.Customer)
    .Include(o => o.Items)
      .ThenInclude(i => i.Product)
    .ToList(); // One SQL with JOINs

Lazy Loading: Related data loads automatically when accessed (requires proxies + virtual properties).
  // Install: Microsoft.EntityFrameworkCore.Proxies
  services.AddDbContext<Db>(opt => opt.UseLazyLoadingProxies());
  // Each access to order.Customer fires a new SQL — N+1 risk!

Explicit Loading: Manual control — load only when you need it.
  var order = db.Orders.Find(1);
  db.Entry(order).Reference(o => o.Customer).Load();
  db.Entry(order).Collection(o => o.Items).Load();

Best practice: Use eager loading for known needs; avoid lazy loading in loops (N+1 queries).` },
  { id:"ef3", level:"intermediate", q:'What are EF Core migrations and how do you manage them in production?', a:`Migrations: Version-controlled incremental changes to the database schema.

Create migration:
  dotnet ef migrations add AddUserPhoneNumber
  -- Generates: Up() (apply) and Down() (rollback) methods

Apply:
  dotnet ef database update
  // Or programmatically on startup:
  await db.Database.MigrateAsync();

Production migration strategy:
1. Generate SQL script from migrations (review before applying):
   dotnet ef migrations script --idempotent > migration.sql
2. Apply via DBA or deployment pipeline (Azure DevOps/GitHub Actions).
3. Use --idempotent flag so script is safe to run multiple times.
4. Never run migrations automatically in high-traffic production without review.

Rollback: dotnet ef database update PreviousMigrationName
Remove last migration (if not applied): dotnet ef migrations remove` },
  { id:"ef4", level:"intermediate", q:'How do you use raw SQL with EF Core and when should you?', a:`EF Core supports raw SQL for complex queries that LINQ can't express efficiently.

FromSqlRaw / FromSqlInterpolated (returns entities):
  var orders = await db.Orders
    .FromSqlInterpolated($"SELECT * FROM Orders WHERE customer_id = {customerId}")
    .Include(o => o.Items)
    .ToListAsync();

ExecuteSqlRaw / ExecuteSqlInterpolated (for non-select):
  await db.Database.ExecuteSqlInterpolatedAsync(
    $"UPDATE Orders SET status = {status} WHERE id = {orderId}"
  );

SqlQueryRaw (EF 7+ — for non-entity results):
  var result = db.Database.SqlQuery<OrderSummaryDto>(
    $"SELECT customer_id, COUNT(*) as total FROM Orders GROUP BY customer_id"
  ).ToList();

When to use:
- Complex reporting queries that generate poor LINQ SQL.
- Stored procedures / functions.
- Bulk operations (also consider EFCore.BulkExtensions).
- Always prefer interpolated variants for parameterization (SQL injection safety).` },
  { id:"ef5", level:"advanced", q:'What are global query filters in EF Core? Give a practical use case.', a:`Global query filters automatically add a WHERE clause to every query on an entity type.

Registration in OnModelCreating:
  modelBuilder.Entity<Product>()
    .HasQueryFilter(p => !p.IsDeleted); // soft-delete filter
  
  modelBuilder.Entity<Order>()
    .HasQueryFilter(o => o.TenantId == _currentTenantId); // multi-tenancy

Effect:
  db.Products.ToList() // generates: SELECT * FROM Products WHERE IsDeleted = false
  db.Products.Find(1)  // also filtered

Bypass the filter:
  db.Products.IgnoreQueryFilters().ToList(); // see all including deleted

Use cases:
- Soft deletes (IsDeleted flag).
- Multi-tenancy (TenantId filter).
- Published/active record filtering.

Caution: The filter is always applied unless explicitly ignored — be aware in admin contexts.` },
  { id:"ef6", level:"advanced", q:'How do you handle concurrency conflicts in EF Core?', a:`Concurrency conflict: Two users try to update the same record simultaneously.

Optimistic Concurrency (preferred):
1. Add a rowversion/concurrency token to the entity:
  public byte[] RowVersion { get; set; }  // SQL Server
  [Timestamp] public byte[] RowVersion { get; set; }
  // PostgreSQL: use xmin column or a GUID/datetime token.

2. EF includes it in WHERE clause:
  UPDATE Orders SET Status=@s WHERE Id=@id AND RowVersion=@rv
  -- If another update happened, RowVersion changed → 0 rows affected → exception.

3. Catch and resolve:
  try {
    await db.SaveChangesAsync();
  } catch (DbUpdateConcurrencyException ex) {
    var entry = ex.Entries.First();
    var dbValues = await entry.GetDatabaseValuesAsync();
    // Option A: Last-write-wins: entry.OriginalValues.SetValues(dbValues);
    // Option B: Notify user to review conflict.
  }

Pessimistic Concurrency: Use raw SQL SELECT FOR UPDATE to lock rows. Rare in EF Core.` },
  { id:"ef7", level:"expert", q:'What are EF Core interceptors and how can you use them?', a:`Interceptors allow hooking into EF Core operations (commands, connections, transactions, etc.) without modifying DbContext.

Types: IDbCommandInterceptor, IDbConnectionInterceptor, IDbTransactionInterceptor, ISaveChangesInterceptor.

Example — query logging interceptor:
  public class SlowQueryInterceptor : DbCommandInterceptor {
    public override DbDataReader ReaderExecuted(
      DbCommand command, CommandExecutedEventData data, DbDataReader result) {
      if (data.Duration.TotalMilliseconds > 500)
        Log.Warning("Slow query ({ms}ms): {sql}", data.Duration.TotalMilliseconds, command.CommandText);
      return base.ReaderExecuted(command, data, result);
    }
  }

ISaveChangesInterceptor — for auditing:
  public override ValueTask<InterceptionResult<int>> SavingChangesAsync(...) {
    foreach (var entry in context.ChangeTracker.Entries<IAuditable>())
      entry.Entity.UpdatedAt = DateTime.UtcNow;
    return base.SavingChangesAsync(...);
  }

Register:
  services.AddDbContext<Db>(opt => opt.AddInterceptors(new SlowQueryInterceptor()));

Use cases: Audit logging, query performance monitoring, soft-delete on SaveChanges, multi-tenancy header injection.` }
];

export default questions;
