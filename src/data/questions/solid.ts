import { Question } from '../../types';

const questions: Question[] = [
{ id:"s1", level:"beginner", q:'What are the 4 pillars of Object-Oriented Programming?', a:`1. Encapsulation: Bundling data and methods that operate on it into a class; hiding internal details via access modifiers (private, protected, public).
  // private fields, public properties/methods expose controlled interface.

2. Abstraction: Hiding implementation complexity; exposing only what's needed.
  // abstract class / interface defines what, not how.

3. Inheritance: A class (child) derives behavior and properties from another class (parent).
  // "is-a" relationship: Dog : Animal.
  // Enables code reuse but creates tight coupling (prefer composition).

4. Polymorphism: Same interface, different implementations at runtime.
  - Compile-time (overloading): Same method name, different parameters.
  - Runtime (overriding): virtual/override; base class reference holds derived instance.
    Animal a = new Dog(); a.Speak(); // calls Dog.Speak() — runtime dispatch.` },
  { id:"s2", level:"beginner", q:'Explain each SOLID principle with a brief example.', a:`S — Single Responsibility: A class should have one reason to change.
  Bad: OrderService handles business logic + emails + logging.
  Good: Separate EmailService, OrderLogger, OrderProcessor.

O — Open/Closed: Open for extension, closed for modification.
  Add new payment types by implementing IPaymentProcessor — not modifying existing code.

L — Liskov Substitution: Subclasses must be substitutable for their base class.
  If Bird has Fly(), a Penguin : Bird that throws NotImplementedException violates LSP.

I — Interface Segregation: Don't force clients to depend on methods they don't use.
  Split IAnimal into ISwimmable, IFlyable — not all animals implement both.

D — Dependency Inversion: Depend on abstractions, not concretions.
  OrderService(IEmailService emailService) — injected; doesn't new up EmailService.` },
  { id:"s3", level:"intermediate", q:'What is the Repository pattern? How do you implement it with EF Core?', a:`Repository pattern: Abstracts data access behind an interface, decoupling business logic from the ORM.

Interface:
  public interface IOrderRepository {
    Task<Order?> GetByIdAsync(int id);
    Task<IList<Order>> GetByCustomerAsync(int customerId);
    Task AddAsync(Order order);
    Task SaveChangesAsync();
  }

Implementation:
  public class OrderRepository(AppDbContext db) : IOrderRepository {
    public Task<Order?> GetByIdAsync(int id) => db.Orders.FindAsync(id).AsTask();
    public Task AddAsync(Order o) => db.Orders.AddAsync(o).AsTask();
    public Task SaveChangesAsync() => db.SaveChangesAsync();
  }

Unit of Work: Groups repositories that share a DbContext — SaveChanges once for all.

Benefits: Easily swap EF Core for Dapper/MongoDB; testable with mock/in-memory repos.
Caution: Don't leak IQueryable through the interface — defeats the abstraction.` },
  { id:"s4", level:"intermediate", q:'Explain the Strategy and Factory design patterns.', a:`Strategy Pattern: Define a family of algorithms, encapsulate each, and make them interchangeable.
  interface IDiscountStrategy { decimal Apply(decimal price); }
  class VipDiscount : IDiscountStrategy { public decimal Apply(decimal p) => p * 0.8m; }
  class NoDiscount : IDiscountStrategy { public decimal Apply(decimal p) => p; }
  
  class OrderService(IDiscountStrategy discount) {
    public decimal GetPrice(decimal price) => discount.Apply(price);
  }
  // Change algorithm without touching OrderService.

Factory Method: Define an interface for creating objects; subclasses decide what to instantiate.
  abstract class NotificationFactory { public abstract INotification Create(); }
  class EmailFactory : NotificationFactory { public override INotification Create() => new EmailNotification(); }
  class SmsFactory : NotificationFactory { public override INotification Create() => new SmsNotification(); }

Abstract Factory: Creates families of related objects (Email+SMS vs Push+InApp).
Simple Factory (not GoF): Static method that returns instances — useful for simple cases.` },
  { id:"s5", level:"advanced", q:'What is the Observer pattern and how is it used in .NET (events/delegates)?', a:`Observer pattern: Subject notifies multiple observers when state changes (publish-subscribe).

.NET events implement this natively:
  public class Order {
    public event EventHandler<OrderStatusChangedEventArgs>? StatusChanged;
    private OrderStatus _status;
    public OrderStatus Status {
      set { _status = value; StatusChanged?.Invoke(this, new(value)); }
    }
  }
  
  // Observers subscribe:
  order.StatusChanged += (sender, args) => emailService.NotifyCustomer(args.NewStatus);
  order.StatusChanged += (sender, args) => auditLog.Record(args.NewStatus);

MediatR library (CQRS-friendly pub/sub):
  // Publish:
  await mediator.Publish(new OrderCreatedNotification(order));
  // Handler:
  public class SendEmailOnOrderCreated : INotificationHandler<OrderCreatedNotification> {
    public Task Handle(OrderCreatedNotification n, CancellationToken ct) => email.SendAsync(n.Order);
  }

IObservable<T> / IObserver<T>: For Rx (Reactive Extensions) — streaming, composable pipelines.` },
  { id:"s6", level:"advanced", q:'What is the Decorator pattern? Implement a logging decorator for a service.', a:`Decorator: Wraps an object to add behavior without modifying the original class.

Interface:
  public interface IOrderService { Task<Order> CreateAsync(CreateOrderDto dto); }

Base implementation:
  public class OrderService(IOrderRepository repo) : IOrderService {
    public async Task<Order> CreateAsync(CreateOrderDto dto) {
      var order = dto.MapToOrder();
      await repo.AddAsync(order);
      return order;
    }
  }

Decorator:
  public class LoggingOrderService(IOrderService inner, ILogger<LoggingOrderService> logger)
    : IOrderService {
    public async Task<Order> CreateAsync(CreateOrderDto dto) {
      logger.LogInformation("Creating order for product {Id}", dto.ProductId);
      var sw = Stopwatch.StartNew();
      var result = await inner.CreateAsync(dto);
      logger.LogInformation("Order {Id} created in {ms}ms", result.Id, sw.ElapsedMilliseconds);
      return result;
    }
  }

Register:
  services.AddScoped<OrderService>();
  services.AddScoped<IOrderService>(sp =>
    new LoggingOrderService(sp.GetRequiredService<OrderService>(), sp.GetRequiredService<ILogger<LoggingOrderService>>()));` },
  { id:"s7", level:"expert", q:'What is Hexagonal Architecture (Ports and Adapters)? How does it apply to a .NET API?', a:`Hexagonal Architecture (Alistair Cockburn): The application core is isolated from external systems (DB, UI, APIs) through ports (interfaces) and adapters (implementations).

Three layers:
1. Domain Core: Pure business logic, entities, domain events. No dependencies on external systems.
2. Application Layer: Use cases (commands/queries), orchestrates domain. Depends only on domain + ports.
3. Infrastructure Layer: Adapters for DB (EF Core), message queues, email, HTTP clients.

Ports: Interfaces defined by the application.
  IOrderRepository, IEmailPort, IPaymentGateway (in Application project)

Adapters: Implementations in Infrastructure.
  EfCoreOrderRepository : IOrderRepository
  SendGridEmailAdapter : IEmailPort

Project structure:
  Domain/          → Entities, Value Objects, Domain Events (no dependencies)
  Application/     → Commands, Queries, Handlers, IRepository interfaces
  Infrastructure/  → EF Core, email, external APIs
  Api/             → Controllers, minimal APIs, DI composition root

Benefits: Domain testable without DB or HTTP; swap EF Core for Dapper without touching domain; clear boundaries.` }
];

export default questions;
