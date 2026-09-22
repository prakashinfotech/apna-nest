# ApnaNest — Technical Architecture

---

## 1. High-level architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            BROWSER / MOBILE                          │
│           Next.js 15 (RSC + Client) — React 19 — Tailwind v4         │
└────────────────┬─────────────────────────┬──────────────────────────┘
                 │ HTTPS                    │ HTTPS
                 │ (HTML / RSC)             │ (REST / JSON)
                 ▼                          ▼
        ┌────────────────┐         ┌──────────────────┐
        │  Vercel Edge   │         │   API Gateway    │
        │  (Next server) │         │ (NGINX / Cloud-  │
        │                │         │  flare worker)   │
        └────────┬───────┘         └────────┬─────────┘
                 │                          │
                 │   (BFF calls)            │
                 └──────────────┬───────────┘
                                ▼
                    ┌──────────────────────────┐
                    │   ASP.NET Core 8 Web API │
                    │   (Clean Architecture)   │
                    │  ┌────────────────────┐  │
                    │  │  Presentation      │  │  Controllers, Filters
                    │  │  Application       │  │  Use cases, MediatR
                    │  │  Domain            │  │  Entities, Rules
                    │  │  Infrastructure    │  │  EF Core, Email, Storage
                    │  └────────────────────┘  │
                    └────┬──────┬──────┬───────┘
                         │      │      │
              ┌──────────┘      │      └──────────┐
              ▼                 ▼                 ▼
        ┌──────────┐      ┌──────────┐      ┌──────────────┐
        │PostgreSQL│      │  Redis   │      │ Object Store │
        │+ PostGIS │      │ (cache + │      │ (R2 / S3)    │
        │          │      │  queues) │      │ Photos       │
        └──────────┘      └──────────┘      └──────────────┘

        ┌──────────────────────────────────────────────────┐
        │   External services: Mapbox, SendGrid, Twilio,   │
        │   Google OAuth, Razorpay (V2), Cloudflare CDN    │
        └──────────────────────────────────────────────────┘
```

---

## 2. Why this stack (decision log)

### Frontend: **Next.js 15 + React 19**
You asked for React 19. For a real-estate site, raw React 19 (Vite/CRA-style) would be a mistake — every property page needs to be indexable by Google with full content in the HTML. Next.js 15:
- Gives you React 19 + RSC (React Server Components) by default.
- App Router lets you mix static (homepage, locality pages), ISR (property detail, regenerated when listing updates), and client (search, filters) seamlessly.
- Built-in image optimization saves you 50%+ on image bandwidth.
- File-based routing matches mental model of a multi-page site.
- Great free tier on Vercel.

**If you really want pure React 19 (no Next.js):** use Vite + React Router 7 + `react-helmet-async`, and accept a permanent SEO disadvantage. Not recommended.

### Backend: **.NET 8 Web API (Clean Architecture)**
- You have 3.5 yrs production .NET — leverage your strength.
- Clean Architecture (Domain → Application → Infrastructure → Presentation) maps naturally to MediatR + CQRS.
- Excellent for portfolio: VW interview is .NET, this project demonstrates the same stack.
- Alternative considered: Node.js (Hono/Fastify) — single language with frontend, hot for indie devs. Skipping for career-fit reasons.

### Database: **PostgreSQL + PostGIS**
- Real estate is geo-first. "Properties within 2km", "On the metro line", "Inside this drawn polygon" — PostGIS handles all of these natively.
- Free, mature, EF Core has excellent Npgsql provider.
- SQL Server can do spatial too — use it if you have free licenses or want consistency, but PostGIS is more powerful and cheaper to host.

### Cache: **Redis**
- Session storage, rate limiting, hot search results, recently viewed listings.
- Use [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/) from .NET.

### Search evolution
| Phase | Tech | Why |
|---|---|---|
| MVP | Postgres `tsvector` + GIN index | Free, "good enough" for 10K listings |
| V1 | [Meilisearch](https://www.meilisearch.com/) | Fast, typo-tolerant, easy self-host |
| V2 | Elasticsearch / OpenSearch | Faceted search at scale, geo + text combined |

---

## 3. Frontend folder structure (Next.js 15 App Router)

```
apnanest-web/
├── app/                              # Next.js App Router root
│   ├── (marketing)/                  # Route group for public pages (no nav padding)
│   │   ├── page.tsx                  # Home
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── (app)/                        # Route group for app pages (with nav)
│   │   ├── layout.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── property/
│   │   │   └── [id]/page.tsx        # ISR
│   │   ├── locality/
│   │   │   └── [city]/[area]/page.tsx  # SSG for SEO
│   │   ├── post-property/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── saved/page.tsx
│   │   │   ├── contacted/page.tsx
│   │   │   ├── recent-searches/page.tsx
│   │   │   ├── my-listings/page.tsx
│   │   │   └── profile/page.tsx
│   │   └── tools/
│   │       ├── emi-calculator/page.tsx
│   │       ├── rent-receipt/page.tsx
│   │       └── property-value/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (admin)/
│   │   └── admin/...
│   ├── api/                          # Next.js Route Handlers (BFF, mock APIs)
│   │   └── mock/...
│   ├── globals.css
│   ├── layout.tsx                    # Root layout with providers
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── ui/                           # shadcn/ui primitives (Button, Input, etc.)
│   ├── layout/                       # Header, Footer, MegaMenu, MobileNav
│   ├── property/                     # PropertyCard, PropertyGallery, PropertyMap
│   ├── search/                       # SearchBar, FilterPanel, ResultsList
│   ├── forms/                        # PostPropertyWizard, ContactOwnerForm
│   ├── home/                         # HeroSection, TopPicks, TrustedDevs
│   ├── illustrations/                # SVG components: NestLogo, FamilyHero, EmptyState
│   └── motion/                       # Reusable Framer Motion wrappers
│
├── lib/
│   ├── api/
│   │   ├── client.ts                 # Axios/fetch wrapper with auth
│   │   ├── endpoints.ts              # All API endpoint constants
│   │   └── types.ts                  # API response types (generated from OpenAPI ideally)
│   ├── hooks/
│   │   ├── useProperties.ts          # TanStack Query hook
│   │   ├── useGeolocation.ts
│   │   └── useSavedSearches.ts
│   ├── stores/                       # Zustand stores
│   │   ├── auth-store.ts
│   │   └── filter-store.ts
│   ├── validators/                   # Zod schemas
│   │   ├── property.ts
│   │   └── auth.ts
│   ├── utils/
│   │   ├── format.ts                 # Currency (₹), area (sqft↔sqm), etc.
│   │   ├── seo.ts                    # generateMetadata helpers
│   │   └── analytics.ts
│   └── constants/
│       ├── cities.ts
│       └── amenities.ts
│
├── mocks/                            # MSW handlers + JSON data
│   ├── handlers.ts
│   ├── data/
│   │   ├── properties.json
│   │   ├── localities.json
│   │   ├── developers.json
│   │   ├── news.json
│   │   └── users.json
│   └── browser.ts
│
├── public/
│   ├── images/
│   ├── lottie/
│   └── icons/
│
├── styles/
│   └── globals.css                   # Tailwind directives + design tokens
│
├── types/
│   ├── property.ts
│   ├── user.ts
│   └── api.ts
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Key conventions
- **Route groups** `(marketing)`, `(app)`, `(auth)`, `(admin)` — different layouts without affecting URL.
- **Server Components by default**; mark `"use client"` only where you need state, effects, or browser APIs.
- **Colocate types** with feature folders, hoist shared types to `/types`.
- **All API calls go through `lib/api/client.ts`** — single source of auth, error handling, retry logic.
- **MSW intercepts in development** — when you swap mock JSON for real backend, only `next.config.ts` env changes.

---

## 4. Backend folder structure (.NET 8 Clean Architecture)

```
ApnaNest.Api/
├── src/
│   ├── ApnaNest.Domain/              # Pure C#, no dependencies
│   │   ├── Entities/
│   │   │   ├── Property.cs
│   │   │   ├── User.cs
│   │   │   ├── Locality.cs
│   │   │   ├── Lead.cs
│   │   │   └── ...
│   │   ├── ValueObjects/
│   │   │   ├── Price.cs              # value + currency
│   │   │   ├── Area.cs               # value + unit (sqft/sqm)
│   │   │   └── GeoLocation.cs
│   │   ├── Enums/
│   │   ├── Events/                   # Domain events
│   │   └── Exceptions/
│   │
│   ├── ApnaNest.Application/         # Use cases, no DB code
│   │   ├── Common/
│   │   │   ├── Behaviors/            # MediatR pipeline (Validation, Logging)
│   │   │   ├── Interfaces/           # IApplicationDbContext, IEmailService
│   │   │   └── Mappings/             # AutoMapper profiles
│   │   ├── Properties/
│   │   │   ├── Commands/
│   │   │   │   ├── CreateProperty/
│   │   │   │   │   ├── CreatePropertyCommand.cs
│   │   │   │   │   ├── CreatePropertyCommandHandler.cs
│   │   │   │   │   └── CreatePropertyCommandValidator.cs
│   │   │   │   └── UpdateProperty/...
│   │   │   └── Queries/
│   │   │       ├── GetPropertyById/
│   │   │       ├── SearchProperties/
│   │   │       └── GetFeaturedProperties/
│   │   ├── Users/...
│   │   ├── Leads/...
│   │   └── Admin/...
│   │
│   ├── ApnaNest.Infrastructure/      # DB, external services
│   │   ├── Persistence/
│   │   │   ├── ApplicationDbContext.cs
│   │   │   ├── Configurations/      # IEntityTypeConfiguration<T> for each entity
│   │   │   ├── Migrations/
│   │   │   └── Repositories/        # Only if needed beyond DbSet
│   │   ├── Identity/
│   │   │   ├── JwtTokenService.cs
│   │   │   └── UserManager extensions
│   │   ├── Services/
│   │   │   ├── EmailService.cs       # SendGrid
│   │   │   ├── SmsService.cs         # Twilio / MSG91
│   │   │   ├── StorageService.cs     # S3 / R2
│   │   │   └── GeocodingService.cs   # Mapbox / Google
│   │   ├── Search/
│   │   │   ├── PostgresSearchProvider.cs    # MVP
│   │   │   └── MeilisearchProvider.cs       # V1
│   │   └── Caching/
│   │       └── RedisCacheService.cs
│   │
│   └── ApnaNest.WebApi/              # Composition root
│       ├── Controllers/
│       │   ├── PropertiesController.cs
│       │   ├── AuthController.cs
│       │   └── ...
│       ├── Middleware/
│       │   ├── ExceptionHandlingMiddleware.cs
│       │   └── RequestLoggingMiddleware.cs
│       ├── Filters/
│       ├── Endpoints/                # Or use Minimal APIs grouped here
│       ├── Program.cs
│       └── appsettings.json
│
└── tests/
    ├── ApnaNest.Domain.UnitTests/
    ├── ApnaNest.Application.UnitTests/
    └── ApnaNest.WebApi.IntegrationTests/    # WebApplicationFactory
```

### Key patterns
- **CQRS via MediatR** — Commands write, Queries read. Each is a `record`.
- **Pipeline behaviors** — cross-cutting concerns (logging, validation, transactions) without polluting handlers.
- **Result pattern** — return `Result<T>` instead of throwing for expected failures.
- **Specification pattern** for complex EF queries (`Ardalis.Specification`).
- **No repositories on top of DbContext** unless they earn their keep — DbContext + IQueryable is fine.

---

## 5. API design

### Conventions
- **REST**, JSON, plural nouns: `/api/v1/properties`, `/api/v1/users/me`.
- **Versioned** in URL: `/api/v1/...`.
- **Pagination**: cursor-based for infinite scroll (`?cursor=abc&limit=20`), offset for admin tables.
- **Filtering**: query params (`?city=ahmedabad&type=rent&bhk=2`).
- **Sorting**: `?sort=-createdAt` (- for desc).
- **Errors**: RFC 7807 Problem Details (`type`, `title`, `status`, `detail`).
- **Auth**: `Authorization: Bearer <jwt>` header. Refresh token in httpOnly cookie.
- **Idempotency**: `Idempotency-Key` header for POST that creates resources.

### Sample endpoints (not exhaustive — see backend prompt for full list)
```
GET    /api/v1/properties?city=ahmedabad&type=rent&bhk=2&page=1
GET    /api/v1/properties/{id}
POST   /api/v1/properties              (auth: owner)
PATCH  /api/v1/properties/{id}         (auth: owner of listing)
DELETE /api/v1/properties/{id}         (auth: owner or admin)

GET    /api/v1/properties/search/geo?lat=23.02&lng=72.57&radiusKm=5

POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/me/saved-properties
POST   /api/v1/users/me/saved-properties/{propertyId}
DELETE /api/v1/users/me/saved-properties/{propertyId}

POST   /api/v1/leads                   (contact owner about property)
GET    /api/v1/leads                   (auth: my leads — sent or received)

POST   /api/v1/reports                 (report fraud)

GET    /api/v1/localities/popular?city=ahmedabad
GET    /api/v1/developers/trusted

GET    /api/v1/news?limit=6
```

---

## 6. Authentication & authorization

- **JWT access token** (15 min TTL) in `Authorization` header.
- **Refresh token** (30 day TTL, rotating) in httpOnly + Secure + SameSite=Strict cookie.
- **OTP login** via SMS for phone-first users (India trust signal).
- **Google OAuth** for fast signup.
- **Roles**: `User`, `Owner`, `Broker`, `Admin`. A user can be both User and Owner.
- **Policy-based authorization** in .NET (`[Authorize(Policy = "OwnerOnly")]`).
- **Resource-level checks**: only the listing owner or admin can edit/delete a property — done in handlers, not just controllers.

---

## 7. Caching strategy

| Cache key | TTL | Invalidate when |
|---|---|---|
| `property:{id}` | 10 min | Property updated/deleted |
| `properties:search:{hash}` | 5 min | New listing matches filter (lazy: just expire) |
| `localities:popular:{city}` | 1 hour | Daily cron rebuilds |
| `featured:home` | 30 min | Admin curates new featured list |
| `user:{id}:saved` | 5 min | User saves/unsaves |

Use Redis for distributed cache, `IMemoryCache` for per-instance hot paths.

---

## 8. Security checklist

- [ ] HTTPS everywhere, HSTS preload
- [ ] Strict CSP headers
- [ ] CORS allowlist (no `*`)
- [ ] Rate limiting (per-IP and per-user)
- [ ] Input validation with FluentValidation
- [ ] Output encoding (React handles by default)
- [ ] Parameterized queries (EF Core handles by default)
- [ ] Password hashing: ASP.NET Identity uses PBKDF2 by default; consider Argon2id
- [ ] JWT signed with RS256 (rotate keys quarterly)
- [ ] Refresh token rotation + revocation list
- [ ] CAPTCHA on signup, contact-owner, fraud-report
- [ ] File upload: MIME sniffing, size limits, virus scan (ClamAV)
- [ ] No secrets in code — Azure Key Vault / .env / Doppler
- [ ] Audit log for admin actions
- [ ] Privacy: data export + delete endpoints (DPDPA compliance)

---

## 9. Observability

- **Logging**: Serilog → Seq (dev) / Datadog or Grafana Loki (prod). Correlation IDs across HTTP boundary.
- **Metrics**: OpenTelemetry → Prometheus → Grafana. Track: request rate, error rate, p95 latency, DB query time, cache hit ratio.
- **Tracing**: OpenTelemetry distributed tracing, view in Jaeger or Honeycomb.
- **Frontend**: Vercel Analytics + Sentry for errors + PostHog or Plausible for product analytics.
- **Uptime**: BetterStack or UptimeRobot.

---

## 10. CI/CD

```yaml
GitHub repo
├── PR → run lint, type-check, unit tests, build
├── merge to main → deploy preview to Vercel + staging API
├── tag v* → deploy to production
└── nightly → run e2e (Playwright), security scan (Snyk), Lighthouse CI
```

---

## 11. Phasing checklist (architectural)

| Phase | Add | Skip |
|---|---|---|
| MVP | Mock API (MSW + JSON), no real backend yet | Redis, search service, OAuth, SMS |
| V1 | Real .NET backend, Postgres, JWT, basic search, S3 uploads | Elasticsearch, microservices, mobile apps |
| V2 | Meilisearch, Redis caching, OAuth, SMS, payments | Microservices (still!) |
| V3 | Maybe split admin / public / search into separate services | — |

**Resist microservices until you have load that justifies it.** Modular monolith with clean boundaries scales surprisingly far.
