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
```
npx eslint .
npx jest                           # Run all tests
npx jest --testPathPattern=<file>  # Run a single test
```

Jest is configured in `package.json` (Jest 30, ts-jest). Test files match `*.spec.ts` in `apps/` and `libs/`. NestJS generators are configured with `"spec": false` in `nest-cli.json`.

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
| `libs/mercury-client/` | TCP client proxy for Mercury. |
| `libs/pluto-client/` | TCP client proxy for Pluto. |
| `libs/cache/` | Cache module via `@nestjs/cache-manager`. Used for auth state and captcha codes. |
| `constants/` | Token registries: `APPLICATION_TOKEN`, `PROVIDER_TOKEN`, `COMMAND_TOKENS`, `REGISTERED_CONFIGURATION_TOKENS`, `SERVICE_PORTS`, `MICRO_SERVICE_PORTS`. |
| `utils/` | Decorators (`@Authorization`, `@Filter`, `@Pagination`, `@Sort`, `@WhoAmI`), interceptors, SSE utilities, `paginateQuery` helper. |
| `typings/` | Shared TypeScript types for microservice patterns and controller queries. |
| `assets/` | Shared guards (`AuthorizationGuard`), DTOs (`Pagination`). |

## Key patterns

### Path resolution
`tsconfig.json` sets `baseUrl: "./"` (repo root), so these import forms all work from any file:
- `constants/*`, `utils/*`, `typings/*`, `assets/*` — absolute from repo root
- `@/libs/<name>` or `@/libs/<name>/*` — maps to `libs/<name>/src` and `libs/<name>/src/*`
- `libs/*` — relative resolution (also works due to `rootDir: "."`)

Jest mirrors these via `moduleNameMapper` in `package.json`.

### Service AppModule boilerplate
Every service's `AppModule` imports a standard set:
1. `PlutoClientModule` — always needed (config bootstrap)
2. `DatabaseModule.forRoot(APPLICATION_TOKEN.<SERVICE>, { synchronize: false })` — TypeORM with Pluto-resolved DB creds. `synchronize` is always `false`.
3. `GraphQLModule.forRoot<ApolloFederationDriverConfig>({ driver: ApolloFederationDriver, autoSchemaFile: { federation: 2 } })` — federation subgraph. Services that reference cross-service types use `buildSchemaOptions.orphanedTypes`.
4. `PassportModule` — JWT auth (validates tokens, attaches user to request)
5. `MercuryClientModule` — only imported by services that call Mercury directly

### Entity inheritance
Entities in `libs/database/src/entities/` follow this hierarchy from `any-use/`:
- `TimeStamped` — `createdAt`, `updatedAt`
- `IdentifiedTimeStamped extends TimeStamped` — adds auto-increment `id`
- `Authored extends IdentifiedTimeStamped` — adds `createdById`, `updatedById`
- `Tracked extends Authored` — adds `deletedAt` (soft delete) with a `deletedById` setter

All entity classes carry both TypeORM and GraphQL decorators. The `@ObjectType` decorator on base classes means subclasses inherit GraphQL fields automatically. **创建数据库实体时不需要单独写 SQL 文件**，表结构通过 TypeORM 装饰器定义，数据库同步由运维侧管理（项目内 `synchronize: false`）。

### Microservice client pattern
Each client library (pluto-client, mercury-client) is a `@Global()` module that:
1. Creates a `ClientProxy` via `ClientProxyFactory.create({ transport: Transport.TCP, options: { port: <PORT> } })`
2. Provides it under a named token (`PROVIDER_TOKEN.PLUTO_CLIENT_PROXY` / `PROVIDER_TOKEN.MERCURY_CLIENT_PROXY`)
3. Exposes a service class that wraps `client.send({ cmd: COMMAND_TOKENS.XXX }, payload)` with `lastValueFrom()` to convert Observable → Promise

### Configuration flow
All secrets (DB creds, JWT keys, OpenAI/VolcArk API keys) are stored in Pluto. Services resolve them at startup via `PlutoClientService.getConfiguration()` for single values or `getConfigurations()` for batch fetches (reduces TCP round-trips). Config tokens are defined in `constants/configuration.constant.ts`.

### Authentication flow
1. Request arrives with `Authorization: Bearer <jwt>` header
2. `JwtAuthGuard` extracts the token → delegates to `JwtStrategy`
3. `JwtStrategy.validate(payload)` calls Mercury: `isLoggedIn(userId)` (checks cache for forced logout), then `getUser({ id })` (fetches from DB)
4. The resolved user object is attached to `req.user`
5. `JwtAuthGuard` supports **loose mode** (`new JwtAuthGuard(true)`) — auth failure returns `user: null` instead of throwing 401. Used for public endpoints that optionally show user-specific data.
6. `@Authorization(point)` is a composite decorator that applies both `JwtAuthGuard` (strict) and `AuthorizationGuard` (checks permissions via Mercury `role.authorize`)

### GraphQL patterns
- **Module structure**: Each domain module imports `TypeOrmModule.forFeature([Entity])`, declares `Resolver`, `Service`, and `Loader` as providers.
- **Pagination**: Use `@Filter`, `@Pagination` decorators to extract query params. The service returns `[items, total]` from TypeORM's `getManyAndCount()`. Apply `@UseInterceptors(PaginatedInterceptor)` to wrap into `{ items, total }`.
- **DataLoaders**: Use `@ResolveField` with a DataLoader to batch-fetch related entities and avoid N+1 queries.

### Jupiter AI patterns
Jupiter uses LangChain with OpenAI-compatible APIs for AI-powered trip planning:
- LLM config (model, apiKey, baseURL) is fetched from Pluto at runtime
- `ChatOpenAI` is instantiated per-request (not a singleton)
- `chat.withStructuredOutput(schema, { method: 'functionCalling' })` produces typed JSON output via Zod schemas
- SSE streaming uses RxJS `Observable<MessageEvent>` with `map`, `endWith`, `shareReplay`

### Utility library
The project uses `@aiszlab/relax` for shared utilities: `ValueOf` type (extracts union of values from a const object), `PartialTuple`, `isString`. Constants files use `ValueOf<typeof CONST>` to create narrow string literal unions from `as const` objects.
