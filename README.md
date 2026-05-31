# Construction Work Journal

A fullstack internal tool for tracking completed construction works on a job site.

This repository is organized as a pnpm workspace with a separate Vite React frontend and NestJS API. The implementation will be built incrementally according to the assignment brief.

## Planned Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, TanStack Table, React Hook Form, Zod, Orval, Axios, date-fns.
- Backend: Node.js, NestJS, TypeScript, Prisma, PostgreSQL, Swagger/OpenAPI, class-validator, class-transformer.
- Infrastructure: Docker, Docker Compose, pnpm workspaces, ESLint, Prettier.

## Repository Structure

```txt
construction-work-journal/
├── apps/
│   ├── api/
│   └── web/
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── .env.example
```

## Setup

Install workspace dependencies:

```bash
pnpm install
```

Application-specific setup commands will be added as the API, frontend, database, and Docker configuration are implemented.

Run the API in development mode:

```bash
pnpm dev:api
```

API URLs:

- Health: <http://localhost:3000/api/health>
- Swagger UI: <http://localhost:3000/api/docs>
- OpenAPI JSON: <http://localhost:3000/api/docs-json>

Start PostgreSQL with Docker Compose:

```bash
docker compose up -d postgres
```

If local port `5432` is already in use, override it:

```bash
POSTGRES_PORT=5433 docker compose up -d postgres
```

Apply database migrations and seed work types:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/construction_work_journal pnpm --filter api prisma:deploy
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/construction_work_journal pnpm --filter api db:seed
```

Use the same port in `DATABASE_URL` that Docker Compose exposes locally.

## Architecture Notes

The frontend and backend are intentionally separate applications. The backend OpenAPI schema will be the source of truth for frontend API types and TanStack Query hooks via Orval.

The API uses Prisma for typed database access. The current database schema contains a `WorkType` dictionary table, a `WorkLog` table, and a `Unit` enum. Work logs reference work types by foreign key instead of storing duplicated work type names.

## Useful Scripts

```bash
pnpm dev
pnpm dev:api
pnpm dev:web
pnpm build
pnpm lint
pnpm format
pnpm typecheck
```
