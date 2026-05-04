import { Question } from '../../types';

const questions: Question[] = [
{ id:"ms1", level:"beginner", q:'What are microservices and how do they differ from a monolith?', a:`Monolith: All features in one deployable unit. Simple to develop initially; hard to scale independently; one failure can take down the whole system.

Microservices: Application split into small, independently deployable services, each owning its data and deployed separately.

Key characteristics:
- Each service owns one business capability (Orders, Inventory, Users).
- Services communicate via APIs (REST/gRPC) or events (message queues).
- Independent technology stacks per service.
- Independently scalable and deployable.

Tradeoffs:
  Microservices advantages: Independent scaling, fault isolation, team autonomy.
  Microservices challenges: Distributed system complexity, network latency, distributed transactions, data consistency.

Start with a modular monolith; extract microservices only when you hit team/scaling boundaries.` },
  { id:"ms2", level:"intermediate", q:'What is the API Gateway pattern and what does it solve?', a:`API Gateway: A single entry point that sits in front of all microservices.

Responsibilities:
- Request routing to the correct service.
- Authentication/authorization (offloads from services).
- Rate limiting & throttling.
- SSL termination.
- Request aggregation (BFF pattern — combine multiple service calls for frontend).
- Load balancing.
- Logging, monitoring, distributed tracing.

Without gateway: Client must know all service endpoints + handle auth for each.
With gateway: Client talks to one URL; gateway handles complexity.

Options: Nginx, Kong, YARP (built-in .NET reverse proxy), Azure API Management, AWS API Gateway.

YARP in .NET:
  // appsettings.json defines routes + clusters → YARP handles proxying.` },
  { id:"ms3", level:"intermediate", q:'What is the Circuit Breaker pattern? Explain its states.', a:`Circuit Breaker: Prevents cascade failures by stopping requests to a failing service.

States:
1. Closed (normal): Requests flow through. Failures counted.
2. Open (tripped): After threshold failures, circuit opens. All requests fail immediately (fail-fast). No calls to the failing service.
3. Half-Open (recovery): After timeout, lets a few test requests through.
   - Success → Close circuit.
   - Failure → Reopen circuit.

Implementation with Polly (.NET):
  var pipeline = new ResiliencePipelineBuilder()
    .AddCircuitBreaker(new CircuitBreakerStrategyOptions {
      FailureRatio = 0.5,          // 50% failure rate
      SamplingDuration = TimeSpan.FromSeconds(10),
      MinimumThroughput = 5,
      BreakDuration = TimeSpan.FromSeconds(30)
    })
    .Build();

  await pipeline.ExecuteAsync(ct => httpClient.GetAsync("/inventory/1", ct), ct);

Combine with retry (retry → circuit breaker) and timeout.` },
  { id:"ms4", level:"intermediate", q:'What is event-driven communication? Compare RabbitMQ vs Azure Service Bus.', a:`In event-driven microservices, services communicate asynchronously via messages rather than synchronous HTTP calls.

Patterns:
- Event: "Something happened" (OrderCreated, PaymentProcessed).
- Command: "Do this" (SendEmail, ChargeCard).
- Query: "Tell me" (RequestReply pattern).

Broker types:
RabbitMQ:
- Open source, AMQP protocol.
- Exchanges (fanout, direct, topic, headers) → Queues → Consumers.
- Fast, flexible routing.
- Requires ops overhead (HA setup, mirroring).

Azure Service Bus:
- Fully managed PaaS.
- Queues (point-to-point) and Topics+Subscriptions (pub/sub).
- Features: Dead-letter queue, sessions, scheduled messages, duplicate detection, message lock.
- Enterprise-grade; integrates with Azure ecosystem.

MassTransit: .NET library that abstracts RabbitMQ/Service Bus — consistent API regardless of broker.` },
  { id:"ms5", level:"advanced", q:'Explain the Saga pattern — choreography vs orchestration.', a:`Saga: Manages distributed transactions across microservices without using 2-phase commit.

Problem: "Place order" involves Inventory, Payment, Shipping — if Payment fails, need to compensate.

Choreography Saga (event-driven):
- Services react to events and publish their own.
- OrderService → OrderCreated → InventoryService → Reserved → PaymentService → Charged → ShippingService.
- Rollback: PaymentFailed → InventoryService listens → releases reservation.
- Pros: Decoupled. Cons: Hard to trace, complex failure handling.

Orchestration Saga (centralized):
- Saga orchestrator (state machine) tells each service what to do.
- OrderSaga calls: ReserveInventory → if OK, ChargePayment → if OK, CreateShipment.
- On failure: CallCompensation (ReleaseInventory, RefundPayment).
- Pros: Explicit flow, easy to trace. Cons: Orchestrator is a central point.

Libraries: MassTransit Saga, NServiceBus, Dapr.` },
  { id:"ms6", level:"advanced", q:'What is CQRS and Event Sourcing? When should you use them?', a:`CQRS (Command Query Responsibility Segregation):
- Separate read models from write models.
- Commands: Change state (no return value or just ID).
- Queries: Return data (no state changes).
- Benefits: Independent scaling, optimized read models (denormalized), different databases.

Event Sourcing:
- Instead of storing current state, store a sequence of events.
- State = reduce(events). 
- Example: Instead of { balance: 500 }, store [Deposited(1000), Withdrew(500)].
- Benefits: Complete audit log, time-travel (replay to any point), event replay for new projections.
- Drawbacks: Complex queries, eventual consistency, schema evolution of events is hard.

Combined:
- Commands produce events → stored in event store.
- Events projected to read-model DB (eventual consistency).

When NOT to use: Most CRUD apps, small teams, tight deadlines — significant complexity overhead.` },
  { id:"ms7", level:"expert", q:'What is distributed tracing and how do you implement it in .NET microservices?', a:`Distributed tracing: Track a request as it flows through multiple services by propagating a trace context.

Concepts:
- Trace: End-to-end journey of a request across all services.
- Span: One unit of work within a trace (e.g., one HTTP call or DB query).
- TraceId: Unique ID for the entire trace.
- SpanId: Unique ID for each span.

OpenTelemetry (.NET implementation):
  builder.Services.AddOpenTelemetry()
    .WithTracing(tracer => tracer
      .AddAspNetCoreInstrumentation()
      .AddHttpClientInstrumentation()
      .AddEntityFrameworkCoreInstrumentation()
      .AddOtlpExporter(opt => opt.Endpoint = new Uri("http://jaeger:4317")));

Propagation: Trace context (W3C traceparent header) is automatically forwarded in HTTP calls.

Exporters: Jaeger, Zipkin, Azure Monitor (Application Insights), Grafana Tempo.

Correlation IDs in logs: Log the TraceId in structured logs so you can correlate logs + traces.
  logger.LogInformation("Processing order {OrderId}", orderId); // TraceId auto-attached` }
];

export default questions;
