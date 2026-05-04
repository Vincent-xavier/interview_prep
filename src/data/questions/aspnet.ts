import { Question } from '../../types';

const questions: Question[] = [
{ id:"as1", level:"beginner", q:'What is middleware in ASP.NET Core? Explain the request pipeline.', a:`Middleware: Software components that handle HTTP requests and responses in a pipeline.

  app.UseMiddleware<A>()
     .UseMiddleware<B>()
     .UseMiddleware<C>();

Request flows: A → B → C → endpoint
Response flows: C → B → A (reverse)

Each middleware:
- Receives HttpContext.
- Can short-circuit (return early) or call next().

  app.Use(async (context, next) => {
    // before
    await next.Invoke(context);
    // after (runs on the way back)
  });

Built-in: UseRouting, UseAuthentication, UseAuthorization, UseStaticFiles, UseCors.

Order matters: UseAuthentication must come before UseAuthorization.` },
  { id:"as2", level:"beginner", q:'What is model binding and model validation in ASP.NET Core?', a:`Model binding: Automatically maps HTTP request data (route, query string, body, headers) to action method parameters.

  [HttpPost]
  public IActionResult Create([FromBody] CreateOrderDto dto) { ... }

  [FromRoute] — from URL route params
  [FromQuery] — from ?key=val
  [FromBody]  — from JSON body
  [FromHeader]— from HTTP headers
  [FromForm]  — from form data

Model validation via Data Annotations:
  public class CreateOrderDto {
    [Required] public string ProductId { get; set; }
    [Range(1, 100)] public int Quantity { get; set; }
    [EmailAddress] public string ContactEmail { get; set; }
  }

  // In controller:
  if (!ModelState.IsValid) return BadRequest(ModelState);
  // Or use [ApiController] — automatically returns 400 on validation failure.` },
  { id:"as3", level:"intermediate", q:'What are Action Filters in ASP.NET Core? How do you create a custom one?', a:`Filters run code before/after specific stages of the request pipeline.

Filter types:
- Authorization: Run first; short-circuit if unauthorized.
- Resource: Run after auth, before model binding (for caching).
- Action: Run before/after action method execution.
- Exception: Handle unhandled exceptions.
- Result: Run before/after result execution.

Custom Action Filter:
  public class LogActionFilter : IActionFilter {
    public void OnActionExecuting(ActionExecutingContext ctx) {
      Console.WriteLine("Before: " + ctx.ActionDescriptor.DisplayName);
    }
    public void OnActionExecuted(ActionExecutedContext ctx) {
      Console.WriteLine("After: " + ctx.Result);
    }
  }

Apply:
  [ServiceFilter(typeof(LogActionFilter))] // via DI
  public class OrdersController : ControllerBase {}

Register: services.AddScoped<LogActionFilter>();
Global: builder.Services.AddControllers(opt => opt.Filters.Add<LogActionFilter>());` },
  { id:"as4", level:"intermediate", q:'How do you implement API versioning in ASP.NET Core?', a:`Install: Microsoft.AspNetCore.Mvc.Versioning

  builder.Services.AddApiVersioning(opt => {
    opt.DefaultApiVersion = new ApiVersion(1, 0);
    opt.AssumeDefaultVersionWhenUnspecified = true;
    opt.ReportApiVersions = true; // adds api-supported-versions header
    opt.ApiVersionReader = ApiVersionReader.Combine(
      new UrlSegmentApiVersionReader(),    // /api/v1/orders
      new HeaderApiVersionReader("api-version"), // header: api-version: 1.0
      new QueryStringApiVersionReader("api-version") // ?api-version=1.0
    );
  });

Controller:
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/orders")]
  public class OrdersV1Controller : ControllerBase {}

  [ApiVersion("2.0")]
  [Route("api/v{version:apiVersion}/orders")]
  public class OrdersV2Controller : ControllerBase {}

Best practice: Default to URL versioning for REST APIs; add header versioning for clients that can't change URLs.` },
  { id:"as5", level:"intermediate", q:'How do you handle global exception handling in ASP.NET Core?', a:`Approach 1 — UseExceptionHandler middleware:
  app.UseExceptionHandler(errorApp => {
    errorApp.Run(async context => {
      var error = context.Features.Get<IExceptionHandlerFeature>();
      context.Response.StatusCode = 500;
      await context.Response.WriteAsJsonAsync(new { error = error?.Error.Message });
    });
  });

Approach 2 — Custom exception middleware:
  public class ExceptionMiddleware(RequestDelegate next, ILogger logger) {
    public async Task Invoke(HttpContext ctx) {
      try { await next(ctx); }
      catch (NotFoundException ex) {
        ctx.Response.StatusCode = 404;
        await ctx.Response.WriteAsJsonAsync(new { message = ex.Message });
      }
      catch (Exception ex) {
        logger.LogError(ex, "Unhandled exception");
        ctx.Response.StatusCode = 500;
        await ctx.Response.WriteAsJsonAsync(new { message = "An error occurred." });
      }
    }
  }

Approach 3 (Minimal API / .NET 8) — IExceptionHandler:
  public class GlobalExceptionHandler : IExceptionHandler {
    public async ValueTask<bool> TryHandleAsync(HttpContext ctx, Exception ex, CancellationToken ct) { ... }
  }` },
  { id:"as6", level:"advanced", q:'What is Hangfire and how does it compare to IHostedService for background jobs?', a:`IHostedService / BackgroundService:
- Built-in .NET mechanism for background work.
- Good for: Continuous loops, startup tasks, long-running services.
- No dashboard, no persistence, no retry out of the box.
  public class MyWorker : BackgroundService {
    protected override async Task ExecuteAsync(CancellationToken ct) {
      while (!ct.IsCancellationRequested) {
        await DoWork(); await Task.Delay(TimeSpan.FromMinutes(1), ct);
      }
    }
  }

Hangfire:
- Full-featured job scheduler with SQL/Redis storage + retry + dashboard.
- Job types: Fire-and-forget, delayed, recurring (cron), continuations, batches.
  BackgroundJob.Enqueue(() => emailService.Send(userId)); // fire-and-forget
  RecurringJob.AddOrUpdate("daily-report", () => service.GenerateReport(), Cron.Daily);
- Dashboard at /hangfire — see jobs, failures, retries.

Choose IHostedService for: Simple polling, internal work.
Choose Hangfire for: External job scheduling, retry logic, audit trail, distributed processing.` },
  { id:"as7", level:"advanced", q:'How does SignalR work and what are its transport fallbacks?', a:`SignalR is a real-time communication library that enables bidirectional communication between server and client.

Transport mechanisms (in preference order):
1. WebSockets — full duplex, lowest latency.
2. Server-Sent Events — server push only, unidirectional.
3. Long Polling — client polls and waits, fallback.

Hub (server-side):
  public class ChatHub : Hub {
    public async Task SendMessage(string user, string message) {
      await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
    public override Task OnConnectedAsync() { return base.OnConnectedAsync(); }
  }

Client (JS):
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub").withAutomaticReconnect().build();
  connection.on("ReceiveMessage", (user, msg) => updateUI(user, msg));
  await connection.start();
  await connection.invoke("SendMessage", "Alice", "Hello");

Scale-out: Use Redis backplane or Azure SignalR Service for multi-server deployments.` },
  { id:"as8", level:"expert", q:'Explain the difference between Output Caching, Response Caching, and In-Memory Caching in ASP.NET Core.', a:`In-Memory Cache (IMemoryCache):
- Application-level cache in server memory.
- You control what to cache, when to expire, eviction policy.
  cache.Set("key", data, TimeSpan.FromMinutes(5));
  cache.TryGetValue("key", out Data data);

Response Caching (HTTP-level):
- Sets Cache-Control headers; browser/CDN/proxy caches the response.
- Server may still process the request if cache miss.
  [ResponseCache(Duration = 60, VaryByHeader = "Accept")]

Output Caching (.NET 7+, server-side):
- Server caches the full HTTP response in memory.
- Subsequent requests for same resource served from cache without hitting controller.
  app.UseOutputCache();
  [OutputCache(Duration = 60, VaryByQuery = "page,size")]
  
  // Tag-based invalidation:
  await cache.EvictByTagAsync("products");

IDistributedCache (Redis/SQL):
- Multi-server cache sharing (needed for scale-out).

Hierarchy: DistributedCache → shared; OutputCache → server-side HTTP; MemoryCache → fast, per-server.` },
  { id:"as9", level:"intermediate", q:'How do you implement health checks in ASP.NET Core?', a:`Health checks expose /health endpoint for load balancers, Kubernetes probes, and monitoring tools.

Basic setup:
  builder.Services.AddHealthChecks()
    .AddNpgsql(connectionString, name: "postgresql")         // DB check
    .AddRedis(redisConnectionString, name: "redis")         // Redis check
    .AddUrlGroup(new Uri("https://api.partner.com"), "partner-api"); // HTTP check

Map endpoint:
  app.MapHealthChecks("/health", new HealthCheckOptions {
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse // rich JSON
  });
  app.MapHealthChecks("/health/live",  new HealthCheckOptions { Predicate = _ => false }); // liveness
  app.MapHealthChecks("/health/ready", new HealthCheckOptions {/* all checks */});          // readiness

Custom check:
  public class InventoryHealthCheck(IInventoryService svc) : IHealthCheck {
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext ctx, CancellationToken ct) {
      var ok = await svc.PingAsync(ct);
      return ok ? HealthCheckResult.Healthy() : HealthCheckResult.Degraded("Inventory slow");
    }
  }

Kubernetes probes:
- Liveness: Is the app alive? (restart if failing)
- Readiness: Is the app ready for traffic? (remove from LB if failing)` },
  { id:"as10", level:"advanced", q:'What is minimal API in ASP.NET Core and how does it compare to controller-based APIs?', a:`Minimal API (ASP.NET Core 6+): Define endpoints with less ceremony — no controller classes.

  var app = WebApplication.Create();
  app.MapGet("/orders/{id}", async (int id, IOrderService svc) =>
    await svc.GetByIdAsync(id) is Order o ? Results.Ok(o) : Results.NotFound());
  app.MapPost("/orders", async (CreateOrderDto dto, IOrderService svc) => {
    var order = await svc.CreateAsync(dto);
    return Results.Created($"/orders/{order.Id}", order);
  });
  app.Run();

Pros:
- Less boilerplate, faster startup, lower memory footprint.
- Better for microservices / small services.
- Supports endpoint filters (like action filters).

Cons:
- No built-in model binding helpers like [ApiController] features.
- Large APIs become messy — use extension methods to split endpoints.

Controller-based pros:
- Better for large APIs with many endpoints.
- [ApiController] auto-validation, problem details.
- Better code organization at scale.

Best practice: Use minimal APIs for new microservices; controller-based for large enterprise APIs.` }
];

export default questions;
