# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Generate Prisma client + Next.js build
npm run lint         # ESLint
npx prisma db push   # Sync schema to database (no migrations)
npx prisma studio    # Database GUI on localhost:5555
```

## Architecture

Next.js 14 App Router family task management app. Google OAuth via NextAuth v4, Prisma ORM, Tailwind CSS, Resend for email.

**Data flow:** All mutations go through server actions in `src/app/actions.ts`. Every action calls `requireUser()` or `requireFamily()` for auth, then uses Prisma and calls `revalidatePath()`. There are no API routes for mutations — only server actions.

**Auth model:** NextAuth with PrismaAdapter. Session callback in `src/lib/auth.ts` enriches the session with `familyId` and `familyName`. The `signIn` event auto-accepts pending invitations. Middleware protects `/dashboard`, `/backlog`, and `/setup` routes.

**Database:** Prisma with PostgreSQL (`prisma/schema.prisma`). The schema is currently set to `postgresql` provider. For local dev with SQLite, change the provider and `DATABASE_URL` per `.env.example`. Use `npx prisma db push` (not migrate) to sync schema changes.

**Task model:** Tasks belong to a Family and have a `list` field ("priority" | "backlog"), `status` ("pending" | "done"), and `position` for ordering. Multi-assignee via `TaskAssignee` join table.

**Email reminders:** Vercel cron hits `/api/reminders/send` every 2 hours (configured in `vercel.json`). Email sending via Resend is best-effort — failures don't break the app.

**Path alias:** `@/*` maps to `./src/*`.

## Node Version

Node.js 24 (specified in `.tool-versions`).
