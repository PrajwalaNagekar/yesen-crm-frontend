# Yesen CRM Frontend

Admin panel frontend for Yesen CRM — login, Kanban inquiry pipeline with a
slide-in detail drawer, user management, and account settings. Built
against the `yesen-crm-backend` API.

## Stack

Vite + React 19 + Tailwind CSS v4 + React Router 7 + TanStack Query 5, all JavaScript (no TypeScript), package manager: **pnpm**.

- **Tailwind v4** via `@tailwindcss/vite` — no `tailwind.config.js`/PostCSS setup needed; theme tokens live in `src/index.css` under `@theme`.
- **TanStack Query** for all server state (board, inquiry detail, users) — handles caching/loading/error state and refetches automatically after mutations, instead of hand-rolled `useState`/`useEffect` data fetching.
- **ESLint** pinned to the 9.x line deliberately: `eslint-plugin-react`'s latest release (7.37.5) doesn't yet support ESLint 10's internal API changes (confirmed by actually running it — it crashes with `contextOrFilename.getFilename is not a function`). 9.39.5 is the actively-maintained 9.x release and works cleanly. Revisit this pin once `eslint-plugin-react` ships ESLint 10 support.
- Native HTML5 drag-and-drop for the Kanban board (no extra dependency).

## Structure

```
src/
  main.jsx / App.jsx     Entry point, route definitions
  api/                     One file per backend resource - thin fetch wrappers
    client.js                Base request helper: auth header injection, error normalization
  context/ + hooks/         AuthContext (session), useAuth, useInquiries/useUsers/usePipeline (React Query)
  routes/
    ProtectedRoute.jsx        Redirects to /login if unauthenticated; adminOnly flag for /users
  components/
    layout/                    Sidebar, AppLayout (header + collapsible sidebar shell)
    pipeline/                   KanbanBoard, KanbanColumn, InquiryCard, InquiryDrawer, TagBadge
    users/                       UserForm, UserList
    common/                       Avatar, Button, Input, Spinner, EmptyState
  pages/                     LoginPage, PipelinePage, UsersPage, SettingsPage
  utils/                     initials.js, colors.js (avatar gradients), format.js (currency/relative time)
```

## Setup

```bash
pnpm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend if not localhost:5000
pnpm dev                 # http://localhost:5173
```

Requires `yesen-crm-backend` running (see that project's README) with a seeded admin user (`pnpm seed:dev` there) and `CORS_ORIGINS` including `http://localhost:5173` (already set in its `.env.development.example`).

## Scripts

```bash
pnpm dev            # dev server
pnpm build           # production build to dist/
pnpm preview          # serve the production build locally
pnpm lint / lint:fix
pnpm format / format:check
```

## Design decisions worth knowing

- **User management is role-based only** (`admin` / `staff`), matching what the backend actually stores. The reference screenshots showed a granular per-section/per-action permission checklist (move stages, edit details, delete, etc.) — the backend has no data model for that, so rather than build a checklist UI that doesn't do anything, the Users page only exposes what's real: name, username, temporary password, and role. If granular permissions become a real requirement, that's a backend schema change first (a `permissions` array on `User`, checked in middleware) — happy to build the UI once that exists.
- **Two small backend additions were made to support this UI** (see `yesen-crm-backend`'s README): `PATCH /auth/password` (self-service password change, for Settings) and a `value` field on `Inquiry` (for the dollar amounts on cards) — neither existed before this frontend needed them.
- **Document downloads** go through `fetch` + blob, not a plain `<a href>`, because the endpoint requires the `Authorization` header, which a browser won't attach to a normal link click.
- **Mutations invalidate-and-refetch** rather than optimistic-update the cache directly. Simpler and correct for this data size; if the board grows large enough that refetch latency is noticeable, optimistic updates in `useInquiries.js` are the next step.

## Verified

- `pnpm build` succeeds (production bundle, no resolution errors)
- `pnpm lint` and `pnpm format:check` both clean
- Full manual audit of every frontend API call against the actual backend routes, request/response shapes, and Mongoose field names — all consistent
- Built app confirmed serving correctly via `pnpm preview`

**Not verified in this environment**: an actual browser click-through against a live backend + MongoDB. This sandbox has no local `mongod` and can't download one (network restrictions), so the backend can't fully boot here. Run both projects locally (`pnpm dev` in each, with the backend seeded) to do that pass yourself — the API contract audit above is the strongest confidence available without it.
