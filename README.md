
# 📝 Pastebin Lite

A fast, secure, and ephemeral pastebin application built with **Next.js 15**, **Tailwind CSS**, and **Redis**.
Create self-destructing text pastes with optional expiration times and view limits.

**[View Live Demo](https://pastebin-lite-delta.vercel.app/)**

---

## ✨ Features

*   **Create Pastes**: Simple, clean interface to share text.
*   **Time-to-Live (TTL)**: Set pastes to expire automatically after a specific duration (seconds).
*   **View Limits**: Set pastes to "self-destruct" after a specific number of views.
*   **Secure & Atomic**: Uses Redis atomic operations (`HINCRBY`) to safely handle concurrent view counting.
*   **Premium UI**: Dark mode design with glassmorphism effects and responsiveness.
*   **API Support**: Full REST API for creating and retrieving pastes programmatically.

## 🚀 Getting Started

### Prerequisites

*   Node.js 18+
*   npm

### Local Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vamshi335235/pastebin-lite.git
    cd pastebin-lite
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment (Optional):**
    The app runs with **In-Memory Storage** by default (data lost on restart).
    To use **Redis** locally, create a `.env.local` file:
    ```bash
    cp .env.example .env.local
    ```
    Then add your Upstash/Redis credentials:
    ```env
    UPSTASH_REDIS_REST_URL="your-url-here"
    UPSTASH_REDIS_REST_TOKEN="your-token-here"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Architecture & Decisions

*   **Framework**: Next.js 15 (App Router) was chosen for its robust API route handling and server-side rendering capabilities.
*   **Styling**: Tailwind CSS v4 provides a highly maintainable, utility-first design system without runtime overhead.
*   **Persistence (Redis)**:
    *   **Upstash Redis** (`@upstash/redis`) is used for serverless-friendly HTTP-based Redis connections.
    *   **Data Model**: Pastes are stored as Redis Hashes (`paste:<id>`).
    *   **Concurrency**: View counts are incremented atomically using `HINCRBY` to ensure `max_views` constraints are strictly enforced even under load.
    *   **Expiry**: While Redis TTL is set for cleanup, application logic also validates `expires_at` timestamps to support deterministic testing.
*   **Testing**: The app supports a `TEST_MODE=1` environment variable to allow time-travel testing via the `x-test-now-ms` header.

## 📡 API Documentation

### 1. Create a Paste
**Endpoint**: `POST /api/pastes`

**Body**:
```json
{
  "content": "Hello World",
  "ttl_seconds": 60,    // Optional: Expires in 60s
  "max_views": 5        // Optional: Expires after 5 views
}
```

**Response**:
```json
{
  "id": "abc12345",
  "url": "https://.../p/abc12345"
}
```

### 2. Get Paste Metadata
**Endpoint**: `GET /api/pastes/:id`

**Response**:
```json
{
  "content": "Hello World",
  "remaining_views": 4,
  "expires_at": "2025-01-01T12:00:00Z"
}
```

### 3. Health Check
**Endpoint**: `GET /api/healthz`
**Response**: `{ "ok": true }`

---

Built for the **Pastebin-Lite Take-Home Assignment**.
