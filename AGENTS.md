# AGENTS.md

This document provides guidance for AI agents working on the Puck coffee logger application.

## Project Overview

Puck is a self-hosted coffee logger application built as a monorepo. Users can store their brewing equipment, coffee beans, and extraction records. The backend is fully implemented with plans for a Vue3 frontend in the future.

## Tech Stack

- **Runtime**: Bun (JavaScript/TypeScript)
- **Backend Framework**: Elysia (TypeScript web framework)
- **Database**: SQLite (via `bun:sqlite`)
- **Validation**: Elysia TypeBox schemas
- **Testing**: Bun's built-in test runner
- **API Docs**: `@elysiajs/openapi`
- **Code Formatting**: Prettier (2 space indent, semicolons, single quotes, 100 char width)

## Monorepo Structure

```
puck/
├── apps/
│   └── api/           # Bun/Elysia backend API
│       ├── src/
│       │   ├── database.ts      # SQLite database connection
│       │   ├── application.ts   # Elysia app setup
│       │   ├── index.ts         # Entry point (listens on port 3000)
│       │   ├── migrations.ts    # Migration runner
│       │   ├── schema.ts        # General schemas (coffee, extraction)
│       │   └── equipment/       # Equipment module
│       │       ├── routes.ts    # Equipment API endpoints
│       │       ├── service.ts   # Equipment business logic
│       │       └── schema.ts    # Equipment schemas
│       ├── migrations/          # SQL migration files
│       ├── tests/               # Test files
│       ├── scripts/             # Utility scripts
│       └── package.json
└── packages/                   # Shared packages (currently empty, WIP)
```

## Database Schema

### equipment

Stores brewing equipment (grinders, brewers).

- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `type` TEXT NOT NULL (GRINDER or BREWER)
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

### coffees

Stores coffee bean information.

- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `roaster` TEXT NOT NULL
- `name` TEXT NOT NULL
- `roast_date` TEXT
- `process` TEXT
- `notes` TEXT
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

### extractions

Stores brewing extraction records.

- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `coffee_id` INTEGER NOT NULL (FK to coffees.id)
- `brewer_id` INTEGER NOT NULL (FK to equipment.id)
- `grinder_id` INTEGER (FK to equipment.id)
- `grind_setting` TEXT
- `dose` REAL NOT NULL
- `yield` REAL NOT NULL
- `brew_time` REAL NOT NULL
- `water_temp` REAL
- `rating` REAL NOT NULL (1-10)
- `tasting_notes` TEXT
- `recipe_metadata` TEXT
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

## API Architecture

The application follows a **Schema → Service → Route** pattern:

1. **Schema**: Define TypeScript types and Elysia validation schemas
2. **Service**: Business logic and database operations
3. **Route**: HTTP endpoint handlers

All routes are registered in `src/application.ts` and use Elysia with TypeBox validation.

### Current Endpoints

#### Equipment

- `GET /equipment` - List all equipment (returns empty array if none)
- `GET /equipment/:id` - Get equipment by ID (404 if not found)
- `POST /equipment` - Create new equipment (returns 201 with created resource)
- `DELETE /equipment/:id` - Delete equipment by ID (returns 204)

#### Root

- `GET /` - Returns "☕" (coffee emoji)

### OpenAPI Documentation

Swagger documentation is available at `/swagger` endpoint via `@elysiajs/openapi`.

## Development Commands

### Root Level

- `bun run dev` - Start all apps in dev mode
- `bun run dev:api` - Start API in dev mode with watch mode
- `bun run dev:web` - Start web app (currently WIP)
- `bun run test:api` - Run API tests

### API Level (`apps/api/`)

- `bun run dev` - Start API dev server with watch mode (port 3000)
- `bun run build` - Build the application
- `bun test` - Run all tests (`bun test **/*.test.ts`)
- `bun run scripts/migrate.ts` - Run database migrations

## Testing

- **Framework**: Bun's built-in test runner
- **Test Location**: `tests/{module}/{module}.test.ts`
- **Test Database**: In-memory SQLite for isolation
- **Helpers**: `setupTestDatabase()` and `teardownTestDatabase()` in `tests/helper.ts`

### Current Test Coverage

- Equipment CRUD operations (create, read, update, delete)
- Smoke tests for root endpoint
- Empty list handling

### Writing Tests

Always write tests for new features. Follow the existing test patterns:

```typescript
import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { createElysiaApplication } from '../../src/application';
import { setupTestDatabase, teardownTestDatabase } from '../helper';

describe('/module', async () => {
  const app = await createElysiaApplication();

  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(() => {
    teardownTestDatabase();
  });

  test('description', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Code Conventions

### TypeScript

- Strict mode enabled
- Use ES2022 modules and targets
- Type imports from schemas
- Explicit return types on exported functions

### Database Queries

- Use raw SQL with prepared statements
- **Critical**: Avoid table aliases in DELETE/INSERT statements (causes SQLite syntax errors)
- SELECT queries can use table aliases
- SQL constants defined at module level in uppercase snake_case
- Example: `const DELETE_SQL = 'DELETE FROM equipment WHERE id = ?';`

### Service Pattern

Async functions that return typed data:

```typescript
async function find(id: number): Promise<Equipment | undefined> {
  const row = db.query(FIND_BY_ID_SQL).get(id) as EquipmentDatabaseRow | undefined;
  return row ? mapDatabaseRowToSchema(row) : undefined;
}
```

### Route Handlers

- Elysia route order: GET specific routes before parameterized routes
- ID types: Database uses numeric IDs, route params are strings (requires conversion with `Number()`)
- Error handling: Return appropriate HTTP status codes with error messages
- 204 responses: Must explicitly return `undefined` after setting status
- Use `set.status` for custom status codes

### Route Registration Order

Important: Register more specific routes before parameterized ones to avoid conflicts:

```typescript
.get('/:id', ...)  // Parameterized - register last
.delete('/:id', ...)  // Parameterized - register last
.get('/', ...)  // Specific - register first
```

## Important Notes

### Environment

- Use `DATABASE_PATH` environment variable to override default database path
- Default: In-memory database (`:memory:`)
- Local development: `DATABASE_PATH="../../puck.db"` (see `apps/api/.env`)

### Database Connection

- Single connection per app instance
- Test database override via `useTestDatabase()` function
- Close and reopen database for test isolation

### Migrations

- Located in `apps/api/migrations/`
- Naming convention: `NNNN_description.sql` (e.g., `0001_equipment.sql`)
- Run on app startup or manually via `bun run scripts/migrate.ts`
- Tracked in `migrations` table

### Type Conversion

- Database IDs are numbers, route params are strings
- Always convert: `const id = Number(params.id)`

### Response Patterns

- Empty lists: Return `[]` (natural behavior of `map()` on empty arrays)
- Not found: Return 404 with `{ error: 'Resource not found' }`
- Success with data: Return 200 with schema object
- Created: Return 201 with created object
- No content: Set `set.status = 204` and `return;`

## Key Files Reference

- **Database Setup**: `apps/api/src/database.ts:1`
- **App Configuration**: `apps/api/src/application.ts:1`
- **Entry Point**: `apps/api/src/index.ts:1`
- **Migration System**: `apps/api/src/migrations.ts:1`
- **Service Pattern**: `apps/api/src/equipment/service.ts:1`
- **Route Handlers**: `apps/api/src/equipment/routes.ts:1`
- **Test Helpers**: `apps/api/tests/helper.ts:1`
- **Schema Examples**: `apps/api/src/equipment/schema.ts:1`, `apps/api/src/schema.ts:1`

## Future Plans

- Implement Coffee CRUD endpoints
- Implement Extraction CRUD endpoints
- Create Vue3 frontend application in `apps/web/`
- Add authentication/authorization
- Add recipe management features
