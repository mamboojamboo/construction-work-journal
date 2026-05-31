# Construction Work Journal

A fullstack internal tool for tracking completed construction works on a job site.

This repository is organized as a pnpm workspace with a separate Vite React frontend and NestJS API. The implementation will be built incrementally according to the assignment brief.

## Status

Step 1 is complete: the monorepo skeleton is initialized.

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

## Architecture Notes

The frontend and backend are intentionally separate applications. The backend OpenAPI schema will be the source of truth for frontend API types and TanStack Query hooks via Orval.

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

Most scripts are placeholders until the corresponding applications are initialized in later steps.
