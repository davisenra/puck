# AGENTS.md

This guide helps AI agents contribute to the Puck repository by following established patterns across the codebase.

## Project Structure

```
puck/
├── apps/
│   ├── api/           # Elysia backend (Bun + SQLite)
│   └── web/           # Vue 3 frontend (Vite + Pinia)
├── package.json       # Monorepo config (Bun workspaces)
└── tsconfig.json      # Shared TypeScript config
```

## Backend Patterns (`apps/api`)

### Architecture: Routes → Services → Database

Each domain (coffees, equipment, extractions) follows this three-layer pattern:

```
apps/api/src/{domain}/
├── schema.ts     # Elysia types for validation
├── service.ts    # Business logic + database queries
└── routes.ts     # HTTP endpoints
```

### Example: Creating a New Domain

1. **Define schemas** in `apps/api/src/{domain}/schema.ts`:

```typescript
import { t } from 'elysia';

export const EntitySchema = t.Object({
  id: t.Numeric(),
  name: t.String({ minLength: 1 }),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const CreateEntitySchema = t.Object({
  name: t.String({ minLength: 1 }),
});

export const UpdateEntitySchema = t.Partial(CreateEntitySchema);

export type Entity = typeof EntitySchema.static;
export type CreateEntity = typeof CreateEntitySchema.static;
export type UpdateEntity = typeof UpdateEntitySchema.static;
```

2. **Create service** in `apps/api/src/{domain}/service.ts`:

```typescript
import { db } from '../database';
import { Entity, CreateEntity, UpdateEntity } from './schema';

async function listAll(): Promise<Entity[]> {
  const rows = db.query('SELECT * FROM entities').all();
  return rows.map(mapToEntity);
}

async function save(data: CreateEntity): Promise<Entity> {
  const result = db.query('INSERT INTO entities (...) VALUES (...)').run(...);
  return await find(result.lastInsertRowid);
}

async function find(id: number): Promise<Entity | undefined> {
  const row = db.query('SELECT * FROM entities WHERE id = ?').get(id);
  return row ? mapToEntity(row) : undefined;
}

async function update(id: number, data: UpdateEntity): Promise<Entity | undefined> {
  // Update query...
  return await find(id);
}

async function destroy(id: number): Promise<void> {
  db.query('DELETE FROM entities WHERE id = ?').run(id);
}

export default { listAll, save, find, update, destroy };
```

3. **Create routes** in `apps/api/src/{domain}/routes.ts`:

```typescript
import { Elysia, t } from 'elysia';
import { EntitySchema, CreateEntitySchema, UpdateEntitySchema } from './schema';
import EntityService from './service';

export default new Elysia({ prefix: '/entities' })
  .get('/', async () => await EntityService.listAll(), {
    response: { 200: t.Array(EntitySchema) },
  })
  .post(
    '/',
    async ({ body, set }) => {
      const entity = await EntityService.save(body);
      set.status = 201;
      return entity;
    },
    {
      body: CreateEntitySchema,
      response: { 201: EntitySchema },
    },
  )
  .get('/:id', async ({ params: { id }, set }) => {
    const entity = await EntityService.find(Number(id));
    if (!entity) {
      set.status = 404;
      return { error: 'Entity not found' };
    }
    return entity;
  })
  .put(
    '/:id',
    async ({ params: { id }, body, set }) => {
      const entity = await EntityService.update(Number(id), body);
      if (!entity) {
        set.status = 404;
        return { error: 'Entity not found' };
      }
      return entity;
    },
    {
      body: UpdateEntitySchema,
    },
  )
  .delete('/:id', async ({ params: { id }, set }) => {
    await EntityService.destroy(Number(id));
    set.status = 204;
    return;
  });
```

4. **Register routes** in `apps/api/src/application.ts`:

```typescript
import entityRoutes from './entities/routes';

export async function createElysiaApplication() {
  return new Elysia().use(entityRoutes); // Add this line
  // ... other routes
}
```

5. **Export types** in `apps/api/src/types.ts`:

```typescript
export type { Entity, CreateEntity, UpdateEntity } from './entities/schema';
```

6. **Add migration** in `apps/api/migrations/{timestamp}_entities.sql`:

```sql
CREATE TABLE IF NOT EXISTS entities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Error Handling

Use custom error classes from `src/errors.ts`:

```typescript
import { NotFoundError, ValidationError } from '../errors';

if (!entity) {
  throw new NotFoundError('Entity not found');
}
```

### Testing

Write integration tests in `apps/api/tests/{domain}/` using Bun test:

```typescript
import { describe, expect, test } from 'bun:test';
import { createElysiaApplication } from '../../src/application';
import EntityService from '../../src/entities/service';

describe('/entities', async () => {
  const app = await createElysiaApplication();

  test('returns list of entities', async () => {
    const response = await app.handle(new Request('http://localhost/entities'));
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toBeArray();
  });
});
```

## Frontend Patterns (`apps/web`)

### Architecture: Components → Composables → Stores → API Client

```
apps/web/src/
├── api/
│   ├── client.ts           # Fetch wrapper
│   ├── entities.ts         # API endpoint functions
│   └── useEntities.ts      # TanStack Query composables
├── components/
│   ├── EntityCard.vue      # UI components
│   └── modal/
│       └── modals/
│           └── EntityModal.vue
├── composables/
│   └── useModal.ts         # Modal system
├── stores/
│   └── modal.ts            # Pinia stores
└── views/
    └── Dashboard.vue
```

### Example: Adding a New Domain to Frontend

1. **Create API functions** in `apps/web/src/api/entities.ts`:

```typescript
import client from './client';
import type { Entity, CreateEntity, UpdateEntity } from '@puck/api';

export const entityApi = {
  listAll: () => client.get<Entity[]>('/entities'),
  get: (id: number) => client.get<Entity>(`/entities/${id}`),
  create: (data: CreateEntity) => client.post<CreateEntity, Entity>('/entities', data),
  update: (id: number, data: UpdateEntity) =>
    client.put<UpdateEntity, Entity>(`/entities/${id}`, data),
  delete: (id: number) => client.delete(`/entities/${id}`),
};
```

2. **Create TanStack Query composable** in `apps/web/src/api/useEntities.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { entityApi } from './entities';

export function useEntities() {
  return useQuery({
    queryKey: ['entities'],
    queryFn: entityApi.listAll,
  });
}

export function useEntity(id: number) {
  return useQuery({
    queryKey: ['entities', id],
    queryFn: () => entityApi.get(id),
  });
}

export function useCreateEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entityApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entities'] }),
  });
}

export function useUpdateEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEntity }) => entityApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entities'] }),
  });
}

export function useDeleteEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: entityApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entities'] }),
  });
}
```

3. **Create component** in `apps/web/src/components/EntityCard.vue`:

```vue
<script setup lang="ts">
import { useEntities, useDeleteEntity } from '@/api/useEntities';
import { useModal } from '@/composables/useModal';

const { data: entities, isLoading } = useEntities();
const deleteEntity = useDeleteEntity();
const { openDeleteModal } = useModal();

async function handleDelete(id: number, name: string) {
  const result = await openDeleteModal({ itemName: name, itemType: 'entity' });
  if (result?.confirmed) {
    deleteEntity.mutate(id);
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Entities</h2>
      <div v-if="isLoading">Loading...</div>
      <ul v-else>
        <li v-for="entity in entities" :key="entity.id">
          {{ entity.name }}
          <button @click="handleDelete(entity.id, entity.name)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>
```

### Modal System

See `apps/web/src/components/modal/README.md` for detailed modal system documentation.

### Form Validation

Use the `useFormValidation` composable for client-side validation:

```typescript
import { useFormValidation } from '@/composables/useFormValidation';

const formData = ref({ name: '' });
const schema = { name: { required: true, minLength: 3 } };
const { validateField, getError, validateAll } = useFormValidation(schema, formData);
```

### Testing

Write tests in `apps/web/src/` using Vitest:

```typescript
import { describe, test, expect } from 'vitest';

describe('MyComponent', () => {
  test('renders correctly', () => {
    // Test implementation
  });
});
```

## Type Sharing

Type safety is maintained across the stack:

1. Define types in `apps/api/src/{domain}/schema.ts` using Elysia types
2. Export them in `apps/api/src/types.ts`
3. Import in frontend: `import type { Entity } from "@puck/api"`

## Linting & Type Checking

Run these commands before committing:

```bash
bun run lint               # Check all lint rules
bunx tsc --noEmit          # Type check
```

## Existing Domains

Study these for complete examples:

- **Coffees**: `apps/api/src/coffees/` and `apps/web/src/api/coffees.ts`
- **Equipment**: `apps/api/src/equipment/` and `apps/web/src/api/equipment.ts`
- **Extractions**: `apps/api/src/extractions/` and `apps/web/src/api/extractions.ts`

## Key Conventions

- **Database queries**: Use parameterized queries to prevent SQL injection
- **Error responses**: Return `{ error: string }` format
- **HTTP status codes**: Use appropriate codes (201 for create, 204 for delete, 404 for not found)
- **Vue components**: Use `<script setup lang="ts">` syntax
- **API client**: Always use the wrapper in `apps/web/src/api/client.ts`
- **Query invalidation**: Invalidate relevant queries after mutations
- **Type safety**: Never use `any` - leverage TypeScript strict mode
