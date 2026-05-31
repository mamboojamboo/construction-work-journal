# Construction Work Journal

A fullstack internal tool for construction site supervisors to track completed daily work on a job site.

![Preview](./docs/img/preview.png)

The application supports viewing, filtering, sorting, creating, editing, and deleting work log records. Work types are stored as a PostgreSQL-backed dictionary and are selected from the frontend rather than entered as free text.

## Features

- Work log table with performed date, work type, quantity, unit, performer, optional comment, and row actions.
- Date range filtering and date sorting.
- Additional filtering by work type and performer.
- Create, edit, and delete flows backed by API mutations.
- Delete confirmation dialog.
- Work type dictionary loaded from the database.
- Loading, error, empty, validation, disabled submit, and toast states.
- URL-backed filters and sort order.
- Swagger/OpenAPI contract exposed by the backend.
- Orval-generated frontend API client and TanStack Query hooks.
- PostgreSQL persistence through Prisma.
- One-command Docker Compose setup.

## Stack

Frontend:

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui-style primitives with Radix UI
- TanStack Query
- TanStack Table
- React Hook Form
- Zod
- Orval
- Axios
- date-fns

Backend:

- Node.js
- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Swagger/OpenAPI
- class-validator
- class-transformer

Infrastructure:

- Docker
- Docker Compose
- pnpm workspaces
- ESLint
- Prettier

## Why This Stack

React + Vite fits the task because the application is an internal CRUD tool with no SSR or SEO requirement. A separate NestJS API keeps the client/server boundary explicit and gives the backend a clear module, DTO, validation, and Swagger structure.

PostgreSQL is used as a production-like relational database. Prisma provides typed database access, migrations, and a concise model for the work type dictionary and work log records.

The frontend API layer is generated with Orval from the NestJS Swagger document. This keeps request/response types and TanStack Query hooks aligned with the backend contract without manually duplicating API types in the frontend.

Server state is handled by TanStack Query. Local UI state stays close to the components: dialogs, selected records, URL filters, table sorting, and form state. Forms use React Hook Form and Zod for user-friendly client-side validation, while backend validation remains in NestJS DTOs and the global ValidationPipe.

## Repository Structure

```txt
construction-work-journal/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   └── src/
│   └── web/
│       └── src/
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── .env.example
```

Frontend structure follows a practical feature-based layout:

```txt
apps/web/src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

Backend structure uses NestJS feature modules:

```txt
apps/api/src/
├── prisma/
├── work-logs/
└── work-types/
```

## Run With Docker

Start the full application:

```bash
docker compose up --build
```

URLs:

- Web app: <http://localhost:5173>
- API base: <http://localhost:3000/api>
- Swagger UI: <http://localhost:3000/api/docs>
- OpenAPI JSON: <http://localhost:3000/api/docs-json>

Docker Compose starts three services:

- `postgres`: PostgreSQL 16, available inside the Docker network as `postgres:5432`.
- `api`: NestJS API. On startup it runs `prisma migrate deploy`, `prisma db seed`, then starts `node dist/src/main.js`.
- `web`: Vite static build served by Nginx on host port `5173`.

PostgreSQL is not exposed to the host by default; the app containers communicate over the internal Compose network.

Stop the stack:

```bash
docker compose down
```

## Run Locally

Install dependencies:

```bash
pnpm install
```

Provide a local PostgreSQL database that matches `DATABASE_URL`. One option is a standalone Docker container:

```bash
docker run --name cwj-postgres-local \
  -e POSTGRES_DB=construction_work_journal \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Apply migrations and seed work types:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/construction_work_journal pnpm --filter api prisma:deploy
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/construction_work_journal pnpm --filter api db:seed
```

Start the API:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/construction_work_journal pnpm dev:api
```

Start the frontend in another terminal:

```bash
pnpm dev:web
```

Local URLs are the same as Docker:

- Web app: <http://localhost:5173>
- API: <http://localhost:3000/api>
- Swagger UI: <http://localhost:3000/api/docs>

## Environment Variables

Root `.env.example`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/construction_work_journal
POSTGRES_DB=construction_work_journal
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

API_PORT=3000
WEB_PORT=5173

VITE_API_URL=http://localhost:3000/api
```

Docker Compose overrides the API database URL internally:

```txt
postgresql://postgres:postgres@postgres:5432/construction_work_journal
```

## API Contract Generation

The backend OpenAPI schema is the source of truth for frontend API types and hooks:

```txt
NestJS DTOs
→ Swagger/OpenAPI at /api/docs-json
→ Orval
→ generated Axios + TanStack Query client
→ UI
```

Generate the frontend API client after the API is running:

```bash
pnpm --filter web api:generate
```

Generated output:

```txt
apps/web/src/shared/api/generated/work-journal-api.ts
```

The generated file is committed so the frontend can typecheck and build without regenerating during every install. If backend DTOs or operation names change, rerun Orval.

## API Endpoints

Health:

```txt
GET /api/health
```

Work types:

```txt
GET /api/work-types
```

Work logs:

```txt
GET    /api/work-logs
POST   /api/work-logs
PATCH  /api/work-logs/:id
DELETE /api/work-logs/:id
```

Supported `GET /api/work-logs` query params:

```txt
dateFrom?: string
dateTo?: string
workTypeId?: string
performer?: string
sortBy?: "performedAt"
sortOrder?: "asc" | "desc"
```

Create request body:

```json
{
  "performedAt": "2026-05-30",
  "workTypeId": "uuid",
  "quantity": 24,
  "performer": "Иванов Иван Иванович",
  "comment": "Работы выполнены на секции А"
}
```

Update request body is partial:

```json
{
  "quantity": 28,
  "comment": "Скорректированный объем"
}
```

## Database Schema

Prisma models:

```txt
Unit
- M2
- M3
- M
- PCS
- HOUR
- TON

WorkType
- id
- name
- unit
- createdAt
- updatedAt

WorkLog
- id
- performedAt
- quantity
- performer
- comment
- workTypeId
- createdAt
- updatedAt
```

Important schema details:

- Work logs reference `WorkType` through `workTypeId`.
- Work logs do not duplicate the work type name.
- `quantity` uses a decimal column with precision.
- `performedAt` and `workTypeId` are indexed.

Seeded work types:

- Кладка перегородок — M2
- Монтаж опалубки — M2
- Бетонирование — M3
- Монтаж арматуры — TON
- Штукатурные работы — M2
- Установка дверей — PCS
- Прокладка кабеля — M
- Покраска стен — M2

## Useful Scripts

Root:

```bash
pnpm dev
pnpm dev:api
pnpm dev:web
pnpm build
pnpm lint
pnpm format
pnpm typecheck
docker compose up --build
docker compose down
```

API:

```bash
pnpm --filter api prisma:generate
pnpm --filter api prisma:deploy
pnpm --filter api db:seed
```

Web:

```bash
pnpm --filter web api:generate
```

## Validation

Backend validation:

- NestJS DTOs
- `class-validator`
- `class-transformer`
- global `ValidationPipe` with whitelist, forbidden non-whitelisted fields, and transform enabled

Frontend validation:

- React Hook Form
- Zod schema in the reusable `WorkLogForm`
- required date, work type, quantity, and performer fields
- positive quantity validation
- optional comment validation

## Known Trade-Offs

- The frontend has a single route because the product scope is one focused internal tool.
- The table does not implement pagination; current API returns the filtered list and total for the assignment scale.
- Summary cards are calculated from the currently loaded list rather than a separate aggregate endpoint.
- PostgreSQL is internal-only in Docker Compose. Local development needs a separately exposed database.
- Authentication, authorization, projects, photos, uploads, and audit trails are intentionally out of scope.
- The production frontend image embeds `VITE_API_URL` at build time, which is normal for Vite but means API URL changes require rebuilding the web image.

## Possible Improvements

- Add pagination or cursor-based loading for large journals.
- Add backend aggregate endpoints for summaries.
- Add automated frontend tests for create/edit/delete flows.
- Add API e2e tests against a test database.
- Add CI checks for lint, typecheck, build, migrations, and Orval generation drift.
- Add Docker image size optimizations and non-root runtime users.
- Add authentication and per-site permissions if the product scope grows.
