-- ============================================================
-- Fix: Add missing columns to existing properties table
-- then recreate vw_properties view
-- Run in Supabase SQL Editor
-- ============================================================

-- ── 1. Add all missing columns to properties ───────────────
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS deleted_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_featured          BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS view_count           INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lead_count           INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS floor_number         SMALLINT,
  ADD COLUMN IF NOT EXISTS total_floors         SMALLINT,
  ADD COLUMN IF NOT EXISTS age_years            SMALLINT,
  ADD COLUMN IF NOT EXISTS is_price_negotiable  BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS maintenance_per_month DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS furnishing_status_id  SMALLINT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS possession_status_id  SMALLINT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS available_from        DATE,
  ADD COLUMN IF NOT EXISTS rera_number           VARCHAR(40),
  ADD COLUMN IF NOT EXISTS area_sqft_carpet      DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS pin_code              CHAR(6),
  ADD COLUMN IF NOT EXISTS latitude              DECIMAL(9,6),
  ADD COLUMN IF NOT EXISTS longitude             DECIMAL(9,6);

-- ── 2. Make sure required tables exist ─────────────────────
CREATE TABLE IF NOT EXISTS cities (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id   SMALLINT,
    name       VARCHAR(80) NOT NULL,
    name_hi    VARCHAR(80),
    slug       VARCHAR(80) UNIQUE NOT NULL,
    latitude   DECIMAL(9,6),
    longitude  DECIMAL(9,6),
    is_active  BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS localities (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id        UUID NOT NULL,
    name           VARCHAR(100) NOT NULL,
    slug           VARCHAR(100) NOT NULL,
    latitude       DECIMAL(9,6),
    longitude      DECIMAL(9,6),
    pin_code       CHAR(6),
    description    TEXT,
    avg_price_sqft DECIMAL(10,2),
    is_active      BOOLEAN DEFAULT TRUE,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(city_id, slug)
);
ALTER TABLE localities ADD COLUMN IF NOT EXISTS avg_price_sqft DECIMAL(10,2);

CREATE TABLE IF NOT EXISTS property_images (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL,
    url         TEXT NOT NULL,
    is_primary  BOOLEAN DEFAULT FALSE,
    sort_order  SMALLINT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_propimg_prop ON property_images(property_id);

CREATE TABLE IF NOT EXISTS property_amenities (
    property_id UUID     NOT NULL,
    amenity_id  SMALLINT NOT NULL,
    PRIMARY KEY (property_id, amenity_id)
);

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

CREATE TABLE IF NOT EXISTS saved_properties (
    user_id     UUID NOT NULL,
    property_id UUID NOT NULL,
    saved_at    TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, property_id)
);

-- ── 3. Drop and recreate vw_properties view ────────────────
DROP VIEW IF EXISTS vw_properties;

CREATE VIEW vw_properties AS
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
  p.deleted_at,
  -- Joined fields
  COALESCE(c.name, '')  AS city_name,
  COALESCE(c.slug, '')  AS city_slug,
  COALESCE(l.name, '')  AS locality_name,
  COALESCE(l.slug, '')  AS locality_slug,
  u.name   AS owner_name,
  u.phone  AS owner_phone,
  u.email  AS owner_email,
  -- Images array (ordered by sort_order)
  COALESCE(
    ARRAY(
      SELECT pi.url
      FROM property_images pi
      WHERE pi.property_id = p.id
      ORDER BY pi.sort_order, pi.created_at
    ),
    ARRAY[]::TEXT[]
  ) AS images,
  -- Amenity labels array
  COALESCE(
    ARRAY(
      SELECT a.label
      FROM property_amenities pa
      JOIN amenities a ON a.id = pa.amenity_id
      WHERE pa.property_id = p.id
    ),
    ARRAY[]::TEXT[]
  ) AS amenities,
  -- Computed label helpers
  CASE p.property_type_id
    WHEN 1 THEN 'Apartment'
    WHEN 2 THEN 'Villa'
    WHEN 3 THEN 'Plot'
    WHEN 4 THEN 'PG'
    WHEN 5 THEN 'Commercial'
    WHEN 6 THEN 'Studio'
    WHEN 7 THEN 'Builder Floor'
    ELSE 'Property'
  END AS property_type_name,
  CASE p.listing_intent_id
    WHEN 1 THEN 'Buy'
    WHEN 2 THEN 'Rent'
    WHEN 3 THEN 'PG'
    ELSE 'Rent'
  END AS listing_intent_name,
  CASE p.furnishing_status_id
    WHEN 1 THEN 'Unfurnished'
    WHEN 2 THEN 'Semi Furnished'
    WHEN 3 THEN 'Fully Furnished'
    ELSE 'Unfurnished'
  END AS furnishing_label,
  CASE p.possession_status_id
    WHEN 1 THEN 'Ready to Move'
    WHEN 2 THEN 'Under Construction'
    WHEN 3 THEN 'New Launch'
    ELSE 'Ready to Move'
  END AS possession_label
FROM properties p
LEFT JOIN cities     c ON c.id = p.city_id
LEFT JOIN localities l ON l.id = p.locality_id
LEFT JOIN users      u ON u.id = p.owner_id;

-- ── 4. Quick sanity check ──────────────────────────────────
SELECT COUNT(*) AS properties_in_view FROM vw_properties WHERE is_active = true;
