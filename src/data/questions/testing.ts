import { Question } from '../../types';

const questions: Question[] = [
{ id:"tst1", level:"beginner", q:'What is the difference between unit, integration, and E2E testing?', a:`Unit Tests (most numerous, fastest):
  Test single function/class in isolation. All dependencies mocked.
  <1ms per test. No external systems. Verify business logic.
  Tools: xUnit + Moq (C#), Vitest + RTL (React).

Integration Tests (middle):
  Test multiple components together. May use real DB (TestContainers), real HTTP.
  Seconds to run. Verify components work together correctly.
  Tools: ASP.NET WebApplicationFactory + TestContainers.

E2E Tests (fewest, slowest):
  Real browser + real backend + real DB.
  Minutes, flaky, expensive. Verify critical user journeys.
  Tools: Playwright, Cypress.

Testing pyramid: 70% unit, 20% integration, 10% E2E.
Shift-left: Catch bugs early (unit) where they're cheapest to fix.
Contract testing (Pact): Verify API contracts between microservices without full integration.` },
  { id:"tst2", level:"intermediate", q:'How do you write good unit tests? Explain AAA pattern and test doubles.', a:`AAA Pattern: Arrange → Act → Assert

  [Fact]
  public async Task CreateOrder_ReturnsOrder_WhenValid()
  {
    // Arrange
    var mockRepo = new Mock<IOrderRepository>();
    mockRepo.Setup(r => r.AddAsync(It.IsAny<Order>())).Returns(Task.CompletedTask);
    var service = new OrderService(mockRepo.Object);
    var dto = new CreateOrderDto { ProductId = 1, Qty = 2 };

    // Act
    var result = await service.CreateAsync(dto);

    // Assert
    Assert.NotNull(result);
    mockRepo.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Once);
  }

Test Doubles:
  Mock: Fake with verification (Moq, NSubstitute).
  Stub: Returns canned data, no verification.
  Fake: Lightweight real implementation (InMemoryDbContext).
  Spy: Records calls for later verification.

Good tests (FIRST): Fast, Independent, Repeatable, Self-validating, Timely.
Don't test: Private methods, framework code, trivial getters/setters.
Do test: Business rules, edge cases, boundary values, all error paths.` },
  { id:"tst3", level:"intermediate", q:'How do you test ASP.NET Core APIs with WebApplicationFactory and TestContainers?', a:`WebApplicationFactory: Creates in-memory ASP.NET Core server for integration testing.

  public class OrdersApiTests : IClassFixture<WebApplicationFactory<Program>>
  {
    private readonly HttpClient _client;
    public OrdersApiTests(WebApplicationFactory<Program> factory) {
      _client = factory.WithWebHostBuilder(builder => {
        builder.ConfigureServices(services => {
          services.AddDbContext<AppDbContext>(o => o.UseNpgsql(_testConnStr));
        });
      }).CreateClient();
    }

    [Fact]
    public async Task GetOrders_ReturnsOk() {
      var res = await _client.GetAsync("/api/orders");
      res.EnsureSuccessStatusCode();
    }
  }

TestContainers (real DB in Docker for tests):
  private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder().Build();

  public async Task InitializeAsync() {
    await _postgres.StartAsync(); // spin up real PostgreSQL in Docker
    // run migrations against _postgres.GetConnectionString()
  }

Benefits: Tests run against real PostgreSQL — catches SQL dialect issues, constraints, migration errors.` },
  { id:"tst4", level:"intermediate", q:'How do you test React components effectively with React Testing Library?', a:`Philosophy: Test behavior from user's perspective — not implementation details.

  import { render, screen, waitFor } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';

  test('shows error when submitted empty', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  test('calls onLogin after successful submit', async () => {
    const mockLogin = jest.fn();
    render(<LoginForm onLogin={mockLogin} />);
    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => expect(mockLogin).toHaveBeenCalled());
  });

Query priority: getByRole > getByLabelText > getByPlaceholderText > getByText > getByTestId.

Mock API with MSW (Mock Service Worker):
  server.use(http.post('/api/login', () => HttpResponse.json({ token: 'abc' })));
  // Intercepts at network level — most realistic.` },
  { id:"tst5", level:"advanced", q:'What is TDD (Test-Driven Development)? When is it beneficial vs when is it awkward?', a:`TDD cycle: Red → Green → Refactor
  1. Write a failing test for the behavior you want.
  2. Write minimal code to pass the test.
  3. Refactor, keeping tests green.

Benefits:
  - Forces thinking about API/behavior before implementation.
  - Regression safety net built in.
  - Naturally produces testable, decoupled code (if it's hard to test → bad design).
  - Tests document intent.

TDD works well: Stable business requirements, algorithm implementation, library/SDK development, domain logic.

TDD is awkward:
  - UI components (visual behavior hard to spec upfront).
  - Exploratory code (requirements unknown — write tests after).
  - Infrastructure code (migrations, config).
  - Prototypes you'll throw away.

BDD (Behavior-Driven Development): Write tests in plain English using Given/When/Then.
  SpecFlow (C#), Cucumber (JS). Bridge between business and technical.

Alternative: Write tests AFTER for exploratory code; TDD for core domain logic.` },
  { id:"tst6", level:"advanced", q:'How do you mock HTTP calls in .NET tests? Explain different approaches.', a:`Never mock HttpClient directly (concrete class). Mock the handler or use libraries.

Option 1 — WireMock.Net (best for integration):
  var server = WireMockServer.Start();
  server.Given(Request.Create().WithPath("/api/users").UsingGet())
    .RespondWith(Response.Create().WithStatus(200)
      .WithBodyAsJson(new[] { new { id=1, name="Test" } }));
  // Point HttpClient to server.Url
  // Verify: server.LogEntries for call assertions.

Option 2 — RichardSzalay.MockHttp (clean DSL):
  var mockHttp = new MockHttpMessageHandler();
  mockHttp.When("/api/users").Respond("application/json", "[{id:1}]");
  var client = mockHttp.ToHttpClient();

Option 3 — Mock HttpMessageHandler (Moq):
  var handler = new Mock<HttpMessageHandler>();
  handler.Protected().Setup<Task<HttpResponseMessage>>("SendAsync", ...)
    .ReturnsAsync(new HttpResponseMessage { StatusCode = HttpStatusCode.OK, Content = JsonContent.Create(data) });
  var client = new HttpClient(handler.Object) { BaseAddress = new Uri("http://test") };

Use HttpClientFactory with named clients → test replaces the named client's handler.` },
  { id:"tst7", level:"expert", q:'What is contract testing with Pact? How does it solve microservice integration testing?', a:`Problem: Integration tests between services require BOTH running — slow, fragile, environment issues.

Pact solution: Consumer defines contract; provider verifies it independently.

Consumer test:
  pact.UponReceiving("get user 1")
    .WithRequest(HttpMethod.Get, "/users/1")
    .WillRespond()
    .WithStatus(200)
    .WithJsonBody(new { id = 1, name = "Alice" });
  // Test runs against Pact mock server — no real provider needed.
  // Pact records interaction as JSON contract file.

Provider verification:
  new PactVerifier(config)
    .ServiceProvider("UserService", realProviderUrl)
    .WithPactBrokerSource(new Uri(pactBrokerUrl))
    .Verify();
  // Replays consumer's requests against REAL provider, checks responses match.

Pact Broker: Central store for pacts and verification results.
Can-I-Deploy: "Has provider verified this consumer's pact?" — gates deployments.

Benefits:
  - No shared test environment needed.
  - Fast, deterministic, runs in CI.
  - Breaking changes caught before deployment.
  - Consumer-driven — provider knows exactly what consumers need.` }
];

export default questions;
