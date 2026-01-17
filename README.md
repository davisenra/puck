# Puck

Puck is a self-hosted coffee logger application built as a monorepo. Users can store their brewing equipment, coffee beans, and extraction records.

## Tech Stack

- **Runtime**: Bun (JavaScript/TypeScript)
- **Backend Framework**: Elysia
- **Database**: SQLite
- **API Docs**: OpenAPI/Swagger at `/swagger`

## Getting Started

```bash
bun install
bun run dev
```

Open http://localhost:3000/ to access the API.

## Development

- `bun run dev` - Start all apps
- `bun run dev:api` - Start API in dev mode
- `bun run test:api` - Run API tests
- `bun run lint` - Check code formatting
