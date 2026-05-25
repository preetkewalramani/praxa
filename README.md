# Praxa

Praxa is a production-grade SaaS monorepo foundation built with Turborepo, PNPM workspaces, TypeScript, NestJS, React, Vite, Docker Compose, and shared enterprise tooling.

## Workspace layout

```text
apps/
  api/        NestJS API application with core/common/shared backend architecture
  web/        React + Vite web application
packages/
  shared-types/  Shared DTO, API response, and pagination types
  constants/     Shared app names, API prefixes, env keys, and enum placeholders
  env/           Shared environment contracts and validation helpers
  eslint-config/ Reusable ESLint flat configs
  tsconfig/      Reusable strict TypeScript configs
  ui/            Placeholder UI package
infrastructure/
  docker/     Local MySQL and Redis Docker Compose stack
```

## Prerequisites

- Node.js 20.11 or newer
- PNPM 9 or newer
- Docker and Docker Compose

## Setup

Install dependencies:

```bash
pnpm install
```

Create local environment variables:

```bash
cp .env.example .env
```

Start local infrastructure:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

Start both applications through Turborepo:

```bash
pnpm dev
```

- Web: <http://localhost:5173>
- API health check: <http://localhost:3000/api/v1/health>

## Backend core architecture

The API app is organized into layered `core/`, `common/`, `shared/`, and `modules/` areas. The foundation includes centralized typed configuration, Pino JSON logging, request correlation context, standardized response/error shapes, health monitoring, cache/event/queue/repository abstractions, guard/decorator scaffolds, Swagger at `/docs`, secure headers, CORS, compression, throttling, and a hardened global validation pipe.

## Available scripts

- `pnpm dev` - run development servers for all applications and packages that expose a dev script.
- `pnpm build` - build all workspaces with Turborepo caching.
- `pnpm lint` - lint all workspaces with zero-warning enforcement.
- `pnpm typecheck` - run strict TypeScript checks across all workspaces.
- `pnpm format` - format the repository with Prettier.
- `pnpm prepare` - install Husky Git hooks.

## Development workflow

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env` and adjust values only when needed.
3. Start MySQL and Redis with Docker Compose.
4. Run `pnpm dev` to start the API and web app together.
5. Keep changes formatted, linted, and type-safe before committing.

Husky hooks are configured to run lint-staged formatting/linting plus repository type checks before commits. Commit messages are validated with Commitlint conventional commit rules. VS Code workspace recommendations are included for ESLint, Prettier, and workspace TypeScript usage.

## Environment variables

| Variable       | Default                                  | Purpose                                               |
| -------------- | ---------------------------------------- | ----------------------------------------------------- |
| `NODE_ENV`     | `development`                            | Runtime environment.                                  |
| `DATABASE_URL` | `mysql://root:root@localhost:3306/praxa` | MySQL connection URL reserved for future data access. |
| `REDIS_HOST`   | `localhost`                              | Redis host reserved for future caching and queues.    |
| `REDIS_PORT`   | `6379`                                   | Redis port.                                           |
| `API_PORT`     | `3000`                                   | NestJS API port.                                      |
| `WEB_PORT`     | `5173`                                   | Vite dev server port.                                 |

## Notes

This foundation intentionally excludes business logic, authentication, database schemas, RBAC, multi-tenancy, production deployment workflows, and feature modules. It includes scaffolds for centralized environment validation, API constants, request correlation IDs, URI API versioning, global API error formatting, TanStack Query, and frontend error boundaries so product work can start on a hardened base.

## Authentication and RBAC

Praxa API now includes tenant-aware authentication and RBAC scaffolding under `apps/api/src/modules/auth`.

- Access tokens are JWTs (15m) containing user, tenant, session, roles, permissions, and tokenVersion.
- Refresh tokens are rotated on every refresh and only stored as hashes in sessions.
- Session lifecycle supports create, validate, revoke, revoke-all, activity updates, and replay-attack revocation path.
- Roles and permissions are modeled for tenant-safe assignment.
- Required system roles seeded: `SUPER_ADMIN`, `FIRM_ADMIN`, `MANAGER`, `EMPLOYEE`.
- Audit events logged for `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `TOKEN_REFRESH`, `LOGOUT`, `SESSION_REVOKED`.

### Auth hardening updates

- Refresh token replay protection revokes compromised session state and emits `TOKEN_REPLAY_DETECTED` audit events.
- Revoked or expired sessions are denied during JWT strategy validation.
- Permission resolution now supports cached role-to-permission expansion via the shared cache service with invalidation hooks on role changes.
