# Agents Guide for Puck Monorepo

This guide provides essential information for coding agents working in the Puck repository.

## Development Commands

### General Commands

- `bun install` - Install all dependencies
- `bun run dev` - Start all apps in dev mode (API on 3000, web on 5173)
- `bun run dev:api` - Start API server in dev mode (port 3000)
- `bun run dev:web` - Start web app in dev mode (port 5173)

### Testing Commands

- `bun run test:api` - Run all API tests
- `bun test` - Run tests from current directory
- `bun test <specific-test-file.test.ts>` - Run a single test file

### Build Commands

- `bun run build` - Build the API package (output to apps/api/dist)

### Type Checking & Linting

- `bunx tsc --noEmit` - Type check API only (root tsconfig checks apps/api/\*_/_)
- `bun run lint` - Run all linting checks (code style + API + web)
- `bun run lint:code-style` - Check code formatting with Prettier
- `bun run lint:api` - ESLint for API
- `bun run lint:web` - Type check web app (uses vue-tsc)

### Database Commands

- `cd apps/api && bun run scripts/migrate.ts` - Run database migrations

## Tech Stack

### Backend

- **Runtime**: Bun
- **Language**: TypeScript (strict mode enabled)
- **Backend Framework**: Elysia
- **Database**: SQLite (bun:sqlite)
- **Testing**: bun:test
- **API Documentation**: OpenAPI/Swagger

### Frontend

- **Framework**: Vue 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Language**: TypeScript

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
- **Vue Components**: PascalCase (e.g., `CoffeeList.vue`)

### Error Handling

- Use HTTP status codes in routes
- Return error objects with descriptive messages
- Use `set.status` for setting response status
- Handle missing resources with 404 and clear error messages
- Throw custom error classes (ApplicationError, NotFoundError, ValidationError) from services
- Global error handler in `application.ts` automatically catches ApplicationError instances

```typescript
// In routes
const equipment = await EquipmentService.find(Number(id));
if (!equipment) {
  set.status = 404;
  return { error: 'Equipment not found' };
}

// In services (preferred approach for complex validation)
import { NotFoundError } from '../errors';

function find(id: number): Equipment | undefined {
  const row = db.query('SELECT * FROM equipment WHERE id = ?').get(id);
  if (!row) {
    throw new NotFoundError('Equipment not found');
  }
  return mapDatabaseRowToSchema(row);
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

- Migration files are in `apps/api/migrations/` directory
- Naming convention: `####_feature_name.sql` (e.g., `0002_coffees.sql`)
- Use the migration system to manage database schema changes
- Run migrations with: `cd apps/api && bun run scripts/migrate.ts`

### Vue 3 Patterns

#### Components

- Use Vue 3 Composition API with `<script setup>`
- Use TypeScript for component props and emits
- Organize template, script, and style sections

```typescript
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Props {
  coffeeId: number;
}

const props = defineProps<Props>();

const loading = ref(false);
const coffee = ref<Coffee | null>(null);

onMounted(async () => {
  loading.value = true;
  coffee.value = await fetchCoffee(props.coffeeId);
  loading.value = false;
});
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="coffee">{{ coffee.name }}</div>
</template>
```

#### Pinia Stores

- Use defineStore with id and setup function
- Organize stores by feature/domain
- Use TypeScript for state typing

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useEquipmentStore = defineStore('equipment', () => {
  const equipment = ref<Equipment[]>([]);
  const loading = ref(false);

  const grinders = computed(() => equipment.value.filter((e) => e.type === 'GRINDER'));

  async function loadEquipment() {
    loading.value = true;
    const response = await fetch('/api/equipment');
    equipment.value = await response.json();
    loading.value = false;
  }

  return { equipment, loading, grinders, loadEquipment };
});
```

## Project Structure

```
puck/
├── apps/
│   ├── api/                          # Backend API server
│   │   ├── migrations/               # SQL migration files
│   │   │   ├── 0001_equipment.sql
│   │   │   ├── 0002_coffees.sql
│   │   │   ├── 0003_extractions.sql
│   │   │   └── 0004_add_archived_to_coffees.sql
│   │   ├── scripts/                  # Utility scripts
│   │   │   └── migrate.ts            # Run database migrations
│   │   ├── src/
│   │   │   ├── coffees/              # Coffees CRUD endpoints
│   │   │   │   ├── routes.ts
│   │   │   │   ├── service.ts
│   │   │   │   └── schema.ts
│   │   │   ├── equipment/            # Equipment CRUD endpoints
│   │   │   │   ├── routes.ts
│   │   │   │   ├── service.ts
│   │   │   │   └── schema.ts
│   │   │   ├── extractions/          # Extractions CRUD endpoints
│   │   │   │   ├── routes.ts
│   │   │   │   ├── service.ts
│   │   │   │   └── schema.ts
│   │   │   ├── application.ts        # Elysia app setup
│   │   │   ├── database.ts           # Database connection
│   │   │   ├── errors.ts             # Custom error classes
│   │   │   ├── index.ts              # Entry point
│   │   │   └── migrations.ts         # Migration system
│   │   └── tests/                    # API tests
│   │       ├── coffees/
│   │       ├── equipment/
│   │       ├── extractions/
│   │       └── helper.ts
│   └── web/                          # Frontend Vue app
│       ├── src/
│       │   ├── components/           # Vue components
│       │   │   ├── modal/           # Modal components
│       │   │   │   ├── modals/
│       │   │   │   │   ├── LogExtractionModal.vue
│       │   │   │   │   └── DeleteConfirmModal.vue
│       │   │   │   └── ModalContainer.vue
│       │   │   ├── BaseModal.vue
│       │   │   ├── ExtractionCard.vue
│       │   │   ├── CoffeeCard.vue
│       │   │   ├── EquipmentCard.vue
│       │   │   └── Navbar.vue
│       │   ├── composables/          # Vue composables
│       │   │   └── useModal.ts
│       │   ├── router/               # Vue Router config
│       │   ├── stores/               # Pinia stores
│       │   │   └── modal.ts
│       │   ├── views/                # Page views
│       │   │   └── Dashboard.vue
│       │   ├── App.vue
│       │   └── main.ts
│       ├── vite.config.ts
│       └── package.json
├── .github/workflows/                # CI/CD workflows
│   └── ci.yml                        # Runs lint, typecheck, tests
├── AGENTS.md                         # This file
├── package.json                      # Root package.json (workspaces)
└── tsconfig.json                     # TypeScript config (API only)
```

## Feature Implementation Status

### Completed

- ✅ Equipment CRUD (grinders, brewers)
  - Routes: `GET /equipment`, `POST /equipment`, `GET /equipment/:id`, `DELETE /equipment/:id`
- ✅ Coffees CRUD (roaster, name, roast date, process, notes, archived)
  - Routes: `GET /coffees`, `POST /coffees`, `GET /coffees/:id`, `PUT /coffees/:id`, `DELETE /coffees/:id`
  - Includes soft delete via `archived` boolean field
- ✅ Extractions CRUD (brewing records)
  - Routes: `GET /extractions`, `POST /extractions`, `GET /extractions/:id`, `PUT /extractions/:id`, `DELETE /extractions/:id`
  - Fields: coffeeId, brewerId, grinderId, grindSetting, dose, yield, brewTime, waterTemp, rating, tastingNotes, recipeMetadata
- ✅ Centralized error handling
  - Custom error classes: ApplicationError, NotFoundError, ValidationError
  - Global error handler in application.ts
- ✅ Frontend modal system
  - Modal components: BaseModal, ModalContainer, LogExtractionModal, DeleteConfirmModal
  - Composable: useModal
  - Store: modal.ts

### Pending Implementation

None currently - all planned features are implemented.

## CI/CD

The project uses GitHub Actions for continuous integration. The workflow (`.github/workflows/ci.yml`) checks:

1. Code formatting (Prettier)
2. TypeScript type checking (API and web app)
3. API tests

All checks must pass before merging to main/master branches.

## Important Notes

- Always run `bun run lint` before committing
- Keep tests focused and descriptive
- Follow REST conventions for API endpoints
- Use proper HTTP status codes (201 for created, 204 for no content, 404 for not found)
- OpenAPI/Swagger docs available at `/swagger`
- Database path controlled by `DATABASE_PATH` env var (defaults to `:memory:`)
- Root tsconfig.json only type-checks `apps/api/**/*` (web app has its own tsconfig)
- When adding new CRUD endpoints, follow the equipment/coffees module patterns
- Migration files must be numbered sequentially (e.g., `0004_new_feature.sql`)
