-- Paste this into Supabase SQL Editor

CREATE TABLE property_types (
    id SMALLINT PRIMARY KEY, code VARCHAR(30) UNIQUE NOT NULL, label VARCHAR(50) NOT NULL
);
INSERT INTO property_types VALUES
(1,'apartment','Apartment'),(2,'independent','Independent House / Villa'),
(3,'plot','Plot / Land'),(4,'pg','PG / Hostel'),(5,'commercial','Commercial'),(6,'short_stay','Short Stay / Vacation');

CREATE TABLE listing_intents (
    id SMALLINT PRIMARY KEY, code VARCHAR(20) UNIQUE NOT NULL, label VARCHAR(30) NOT NULL
);
INSERT INTO listing_intents VALUES (1,'buy','Buy'),(2,'rent','Rent');

CREATE TABLE furnishing_statuses (
    id SMALLINT PRIMARY KEY, code VARCHAR(20) UNIQUE NOT NULL, label VARCHAR(30) NOT NULL
);
INSERT INTO furnishing_statuses VALUES (1,'unfurnished','Unfurnished'),(2,'semi','Semi Furnished'),(3,'fully','Fully Furnished');

CREATE TABLE possession_statuses (
    id SMALLINT PRIMARY KEY, code VARCHAR(30) UNIQUE NOT NULL, label VARCHAR(50) NOT NULL
);
INSERT INTO possession_statuses VALUES (1,'ready','Ready to Move'),(2,'under_const','Under Construction'),(3,'new_launch','New Launch');

CREATE TABLE user_roles (
    id SMALLINT PRIMARY KEY, code VARCHAR(20) UNIQUE NOT NULL, label VARCHAR(30) NOT NULL
);
INSERT INTO user_roles VALUES (1,'buyer','Buyer / Tenant'),(2,'owner','Owner'),(3,'broker','Broker / Agent'),(4,'admin','Admin');

CREATE TABLE lead_statuses (
    id SMALLINT PRIMARY KEY, code VARCHAR(20) UNIQUE NOT NULL, label VARCHAR(30) NOT NULL
);
INSERT INTO lead_statuses VALUES (1,'new','New'),(2,'contacted','Contacted'),(3,'visited','Site Visited'),(4,'closed','Closed'),(5,'rejected','Not Interested');

CREATE TABLE amenity_categories (
    id SMALLINT PRIMARY KEY, code VARCHAR(30) UNIQUE NOT NULL, label VARCHAR(50) NOT NULL
);
INSERT INTO amenity_categories VALUES (1,'security','Security'),(2,'fitness','Fitness'),(3,'lifestyle','Lifestyle'),(4,'green','Green'),(5,'utility','Utilities');

CREATE TABLE states (
    id       SMALLINT PRIMARY KEY,
    code     CHAR(2)     UNIQUE NOT NULL,
    name     VARCHAR(60) NOT NULL,
    name_hi  VARCHAR(60),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE cities (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id  SMALLINT    NOT NULL,
    name      VARCHAR(80) NOT NULL,
    name_hi   VARCHAR(80),
    slug      VARCHAR(80) UNIQUE NOT NULL,
    latitude  DECIMAL(9,6),
    longitude DECIMAL(9,6),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE localities (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id   UUID        NOT NULL,
    name      VARCHAR(100) NOT NULL,
    name_hi   VARCHAR(100),
    slug      VARCHAR(100) NOT NULL,
    latitude  DECIMAL(9,6),
    longitude DECIMAL(9,6),
    pin_code  CHAR(6),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(city_id, slug)
);

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone         VARCHAR(15) UNIQUE NOT NULL,
    email         VARCHAR(150) UNIQUE,
    name          VARCHAR(100),
    role_id       SMALLINT NOT NULL DEFAULT 1,
    profile_pic   TEXT,
    is_verified   BOOLEAN DEFAULT FALSE,
    is_active     BOOLEAN DEFAULT TRUE,
    password_hash TEXT NOT NULL,
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ
);

CREATE TABLE properties (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id             UUID NOT NULL,
    city_id              UUID NOT NULL,
    locality_id          UUID NOT NULL,
    address_line         VARCHAR(200),
    latitude             DECIMAL(9,6),
    longitude            DECIMAL(9,6),
    pin_code             CHAR(6),
    property_type_id     SMALLINT NOT NULL DEFAULT 1,
    listing_intent_id    SMALLINT NOT NULL DEFAULT 1,
    title                VARCHAR(200) NOT NULL,
    description          TEXT,
    bhk                  SMALLINT,
    bathrooms            SMALLINT,
    area_sqft            DECIMAL(10,2) NOT NULL,
    price                DECIMAL(14,2) NOT NULL,
    is_rera_verified     BOOLEAN DEFAULT FALSE,
    is_zero_brokerage    BOOLEAN DEFAULT TRUE,
    is_active            BOOLEAN DEFAULT TRUE,
    created_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leads (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL,
    owner_id    UUID NOT NULL,
    buyer_name  VARCHAR(100) NOT NULL,
    buyer_phone VARCHAR(15)  NOT NULL,
    buyer_email VARCHAR(150),
    message     TEXT,
    status_id   SMALLINT DEFAULT 1,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
