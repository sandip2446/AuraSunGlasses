# AuraSunGlasses

E-commerce platform for sunglasses with a customer storefront, vendor dashboard, and Node.js API backend.

## Project structure

| Directory | Description |
|-----------|-------------|
| `frontend/` | Customer-facing React + Vite storefront |
| `venderFrontend/` | Vendor dashboard (inventory, orders, reviews) |
| `backend/` | Express API with SQLite database |
| `database/` | SQLite database files (created at runtime) |

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
# Install all dependencies (root, frontend, backend, vendor)
npm run install-all
```

## Development

Run all services concurrently:

```bash
npm run dev
```

Or run individually:

```bash
npm run dev:frontend   # Customer storefront
npm run dev:backend    # API server
npm run dev:vendor     # Vendor dashboard
```

## Production build

```bash
npm run build
```

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Express, SQLite
- **Vendor app:** React, Vite, Axios
