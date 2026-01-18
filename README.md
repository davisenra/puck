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
│   │   │   ├── application.ts  # Elysia app setup
│   │   │   ├── database.ts     # Database connection
│   │   │   └── migrations.ts   # Migration system
│   │   ├── migrations/         # SQL migration files
│   │   └── tests/              # API tests
│   └── web/                    # Frontend Vue app
│       ├── src/
│       │   ├── stores/         # Pinia stores
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

### Pending Implementation

- 🚧 Extractions (brewing records with equipment and coffee relationships)

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

# Check code formatting
bun run lint

# Type checking (API only)
bunx tsc --noEmit

# Type checking (web app)
bun run lint:web
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
- TypeScript type checking (API and web app)
- API tests

See `.github/workflows/ci.yml` for details.
