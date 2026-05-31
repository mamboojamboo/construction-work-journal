# Construction Work Journal

A fullstack internal tool for tracking completed construction works on a job site.

This repository is organized as a pnpm workspace with a separate Vite React frontend and NestJS API.

## Stack

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

Run the frontend in development mode:

```bash
pnpm dev:web
```

Frontend URL:

- Web app: <http://localhost:5173>

API URLs:

- Health: <http://localhost:3000/api/health>
- Work types: <http://localhost:3000/api/work-types>
- Work logs: <http://localhost:3000/api/work-logs>
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

Generate the frontend API client from the backend OpenAPI schema:

```bash
pnpm --filter web api:generate
```

## Architecture Notes

The frontend and backend are intentionally separate applications. The backend OpenAPI schema will be the source of truth for frontend API types and TanStack Query hooks via Orval.

The frontend is a Vite React application under `apps/web`. It uses a practical feature-based folder structure with `app`, `pages`, `widgets`, `features`, `entities`, and `shared` layers. `AppProviders` wires TanStack Query and the toast provider around the application. The shared Axios instance reads `VITE_API_URL` and exposes `customInstance` for Orval.

The Work Journal page composes `AppLayout`, page header actions, `WorkLogSummary`, `WorkLogFilters`, and `WorkLogTable`. `WorkLogFilters` keeps `dateFrom`, `dateTo`, `workTypeId`, and `performer` in URL search params, then passes them to the Orval-generated `useGetWorkLogs` hook. `WorkLogTable` uses TanStack Table for rendering and controls server-side `performedAt` sorting through the same URL-driven flow.

Creating a work log is handled by a feature-level dialog that reuses `WorkLogForm`. The form uses React Hook Form with a Zod schema for client-side validation, loads the work type dictionary from the API, shows the selected unit near the quantity field, and submits through the Orval-generated create mutation. Successful creation invalidates the work log list query and shows a toast notification.

Editing uses the same `WorkLogForm` with existing record values passed as defaults. Row actions in the table open a controlled edit dialog, submit changes through the Orval-generated update mutation, invalidate the work log list, and show success or error toasts.

Deleting is handled through a confirmation dialog opened from the table row action. The dialog shows the selected record summary, calls the Orval-generated delete mutation, invalidates the work log list, and confirms the result with toast notifications.

Orval reads `http://localhost:3000/api/docs-json` and writes generated types, request functions, and TanStack Query hooks to `apps/web/src/shared/api/generated/work-journal-api.ts`. The OpenAPI document describes paths relative to the `/api` server, so the generated client works with `VITE_API_URL=http://localhost:3000/api`.

The API uses Prisma for typed database access. The current database schema contains a `WorkType` dictionary table, a `WorkLog` table, and a `Unit` enum. Work logs reference work types by foreign key instead of storing duplicated work type names.

The work type dictionary is exposed through `GET /api/work-types`. The endpoint reads from PostgreSQL through Prisma and returns `id`, `name`, and `unit` for each seeded work type.

Work logs are exposed through:

- `GET /api/work-logs`
- `POST /api/work-logs`
- `PATCH /api/work-logs/:id`
- `DELETE /api/work-logs/:id`

`GET /api/work-logs` supports `dateFrom`, `dateTo`, `workTypeId`, `performer`, `sortBy=performedAt`, and `sortOrder=asc|desc`. The list response shape is `{ items, total }`, and each work log includes the related work type dictionary entry.

## Useful Scripts

```bash
pnpm dev
pnpm dev:api
pnpm dev:web
pnpm build
pnpm lint
pnpm format
pnpm typecheck
pnpm --filter web api:generate
```
