# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development (watch mode)
```
pnpm dev:pluto      # Config service (must start first)
pnpm dev:mercury    # Auth / base service
pnpm dev:venus      # Bookkeeping
pnpm dev:earth      # Blog
pnpm dev:mars       # Resume
pnpm dev:jupiter    # Travel / tourism
pnpm dev:halley     # GraphQL gateway (must start last)
```

### Build and production start
```
pnpm build:<service>
pnpm start:<service>
```

### Lint and test
No npm scripts are defined for these. Use:
```
npx eslint .
npx jest                           # Run all tests
npx jest --testPathPattern=<file>  # Run a single test
```

Jest is configured in `package.json` (Jest 30, ts-jest). Test files match `*.spec.ts` in `apps/` and `libs/`. Currently there are no test files in the repo.

## Architecture

This is a **NestJS monorepo** with pnpm workspaces. Each service is a solar-system-themed microservice, connected via **Apollo GraphQL Federation** with **TCP microservice transport** for internal communication.

### Service dependency graph (startup order matters)

```
Pluto (TCP:3010)          ← Config server — all other services depend on it for DB/JWT/cloud secrets
  └─ Mercury (3100, TCP:3110)  ← Auth, users, roles, dictionaries
       ├─ Venus (3200)    ← Bookkeeping
       ├─ Earth (3300)    ← Blog
       ├─ Mars (3400)     ← Resume
       └─ Jupiter (3500)  ← Travel (LangChain + OpenAI for AI-powered trip planning)
            └─ Halley (3900) ← Apollo Federation gateway — composes all subgraphs into one endpoint
```

- **Pluto** is a pure TCP microservice (no HTTP). All other services bootstrap by fetching config from Pluto via `PlutoClientService`.
- **Mercury** runs both HTTP (GraphQL subgraph) and a TCP microservice. It handles auth (JWT) and user/role management. Other services call it via `MercuryClientService` for `user.get`, `role.authorize`, `authentication.logged-in`.
- **Halley** uses `IntrospectAndCompose` to federate the 5 subgraphs (Mercury, Venus, Earth, Mars, Jupiter). It forwards `Authorization` headers to subgraphs via a custom `RouterDataSource`.
- **Sun** exists as a stub app but is not deployed.

## Shared code

| Location | Purpose |
|---|---|
| `libs/database/` | TypeORM module. Uses `PlutoClientService` to dynamically build DB connection options from Pluto config. Entities are grouped by service under `src/entities/<service>/`. |
| `libs/passport/` | Global JWT auth module (`JwtStrategy` + `JwtModule`). Gets the JWT secret from Pluto at startup. |
| `libs/mercury-client/` | TCP client proxy for Mercury. Provides `getUser()`, `isAuthorized()`, `isLoggedIn()`. |
| `libs/pluto-client/` | TCP client proxy for Pluto. Provides `getConfiguration()`, `getConfigurations()`. |
| `libs/cache/` | Cache module via `@nestjs/cache-manager`. Used for auth state and captcha codes. |
| `assets/tokens.ts` | Central token/command registry: `ApplicationToken`, `ProviderToken`, `COMMAND_TOKENS`, `CacheToken`, `GraphQLEnumToken`. |
| `constants/ports.ts` | All HTTP and TCP port assignments. |
| `utils/` | Decorators (`@Authorization`, `@Filter`, `@Pagination`, `@Sort`, `@WhoAmI`), interceptors, SSE utilities, query builder helpers. |
| `typings/` | Shared TypeScript types for microservice patterns and controller queries. |

## Key patterns

### Path aliases
`tsconfig.json` maps `@/libs/*` to `libs/*/src`. In Jest, `moduleNameMapper` provides the same mappings (see `package.json` lines 116-121).

### Microservice client pattern
Each client library (pluto-client, mercury-client) registers a custom transport client as a provider. Services import the client's module and inject the service class. Commands are sent via `client.send({ cmd: COMMAND_TOKENS.XXX }, payload)` over TCP.

### Database module
`DatabaseModule.forRoot(applicationToken, options)` creates a TypeORM connection. It internally calls `PlutoClientService.getConfiguration()` to resolve DB credentials (Tencent Cloud MySQL), so Pluto must be running first.

### Decorator-based filtering/pagination/sorting
Controller query parameters use the `Query<F>` type from `typings/controller.d.ts`. Custom decorators (`@Filter()`, `@Pagination()`, `@Sort()`) extract structured query params. The `PaginatedInterceptor` wraps responses in pagination metadata.
