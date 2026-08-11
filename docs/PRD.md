# ApnaNest — Product Requirements Document (PRD)

**Status:** Draft v0.1 — iterate before locking
**Owner:** Dwarkesh
**Last updated:** 2026-04-28

---

## 1. Vision

A trusted, beautifully designed real-estate discovery platform for Indian buyers, tenants, and owners — where finding (or listing) the right home feels emotional and effortless, not transactional and frustrating.

**Tagline candidates:**
- *"Apna Nest. Apna Sapna."* (Our Nest. Our Dream.)
- *"Where homes find people."*
- *"Find the place where life happens."*

---

## 2. The problem we're solving

| Existing pain | How ApnaNest answers it |
|---|---|
| 99acres / MagicBricks listings dominated by brokers spamming the same property 5×, often fake | **Verified listings**, owner-direct toggle, fraud reporting, "zero brokerage" filter |
| Search returns junk because filters are weak | Smart filters: lifestyle (pet-friendly, vegetarian-only society, women-only PG), commute-time, micro-localities |
| UI feels dated and ad-stuffed | Minimal, premium, animation-led design — Airbnb-grade polish |
| No emotional connection — homes shown like commodities | Hero illustrations of real Indian families, locality stories, "first home" badges |
| Mobile-second; most sites have heavy mobile experiences | **Mobile-first**, sub-2-second LCP, offline-tolerant search |

---

## 3. Personas

### 🧑 **Aarav — The First-Time Buyer** (28, Software Engineer, Pune)
- Wants a 2BHK under ₹60L, near IT corridor.
- Frustrated by broker calls within 30 seconds of registering anywhere.
- Needs: home loan EMI calculator, locality reviews, comparable price data.
- Spends 6+ months researching; saves 40+ properties.

### 👨‍👩‍👧 **Priya — The Renter** (32, Marketing Manager, Bangalore)
- Relocating with family. Needs 3BHK, family society, near good schools.
- Hates virtual visits — wants real photos, not staged.
- Needs: rent receipt generator, verified-owner badge, school proximity.

### 🏘 **Rajesh — The Owner/Broker** (45, owns 3 flats in Ahmedabad)
- Wants to list quickly with minimum hassle.
- Needs: lead notifications, dashboard with view counts, easy photo upload.
- Will pay for premium placement if ROI is clear.

### 🛡 **Aditi — The Admin** (internal)
- Moderates listings, bans fraudsters, handles disputes.
- Needs: queue UI, bulk actions, audit log, fraud-pattern detection.

---

## 4. User journeys (key flows)

### 4.1 Discovery (anonymous)
1. Lands on home page → sees hero with locality search.
2. IP-detected city ("Looking for homes in Ahmedabad?") with toggle to change.
3. Browses *Top picks*, *Trusted developers*, *News*.
4. Clicks property → can view details, photos, map without login.
5. Hits paywall actions: **Save**, **Contact owner**, **Schedule visit** → prompted to sign up.

### 4.2 Search & shortlist
1. Search bar: locality / landmark / project / builder name.
2. Results page: split view (list left, map right on desktop).
3. Filters: type (Buy/Rent/PG/Commercial), BHK, budget, area, amenities, posted-by-owner toggle, verified toggle.
4. Save to shortlist, set alert for new matches.

### 4.3 Owner posts property
1. "Post Property" CTA in nav (visible to all, but flow gates at login).
2. Wizard: Type → Location (map pin + address autocomplete) → Details (BHK, area, age) → Amenities → Photos (min 3, max 20) → Pricing → Review → Publish.
3. Listing goes to admin moderation queue (V1) or auto-publishes with later moderation (MVP).
4. Owner dashboard: views, saves, contacts, edit, mark-as-rented/sold.

### 4.4 Contact / lead generation
1. Buyer clicks "Contact Owner" on listing.
2. Modal: confirm phone, send message, optional schedule visit.
3. Owner gets notification (email + SMS in V1, just email in MVP).
4. Both sides see the lead in their dashboard.
5. Owner can mark lead as "responded / not interested / closed".

### 4.5 Fraud reporting
1. Any user can hit "Report this listing" on a property page.
2. Categories: fake photos, wrong price, broker posing as owner, property doesn't exist, other.
3. Listing flagged in admin queue; auto-hidden after 3 reports (configurable).

---

## 5. Feature inventory

### Public / unauthenticated
- [x] Home page with hero, top picks, trusted developers, news
- [x] Browse listings (buy/rent/PG/commercial/plots)
- [x] Property detail page (photos, map, amenities, owner card)
- [x] Search with filters + map view
- [x] Static pages: About, Contact, Terms, Privacy, Refund
- [x] EMI calculator (anonymous-usable)
- [x] Property value calculator (anonymous-usable)
- [x] Rent receipt generator (anonymous-usable)
- [x] News & guides section
- [x] Locality pages (SEO)

### User / Buyer / Tenant (authenticated)
- [x] Saved properties
- [x] Contacted properties
- [x] Recently viewed
- [x] Recent searches (with re-run)
- [x] Saved searches with email/SMS alerts (V1)
- [x] Profile & settings (phone, email, preferences)
- [x] Report a fraud
- [x] My transactions (V2 — when payments exist)
- [x] Zero-brokerage filter / view

### Owner / Broker
- [x] Post property wizard
- [x] My listings dashboard
- [x] Lead inbox (who contacted you)
- [x] Listing analytics (views, saves, contacts over time)
- [x] Edit / mark sold-rented / delete
- [x] Subscription / premium placement (V2)
- [x] Verified badge flow (V1 — KYC)

### Admin
- [x] Moderation queue (pending listings)
- [x] User management (ban, verify)
- [x] Fraud reports queue
- [x] Content management (news, guides, banners)
- [x] Locality / city / project master data
- [x] Analytics dashboard

### Cross-cutting
- [x] Sticky nav with mega-menu hover dropdowns: For Buyers, For Tenants, For Sellers, Services, News & Guide
- [x] Footer mega-nav: For Buyers, For Tenants, Projects, Popular Cities, Popular Searches
- [x] Social: Instagram, LinkedIn, YouTube icons
- [x] Mobile bottom nav (Search, Saved, Post, Inbox, Profile)
- [x] Notification bell (in-app)
- [x] Dark mode (optional V1)
- [x] i18n: English + Hindi (V1), Gujarati / Marathi later

---

## 6. Non-functional requirements

| Category | Requirement |
|---|---|
| **Performance** | LCP < 2.0s on 4G, TTI < 3.5s, CLS < 0.1. Property detail pages must be SSG/ISR. |
| **SEO** | Server-rendered or static HTML for all public pages. Schema.org `RealEstateListing`. Sitemap auto-generated. Open Graph + Twitter cards. |
| **Accessibility** | WCAG 2.1 AA. Keyboard navigation, screen reader labels, color contrast 4.5:1+. |
| **Security** | OWASP Top 10. JWT with httpOnly cookies. Rate limiting. CAPTCHA on contact + signup. CSP headers. No PII in URLs. |
| **Scalability** | Stateless API. Horizontal scaling. CDN for static assets and images. |
| **Reliability** | 99.5% uptime target. Health checks. Graceful degradation if maps/search down. |
| **Privacy** | DPDPA 2023 compliance (India's data protection law). Consent banners, data export, account deletion. |
| **Mobile** | Responsive, mobile-first. Works on 360px width. Touch targets ≥44px. |
| **Browser support** | Chrome / Safari / Firefox / Edge — last 2 versions. |
| **i18n** | Built with i18next from day 1, even if only English shipped initially. |

---

## 7. Success metrics (what "good" looks like)

| Metric | MVP target | V1 target |
|---|---|---|
| Monthly active users | 500 | 10,000 |
| Listings live | 200 | 5,000 |
| Median time-to-first-contact (buyer) | < 5 min | < 2 min |
| Listing-to-lead conversion | 2% | 5% |
| Page load LCP (p75) | < 2.5s | < 2.0s |
| SEO: indexed pages | 500 | 50,000 |
| Bounce rate (home page) | < 60% | < 45% |

---

## 8. Out of scope (V1)

- Mobile native apps (web is mobile-responsive)
- Payments / online transactions
- Document e-signing
- Virtual / 3D tours
- AI chatbot for support
- Multi-country support
- API for third-party developers
- White-label / B2B partnerships

---

## 9. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Listing supply cold-start | High | Seed with scraped *publicly available* listings (legal review!), partner with local brokers in Ahmedabad first |
| Fake listings damaging trust | High | Moderation queue + community reporting + owner KYC in V1 |
| Google Maps cost explosion | Medium | Start on Mapbox or MapLibre; monitor usage; cache static map tiles |
| SEO not ranking against incumbents | High | Hyper-local strategy: "2 BHK in Bopal Ahmedabad" long-tail before competing for "flats in Mumbai" |
| Solo dev burnout / scope creep | High | Strict MVP cut. No V2 features until MVP is in users' hands. |
| Legal: real estate listing regulations | Medium | Consult RERA expert before going live. Publish disclaimers. |
