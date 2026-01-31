# Trellnode

A Trello-inspired task management application built with Next.js. Organize work with boards, lists, and cards—all in one place.

## Features

- **Authentication** — Sign in with email/password or Google OAuth (NextAuth.js)
- **Boards** — Create boards with custom cover images from Unsplash
- **Lists & Cards** — Organize tasks in drag-and-drop lists
- **Real-time ordering** — Reorder lists and cards with @hello-pangea/dnd
- **Responsive UI** — Works on desktop and mobile (Radix UI + Tailwind CSS)

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | Next.js 14 (App Router)              |
| Database     | PostgreSQL (Neon) + Prisma          |
| Auth         | NextAuth.js (JWT, credentials, Google) |
| Styling      | Tailwind CSS, Radix UI              |
| Drag & Drop  | @hello-pangea/dnd                   |
| Images       | Unsplash API, Next/Image            |
| Testing      | Jest, Playwright, Testing Library   |

## Project Structure

```
trellnode/
├── app/
│   ├── (marketing)/          # Landing, sign-in (public)
│   │   ├── _components/
│   │   ├── signin/
│   │   └── page.tsx
│   ├── (platform)/           # Protected app (boards, workspace)
│   │   └── (dashbaord)/
│   │       ├── boards/       # Board list & board detail
│   │       ├── workspace/
│   │       └── _components/
│   └── api/
│       ├── auth/[...nextauth]/
│       └── unsplash/
├── actions/                  # Server actions (CRUD for boards, lists, cards)
├── components/               # Shared UI components
├── lib/                      # DB, Unsplash, utils
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/                    # Playwright e2e tests
└── hooks/
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- PostgreSQL database (e.g. [Neon](https://neon.tech))

### 1. Clone and install

```bash
git clone <repo-url>
cd trellnode
pnpm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
# Database (Neon: use pooled for app, direct for migrations)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/db?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Unsplash (for board cover images)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=""
UNSPLASH_ACCESS_KEY=""   # or NEXT_PUBLIC_UNSPLASH_ACCESS_KEY for API route

# E2E tests (optional)
TEST_USER="test@example.com"
TEST_PW="your-test-password"
```

### 3. Database setup

```bash
pnpm prisma migrate deploy
pnpm prisma generate
```

### 4. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start dev server                     |
| `pnpm build`   | Production build                     |
| `pnpm start`   | Start production server              |
| `pnpm lint`    | Run ESLint                           |
| `pnpm test`    | Run Jest unit tests                  |
| `pnpm test:e2e`| Run Playwright e2e tests             |
| `pnpm cypress:open` | Open Cypress (if configured)   |

## Database

Prisma is configured for **Neon** PostgreSQL:

- **DATABASE_URL** — Pooled connection for the app (used by Prisma client)
- **DIRECT_URL** — Direct connection for migrations and Prisma CLI

The schema includes `User`, `Board`, `List`, and `Card` models with appropriate relations and cascades.

## Authentication

- **Credentials** — Email + password (bcrypt). Sign up via the sign-in page.
- **Google OAuth** — Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to enable.
- Protected routes: `/boards`, `/board/*` (NextAuth middleware).
- Session strategy: JWT.

## Testing

### Unit tests (Jest)

```bash
pnpm test
pnpm test:watch   # Watch mode
```

### E2E tests (Playwright)

```bash
pnpm exec playwright install   # First-time: install browsers
pnpm test:e2e
```

The sign-in e2e test uses `TEST_USER` and `TEST_PW` from `.env`. Ensure the test user exists in the database.

## Deployment

1. Set environment variables in your hosting provider.
2. Run migrations: `pnpm prisma migrate deploy`
3. Build: `pnpm build`
4. Start: `pnpm start`

For Vercel, use the Neon serverless driver and configure `DATABASE_URL` and `DIRECT_URL` accordingly.

## License

Private.
