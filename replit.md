# ProjTrack - Project Submission Management System

## Overview

ProjTrack is a premium dark-mode multi-role academic project submission management platform with three distinct portals: Admin, Teacher, and Student.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/projtrack)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Animations**: framer-motion

## Architecture

- `artifacts/projtrack` — React+Vite frontend, preview path `/`
- `artifacts/api-server` — Express API server, preview path `/api`
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-client-react` — Generated React Query hooks
- `lib/api-zod` — Generated Zod validation schemas
- `lib/db` — Drizzle ORM schema and database client

## Design System

**Role-specific accent colors**:
- Admin: Orange (#F97316 → #FB923C)
- Teacher: Purple (#7C3AED → #A855F7)
- Student: Cyan/Blue (#06B6D4 → #3B82F6)

**Background**: Deep navy-black (#0A0A0F)
**Cards**: Glassmorphic (rgba(15, 23, 42, 0.85) + backdrop-blur)

## Portals

### Admin Portal
- Dashboard with system-wide stats
- User management (create/edit/delete users by role)
- Class management
- All projects view

### Teacher Portal
- Dashboard with pending reviews and class stats
- My Projects (create/manage)
- Submission review with grading
- Classes view

### Student Portal
- Dashboard with deadlines and feedback
- Browse open projects and submit
- My submissions with status tracking

## Demo Credentials

- **Admin**: ID `ADM0001` / password `admin123`
- **Teacher**: ID `TCH0001` / password `teacher123`
- **Student**: ID `STU0001` / password `student123`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Important Notes

- After running codegen, manually reset `lib/api-zod/src/index.ts` to only export from `./generated/api` (codegen generates bad exports)
- Session auth via signed cookies (`projtrack_session`)
- Passwords stored as plain text (demo only — use bcrypt in production)
