---
name: apnanest-feature-builder
description: Build features for the ApnaNest real estate platform end-to-end (backend command/query + endpoint + frontend page/component + tests + mock data) following the project's Clean Architecture and Next.js 15 conventions. Use this skill whenever the user asks to add, modify, or extend any feature on ApnaNest — whether it's a new property field, a new search filter, a new admin tool, a new dashboard widget, a new API endpoint, or a new page. Also use when reviewing whether an existing feature follows project conventions, or when asked to "scaffold" or "stub" a feature. Trigger this even when the user just says things like "add a fraud report flow" or "let me filter by RERA status" without explicitly mentioning ApnaNest.
---

# ApnaNest Feature Builder

A skill for building production-quality features on ApnaNest end-to-end, respecting the project's locked architecture decisions.

---

## When this skill applies

This skill governs **any work** that touches the ApnaNest codebase:
- Adding new endpoints
- Adding new pages or components
- Adding new database fields or tables
- Adding new search/filter capabilities
- Refactoring existing code
- Reviewing PRs against project conventions
- Generating mock data
- Writing tests for ApnaNest features

If the work is generic (not ApnaNest-specific) or the user explicitly steps outside the project's stack, this skill doesn't apply.

---

## The Golden Rule

**Read before writing.** Before producing code, always:
1. Read `CLAUDE.md` (project conventions)
2. Read the relevant prompt file in `docs/prompts/` (frontend, backend, etc.)
3. Read at least one existing implementation of a similar feature in the codebase
4. Cross-check against `docs/PRD.md` for what's actually in scope
5. Cross-check against `docs/DATABASE_SCHEMA.md` for entities involved

If any of those files contradict each other, **ask the user** which to follow before proceeding.

---

## Workflow for adding a feature

Follow this sequence. Each step has a checkpoint — if it fails, don't proceed.

### Step 1 — Clarify scope (always)

Ask the user (one consolidated message, max 4 questions):
- What's the user-facing goal?
- Which persona is this for? (User / Owner / Admin)
- MVP or V1+? (affects how much polish to add)
- Is this a known scope item from PRD, or net-new? If net-new, should we add it to PRD first?

**Don't skip this even if the request seems clear.** Indian real estate has 50 ways to do anything; assumptions cost more than asking.

### Step 2 — Plan the change

Produce a written plan **before any code** with these sections:

```
## Plan: <feature name>

### Affected layers
- [ ] Database (new tables / columns / migrations)
- [ ] Domain (new entities / value objects / domain events)
- [ ] Application (new commands / queries / validators)
- [ ] Web (new endpoints / authorization)
- [ ] Frontend types
- [ ] Frontend hooks
- [ ] Frontend components
- [ ] Frontend pages / routes
- [ ] Mock data
- [ ] Tests
- [ ] Docs (PRD / architecture / schema)

### Files to create
- `path/to/new/file.ts` — [purpose, ~XX lines]
- ...

### Files to modify
- `path/to/existing/file.ts` — [what changes]
- ...

### Migration plan (if DB changes)
- Forward: ...
- Rollback: ...
- Data backfill: ...

### Open questions for user
- ...

### Estimated diff size
~XXX lines across YY files
```

**Wait for user approval** of the plan before moving to step 3. Even if they said "go ahead and build it" earlier, present the plan once and confirm.

### Step 3 — Build in order: Backend → Frontend → Tests → Docs

**Backend order (strict)**:
1. Domain entity / value object changes
2. EF Core configuration + migration
3. Application command/query (DTO, validator, handler) — one at a time
4. Endpoint(s) in controller
5. Backend tests (handler unit + endpoint integration)

**Frontend order (strict)**:
1. Type definitions
2. API endpoint constant + wrapper
3. TanStack Query hook
4. Mock handler (MSW) + mock JSON data
5. Component(s) — leaf to root
6. Page wiring
7. Frontend tests

**Docs**: Update PRD if scope changed, update DATABASE_SCHEMA if schema changed, update CLAUDE.md if a convention was established or modified.

After each phase, give the user a checkpoint: "Backend done. Files changed: X, Y, Z. Ready to move to frontend?"

### Step 4 — Final review

Before declaring done:
- [ ] Empty state, loading state, error state — all handled in UI
- [ ] Mobile responsive verified (mention this; user verifies)
- [ ] Accessibility check (keyboard, contrast)
- [ ] No `console.log`, no `any`, no `!` null-forgiving
- [ ] No hardcoded strings (i18n keys)
- [ ] Test coverage for happy path + 1 failure path minimum
- [ ] Docs updated where relevant

---

## Locked decisions — DO NOT renegotiate

These are settled. If the user asks "should we use X instead?", defer to the rationale in `docs/ARCHITECTURE.md` first; only deviate if the user explicitly overrides after seeing that rationale.

| Concern | Choice | Why locked |
|---------|--------|------------|
| Frontend framework | Next.js 15 (App Router) + React 19 + TS 5 | SEO needs SSR; Indian real estate is SEO-driven |
| Styling | Tailwind v4 + shadcn/ui | Speed, consistency |
| Server state | TanStack Query | De facto standard, mature |
| Client state | Zustand | Lighter than Redux, no boilerplate |
| Forms | React Hook Form + Zod | Best-in-class for complex forms |
| Maps | Mapbox GL | Cheaper than Google for India |
| Backend | ASP.NET Core 8 + Clean Arch | Matches user's strength, portfolio value |
| ORM | EF Core 8 + NetTopologySuite | Geo support critical |
| DB | PostgreSQL 16 + PostGIS | Open source, geo-strong |
| Cache | Redis | Standard |
| Auth | JWT RS256 + refresh cookie | Secure, well-understood |

---

## Conventions reference (TL;DR)

- **Naming**: see `CLAUDE.md` "Coding conventions"
- **File placement**: see `CLAUDE.md` "Where things go"
- **Endpoint addition**: see `CLAUDE.md` "How to add a new endpoint"
- **Page addition**: see `CLAUDE.md` "How to add a new page"
- **Always do / never do**: see `CLAUDE.md` "Things to ALWAYS / NEVER do"

When in doubt, **read `CLAUDE.md` again**. Don't pattern-match from your training data.

---

## Indian context — non-negotiable

- **Currency**: ₹ INR. Format with Indian numbering (lakhs/crores) for amounts ≥ ₹1L. Helper at `/lib/format/currency.ts`.
- **Phone**: +91 with 10-digit validation (regex: `^[6-9]\d{9}$`).
- **PAN**: `^[A-Z]{5}[0-9]{4}[A-Z]$`
- **GST**: `^\d{2}[A-Z]{5}\d{4}[A-Z]\d[A-Z\d]Z[A-Z\d]$`
- **PIN code**: 6 digits, `^[1-9]\d{5}$`
- **State list**: 28 states + 8 UTs, hardcoded in `/lib/constants/states.ts` — don't fetch this dynamically.
- **Date format**: DD MMM YYYY (e.g., "28 Apr 2026") — never US-style.
- **Timezone**: All timestamps stored UTC. Display in IST (Asia/Kolkata).
- **i18n**: English + Hindi at MVP. Don't pluralize blindly — Hindi has different rules.

---

## Common feature recipes

### Recipe A — Add a new searchable property field

Example: "Add `furnishing_status` field"

1. **Domain**: Add `FurnishingStatus` enum in `Domain/Enums/`. Add property to `Property` entity.
2. **EF**: Update `PropertyConfiguration`. Generate migration.
3. **Search**: Update `SearchPropertiesQuery` to accept `furnishing_status` filter (nullable). Update query handler with `.Where(p => filter == null || p.FurnishingStatus == filter)`.
4. **DTO**: Update `PropertyDto` and `PropertyDetailDto`.
5. **Frontend type**: Update `Property` type.
6. **Filter UI**: Add a chip or select to `PropertyFiltersBar`. Wire to URL state.
7. **Property detail UI**: Display the new field in the spec table.
8. **Owner form**: Add a select to the post-property wizard.
9. **Mock data**: Add the field to all properties in `/mocks/properties.json`.
10. **Tests**: Search filter test, form validation test.

### Recipe B — Add a dashboard widget

1. Define the data the widget needs.
2. If aggregated data: add a new query, e.g. `GetUserDashboardSummaryQuery`. If raw list: reuse existing.
3. Add hook: `useDashboardSummary()`.
4. Build component with loading + empty + error states.
5. Add to dashboard layout.
6. Mobile: ensure widget collapses gracefully.

### Recipe C — Add a new email notification

1. **Backend**: Add a Hangfire job in `Infrastructure/Jobs/`. Use a templating system (Razor templates).
2. **Trigger**: From the appropriate domain event handler (publish event, handler enqueues job).
3. **Templates**: HTML + plain-text. Bilingual (EN + HI).
4. **Test**: Unit test the templating, integration test the end-to-end.
5. **Settings**: Add a per-user toggle in profile settings (don't spam).

---

## Anti-patterns — flag immediately

If you see (or are about to write) any of these, **stop and refuse**:

- Two services calling each other's repositories directly (cross-feature coupling)
- A controller that contains business logic (push to handler)
- An entity that knows about EF Core or the DB (push to infrastructure)
- A React component that does data fetching with `useEffect`
- Inline SQL in handlers
- A query that runs `.ToList()` then filters in memory
- A migration that drops a column without a deprecation phase
- A frontend type that doesn't match the OpenAPI spec
- A controller endpoint missing `[Authorize]` (unless intentional + commented)
- Untyped any in TypeScript or `dynamic` in C# (almost always a smell)
- A user-supplied `userId` in a request body (always derive from JWT)

---

## When the user asks for "the whole thing"

Sometimes a request is huge ("build the post-property flow"). Don't try to one-shot it. Instead:

1. Acknowledge scope.
2. Decompose into phases (e.g., wizard scaffolding → step 1 details → step 2 photos → step 3 pricing → step 4 review/submit).
3. Build phase 1 fully (with checkpoint).
4. Continue phase 2.
5. Etc.

Communicate the plan upfront so the user can stop you if a phase isn't right.

---

## Output formatting

When generating code:
- Always include the full file path as a comment at the top: `// frontend/src/components/property/favorite-button.tsx`
- For partial changes, show only the diff with surrounding context (3 lines before/after)
- For new files, show the full content
- For migrations, show the generated migration file + the entity change side-by-side

When summarizing changes:
- Bullet list of files changed with one-line description each
- Note any breaking changes prominently
- Note any follow-up tasks created (TODOs, tech debt)

---

## Self-check before responding

Before sending any response:
- [ ] Did I read the relevant docs (CLAUDE.md + the prompt file for this layer)?
- [ ] Did I look at an existing similar feature for the pattern?
- [ ] Did I propose a plan before code (for non-trivial changes)?
- [ ] Did I respect locked decisions?
- [ ] Did I follow the Indian context conventions?
- [ ] Did I include all states (loading/empty/error) in any UI?
- [ ] Did I include tests?
- [ ] Did I avoid the anti-patterns list?

If any "no" — fix the response before sending.

---

## Versioning this skill

When the project's conventions change materially, update this skill. Version bump: edit the description to reflect new triggers if needed. Major changes get a note at the top of this file.

**Last updated**: 28 April 2026 (initial version)
