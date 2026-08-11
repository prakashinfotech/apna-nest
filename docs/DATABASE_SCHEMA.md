# Database Schema — ApnaNest (Simplified)

> **Rules**: No foreign keys (app-enforced). No PostGIS (plain lat/lng). Enum tables for all categoricals. Standard 3NF. Supabase-compatible PostgreSQL.

---

## Run It

Paste into **Supabase SQL Editor → Run** or: `psql -U postgres -d apnanest -f schema.sql`

---
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.amenities (
  id smallint NOT NULL,
  category_id smallint NOT NULL,
  code character varying NOT NULL UNIQUE,
  label character varying NOT NULL,
  icon character varying,
  CONSTRAINT amenities_pkey PRIMARY KEY (id)
);
CREATE TABLE public.amenity_categories (
  id smallint NOT NULL,
  code character varying NOT NULL UNIQUE,
  label character varying NOT NULL,
  CONSTRAINT amenity_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  state_id smallint NOT NULL,
  name character varying NOT NULL,
  name_hi character varying,
  slug character varying NOT NULL UNIQUE,
  latitude numeric,
  longitude numeric,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cities_pkey PRIMARY KEY (id)
);
CREATE TABLE public.furnishing_statuses (
  id smallint NOT NULL,
  code character varying NOT NULL UNIQUE,
  label character varying NOT NULL,
  CONSTRAINT furnishing_statuses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.lead_statuses (
  id smallint NOT NULL,
  code character varying NOT NULL UNIQUE,
  label character varying NOT NULL,
  CONSTRAINT lead_statuses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  owner_id uuid NOT NULL,
  buyer_name character varying NOT NULL,
  buyer_phone character varying NOT NULL,
  buyer_email character varying,
  message text,
  status_id smallint DEFAULT 1,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT leads_pkey PRIMARY KEY (id)
);
CREATE TABLE public.listing_intents (
  id smallint NOT NULL,
  code character varying NOT NULL UNIQUE,
  label character varying NOT NULL,
  CONSTRAINT listing_intents_pkey PRIMARY KEY (id)
);
CREATE TABLE public.localities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL,
  name character varying NOT NULL,
  name_hi character varying,
  slug character varying NOT NULL,
  latitude numeric,
  longitude numeric,
  pin_code character,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  avg_price_sqft numeric,
  CONSTRAINT localities_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type character varying NOT NULL,
  title character varying NOT NULL,
  body text,
  is_read boolean DEFAULT false,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);
CREATE TABLE public.otp_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  phone character varying NOT NULL,
  code character NOT NULL,
  purpose character varying NOT NULL DEFAULT 'login'::character varying,
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT otp_codes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id smallint NOT NULL,
  amount_inr numeric NOT NULL,
  method character varying DEFAULT 'manual'::character varying,
  status character varying DEFAULT 'pending'::character varying,
  payment_ref character varying,
  confirmed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id)
);
CREATE TABLE public.possession_statuses (
  id smallint NOT NULL,
  code character varying NOT NULL UNIQUE,
  label character varying NOT NULL,
  CONSTRAINT possession_statuses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.properties (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  city_id uuid NOT NULL,
  locality_id uuid NOT NULL,
  address_line character varying,
  latitude numeric,
  longitude numeric,
  pin_code character,
  property_type_id smallint NOT NULL DEFAULT 1,
  listing_intent_id smallint NOT NULL DEFAULT 1,
  title character varying NOT NULL,
  description text,
  bhk smallint,
  bathrooms smallint,
  area_sqft numeric NOT NULL,
  area_sqft_carpet numeric,
  floor_number smallint,
  total_floors smallint,
  age_years smallint,
  price numeric NOT NULL,
  price_per_night numeric,
  is_price_negotiable boolean DEFAULT false,
  maintenance_per_month numeric,
  furnishing_status_id smallint DEFAULT 1,
  possession_status_id smallint DEFAULT 1,
  available_from date,
  min_nights smallint,
  check_in_time time without time zone,
  check_out_time time without time zone,
  is_rera_verified boolean DEFAULT false,
  rera_number character varying,
  is_zero_brokerage boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  view_count integer DEFAULT 0,
  lead_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT properties_pkey PRIMARY KEY (id)
);
CREATE TABLE public.property_amenities (
  property_id uuid NOT NULL,
  amenity_id smallint NOT NULL,
  CONSTRAINT property_amenities_pkey PRIMARY KEY (property_id, amenity_id)
);
CREATE TABLE public.property_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  url text NOT NULL,
  is_primary boolean DEFAULT false,
  sort_order smallint DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT property_images_pkey PRIMARY KEY (id)
);
CREATE TABLE public.property_types (
  id smallint NOT NULL,
  code character varying NOT NULL UNIQUE,
  label character varying NOT NULL,
  CONSTRAINT property_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.recently_viewed (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id uuid NOT NULL,
  viewed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT recently_viewed_pkey PRIMARY KEY (id)
);
CREATE TABLE public.refresh_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token_hash character varying NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  revoked_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  reviewer_name character varying NOT NULL,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id)
);
CREATE TABLE public.saved_properties (
  user_id uuid NOT NULL,
  property_id uuid NOT NULL,
  saved_at timestamp with time zone DEFAULT now(),
  CONSTRAINT saved_properties_pkey PRIMARY KEY (user_id, property_id)
);
CREATE TABLE public.saved_searches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name character varying,
  filters jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT saved_searches_pkey PRIMARY KEY (id)
);
CREATE TABLE public.states (
  id smallint NOT NULL,
  code character NOT NULL UNIQUE,
  name character varying NOT NULL,
  name_hi character varying,
  is_active boolean DEFAULT true,
  CONSTRAINT states_pkey PRIMARY KEY (id)
);
CREATE TABLE public.subscription_plans (
  id smallint NOT NULL,
  code character varying NOT NULL UNIQUE,
  label character varying NOT NULL,
  price_inr numeric NOT NULL,
  duration_days smallint NOT NULL,
  max_listings smallint,
  features jsonb,
  CONSTRAINT subscription_plans_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_roles (
  id smallint NOT NULL,
  code character varying NOT NULL UNIQUE,
  label character varying NOT NULL,
  CONSTRAINT user_roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id smallint NOT NULL,
  payment_id uuid,
  starts_at timestamp with time zone NOT NULL DEFAULT now(),
  ends_at timestamp with time zone NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  phone character varying NOT NULL UNIQUE,
  email character varying UNIQUE,
  name character varying,
  role_id smallint NOT NULL DEFAULT 1,
  profile_pic text,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  last_login_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone,
  password_hash text NOT NULL DEFAULT ''::text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
---

## pgAdmin + Local Dev

```
1. Download pgAdmin 4 → https://pgadmin.org/download
2. Register server: localhost:5432 / postgres / <your_password>
3. Create DB: apnanest
4. Open Query Tool → paste schema above → Run (F5)
```

OR **Supabase** (zero local setup, recommended):
```
1. https://supabase.com → New Project → free tier
2. Project → SQL Editor → paste schema → Run
3. Settings → Database → copy Connection String → paste into backend .env
```

**Connection string format** (for Dapper / Npgsql):
```
Host=db.xxx.supabase.co;Database=postgres;Username=postgres;Password=xxx;SSL Mode=Require
```
