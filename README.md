# Praxa

Praxa is a production-grade SaaS monorepo foundation built with Turborepo, PNPM workspaces, TypeScript, NestJS, React, Vite, Docker Compose, and shared enterprise tooling.

## Workspace layout

```text
apps/
  api/        NestJS API application
  web/        React + Vite web application
packages/
  shared-types/  Shared DTO, API response, and pagination types
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
- API health check: <http://localhost:3000/api/health>

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

Husky hooks are configured to run lint-staged formatting/linting plus repository type checks before commits. Commit messages are validated with Commitlint conventional commit rules.

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

This foundation intentionally excludes business logic, authentication, database schemas, RBAC, multi-tenancy, production deployment workflows, and feature modules. It is ready for incremental product implementation on top of the established monorepo architecture.
