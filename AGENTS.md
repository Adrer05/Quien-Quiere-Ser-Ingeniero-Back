# AGENTS.md — QQSI Backend

## Quick start
```powershell
pnpm install
# Start Postgres:
docker compose up -d
pnpm run m:run       # run pending TypeORM migrations
pnpm run start:dev   # nest start --watch (port from .env, default 3000)
```

## Commands
| Purpose | Command |
|---|---|
| Build | `pnpm run build` (`nest build`, output `dist/`) |
| Lint+fix | `pnpm run lint` (ESLint — no separate typecheck step) |
| Format | `pnpm run format` (Prettier: singleQuote, trailingComma all) |
| Unit tests | `pnpm run test` (Jest, `src/**/*.spec.ts`) |
| E2E tests | `pnpm run test:e2e` (Jest, `test/**/*.e2e-spec.ts`) |
| Coverage | `pnpm run test:cov` |
| Migration generate | `pnpm run m:gen dev -- <MigrationName>` |
| Migration run | `pnpm run m:run` |

## Architecture
- **NestJS 11 + TypeORM + PostgreSQL** (via `docker-compose.yml`: `postgres:15.1`, db=`qqsi_db`, user=`uqqsi`, password=`secret123`)
- `pnpm` workspace (single-package, nest-cli standard layout)
- `type: "commonjs"` + `module: "nodenext"` in tsconfig
- `.env` drives config: `DATABASE_URL` (Neon), `JWT_SECRET`, `JWT_EXPIRES_IN`, `IS_PRODUCTION`
- Custom `SnakeNamingStrategy` maps camelCase entities→snake_case DB columns/tables
- `BaseEntity` provides `id` (UUID), `status`, `createdAt`, `updatedAt` (note the capital `U` in `UpdatedAt`)
- Error handling: throw `ManagerError({ type: 'NOT_FOUND', message })` then call `ManagerError.createSignatureError(error.message)` in the catch

## Auth
- JWT with `@nestjs/jwt`; secret from `auth/constants.ts` (hardcoded) — does **not** use `JWT_SECRET` from `.env`
- Password hashing via `bcrypt` `@BeforeInsert()` on `User` entity; `@Exclude({ toPlainOnly: true })` on password field
- Guards not yet implemented (per `tasks_complete.txt`)

## Code conventions
- Each module has its own folder with `.module.ts`, `.controller.ts`, `.service.ts`, `entities/`, `dto/`
- DTOs use `class-validator` decorators
- Global `ValidationPipe` with `transform: true` and `enableImplicitConversion: true`
- Services use `ManagerError` pattern (check `src/roles/rol.service.ts` for a canonical example)
- Migrations go in `src/migrations/` (currently empty)
- In dev: `synchronize: true`, `logging: true`; in prod (`IS_PRODUCTION=true`): `migrationsRun: true`, `synchronize: false`

## Pitfalls
- No `typecheck` script exists — only `nest build` catches type errors
- `IS_PRODUCTION` string comparison (`=== 'true'`) — ensure `.env` is exact
- `auth/constants.ts` and `.env` `JWT_SECRET` are independent — changing one does not affect the other
- DB SSL `rejectUnauthorized: false` — do not rely on in production without review
