# Puck

Puck is a self-hosted coffee logger application built as a monorepo. Users can store their brewing equipment, coffee beans, and extraction records.

## Tech Stack

### Backend

- **Runtime**: Bun (JavaScript/TypeScript)
- **Backend Framework**: Elysia
- **Database**: SQLite (bun:sqlite)
- **API Docs**: OpenAPI/Swagger at `/swagger`

### Frontend

- **Framework**: Vue 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Language**: TypeScript

## Project Structure

```
puck/
├── apps/
│   ├── api/                    # Backend API server
│   │   ├── src/
│   │   │   ├── equipment/      # Equipment CRUD endpoints
│   │   │   ├── coffees/        # Coffees CRUD endpoints
│   │   │   ├── extractions/    # Extractions CRUD endpoints
│   │   │   ├── application.ts  # Elysia app setup with error handler
│   │   │   ├── database.ts     # Database connection
│   │   │   ├── errors.ts       # Centralized error classes
│   │   │   └── migrations.ts   # Migration system
│   │   ├── migrations/         # SQL migration files
│   │   └── tests/              # API tests
│   └── web/                    # Frontend Vue app
│       ├── src/
│       │   ├── components/     # Vue components (cards, modals, navbar)
│       │   ├── composables/    # Vue composables (useModal)
│       │   ├── stores/         # Pinia stores (modal)
│       │   ├── views/          # Page views (Dashboard)
│       │   └── router/         # Vue Router config
│       └── package.json
├── .github/workflows/          # CI/CD workflows
├── AGENTS.md                   # Coding guide for agents
└── package.json                # Root package.json
```

## Features

### Implemented

- ✅ Equipment CRUD (grinders, brewers)
- ✅ Coffees CRUD (roaster, name, roast date, process, notes)
  - Includes soft delete via `archived` field
- ✅ Extractions CRUD (brewing records with equipment and coffee relationships)
  - Rating (1-5 scale), dose, yield, brew time, water temp
  - Optional fields: grind setting, tasting notes, recipe metadata
- ✅ Centralized error handling (ApplicationError, NotFoundError, ValidationError)
- ✅ Modal system for frontend (log extraction, delete confirm)

## Getting Started

```bash
bun install
bun run dev
```

This will start both the API server (http://localhost:3000) and the web app (http://localhost:5173).

### Database Setup

The API uses SQLite with migrations. By default, it uses an in-memory database (`:memory:`) for development. To persist data:

```bash
export DATABASE_PATH=./puck.db
bun run dev:api
```

To run migrations manually:

```bash
cd apps/api
bun run scripts/migrate.ts
```

## Development

### Commands

```bash
# Start all apps
bun run dev

# Start API only
bun run dev:api

# Start web app only
bun run dev:web

# Run API tests
bun run test:api

# Run all linting (code style + API typecheck + web typecheck)
bun run lint

# Run individual lint checks
bun run lint:code-style  # Prettier code style
bun run lint:api         # ESLint for API
bun run lint:web         # Vue TSC typecheck for web

# Type checking (API only)
bunx tsc --noEmit
```

### API Development

- API server runs on http://localhost:3000
- OpenAPI/Swagger documentation available at http://localhost:3000/swagger
- Database migrations are in `apps/api/migrations/`
- Add new CRUD endpoints by following the equipment/coffees module patterns

### Web App Development

- Vite dev server runs on http://localhost:5173
- Uses Vue 3 Composition API
- State managed with Pinia stores
- Routing with Vue Router

## CI/CD

The project uses GitHub Actions for continuous integration. The workflow checks:

- Code formatting (Prettier)
- ESLint (API)
- TypeScript type checking (web app)
- API tests

See `.github/workflows/ci.yml` for details.
