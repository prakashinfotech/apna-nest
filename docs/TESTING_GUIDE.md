# ApnaNest — Complete Testing Guide
> Version: 30 Apr 2026 | Environment: Windows + Supabase + Next.js 16 + .NET 9

---

## 1. ENVIRONMENT SETUP (Do This First)

### Step 1 — Database (Supabase)
Run these SQL files in order in **Supabase SQL Editor**:
```
1. apnanest_seed.sql            → Creates schema + 20 properties
2. apnanest_alter_properties.sql → Patches missing columns + creates vw_properties
3. apnanest_fixes.sql           → Fixes states/localities/users column errors
4. apnanest_more_properties.sql → Adds 30 more properties (50 total)
```
After each script, verify the final `SELECT` shows sensible counts.

### Step 2 — Environment File
Create `f:\claude_houseing\apnanest\frontend\.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_USE_MSW=false
```

### Step 3 — Start Backend
```powershell
cd f:\claude_houseing\apnanest\backend
dotnet run --project src/ApnaNest.Web
# → runs on http://localhost:5001
# → Swagger at http://localhost:5001/swagger/index.html
```

### Step 4 — Start Frontend
```powershell
cd f:\claude_houseing\apnanest\frontend
npm run dev
# → http://localhost:3000
```

### Step 5 — Create Real Test Users
Use the Swagger UI or curl to create accounts with real hashed passwords:
```bash
# Owner account
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@test.com","password":"Test@1234","firstName":"Rajesh","lastName":"Kumar","phone":"+919876500000","isOwner":true}'

# Buyer account  
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer@test.com","password":"Test@1234","firstName":"Priya","lastName":"Sharma","phone":"+919876500001","isOwner":false}'
```

---

## 2. FEATURE TESTING CHECKLIST

### ✅ A. Home Page (http://localhost:3000)

| Feature | How to Test | Expected |
|---|---|---|
| Hero section loads | Visit `/` | Background image, search tabs visible |
| Search suggestions | Type "Bopal" in search box | Dropdown appears with matching localities |
| Tab switch | Click Rent → Plot → PG tabs | Trending chips change dynamically |
| Featured properties | Scroll to "Featured Properties" | 6 properties from DB (not hardcoded) |
| Localities section | Scroll to "Top Localities" | Cards from DB via API |
| Stats | Check 50,000+ count | Static — update if DB is live |
| Footer links | Click any footer link | Navigates to correct page |

### ✅ B. Search Page (http://localhost:3000/search)

| Feature | How to Test | Expected |
|---|---|---|
| Initial load | Visit `/search` | Properties load from API within 2s |
| Type filter | Click Rent tab | Results change to rental properties |
| Text search | Type "Koramangala" | Shows Koramangala properties only |
| Debounce | Type quickly | API called after 400ms pause, not on every keystroke |
| BHK filter | Select "2" from sidebar | Only 2BHK properties shown |
| Price range | Set min ₹50L, max ₹1Cr | Filtered results |
| Zero brokerage toggle | Enable toggle | Only zero-brokerage listings |
| Sort | Select "Price: High to Low" | Properties re-sorted |
| Map view | Click Map button | MapLibre map loads with price markers |
| Map popup | Click a price marker | Property card popup appears |
| Loading state | Slow network test | Skeleton cards appear while loading |
| No results | Filter for impossible combo | "No properties found" message |
| Clear filters | Click "Clear all" chip | Filters reset, all properties return |
| Mobile filters | Resize to mobile width | Filter drawer button appears |
| Mobile drawer | Click filters on mobile | Drawer slides in from right |

### ✅ C. Property Detail (http://localhost:3000/property/[id])

| Feature | How to Test | Expected |
|---|---|---|
| Page loads | Click any property card | Detail page loads with DB data |
| Image gallery | Click main image chevrons | Slides to next/previous image |
| Thumbnail | Click thumbnail | Main image changes |
| All images count | Check bottom-right counter | Shows "2 / 4" etc |
| View count | Load page | view_count increments in DB |
| Save/Heart button | Click heart | Turns red, saves to DB (if logged in) |
| Unauthenticated save | Not logged in, click heart | Optimistic update (no error shown, silently fails API) |
| Share button | Click share | Browser share dialog (or copy) |
| Overview tab | Click Overview | Furnishing, facing, floor info visible |
| Amenities tab | Click Amenities | Amenity badges shown |
| Location tab | Click Location | Map placeholder or MapLibre |
| EMI tab | Click EMI | Sliders functional, EMI updates |
| EMI calculation | Move loan slider | Monthly EMI recalculates correctly |
| Enquiry form | Fill name + phone, submit | "Enquiry Sent!" success state appears |
| Enquiry validation | Submit empty form | Button stays disabled |
| Phone reveal | Click "View Phone Number" | Phone number revealed |
| Similar properties | Scroll to bottom | 3-4 similar properties loaded |
| Breadcrumb | Check breadcrumb trail | Home > City > Locality > Title |
| RERA badge | Check if property has RERA | Green badge + RERA number shown |

### ✅ D. Auth (Login/Signup Modal)

| Feature | How to Test | Expected |
|---|---|---|
| Login modal opens | Click "Login" in navbar | Modal slides up |
| OTP tab | Default tab is OTP | Phone input visible |
| Email tab | Click "Email" subtab | Email + password fields |
| Send OTP | Enter phone, click Send | "Verify & Login" button appears |
| Email login | Use owner@test.com / Test@1234 | Login succeeds, modal closes |
| Google button | Click Google | OAuth placeholder (not implemented) |
| Sign up tab | Click "Sign Up" | Name, email, phone, password fields |
| Buyer/Owner toggle | Switch to Owner | Creates owner account |
| Close modal | Click X or outside | Modal closes |
| /login redirect | Visit /login directly | Redirects to home, opens modal |
| /signup redirect | Visit /signup directly | Redirects to home, opens signup |

### ✅ E. Post Property (http://localhost:3000/post-property)

| Feature | How to Test | Expected |
|---|---|---|
| Step 1 | Select "Sell" + "Apartment" + "3 BHK" | Can proceed to step 2 |
| Step 2 | Fill city, locality, address | Step 3 enabled |
| Step 3 | Fill title, area | Step 4 enabled |
| Step 4 | Fill price | Step 5 enabled |
| Step 5 | Upload area visible | Drag-drop zone shown |
| Validation | Click Next without filling | Next button disabled |
| Progress bar | Each step | Step indicator fills |
| Submit | Complete all steps | Success screen shown |

### ✅ F. Dashboard

| Feature | How to Test | Expected |
|---|---|---|
| Route protection | Visit /dashboard without login | Redirected to / with auth modal |
| Overview | Visit /dashboard | Stats + recent activity from API |
| My Listings | Visit /dashboard/listings | Shows current user's properties |
| Saved | Visit /dashboard/saved | Saved properties from API |
| Messages | Visit /dashboard/messages | Lead enquiries list |
| Chat | Click an enquiry | Chat-style view opens |
| Alerts | Visit /dashboard/alerts | Notification list |
| Documents | Visit /dashboard/documents | Upload area + file list |
| Settings | Visit /dashboard/settings | Profile form + notification toggles |
| Post Property CTA | Click in sidebar | Routes to /post-property |
| Logout | Click logout | Clears session (TODO: implement) |

### ✅ G. Tools

| Feature | How to Test | Expected |
|---|---|---|
| EMI Calculator | Visit /tools/emi-calculator | Sliders respond, EMI updates |
| Bank comparison | Check table | 8 banks sorted by rate |
| Amortization | Click "Show" | Yearly table expands |
| Affordability | Visit /tools/affordability | FOIR calculation updates live |
| Rent Receipt | Fill form, Generate | Receipt preview + download button |
| Property Value | Visit /tools/property-value | Inputs → estimated value shown |

### ✅ H. News, Localities, Projects

| Feature | How to Test | Expected |
|---|---|---|
| News list | Visit /news | 6 articles shown (static) |
| Article detail | Click an article | Full article with related |
| Localities list | Visit /localities | Cards from DB API |
| Locality detail | Click a locality | Price chart + properties from API |
| Projects | Visit /projects | 6 projects (static) |
| Developer list | Scroll to bottom | 6 developer cards |
| Agents | Visit /agents | Agent cards with ratings |

---

## 3. KNOWN BUGS & ISSUES

### 🔴 Critical (breaks core flow)
| # | Bug | File | Fix |
|---|---|---|---|
| 1 | Logout button doesn't clear JWT/session | `dashboard/layout.tsx` | Add `localStorage.clear()` + router.push('/') |
| 2 | Auth token not stored after login | `app/layout.tsx` | `AuthModal` calls API but doesn't store token in localStorage |
| 3 | Map shows placeholder instead of real map on Vercel | `map-view.tsx` | Already using Carto free tiles — should work, verify |

### 🟡 Medium (UX issues)
| # | Bug | File | Fix |
|---|---|---|---|
| 4 | Heart/save fails silently when not logged in | `property-card.tsx` | Show toast: "Login to save properties" |
| 5 | Search doesn't update when URL type param changes | `search-results.tsx` | Add searchParams to useEffect dep array |
| 6 | `vw_properties` may fail if `images[]` Dapper mapping | `PropertyRepository.cs` | If array type fails, switch to JSON aggregation |
| 7 | OTP login sends OTP but doesn't verify against DB | `AuthController.cs` | Backend only mocked in MSW — needs real OTP table |
| 8 | Dashboard sidebar route `/dashboard/properties` 404s | `dashboard/layout.tsx` | Change to `/dashboard/listings` (already done in `layout.tsx`?) |
| 9 | Post property wizard submits to nothing | `property-form-wizard.tsx` | Wire final submit to `POST /api/properties` |

### 🟢 Minor (polish)
| # | Issue | Fix |
|---|---|---|
| 10 | `hero-bg.png` 404 in dev if image doesn't exist | Add real image to `/public/` or use a gradient fallback |
| 11 | EMI slider background doesn't track correctly in Firefox | Use `-moz-range-track` CSS (already in globals.css) |
| 12 | Unsplash images blocked in some corporate proxies | Consider R2/Cloudflare CDN for production |

---

## 4. PERFORMANCE CHECKLIST

Run `npm run build` and check the output for:
- [ ] No page > 500KB JS
- [ ] All `<Image>` components have `sizes` prop
- [ ] Hero image has `priority` prop
- [ ] No "missing alt text" warnings

Chrome DevTools checks:
- [ ] Lighthouse score > 85 on desktop
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] No layout shifts (CLS < 0.1)
- [ ] API calls complete in < 1s on localhost

---

## 5. API ENDPOINT REFERENCE

All base URLs: `http://localhost:5001/api`

```
GET  /properties?type=buy&city=bangalore&q=whitefield&page=1&pageSize=20
GET  /properties/{id}
GET  /properties/my                    [🔐 auth required]
POST /properties                       [🔐 auth required]
PUT  /properties/{id}                  [🔐 auth required]
DELETE /properties/{id}               [🔐 auth required]
POST /properties/{id}/save             [🔐 auth required]
DELETE /properties/{id}/save           [🔐 auth required]

GET  /cities
GET  /cities/{slug}
GET  /localities?citySlug=ahmedabad
GET  /localities/{slug}

POST /leads
GET  /leads/property/{propertyId}      [🔐 auth required]

GET  /users/me/saved                   [🔐 auth required]
GET  /users/me/listings               [🔐 auth required]

POST /auth/login     { email, password }
POST /auth/register  { email, password, firstName, lastName, phone, isOwner }
POST /auth/refresh                     [🔐 auth required]
GET  /auth/me                         [🔐 auth required]
```

---

## 6. NEXT DEVELOPMENT PRIORITIES

### Must-Do Before Production
1. **Auth token storage** — Store JWT in memory (not localStorage), refresh token in HTTP-only cookie
2. **Logout** — Clear tokens, redirect to home
3. **Post property form submission** — Wire wizard final step to `POST /api/properties`
4. **Real OTP flow** — Integrate with Twilio/MSG91 for SMS OTP
5. **Image upload** — Wire to Cloudflare R2 (`POST /api/properties/{id}/images`)

### Nice-to-Have
6. **Pagination** — "Load more" button on search (currently 50 results max)
7. **Price alerts** — Email when saved property drops in price
8. **Advanced search** — Polygon-based map search
9. **Reviews** — Rating system on property detail page
10. **Boost listing** — Razorpay payment for promoted listings

---

## 7. DEPLOYMENT CHECKLIST

### Hetzner/DigitalOcean VPS
```bash
# Server setup
apt install docker.io docker-compose nginx certbot

# Clone and setup
git clone <repo> /app/apnanest
cd /app/apnanest

# Backend env
cp backend/.env.example backend/.env
# Edit: ConnectionStrings, JwtSettings

# Frontend env  
echo "NEXT_PUBLIC_API_URL=https://api.apnanest.in" > frontend/.env.production

# Docker compose (postgres + redis + minio + seq)
docker compose -f infra/docker-compose.yml up -d

# Build and run
cd backend && dotnet publish -c Release && dotnet ApnaNest.API.dll
cd frontend && npm run build && npm start

# Nginx reverse proxy config
# frontend: proxy_pass http://localhost:3000
# backend:  proxy_pass http://localhost:5001/api

# SSL
certbot --nginx -d apnanest.in -d api.apnanest.in
```

---

*Testing guide generated: 30 Apr 2026*
