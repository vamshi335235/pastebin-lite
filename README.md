
# Pastebin Lite

A fast, secure, and ephemeral pastebin application built with Next.js and Tailwind CSS.
Supports optional Time-to-Live (TTL) and View Count constraints.

## Features

- **Create Paste**: Share text snippets easily.
- **Constraints**:
  - **TTL**: Pastes automatically expire after a set time.
  - **View Limit**: Pastes self-destruct after N views.
- **Secure**: Content is rendered safely.
- **API First**: Full REST API support.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run local development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

### Persistence

The application is designed to run in a serverless environment (Vercel).
It supports **Vercel KV (Redis)** for persistence.

- **Production/Serverless**: Set `KV_REST_API_URL` and `KV_REST_API_TOKEN` environment variables.
- **Local Development**: If Redis environment variables are missing, the app falls back to **In-Memory Storage**. 
  > **Note**: In-memory data is lost when the server restarts. To use Redis locally, provide the environment variables in `.env.local`.

### Design Decisions

- **Framework**: Next.js 15 (App Router) for server-side rendering and API routes.
- **Styling**: Tailwind CSS for modern, responsive, and maintainable styles.
- **Storage Strategy**:
  - Redis Hash is used to store paste metadata.
  - `HINCRBY` is used for atomic view counting to prevent race conditions.
  - TTL is handled via logic (comparing `expires_at`) to support deterministic testing (`x-test-now-ms`), with Redis native TTL as a garbage collection backup.
- **Deterministic Testing**: Respects `x-test-now-ms` restricted header when `TEST_MODE=1` is enabled.

## API Documentation

### Create Paste
`POST /api/pastes`
Body: `{ "content": "string", "ttl_seconds": number?, "max_views": number? }`

### Get Paste (API)
`GET /api/pastes/:id`

### Health Check
`GET /api/healthz`
