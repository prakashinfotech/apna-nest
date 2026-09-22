-- ============================================================
-- ApnaNest — SQL Fixes for existing tables
-- Run these in Supabase SQL Editor to patch the 3 errors
-- ============================================================

-- ── FIX 1: states already exists — use ON CONFLICT (code) ──
INSERT INTO states (id, code, name) VALUES
  (1,'GJ','Gujarat'),(2,'KA','Karnataka'),(3,'MH','Maharashtra'),
  (4,'TG','Telangana'),(5,'DL','Delhi'),(6,'RJ','Rajasthan')
ON CONFLICT (code) DO NOTHING;

-- ── FIX 2: Add missing column to localities ─────────────────
ALTER TABLE localities ADD COLUMN IF NOT EXISTS avg_price_sqft DECIMAL(10,2);

-- ── FIX 3: Add missing column to users ──────────────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '';

-- ── Now re-run localities INSERT (safe — ON CONFLICT skips dupes) ──
INSERT INTO localities (id, city_id, name, slug, latitude, longitude, pin_code, description, avg_price_sqft) VALUES
  ('aaaaaaaa-0001-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Bopal','bopal',23.031500,72.472000,'380058','Fast-growing suburb with excellent schools and modern shopping districts.',7200),
  ('aaaaaaaa-0001-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','SG Highway','sg-highway',23.046900,72.510300,'380015','Commercial spine of Ahmedabad with vibrant corporate offices and retail.',6800),
  ('aaaaaaaa-0001-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Vastrapur','vastrapur',23.045600,72.532000,'380054','Lake-side neighbourhood loved for quiet streets and mature parks.',9500),
  ('aaaaaaaa-0001-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','Satellite','satellite',23.027800,72.522600,'380015','Upscale commercial and residential area near the river front.',8200),
  ('aaaaaaaa-0002-0000-0000-000000000001','22222222-2222-2222-2222-222222222222','Whitefield','whitefield',12.969800,77.750000,'560066','India''s largest tech hub, top choice for IT professionals.',12000),
  ('aaaaaaaa-0002-0000-0000-000000000002','22222222-2222-2222-2222-222222222222','Koramangala','koramangala',12.935200,77.624500,'560034','Cultural and startup heart of Bangalore with vibrant cafes.',15000),
  ('aaaaaaaa-0003-0000-0000-000000000001','33333333-3333-3333-3333-333333333333','Bandra West','bandra-west',19.054400,72.830500,'400050','Most premium sea-facing neighbourhood in Mumbai.',28000),
  ('aaaaaaaa-0003-0000-0000-000000000002','33333333-3333-3333-3333-333333333333','Powai','powai',19.121600,72.905000,'400076','Lakefront living with corporate offices and premium schools.',18000),
  ('aaaaaaaa-0004-0000-0000-000000000001','44444444-4444-4444-4444-444444444444','Hinjewadi','hinjewadi',18.591200,73.738800,'411057','Pune''s most prominent IT corridor with strong rental yields.',8400),
  ('aaaaaaaa-0004-0000-0000-000000000002','44444444-4444-4444-4444-444444444444','Kharadi','kharadi',18.553200,73.948700,'411014','Emerging IT hub east of Pune with modern gated communities.',7200),
  ('aaaaaaaa-0005-0000-0000-000000000001','55555555-5555-5555-5555-555555555555','Hauz Khas','hauz-khas',28.549400,77.200100,'110016','Upscale neighbourhood near Deer Park with art galleries and cafes.',22000),
  ('aaaaaaaa-0006-0000-0000-000000000001','66666666-6666-6666-6666-666666666666','Gachibowli','gachibowli',17.440100,78.348900,'500032','Hyderabad''s financial district with premium communities.',9200)
ON CONFLICT (city_id, slug) DO NOTHING;

-- ── Re-run users INSERT ──────────────────────────────────────
INSERT INTO users (id, phone, email, name, role_id, is_verified, is_active, password_hash) VALUES
  ('bbbbbbbb-0001-0000-0000-000000000001','+919876511111','rajesh@example.com','Rajesh Kumar',2,true,true,'DEMO_HASH_RESET_VIA_API'),
  ('bbbbbbbb-0002-0000-0000-000000000002','+919876522222','priya@example.com','Priya Sharma',2,true,true,'DEMO_HASH_RESET_VIA_API'),
  ('bbbbbbbb-0003-0000-0000-000000000003','+919876533333','aakash@example.com','Aakash Mehta',2,true,true,'DEMO_HASH_RESET_VIA_API'),
  ('bbbbbbbb-0004-0000-0000-000000000004','+919876544444','anita@example.com','Anita Shah',2,true,true,'DEMO_HASH_RESET_VIA_API'),
  ('bbbbbbbb-0099-0000-0000-000000000099','+919000000001','admin@apnanest.in','ApnaNest Admin',4,true,true,'DEMO_HASH_RESET_VIA_API')
ON CONFLICT (phone) DO NOTHING;

-- ── Verify final counts ──────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM states)     AS states,
  (SELECT COUNT(*) FROM cities)     AS cities,
  (SELECT COUNT(*) FROM localities) AS localities,
  (SELECT COUNT(*) FROM users WHERE role_id = 2) AS owner_users;
