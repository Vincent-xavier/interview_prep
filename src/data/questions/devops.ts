import { Question } from '../../types';

const questions: Question[] = [
{ id:"do1", level:"beginner", q:'What is Docker? Explain images, containers, and Dockerfile.', a:`Docker: A platform for packaging applications into portable containers that run consistently across environments.

Image: Read-only blueprint (like a class). Contains OS, runtime, dependencies, app code.
Container: Running instance of an image (like an object). Isolated process.

Dockerfile (example for .NET app):
  FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
  WORKDIR /app
  COPY ./publish .
  EXPOSE 8080
  ENTRYPOINT ["dotnet", "MyApp.dll"]

Build & run:
  docker build -t myapp:1.0 .
  docker run -p 8080:8080 --env-file .env myapp:1.0

Common commands:
  docker ps                 # list running containers
  docker logs <container>   # view logs
  docker exec -it <id> bash # shell into container
  docker images             # list images` },
  { id:"do2", level:"intermediate", q:'What is a multi-stage Docker build? Why is it important for .NET apps?', a:`Multi-stage build: Use multiple FROM statements — each stage can be a different base image, and only the needed artifacts are copied to the final stage.

Why it matters: The .NET SDK image (~700MB) is needed to build but NOT for running. The runtime image is ~210MB.

Multi-stage .NET Dockerfile:
  # Stage 1: Build
  FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
  WORKDIR /src
  COPY *.csproj .
  RUN dotnet restore
  COPY . .
  RUN dotnet publish -c Release -o /app/publish

  # Stage 2: Runtime (final image only contains published output)
  FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
  WORKDIR /app
  COPY --from=build /app/publish .
  EXPOSE 8080
  ENTRYPOINT ["dotnet", "MyApp.dll"]

Result: Final image is ~250MB instead of ~800MB.
Bonus: Secrets used in build stage (NuGet credentials) don't end up in final image.` },
  { id:"do3", level:"intermediate", q:'What is Docker Compose? Write a compose file for a .NET API + PostgreSQL.', a:`Docker Compose: Define and run multi-container applications via a YAML file.

  version: "3.9"
  services:
    api:
      build:
        context: .
        dockerfile: Dockerfile
      ports:
        - "8080:8080"
      environment:
        - ASPNETCORE_ENVIRONMENT=Development
        - ConnectionStrings__Default=Host=db;Database=mydb;Username=admin;Password=secret
      depends_on:
        db:
          condition: service_healthy

    db:
      image: postgres:15-alpine
      environment:
        POSTGRES_USER: admin
        POSTGRES_PASSWORD: secret
        POSTGRES_DB: mydb
      ports:
        - "5432:5432"
      volumes:
        - pgdata:/var/lib/postgresql/data
      healthcheck:
        test: ["CMD-SHELL", "pg_isready -U admin"]
        interval: 5s
        retries: 5

  volumes:
    pgdata:

Commands:
  docker compose up --build   # start all services
  docker compose down -v      # stop and remove volumes` },
  { id:"do4", level:"intermediate", q:'Explain CI/CD pipeline — what happens in each stage?', a:`CI (Continuous Integration): Automatically build and test code on every push.
CD (Continuous Delivery/Deployment): Automatically deploy to environments after CI passes.

Typical GitHub Actions pipeline for .NET:
  name: CI/CD
  on: [push]
  jobs:
    build-and-test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-dotnet@v3
          with: { dotnet-version: '8.0' }
        - run: dotnet restore
        - run: dotnet build --no-restore
        - run: dotnet test --no-build --logger trx
        - run: dotnet publish -c Release -o ./publish
    
    docker-push:
      needs: build-and-test
      steps:
        - uses: docker/login-action@v3
          with: { registry: ghcr.io, username: \${{ github.actor }}, password: \${{ secrets.GITHUB_TOKEN }} }
        - run: docker build -t ghcr.io/myorg/myapp:\${{ github.sha }} .
        - run: docker push ghcr.io/myorg/myapp:\${{ github.sha }}
    
    deploy:
      needs: docker-push
      steps:
        - run: # SSH into server, docker pull, docker compose up -d` },
  { id:"do5", level:"advanced", q:'What is the difference between blue-green and canary deployments?', a:`Both minimize downtime and risk during deployments.

Blue-Green Deployment:
- Two identical production environments (Blue = live, Green = staging).
- Deploy to Green; test it; switch traffic from Blue → Green (DNS/load balancer).
- Instant rollback: switch back to Blue if issues.
- Downside: 2× infrastructure cost; not suitable for DB schema changes.

Canary Deployment:
- Gradually roll out new version to a small % of users (5% → 25% → 100%).
- Monitor error rates, latency, business metrics at each stage.
- If metrics degrade, roll back automatically.
- Downside: Complex routing (requires feature flags or weighted load balancing).

Rolling Deployment:
- Replace instances one by one with the new version.
- Zero downtime but harder to roll back, and both versions run simultaneously for a period.

In Azure DevOps: Deployment stages with gates (run tests, check metrics before promoting).` }
];

export default questions;
