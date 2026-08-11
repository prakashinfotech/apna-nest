-- ============================================================
-- ApnaNest — Complete Database Seed
-- Idempotent: safe to run multiple times on Supabase or psql
-- Run in Supabase SQL Editor or: psql -c "\i apnanest_seed.sql"
-- ============================================================

-- ── 0. EXTENSIONS ──────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── 1. ENUM / LOOKUP TABLES ────────────────────────────────
CREATE TABLE IF NOT EXISTS property_types (
    id SMALLINT PRIMARY KEY, code VARCHAR(30) UNIQUE NOT NULL, label VARCHAR(50) NOT NULL
);
INSERT INTO property_types VALUES
  (1,'apartment','Apartment'),(2,'independent','Independent House / Villa'),
  (3,'plot','Plot / Land'),(4,'pg','PG / Hostel'),(5,'commercial','Commercial'),
  (6,'studio','Studio'),(7,'builder_floor','Builder Floor')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS listing_intents (
    id SMALLINT PRIMARY KEY, code VARCHAR(20) UNIQUE NOT NULL, label VARCHAR(30) NOT NULL
);
INSERT INTO listing_intents VALUES (1,'buy','Buy'),(2,'rent','Rent'),(3,'pg','PG')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS furnishing_statuses (
    id SMALLINT PRIMARY KEY, code VARCHAR(20) UNIQUE NOT NULL, label VARCHAR(30) NOT NULL
);
INSERT INTO furnishing_statuses VALUES
  (1,'unfurnished','Unfurnished'),(2,'semi','Semi Furnished'),(3,'fully','Fully Furnished')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS possession_statuses (
    id SMALLINT PRIMARY KEY, code VARCHAR(30) UNIQUE NOT NULL, label VARCHAR(50) NOT NULL
);
INSERT INTO possession_statuses VALUES
  (1,'ready','Ready to Move'),(2,'under_const','Under Construction'),(3,'new_launch','New Launch')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS user_roles (
    id SMALLINT PRIMARY KEY, code VARCHAR(20) UNIQUE NOT NULL, label VARCHAR(30) NOT NULL
);
INSERT INTO user_roles VALUES
  (1,'buyer','Buyer / Tenant'),(2,'owner','Owner'),(3,'broker','Broker / Agent'),(4,'admin','Admin')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS lead_statuses (
    id SMALLINT PRIMARY KEY, code VARCHAR(20) UNIQUE NOT NULL, label VARCHAR(30) NOT NULL
);
INSERT INTO lead_statuses VALUES
  (1,'new','New'),(2,'contacted','Contacted'),(3,'visited','Site Visited'),
  (4,'closed','Closed'),(5,'rejected','Not Interested')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS amenity_categories (
    id SMALLINT PRIMARY KEY, code VARCHAR(30) UNIQUE NOT NULL, label VARCHAR(50) NOT NULL
);
INSERT INTO amenity_categories VALUES
  (1,'security','Security'),(2,'fitness','Fitness'),(3,'lifestyle','Lifestyle'),
  (4,'green','Green'),(5,'utility','Utilities')
ON CONFLICT (id) DO NOTHING;

-- ── 2. GEOGRAPHY ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS states (
    id       SMALLINT PRIMARY KEY,
    code     CHAR(2)     UNIQUE NOT NULL,
    name     VARCHAR(60) NOT NULL,
    name_hi  VARCHAR(60),
    is_active BOOLEAN DEFAULT TRUE
);
INSERT INTO states (id, code, name) VALUES
  (1,'GJ','Gujarat'),(2,'KA','Karnataka'),(3,'MH','Maharashtra'),
  (4,'TG','Telangana'),(5,'DL','Delhi'),(6,'RJ','Rajasthan')
ON CONFLICT (code) DO NOTHING;  -- conflict on code, not id

CREATE TABLE IF NOT EXISTS cities (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id   SMALLINT NOT NULL,
    name       VARCHAR(80) NOT NULL,
    name_hi    VARCHAR(80),
    slug       VARCHAR(80) UNIQUE NOT NULL,
    latitude   DECIMAL(9,6),
    longitude  DECIMAL(9,6),
    is_active  BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cities_state ON cities(state_id);

INSERT INTO cities (id, state_id, name, slug, latitude, longitude) VALUES
  ('11111111-1111-1111-1111-111111111111', 1, 'Ahmedabad', 'ahmedabad', 23.022505, 72.571362),
  ('22222222-2222-2222-2222-222222222222', 2, 'Bangalore',  'bangalore',  12.971599, 77.594563),
  ('33333333-3333-3333-3333-333333333333', 3, 'Mumbai',     'mumbai',     19.075984, 72.877656),
  ('44444444-4444-4444-4444-444444444444', 3, 'Pune',       'pune',       18.520430, 73.856744),
  ('55555555-5555-5555-5555-555555555555', 5, 'Delhi',      'delhi',      28.613939, 77.209023),
  ('66666666-6666-6666-6666-666666666666', 4, 'Hyderabad',  'hyderabad',  17.385044, 78.486671)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS localities (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id     UUID NOT NULL,
    name        VARCHAR(100) NOT NULL,
    name_hi     VARCHAR(100),
    slug        VARCHAR(100) NOT NULL,
    latitude    DECIMAL(9,6),
    longitude   DECIMAL(9,6),
    pin_code    CHAR(6),
    description TEXT,
    avg_price_sqft DECIMAL(10,2),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(city_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_localities_city ON localities(city_id);
-- Add column if table already existed without it
ALTER TABLE localities ADD COLUMN IF NOT EXISTS avg_price_sqft DECIMAL(10,2);

INSERT INTO localities (id, city_id, name, slug, latitude, longitude, pin_code, description, avg_price_sqft) VALUES
  ('aaaaaaaa-0001-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Bopal','bopal',23.031500,72.472000,'380058','Fast-growing suburb with excellent schools and modern shopping districts.',7200),
  ('aaaaaaaa-0001-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','SG Highway','sg-highway',23.046900,72.510300,'380015','Commercial spine of Ahmedabad with vibrant corporate offices and retail.',6800),
  ('aaaaaaaa-0001-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Vastrapur','vastrapur',23.045600,72.532000,'380054','Lake-side neighbourhood loved for quiet streets and mature parks.',9500),
  ('aaaaaaaa-0001-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','Satellite','satellite',23.027800,72.522600,'380015','Upscale commercial and residential area near the river front.',8200),
  ('aaaaaaaa-0002-0000-0000-000000000001','22222222-2222-2222-2222-222222222222','Whitefield','whitefield',12.969800,77.750000,'560066','India largest tech hub, top choice for IT professionals.',12000),
  ('aaaaaaaa-0002-0000-0000-000000000002','22222222-2222-2222-2222-222222222222','Koramangala','koramangala',12.935200,77.624500,'560034','Cultural and startup heart of Bangalore with vibrant cafes.',15000),
  ('aaaaaaaa-0003-0000-0000-000000000001','33333333-3333-3333-3333-333333333333','Bandra West','bandra-west',19.054400,72.830500,'400050','Most premium sea-facing neighbourhood in Mumbai.',28000),
  ('aaaaaaaa-0003-0000-0000-000000000002','33333333-3333-3333-3333-333333333333','Powai','powai',19.121600,72.905000,'400076','Lakefront living with corporate offices and premium schools.',18000),
  ('aaaaaaaa-0004-0000-0000-000000000001','44444444-4444-4444-4444-444444444444','Hinjewadi','hinjewadi',18.591200,73.738800,'411057','Pune''s most prominent IT corridor with strong rental yields.',8400),
  ('aaaaaaaa-0004-0000-0000-000000000002','44444444-4444-4444-4444-444444444444','Kharadi','kharadi',18.553200,73.948700,'411014','Emerging IT hub east of Pune with modern gated communities.',7200),
  ('aaaaaaaa-0005-0000-0000-000000000001','55555555-5555-5555-5555-555555555555','Hauz Khas','hauz-khas',28.549400,77.200100,'110016','Upscale neighbourhood near Deer Park with art galleries and cafes.',22000),
  ('aaaaaaaa-0006-0000-0000-000000000001','66666666-6666-6666-6666-666666666666','Gachibowli','gachibowli',17.440100,78.348900,'500032','Hyderabad''s financial district with premium communities.',9200)
ON CONFLICT (city_id, slug) DO NOTHING;

-- ── 3. USERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone         VARCHAR(15) UNIQUE NOT NULL,
    email         VARCHAR(150) UNIQUE,
    name          VARCHAR(100),
    role_id       SMALLINT NOT NULL DEFAULT 1,
    profile_pic   TEXT,
    is_verified   BOOLEAN DEFAULT FALSE,
    is_active     BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ,
    password_hash TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
-- Add column if table already existed without it
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '';

-- Demo owner accounts (password = "Test@1234" — reset via /api/auth/register in production)
INSERT INTO users (id, phone, email, name, role_id, is_verified, is_active, password_hash) VALUES
  ('bbbbbbbb-0001-0000-0000-000000000001','+919876511111','rajesh@example.com','Rajesh Kumar',2,true,true,'DEMO_HASH_RESET_VIA_API'),
  ('bbbbbbbb-0002-0000-0000-000000000002','+919876522222','priya@example.com','Priya Sharma',2,true,true,'DEMO_HASH_RESET_VIA_API'),
  ('bbbbbbbb-0003-0000-0000-000000000003','+919876533333','aakash@example.com','Aakash Mehta',2,true,true,'DEMO_HASH_RESET_VIA_API'),
  ('bbbbbbbb-0004-0000-0000-000000000004','+919876544444','anita@example.com','Anita Shah',2,true,true,'DEMO_HASH_RESET_VIA_API'),
  ('bbbbbbbb-0099-0000-0000-000000000099','+919000000001','admin@apnanest.in','ApnaNest Admin',4,true,true,'DEMO_HASH_RESET_VIA_API')
ON CONFLICT (phone) DO NOTHING;

-- ── 4. AMENITIES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS amenities (
    id          SMALLINT PRIMARY KEY,
    category_id SMALLINT NOT NULL,
    code        VARCHAR(40) UNIQUE NOT NULL,
    label       VARCHAR(60) NOT NULL,
    icon        VARCHAR(40)
);
INSERT INTO amenities VALUES
  (1,1,'security_guard','Security Guard','shield'),
  (2,1,'cctv','CCTV','camera'),
  (3,2,'gym','Gymnasium','dumbbell'),
  (4,2,'swimming_pool','Swimming Pool','waves'),
  (5,2,'playground','Kids Play Area','tree'),
  (6,3,'clubhouse','Clubhouse','building-2'),
  (7,3,'lift','Lift / Elevator','arrow-up'),
  (8,4,'garden','Garden','tree'),
  (9,4,'rainwater','Rainwater Harvesting','droplets'),
  (10,5,'power_backup','Power Backup','zap'),
  (11,5,'gas_pipeline','Gas Pipeline','flame'),
  (12,5,'car_parking','Covered Parking','car'),
  (13,5,'wifi','WiFi','wifi'),
  (14,5,'visitor_parking','Visitor Parking','parking-square'),
  (15,5,'maintenance_staff','24x7 Maintenance','wrench'),
  (16,3,'tennis_court','Tennis Court','circle'),
  (17,3,'home_theater','Home Theater','tv'),
  (18,5,'ev_charging','EV Charging','zap'),
  (19,3,'jogging_track','Jogging Track','activity'),
  (20,3,'smart_home','Smart Home','cpu')
ON CONFLICT (id) DO NOTHING;

-- ── 5. PROPERTIES TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id              UUID NOT NULL,
    city_id               UUID NOT NULL,
    locality_id           UUID NOT NULL,
    address_line          VARCHAR(200),
    latitude              DECIMAL(9,6),
    longitude             DECIMAL(9,6),
    pin_code              CHAR(6),
    property_type_id      SMALLINT NOT NULL DEFAULT 1,
    listing_intent_id     SMALLINT NOT NULL DEFAULT 1,
    title                 VARCHAR(200) NOT NULL,
    description           TEXT,
    bhk                   SMALLINT,
    bathrooms             SMALLINT,
    area_sqft             DECIMAL(10,2) NOT NULL,
    area_sqft_carpet      DECIMAL(10,2),
    floor_number          SMALLINT,
    total_floors          SMALLINT,
    age_years             SMALLINT,
    price                 DECIMAL(14,2) NOT NULL,
    is_price_negotiable   BOOLEAN DEFAULT FALSE,
    maintenance_per_month DECIMAL(10,2),
    furnishing_status_id  SMALLINT DEFAULT 1,
    possession_status_id  SMALLINT DEFAULT 1,
    available_from        DATE,
    is_rera_verified      BOOLEAN DEFAULT FALSE,
    rera_number           VARCHAR(40),
    is_zero_brokerage     BOOLEAN DEFAULT TRUE,
    is_featured           BOOLEAN DEFAULT FALSE,
    is_active             BOOLEAN DEFAULT TRUE,
    view_count            INT DEFAULT 0,
    lead_count            INT DEFAULT 0,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    deleted_at            TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_prop_city     ON properties(city_id);
CREATE INDEX IF NOT EXISTS idx_prop_locality ON properties(locality_id);
CREATE INDEX IF NOT EXISTS idx_prop_owner    ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_prop_type     ON properties(property_type_id, listing_intent_id);
CREATE INDEX IF NOT EXISTS idx_prop_active   ON properties(is_active, deleted_at);

-- ── 6. PROPERTY IMAGES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS property_images (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL,
    url         TEXT NOT NULL,
    is_primary  BOOLEAN DEFAULT FALSE,
    sort_order  SMALLINT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_propimg_prop ON property_images(property_id);

-- ── 7. PROPERTY AMENITIES ────────────────────────────────────
CREATE TABLE IF NOT EXISTS property_amenities (
    property_id UUID     NOT NULL,
    amenity_id  SMALLINT NOT NULL,
    PRIMARY KEY (property_id, amenity_id)
);

-- ── 8. USER ACTIVITY TABLES ──────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_properties (
    user_id     UUID NOT NULL,
    property_id UUID NOT NULL,
    saved_at    TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, property_id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL,
    token_hash VARCHAR(128) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ── 9. LEADS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL,
    owner_id    UUID NOT NULL,
    buyer_name  VARCHAR(100) NOT NULL,
    buyer_phone VARCHAR(15)  NOT NULL,
    buyer_email VARCHAR(150),
    message     TEXT,
    status_id   SMALLINT DEFAULT 1,
    notes       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_prop  ON leads(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner_id);

-- ── 10. SEED PROPERTIES ─────────────────────────────────────
-- Using fixed UUIDs so images/amenities can reference them

DO $$
DECLARE
  p1  UUID := 'cccccccc-0001-0000-0000-000000000001';
  p2  UUID := 'cccccccc-0002-0000-0000-000000000002';
  p3  UUID := 'cccccccc-0003-0000-0000-000000000003';
  p4  UUID := 'cccccccc-0004-0000-0000-000000000004';
  p5  UUID := 'cccccccc-0005-0000-0000-000000000005';
  p6  UUID := 'cccccccc-0006-0000-0000-000000000006';
  p7  UUID := 'cccccccc-0007-0000-0000-000000000007';
  p8  UUID := 'cccccccc-0008-0000-0000-000000000008';
  p9  UUID := 'cccccccc-0009-0000-0000-000000000009';
  p10 UUID := 'cccccccc-0010-0000-0000-000000000010';
  p11 UUID := 'cccccccc-0011-0000-0000-000000000011';
  p12 UUID := 'cccccccc-0012-0000-0000-000000000012';
  p13 UUID := 'cccccccc-0013-0000-0000-000000000013';
  p14 UUID := 'cccccccc-0014-0000-0000-000000000014';
  p15 UUID := 'cccccccc-0015-0000-0000-000000000015';
  p16 UUID := 'cccccccc-0016-0000-0000-000000000016';
  p17 UUID := 'cccccccc-0017-0000-0000-000000000017';
  p18 UUID := 'cccccccc-0018-0000-0000-000000000018';
  p19 UUID := 'cccccccc-0019-0000-0000-000000000019';
  p20 UUID := 'cccccccc-0020-0000-0000-000000000020';

  -- City & Locality UUIDs
  c_ahm  UUID := '11111111-1111-1111-1111-111111111111';
  c_blr  UUID := '22222222-2222-2222-2222-222222222222';
  c_mum  UUID := '33333333-3333-3333-3333-333333333333';
  c_pne  UUID := '44444444-4444-4444-4444-444444444444';
  c_del  UUID := '55555555-5555-5555-5555-555555555555';
  c_hyd  UUID := '66666666-6666-6666-6666-666666666666';

  l_bopal      UUID := 'aaaaaaaa-0001-0000-0000-000000000001';
  l_sg_hwy     UUID := 'aaaaaaaa-0001-0000-0000-000000000002';
  l_vastrapur  UUID := 'aaaaaaaa-0001-0000-0000-000000000003';
  l_satellite  UUID := 'aaaaaaaa-0001-0000-0000-000000000004';
  l_whitefield UUID := 'aaaaaaaa-0002-0000-0000-000000000001';
  l_koramangala UUID := 'aaaaaaaa-0002-0000-0000-000000000002';
  l_bandra     UUID := 'aaaaaaaa-0003-0000-0000-000000000001';
  l_powai      UUID := 'aaaaaaaa-0003-0000-0000-000000000002';
  l_hinjewadi  UUID := 'aaaaaaaa-0004-0000-0000-000000000001';
  l_kharadi    UUID := 'aaaaaaaa-0004-0000-0000-000000000002';
  l_hauz_khas  UUID := 'aaaaaaaa-0005-0000-0000-000000000001';
  l_gachib     UUID := 'aaaaaaaa-0006-0000-0000-000000000001';

  -- Owner UUIDs
  u1 UUID := 'bbbbbbbb-0001-0000-0000-000000000001';
  u2 UUID := 'bbbbbbbb-0002-0000-0000-000000000002';
  u3 UUID := 'bbbbbbbb-0003-0000-0000-000000000003';
  u4 UUID := 'bbbbbbbb-0004-0000-0000-000000000004';

BEGIN

-- ── INSERT PROPERTIES ───────────────────────────────────────
INSERT INTO properties
  (id, owner_id, city_id, locality_id, address_line, latitude, longitude, pin_code,
   property_type_id, listing_intent_id, title, description, bhk, bathrooms, area_sqft,
   floor_number, total_floors, age_years, price, is_price_negotiable, maintenance_per_month,
   furnishing_status_id, possession_status_id, is_rera_verified, rera_number,
   is_zero_brokerage, is_featured, is_active, view_count)
VALUES
-- P1: 3BHK Buy Bopal
(p1, u1, c_ahm, l_bopal, 'Bopal Circle, Bopal, Ahmedabad', 23.0315, 72.4720, '380058',
 1, 1, 'Spacious 3BHK in Bopal with Clubhouse & Pool',
 'Beautiful 3BHK apartment in Bopal''s most sought-after gated society. Spacious rooms with ample natural light, modular kitchen, and views of surrounding greenery. 5,000 sq.ft clubhouse with Olympic-size pool.',
 3, 2, 1420, 5, 12, 2, 8500000, true, 3500, 2, 1, true, 'GJ/AHMD/2022/001234', true, true, true, 1247),

-- P2: 2BHK Buy SG Highway
(p2, u2, c_ahm, l_sg_hwy, 'Prahlad Nagar, SG Highway, Ahmedabad', 23.0469, 72.5103, '380015',
 1, 1, 'Modern 2BHK near SG Highway — Fully Furnished',
 'Fully furnished 2BHK in Prahlad Nagar, perfect for IT professionals. Premium interiors, brand new kitchen appliances. Walkable to corporate offices.',
 2, 2, 1050, 8, 15, 0, 6200000, false, 2800, 3, 1, false, null, false, true, true, 892),

-- P3: 4BHK Villa Buy Vastrapur
(p3, u3, c_ahm, l_vastrapur, 'Vastrapur Lake Road, Vastrapur, Ahmedabad', 23.0456, 72.5320, '380054',
 2, 1, 'Luxury 4BHK Villa with Private Pool, Vastrapur',
 'Exquisite 4BHK luxury villa with private swimming pool and landscaped garden. Smart home automation, private home theatre, designer interiors. A 5-minute walk from Vastrapur Lake.',
 4, 4, 3200, 0, 3, 2, 28000000, true, null, 3, 1, true, null, true, true, true, 2341),

-- P4: 1BHK Rent Satellite
(p4, u1, c_ahm, l_satellite, 'Jodhpur Char Rasta, Satellite, Ahmedabad', 23.0278, 72.5226, '380015',
 6, 2, '1BHK Fully Furnished Studio for Rent, Satellite',
 'Compact and well-maintained 1BHK studio, ideal for working professionals or students. Fully furnished with all appliances, close to major offices and malls. Zero brokerage.',
 1, 1, 550, 2, 5, 8, 18000, false, null, 3, 1, true, null, true, false, true, 634),

-- P5: Plot Buy Bopal
(p5, u2, c_ahm, l_bopal, 'Near Bopal Bus Stop, Bopal, Ahmedabad', 23.0200, 72.4600, '380058',
 3, 1, 'East-Facing Residential Plot for Sale, Bopal',
 'Prime residential plot in Bopal extension with clear title. East-facing corner plot with road access on two sides. Suitable for duplex or multi-story construction.',
 null, null, 1200, null, null, 0, 4500000, true, null, 1, 1, true, null, false, false, true, 456),

-- P6: 3BHK Buy Whitefield
(p6, u4, c_blr, l_whitefield, 'ITPL Road, Whitefield, Bangalore', 12.9698, 77.7500, '560066',
 1, 1, '3BHK Premium Flat, Whitefield — IT Corridor',
 'Stunning 3BHK in Whitefield''s most sought-after gated community. Proximity to major IT parks ideal for tech professionals. RERA approved, top-floor with panoramic views.',
 3, 3, 1750, 10, 18, 2, 13500000, false, 4500, 2, 1, true, 'KA/BANG/2023/005678', false, true, true, 1823),

-- P7: 2BHK Rent Hinjewadi
(p7, u1, c_pne, l_hinjewadi, 'Phase 1, Hinjewadi, Pune', 18.5912, 73.7388, '411057',
 1, 2, '2BHK Flat for Rent near Hinjewadi IT Park',
 'Well-maintained 2BHK available for rent near Hinjewadi IT Park. Semi-furnished with modular kitchen and wardrobes. Walking distance from major IT companies.',
 2, 2, 980, 4, 8, 2, 25000, false, null, 2, 1, true, null, true, false, true, 723),

-- P8: 1BHK Rent Koramangala
(p8, u2, c_blr, l_koramangala, '5th Block, Koramangala, Bangalore', 12.9352, 77.6245, '560034',
 1, 2, 'Cozy 1BHK in Koramangala — Zero Brokerage',
 'Charming 1BHK in the heart of Koramangala. Walking distance to cafes, restaurants, and tech offices. Fully air-conditioned, high-speed internet.',
 1, 1, 650, 3, 4, 4, 22000, false, null, 3, 1, true, null, true, false, true, 567),

-- P9: 4BHK Penthouse Buy Bandra
(p9, u3, c_mum, l_bandra, 'Linking Road, Bandra West, Mumbai', 19.0544, 72.8305, '400050',
 1, 1, 'Ultra-Luxury 4BHK Penthouse, Bandra West',
 'Ultra-luxury sea-facing penthouse with panoramic Arabian Sea views. Private terrace, designer interiors by globally renowned firm, smart home automation, and white-glove concierge.',
 4, 5, 4500, 28, 30, 0, 85000000, false, 25000, 3, 1, true, 'MH/MUM/2023/009876', false, true, true, 4521),

-- P10: 2BHK Rent Hauz Khas
(p10, u4, c_del, l_hauz_khas, 'Hauz Khas Village, New Delhi', 28.5494, 77.2001, '110016',
 7, 2, '2BHK Builder Floor in Hauz Khas Village',
 'Beautiful 2BHK builder floor in upscale Hauz Khas Village. Walking distance to Deer Park, restaurants, art galleries, and Delhi Metro.',
 2, 2, 1100, 1, 3, 4, 45000, false, null, 2, 1, true, null, false, false, true, 389),

-- P11: 3BHK Buy Gachibowli
(p11, u2, c_hyd, l_gachib, 'Gachibowli Main Road, Hyderabad', 17.4401, 78.3489, '500032',
 1, 1, '3BHK Premium Apartment, Gachibowli Tech Corridor',
 'Premium 3BHK in Hyderabad''s Financial District. Walking distance to major IT parks, premium schools, and HITEC City metro station.',
 3, 3, 1650, 7, 14, 0, 9800000, false, 4200, 2, 1, true, 'TS/HYD/2023/003456', false, true, true, 1456),

-- P12: PG Rent Koramangala
(p12, u3, c_blr, l_koramangala, '4th Block, Koramangala, Bangalore', 12.9279, 77.6271, '560034',
 4, 3, 'Premium PG Studio, Koramangala — Meals Included',
 'Premium PG accommodation with all meals included. Fully AC rooms, high-speed WiFi, CCTV, laundry and housekeeping. Ideal for young professionals.',
 1, 1, 300, 2, 4, 4, 12000, false, null, 3, 1, true, null, true, false, true, 892),

-- P13: 2BHK Buy Kharadi
(p13, u1, c_pne, l_kharadi, 'EONAS IT Park Road, Kharadi, Pune', 18.5532, 73.9487, '411014',
 1, 1, '2BHK Ready-to-Move Flat, Kharadi, Pune',
 'Ready-to-move 2BHK in Kharadi''s fastest-growing corridor. Close to EON IT Park, good public transport connectivity, well-designed interiors.',
 2, 2, 920, 6, 14, 1, 7500000, true, 3200, 2, 1, true, 'MH/PUNE/2022/004521', false, false, true, 678),

-- P14: 3BHK Rent Whitefield
(p14, u4, c_blr, l_whitefield, 'Whitefield Main Road, Bangalore', 12.9820, 77.7480, '560066',
 1, 2, '3BHK for Rent in Whitefield Gated Community',
 'Spacious 3BHK in a premium gated community in Whitefield. Semi-furnished, well-maintained, close to ITPL and Marathahalli. Ideal for expats and senior IT employees.',
 3, 3, 1650, 3, 10, 3, 38000, false, null, 2, 1, false, null, false, false, true, 523),

-- P15: Commercial Buy SG Highway
(p15, u2, c_ahm, l_sg_hwy, 'Shyamal Cross Roads, SG Highway, Ahmedabad', 23.0380, 72.5150, '380015',
 5, 1, 'Commercial Office Space for Sale, SG Highway',
 'Prime commercial office space on SG Highway. Corner unit on 4th floor with natural light on two sides. Suitable for IT, fintech, and professional services firms.',
 null, 2, 800, 4, 12, 2, 12000000, true, 8000, 3, 1, true, 'GJ/AHMD/2023/007890', false, false, true, 234),

-- P16: 4BHK Buy Powai
(p16, u3, c_mum, l_powai, 'Hiranandani Gardens, Powai, Mumbai', 19.1210, 72.9040, '400076',
 1, 1, '4BHK Luxury Flat in Hiranandani Gardens, Powai',
 'Spacious 4BHK in iconic Hiranandani Gardens with Powai Lake views. Premium finishes, air-conditioned throughout, exclusive club with multiple pools.',
 4, 4, 2400, 12, 20, 8, 35000000, false, 12000, 3, 1, true, 'MH/MUM/2021/005432', false, true, true, 1102),

-- P17: 1BHK Rent Vastrapur
(p17, u1, c_ahm, l_vastrapur, 'Vastrapur, Ahmedabad', 23.0450, 72.5310, '380054',
 1, 2, '1BHK Affordable Rental near Vastrapur Lake',
 'Clean and comfortable 1BHK available immediately. Walking distance from Vastrapur Lake, good connectivity to SG Highway and GIFT City. Zero brokerage, owner direct.',
 1, 1, 620, 2, 4, 6, 14000, false, null, 2, 1, false, null, true, false, true, 445),

-- P18: 3BHK Buy Gachibowli (different owner)
(p18, u4, c_hyd, l_gachib, 'DLF Cybercity, Gachibowli, Hyderabad', 17.4350, 78.3620, '500032',
 2, 1, 'Independent Villa in Gachibowli, 3BHK',
 'Elegant independent 3BHK villa in a gated villa project near DLF Cybercity. Private garden, covered parking, top-quality construction by reputed builder.',
 3, 3, 2200, 0, 2, 3, 18000000, true, null, 3, 1, true, null, false, false, true, 812),

-- P19: 2BHK Buy Hinjewadi
(p19, u2, c_pne, l_hinjewadi, 'Hinjewadi Phase 2, Pune', 18.5860, 73.7330, '411057',
 1, 1, '2BHK Investment Property in Hinjewadi Phase 2',
 'Well-designed 2BHK in Hinjewadi Phase 2 near Rajiv Gandhi IT Park. Excellent rental yield potential. RERA approved, under warranty period. Good investment at current price.',
 2, 2, 900, 7, 14, 0, 7200000, false, 3000, 1, 2, true, 'MH/PUNE/2024/001122', false, false, true, 334),

-- P20: 5BHK Buy Bandra
(p20, u3, c_mum, l_bandra, 'Carter Road, Bandra West, Mumbai', 19.0560, 72.8290, '400050',
 2, 1, 'Sea-Facing 5BHK Villa, Carter Road, Bandra',
 'Rare sea-facing independent villa on Carter Road. 5 large bedrooms, private parking for 4 cars, rooftop terrace with 360° views. Completely renovated in 2024.',
 5, 6, 5500, 0, 4, 10, 120000000, false, null, 3, 1, false, null, false, true, true, 3456)

ON CONFLICT (id) DO NOTHING;


-- ── 11. PROPERTY IMAGES ─────────────────────────────────────
INSERT INTO property_images (property_id, url, is_primary, sort_order) VALUES
  -- P1: Bopal 3BHK
  ('cccccccc-0001-0000-0000-000000000001','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',true,0),
  ('cccccccc-0001-0000-0000-000000000001','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',false,1),
  ('cccccccc-0001-0000-0000-000000000001','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',false,2),
  ('cccccccc-0001-0000-0000-000000000001','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',false,3),
  -- P2: SG Highway 2BHK
  ('cccccccc-0002-0000-0000-000000000002','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',true,0),
  ('cccccccc-0002-0000-0000-000000000002','https://images.unsplash.com/photo-1600566753376-12c8ab8c17e8?w=800&q=80',false,1),
  ('cccccccc-0002-0000-0000-000000000002','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',false,2),
  -- P3: Vastrapur Villa
  ('cccccccc-0003-0000-0000-000000000003','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',true,0),
  ('cccccccc-0003-0000-0000-000000000003','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',false,1),
  ('cccccccc-0003-0000-0000-000000000003','https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',false,2),
  -- P4: Satellite Studio
  ('cccccccc-0004-0000-0000-000000000004','https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80',true,0),
  ('cccccccc-0004-0000-0000-000000000004','https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',false,1),
  -- P5: Bopal Plot
  ('cccccccc-0005-0000-0000-000000000005','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',true,0),
  -- P6: Whitefield 3BHK
  ('cccccccc-0006-0000-0000-000000000006','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',true,0),
  ('cccccccc-0006-0000-0000-000000000006','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',false,1),
  ('cccccccc-0006-0000-0000-000000000006','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',false,2),
  -- P7: Hinjewadi 2BHK Rent
  ('cccccccc-0007-0000-0000-000000000007','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',true,0),
  ('cccccccc-0007-0000-0000-000000000007','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',false,1),
  -- P8: Koramangala 1BHK
  ('cccccccc-0008-0000-0000-000000000008','https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',true,0),
  ('cccccccc-0008-0000-0000-000000000008','https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80',false,1),
  -- P9: Bandra Penthouse
  ('cccccccc-0009-0000-0000-000000000009','https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',true,0),
  ('cccccccc-0009-0000-0000-000000000009','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',false,1),
  ('cccccccc-0009-0000-0000-000000000009','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',false,2),
  -- P10: Hauz Khas Builder Floor
  ('cccccccc-0010-0000-0000-000000000010','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',true,0),
  ('cccccccc-0010-0000-0000-000000000010','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',false,1),
  -- P11: Gachibowli 3BHK
  ('cccccccc-0011-0000-0000-000000000011','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',true,0),
  ('cccccccc-0011-0000-0000-000000000011','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',false,1),
  -- P12: Koramangala PG
  ('cccccccc-0012-0000-0000-000000000012','https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80',true,0),
  -- P13: Kharadi 2BHK
  ('cccccccc-0013-0000-0000-000000000013','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',true,0),
  -- P14: Whitefield 3BHK Rent
  ('cccccccc-0014-0000-0000-000000000014','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',true,0),
  ('cccccccc-0014-0000-0000-000000000014','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',false,1),
  -- P15: Commercial SG Highway
  ('cccccccc-0015-0000-0000-000000000015','https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',true,0),
  -- P16: Powai 4BHK
  ('cccccccc-0016-0000-0000-000000000016','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',true,0),
  ('cccccccc-0016-0000-0000-000000000016','https://images.unsplash.com/photo-1600566753376-12c8ab8c17e8?w=800&q=80',false,1),
  -- P17: Vastrapur 1BHK Rent
  ('cccccccc-0017-0000-0000-000000000017','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',true,0),
  -- P18: Gachibowli Villa
  ('cccccccc-0018-0000-0000-000000000018','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',true,0),
  ('cccccccc-0018-0000-0000-000000000018','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',false,1),
  -- P19: Hinjewadi 2BHK Buy
  ('cccccccc-0019-0000-0000-000000000019','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',true,0),
  -- P20: Bandra 5BHK Villa
  ('cccccccc-0020-0000-0000-000000000020','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',true,0),
  ('cccccccc-0020-0000-0000-000000000020','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',false,1),
  ('cccccccc-0020-0000-0000-000000000020','https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',false,2)
ON CONFLICT DO NOTHING;


-- ── 12. PROPERTY AMENITIES ────────────────────────────────────
INSERT INTO property_amenities (property_id, amenity_id) VALUES
  -- P1: Bopal (pool, gym, clubhouse, security, power, lift, kids)
  ('cccccccc-0001-0000-0000-000000000001', 4),
  ('cccccccc-0001-0000-0000-000000000001', 3),
  ('cccccccc-0001-0000-0000-000000000001', 6),
  ('cccccccc-0001-0000-0000-000000000001', 1),
  ('cccccccc-0001-0000-0000-000000000001', 10),
  ('cccccccc-0001-0000-0000-000000000001', 7),
  ('cccccccc-0001-0000-0000-000000000001', 5),
  -- P2: SG Highway (gym, power, lift, security, cctv, wifi)
  ('cccccccc-0002-0000-0000-000000000002', 3),
  ('cccccccc-0002-0000-0000-000000000002', 10),
  ('cccccccc-0002-0000-0000-000000000002', 7),
  ('cccccccc-0002-0000-0000-000000000002', 1),
  ('cccccccc-0002-0000-0000-000000000002', 2),
  ('cccccccc-0002-0000-0000-000000000002', 13),
  -- P3: Villa (pool, home theater, smart home, garden, parking)
  ('cccccccc-0003-0000-0000-000000000003', 4),
  ('cccccccc-0003-0000-0000-000000000003', 17),
  ('cccccccc-0003-0000-0000-000000000003', 20),
  ('cccccccc-0003-0000-0000-000000000003', 8),
  ('cccccccc-0003-0000-0000-000000000003', 12),
  -- P4: Studio (power, wifi, security, cctv)
  ('cccccccc-0004-0000-0000-000000000004', 10),
  ('cccccccc-0004-0000-0000-000000000004', 13),
  ('cccccccc-0004-0000-0000-000000000004', 1),
  ('cccccccc-0004-0000-0000-000000000004', 2),
  -- P6: Whitefield (pool, gym, clubhouse, power, lift, security, tennis)
  ('cccccccc-0006-0000-0000-000000000006', 4),
  ('cccccccc-0006-0000-0000-000000000006', 3),
  ('cccccccc-0006-0000-0000-000000000006', 6),
  ('cccccccc-0006-0000-0000-000000000006', 10),
  ('cccccccc-0006-0000-0000-000000000006', 7),
  ('cccccccc-0006-0000-0000-000000000006', 1),
  ('cccccccc-0006-0000-0000-000000000006', 16),
  -- P7: Hinjewadi (power, gym, lift, security, clubhouse)
  ('cccccccc-0007-0000-0000-000000000007', 10),
  ('cccccccc-0007-0000-0000-000000000007', 3),
  ('cccccccc-0007-0000-0000-000000000007', 7),
  ('cccccccc-0007-0000-0000-000000000007', 1),
  ('cccccccc-0007-0000-0000-000000000007', 6),
  -- P8: Koramangala (wifi, cctv, lift)
  ('cccccccc-0008-0000-0000-000000000008', 13),
  ('cccccccc-0008-0000-0000-000000000008', 2),
  ('cccccccc-0008-0000-0000-000000000008', 7),
  -- P9: Penthouse (pool, gym, home theater, smart home, security)
  ('cccccccc-0009-0000-0000-000000000009', 4),
  ('cccccccc-0009-0000-0000-000000000009', 3),
  ('cccccccc-0009-0000-0000-000000000009', 17),
  ('cccccccc-0009-0000-0000-000000000009', 20),
  ('cccccccc-0009-0000-0000-000000000009', 1),
  -- P11: Gachibowli (pool, gym, clubhouse, power, lift, security, kids, jogging)
  ('cccccccc-0011-0000-0000-000000000011', 4),
  ('cccccccc-0011-0000-0000-000000000011', 3),
  ('cccccccc-0011-0000-0000-000000000011', 6),
  ('cccccccc-0011-0000-0000-000000000011', 10),
  ('cccccccc-0011-0000-0000-000000000011', 7),
  ('cccccccc-0011-0000-0000-000000000011', 1),
  ('cccccccc-0011-0000-0000-000000000011', 5),
  ('cccccccc-0011-0000-0000-000000000011', 19),
  -- P12: PG (wifi, cctv, lift)
  ('cccccccc-0012-0000-0000-000000000012', 13),
  ('cccccccc-0012-0000-0000-000000000012', 2),
  ('cccccccc-0012-0000-0000-000000000012', 7)
ON CONFLICT DO NOTHING;


-- ── 13. SAMPLE LEADS ─────────────────────────────────────────
INSERT INTO leads (property_id, owner_id, buyer_name, buyer_phone, buyer_email, message, status_id) VALUES
  ('cccccccc-0001-0000-0000-000000000001', 'bbbbbbbb-0001-0000-0000-000000000001',
   'Suresh Patel', '+919876600001', 'suresh@example.com',
   'I am interested in this property. Can we schedule a visit this weekend?', 1),
  ('cccccccc-0001-0000-0000-000000000001', 'bbbbbbbb-0001-0000-0000-000000000001',
   'Meera Iyer', '+919876600002', 'meera@example.com',
   'What is the final negotiated price? Is parking included?', 2),
  ('cccccccc-0006-0000-0000-000000000006', 'bbbbbbbb-0004-0000-0000-000000000004',
   'Rohit Nair', '+919876600003', null,
   'Looking for something in this budget. Are you open to a long-term lease?', 1),
  ('cccccccc-0009-0000-0000-000000000009', 'bbbbbbbb-0003-0000-0000-000000000003',
   'Arun Kapoor', '+919876600004', 'arun.kapoor@example.com',
   'This is a dream property. Can I visit tomorrow morning?', 3)
ON CONFLICT DO NOTHING;

END $$;

-- ── 14. USEFUL VIEWS FOR THE API ─────────────────────────────
-- Enriched property view — JOIN with city, locality, owner, images, amenities
CREATE OR REPLACE VIEW vw_properties AS
SELECT
  p.id,
  p.owner_id,
  p.city_id,
  p.locality_id,
  p.address_line,
  p.latitude,
  p.longitude,
  p.pin_code,
  p.property_type_id,
  p.listing_intent_id,
  p.title,
  p.description,
  p.bhk,
  p.bathrooms,
  p.area_sqft,
  p.floor_number,
  p.total_floors,
  p.age_years,
  p.price,
  p.is_price_negotiable,
  p.maintenance_per_month,
  p.furnishing_status_id,
  p.possession_status_id,
  p.available_from,
  p.is_rera_verified,
  p.rera_number,
  p.is_zero_brokerage,
  p.is_featured,
  p.is_active,
  p.view_count,
  p.lead_count,
  p.created_at,
  p.updated_at,
  -- Joined fields
  c.name  AS city_name,
  c.slug  AS city_slug,
  l.name  AS locality_name,
  l.slug  AS locality_slug,
  u.name  AS owner_name,
  u.phone AS owner_phone,
  u.email AS owner_email,
  -- Images array (ordered)
  COALESCE(
    ARRAY(SELECT url FROM property_images pi WHERE pi.property_id = p.id ORDER BY pi.sort_order, pi.created_at),
    ARRAY[]::TEXT[]
  ) AS images,
  -- Amenity labels array
  COALESCE(
    ARRAY(SELECT a.label FROM property_amenities pa JOIN amenities a ON a.id = pa.amenity_id WHERE pa.property_id = p.id),
    ARRAY[]::TEXT[]
  ) AS amenities
FROM properties p
LEFT JOIN cities     c ON c.id = p.city_id
LEFT JOIN localities l ON l.id = p.locality_id
LEFT JOIN users      u ON u.id = p.owner_id;

-- ── 15. DONE ─────────────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM properties WHERE is_active = true) AS active_properties,
  (SELECT COUNT(*) FROM cities)      AS cities,
  (SELECT COUNT(*) FROM localities)  AS localities,
  (SELECT COUNT(*) FROM users WHERE role_id = 2) AS owner_users,
  (SELECT COUNT(*) FROM property_images) AS property_images,
  (SELECT COUNT(*) FROM leads)           AS sample_leads;
