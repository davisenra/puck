# Agents Guide for Puck Monorepo

This guide provides essential information for coding agents working in the Puck repository.

## Development Commands

### General Commands

- `bun install` - Install all dependencies
- `bun run dev` - Start all apps in dev mode
- `bun run dev:api` - Start API server in dev mode (port 3000)
- `bun run lint` - Check code formatting with Prettier

### Testing Commands

- `bun run test:api` - Run all API tests
- `bun test` - Run tests from current directory
- `bun test <specific-test-file.test.ts>` - Run a single test file

### Build Commands

- `bun run build` - Build the API package (output to ./dist)

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript (strict mode enabled)
- **Backend Framework**: Elysia
- **Database**: SQLite (bun:sqlite)
- **Testing**: bun:test

## Code Style Guidelines

### Formatting

- Use **2 spaces** for indentation (no tabs)
- Use **semicolons** at end of statements
- Use **single quotes** for strings
- Max line width: **100 characters**
- Run `bun run lint` to check formatting

### Imports

- Use ES6 import statements
- Import external libraries first, then internal modules
- Group related imports together
- Use default exports for services and routes

```typescript
import { Elysia, t } from 'elysia';
import { CreateEquipmentSchema, EquipmentSchema } from './schema';
import EquipmentService from './service';
```

### TypeScript & Types

- **Strict mode is enabled** - always provide explicit types
- Export types from schemas using `.static` property
- Use union types with `t.Literal()` for enums

```typescript
export const EquipmentType = t.Union([t.Literal('GRINDER'), t.Literal('BREWER')]);
export type Equipment = typeof EquipmentSchema.static;
```

### Naming Conventions

- **Files**: kebab-case (e.g., `equipment-service.ts`)
- **Variables/Functions**: camelCase (e.g., `listAll`, `mapDatabaseRowToSchema`)
- **Constants**: UPPER_SNAKE_CASE for SQL queries (e.g., `SELECT_ALL_SQL`)
- **Types**: PascalCase (e.g., `Equipment`, `CreateEquipment`)
- **Interfaces**: PascalCase with descriptive names (e.g., `EquipmentDatabaseRow`)

### Error Handling

- Use HTTP status codes in routes
- Return error objects with descriptive messages
- Use `set.status` for setting response status
- Handle missing resources with 404 and clear error messages

```typescript
const equipment = await EquipmentService.find(Number(id));
if (!equipment) {
  set.status = 404;
  return { error: 'Equipment not found' };
}
```

### Database Patterns

- Store SQL queries in constants at the top of service files
- Use type aliases for database rows: `type XDatabaseRow = Record<string, any>`
- Create mapper functions to convert database rows to schema types
- Use parameterized queries with `?` placeholders

```typescript
const SELECT_ALL_SQL = 'SELECT e.* FROM equipment e ORDER BY e.id DESC';
type EquipmentDatabaseRow = Record<string, any>;

function mapDatabaseRowToSchema(e: EquipmentDatabaseRow): Equipment {
  return { id: e.id, name: e.name /* ... */ };
}
```

### Service Layer

- Export services as default objects with methods
- Use `async/await` for all database operations
- Return typed values based on schema exports
- Handle undefined returns appropriately (e.g., for not-found cases)

```typescript
export default { listAll, save, destroy, find };
```

### Routes

- Use Elysia builder pattern with chaining
- Define response schemas for each status code
- Use `t.Object()` for params and body schemas
- Set proper status codes in handlers

```typescript
new Elysia({ prefix: '/equipment' })
  .get(
    '/',
    async () => {
      /* ... */
    },
    { response: { 200: EquipmentListSchema } },
  )
  .post(
    '/',
    async ({ body }) => {
      /* ... */
    },
    { body: CreateEquipmentSchema },
  );
```

### Testing

- Use `bun:test` with `describe`, `test`, `expect`
- Setup/teardown test database using `beforeEach`/`afterEach`
- Create Requests with proper URLs and methods
- Use `expect(response.status)` and `expect(response.json())`
- Test both happy paths and error cases

```typescript
import { describe, test, expect, beforeEach } from 'bun:test';

describe('/equipment', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  test('creates new equipment', async () => {
    const response = await app.handle(
      new Request('http://localhost/equipment', { method: 'POST' }),
    );
    expect(response.status).toBe(201);
  });
});
```

### Migrations

- Migration files should be in `src/` or `scripts/` directory
- Use the migration system to manage database schema changes

## Project Structure

```
puck/
├── apps/
│   └── api/
│       ├── src/
│       │   ├── equipment/         # Feature-specific modules
│       │   │   ├── routes.ts      # Route definitions
│       │   │   ├── service.ts     # Business logic
│       │   │   └── schema.ts      # Type definitions & schemas
│       │   ├── index.ts           # Entry point
│       │   ├── application.ts     # Elysia app setup
│       │   └── database.ts       # Database connection
│       └── tests/                 # Test files
├── packages/                      # Shared packages
└── package.json
```

## Important Notes

- Always run `bun run lint` before committing
- Keep tests focused and descriptive
- Follow REST conventions for API endpoints
- Use proper HTTP status codes (201 for created, 204 for no content, 404 for not found)
- OpenAPI/Swagger docs available at `/swagger`
- Database path controlled by `DATABASE_PATH` env var (defaults to `:memory:`)
