-- ============================================================
-- ApnaNest — Additional 30 properties with open-source
-- Indian real estate reference data
-- Safe to run multiple times (ON CONFLICT DO NOTHING)
-- ============================================================

-- ── Add more localities first ────────────────────────────────
INSERT INTO localities (id, city_id, name, slug, latitude, longitude, pin_code, description, avg_price_sqft) VALUES
  ('aaaaaaaa-0001-0000-0000-000000000005','11111111-1111-1111-1111-111111111111','Thaltej','thaltej',23.0623,72.5082,'380054','Emerging premium corridor connecting Bopal with SG Highway. Popular with HNI buyers.',8800),
  ('aaaaaaaa-0001-0000-0000-000000000006','11111111-1111-1111-1111-111111111111','Prahlad Nagar','prahlad-nagar',23.0264,72.5077,'380015','Upscale commercial and residential hub with excellent metro connectivity.',9200),
  ('aaaaaaaa-0002-0000-0000-000000000003','22222222-2222-2222-2222-222222222222','Marathahalli','marathahalli',12.9591,77.6972,'560037','Busy IT hub between Whitefield and Electronic City. High rental demand.',10000),
  ('aaaaaaaa-0002-0000-0000-000000000004','22222222-2222-2222-2222-222222222222','HSR Layout','hsr-layout',12.9116,77.6389,'560102','Well-planned BDA layout popular with young professionals and startups.',13500),
  ('aaaaaaaa-0003-0000-0000-000000000003','33333333-3333-3333-3333-333333333333','Andheri West','andheri-west',19.1255,72.8342,'400053','Premier residential neighbourhood close to the business district and airports.',20000),
  ('aaaaaaaa-0003-0000-0000-000000000004','33333333-3333-3333-3333-333333333333','Navi Mumbai Sector 7','navi-mumbai-sector7',19.0176,73.0189,'400703','Planned township with wide roads, parks and excellent NMMT bus connectivity.',9500),
  ('aaaaaaaa-0004-0000-0000-000000000003','44444444-4444-4444-4444-444444444444','Wakad','wakad',18.5998,73.7620,'411057','Fast-growing Pune suburb adjacent to Hinjewadi IT park. Strong infrastructure.',7800),
  ('aaaaaaaa-0004-0000-0000-000000000004','44444444-4444-4444-4444-444444444444','Baner','baner',18.5590,73.7842,'411021','Upscale Pune neighbourhood with excellent schools, cafes and highway access.',9800),
  ('aaaaaaaa-0005-0000-0000-000000000002','55555555-5555-5555-5555-555555555555','Dwarka Sector 10','dwarka-sector10',28.5750,77.0596,'110075','Planned Delhi township with Metro connectivity and affordable housing.',8500),
  ('aaaaaaaa-0005-0000-0000-000000000003','55555555-5555-5555-5555-555555555555','Vasant Kunj','vasant-kunj',28.5209,77.1566,'110070','Leafy south Delhi neighbourhood close to Ambiance Mall and IGI airport.',18000),
  ('aaaaaaaa-0006-0000-0000-000000000002','66666666-6666-6666-6666-666666666666','Hitech City','hitech-city',17.4486,78.3908,'500081','Hyderabad''s original IT nucleus with premium high-rises and MMTS rail.',10500),
  ('aaaaaaaa-0006-0000-0000-000000000003','66666666-6666-6666-6666-666666666666','Madhapur','madhapur',17.4400,78.3827,'500081','Adjacent to Hitech City with dense residential supply and good amenities.',9800)
ON CONFLICT (city_id, slug) DO NOTHING;

-- ── Additional 30 properties ─────────────────────────────────
DO $$
DECLARE
  -- New locality IDs
  l_thaltej      UUID := 'aaaaaaaa-0001-0000-0000-000000000005';
  l_prahlad      UUID := 'aaaaaaaa-0001-0000-0000-000000000006';
  l_mara         UUID := 'aaaaaaaa-0002-0000-0000-000000000003';
  l_hsr          UUID := 'aaaaaaaa-0002-0000-0000-000000000004';
  l_andheri      UUID := 'aaaaaaaa-0003-0000-0000-000000000003';
  l_navi         UUID := 'aaaaaaaa-0003-0000-0000-000000000004';
  l_wakad        UUID := 'aaaaaaaa-0004-0000-0000-000000000003';
  l_baner        UUID := 'aaaaaaaa-0004-0000-0000-000000000004';
  l_dwarka       UUID := 'aaaaaaaa-0005-0000-0000-000000000002';
  l_vasant       UUID := 'aaaaaaaa-0005-0000-0000-000000000003';
  l_hitech       UUID := 'aaaaaaaa-0006-0000-0000-000000000002';
  l_madhapur     UUID := 'aaaaaaaa-0006-0000-0000-000000000003';

  -- Existing locality IDs
  l_bopal        UUID := 'aaaaaaaa-0001-0000-0000-000000000001';
  l_sg_hwy       UUID := 'aaaaaaaa-0001-0000-0000-000000000002';
  l_vastrapur    UUID := 'aaaaaaaa-0001-0000-0000-000000000003';
  l_whitefield   UUID := 'aaaaaaaa-0002-0000-0000-000000000001';
  l_koramangala  UUID := 'aaaaaaaa-0002-0000-0000-000000000002';
  l_bandra       UUID := 'aaaaaaaa-0003-0000-0000-000000000001';
  l_hinjewadi    UUID := 'aaaaaaaa-0004-0000-0000-000000000001';
  l_gachib       UUID := 'aaaaaaaa-0006-0000-0000-000000000001';

  -- City IDs
  c_ahm UUID := '11111111-1111-1111-1111-111111111111';
  c_blr UUID := '22222222-2222-2222-2222-222222222222';
  c_mum UUID := '33333333-3333-3333-3333-333333333333';
  c_pne UUID := '44444444-4444-4444-4444-444444444444';
  c_del UUID := '55555555-5555-5555-5555-555555555555';
  c_hyd UUID := '66666666-6666-6666-6666-666666666666';

  -- Owner IDs
  u1 UUID := 'bbbbbbbb-0001-0000-0000-000000000001';
  u2 UUID := 'bbbbbbbb-0002-0000-0000-000000000002';
  u3 UUID := 'bbbbbbbb-0003-0000-0000-000000000003';
  u4 UUID := 'bbbbbbbb-0004-0000-0000-000000000004';

BEGIN

INSERT INTO properties
  (id, owner_id, city_id, locality_id, address_line, latitude, longitude, pin_code,
   property_type_id, listing_intent_id, title, description, bhk, bathrooms, area_sqft,
   floor_number, total_floors, age_years, price, is_price_negotiable, maintenance_per_month,
   furnishing_status_id, possession_status_id, is_rera_verified, rera_number,
   is_zero_brokerage, is_featured, is_active, view_count)
VALUES

-- ─── AHMEDABAD ────────────────────────────────────────────────────────────────
('cccccccc-0021-0000-0000-000000000021', u2, c_ahm, l_thaltej,
 'Thaltej Cross Road, Ahmedabad', 23.0623, 72.5082, '380054',
 1, 1, '2BHK Ready Flat in Thaltej — Metro Accessible',
 'Modern 2BHK in a gated society just 5 minutes from Thaltej metro station. Vastu-compliant, corner flat with cross-ventilation. Brand new complex with EV charging.',
 2, 2, 960, 4, 10, 0, 7200000, true, 2600, 2, 1, true, 'GJ/AHMD/2024/002211',
 false, false, true, 412),

('cccccccc-0022-0000-0000-000000000022', u1, c_ahm, l_prahlad,
 'Prahlad Nagar Corporate Road, Ahmedabad', 23.0264, 72.5077, '380015',
 5, 1, 'Premium Office Space for Lease — Prahlad Nagar',
 'Class-A commercial office space on the 6th floor. BTS fitout available. 24/7 HVAC, 2 dedicated car parks, high-speed optical fibre. Adjacent to corporate park.',
 NULL, 3, 1200, 6, 14, 0, 18000000, true, 15000, 3, 1, true, 'GJ/AHMD/2022/009988',
 false, false, true, 189),

('cccccccc-0023-0000-0000-000000000023', u3, c_ahm, l_bopal,
 'Bopal Ambli Road, Ahmedabad', 23.0290, 72.4650, '380058',
 1, 2, '3BHK for Rent in Bopal — Schools Nearby',
 'Spacious 3BHK available for rent near premier schools (Udgam, DPS). Semi-furnished with wardrobes and modular kitchen. Society has swimming pool. No brokerage.',
 3, 3, 1380, 7, 12, 3, 28000, false, 3500, 2, 1, false, NULL,
 true, false, true, 621),

('cccccccc-0024-0000-0000-000000000024', u4, c_ahm, l_vastrapur,
 'Vastrapur, Near Lake, Ahmedabad', 23.0445, 72.5335, '380054',
 2, 1, 'Independent Bungalow for Sale, Vastrapur',
 'Elegant 3BHK independent bungalow in prime Vastrapur location, 200 metres from the lake. Private garden, terrace, covered parking for 2 cars. RERA approved.',
 3, 3, 2400, 0, 2, 8, 19500000, true, NULL, 2, 1, true, NULL,
 false, false, true, 543),

-- ─── BANGALORE ───────────────────────────────────────────────────────────────
('cccccccc-0025-0000-0000-000000000025', u1, c_blr, l_mara,
 'Outer Ring Road, Marathahalli, Bangalore', 12.9591, 77.6972, '560037',
 1, 2, '2BHK Rental near ORR — IT Commuters Paradise',
 'Fully furnished 2BHK with built-in wardrobes and ACs in every room. Walking distance to major IT campuses on Outer Ring Road. Society has gym and rooftop lounge.',
 2, 2, 1050, 5, 8, 2, 26000, false, NULL, 3, 1, false, NULL,
 false, false, true, 934),

('cccccccc-0026-0000-0000-000000000026', u2, c_blr, l_hsr,
 '27th Main, HSR Layout, Bangalore', 12.9116, 77.6389, '560102',
 7, 2, '3BHK Builder Floor, HSR Layout Sector 2',
 'Independent builder floor in a quiet lane of HSR Layout. 3 bedrooms, 3 bathrooms, large living area. Semi-furnished. Walking distance to HSR BDA complex.',
 3, 3, 1650, 2, 4, 5, 48000, false, NULL, 2, 1, false, NULL,
 false, false, true, 388),

('cccccccc-0027-0000-0000-000000000027', u3, c_blr, l_koramangala,
 '8th Block, Koramangala, Bangalore', 12.9300, 77.6210, '560095',
 5, 1, 'Retail Shop for Sale, Koramangala 8th Block',
 'Ground floor retail space in Koramangala''s busiest commercial stretch. Excellent footfall, surrounded by cafes, gyms and offices. Suitable for food, pharmacy, salon.',
 NULL, 1, 400, 0, 5, 3, 8500000, true, NULL, 3, 1, false, NULL,
 false, false, true, 267),

('cccccccc-0028-0000-0000-000000000028', u4, c_blr, l_whitefield,
 'Prestige Shantiniketan, Whitefield, Bangalore', 12.9720, 77.7390, '560066',
 1, 1, '4BHK Luxury Apartment in Prestige Shantiniketan',
 'Ultra-premium 4BHK in Bangalore''s most iconic integrated township. Full club access, concierge, 3 covered parks. Proximity to ITPL and EPIP zone.',
 4, 4, 2800, 15, 22, 4, 38000000, false, 8000, 3, 1, true, 'KA/BANG/2021/011234',
 false, true, true, 2156),

-- ─── MUMBAI ─────────────────────────────────────────────────────────────────
('cccccccc-0029-0000-0000-000000000029', u1, c_mum, l_andheri,
 'Versova Road, Andheri West, Mumbai', 19.1255, 72.8342, '400053',
 1, 2, '2BHK Flat for Rent near Versova Metro',
 'Well-maintained 2BHK with new paint job, just 800m from Versova Metro station. Ground floor with private garden access. Pets allowed.',
 2, 2, 920, 1, 6, 10, 55000, false, NULL, 2, 1, false, NULL,
 true, false, true, 712),

('cccccccc-0030-0000-0000-000000000030', u2, c_mum, l_navi,
 'Palm Beach Road, Nerul, Navi Mumbai', 19.0176, 73.0189, '400706',
 1, 1, '2BHK Apartment — Palm Beach Road, Nerul',
 '2BHK in a premium society on Palm Beach Road with a view of the creek. Club with tennis court, gym and pool. Ideal for couples and small families.',
 2, 2, 1080, 9, 16, 6, 11500000, true, 4200, 2, 1, true, NULL,
 false, false, true, 583),

('cccccccc-0031-0000-0000-000000000031', u3, c_mum, l_bandra,
 'Hill Road, Bandra West, Mumbai', 19.0530, 72.8280, '400050',
 1, 1, '3BHK Apartment, Sea View, Hill Road Bandra',
 'Rare 3BHK with partial sea view on Hill Road. Renovated with Italian marble, open-plan kitchen, two balconies. 5-minute walk to Mount Mary Church and promenade.',
 3, 3, 1800, 6, 12, 15, 62000000, false, 18000, 3, 1, false, NULL,
 false, true, true, 1834),

-- ─── PUNE ───────────────────────────────────────────────────────────────────
('cccccccc-0032-0000-0000-000000000032', u4, c_pne, l_wakad,
 'Wakad Road, Wakad, Pune', 18.5998, 73.7620, '411057',
 1, 1, '2BHK New Launch — Wakad, Near Hinjewadi',
 'New under-construction 2BHK in a RERA-registered project. Possession in 18 months. 3 minutes from Rajiv Gandhi IT Park. Interest-subvention scheme available.',
 2, 2, 870, 3, 12, 0, 6800000, false, 3000, 1, 2, true, 'MH/PUNE/2024/003344',
 false, false, true, 334),

('cccccccc-0033-0000-0000-000000000033', u1, c_pne, l_baner,
 'Baner Road, Baner, Pune', 18.5590, 73.7842, '411021',
 1, 2, '3BHK Fully Furnished in Baner — Expat Grade',
 'Expat-grade furnished 3BHK with modular kitchen, 3 ACs, smart TV, premium bathrooms. Society with pool, gym, co-working space. Pet-friendly.',
 3, 3, 1520, 8, 14, 2, 55000, false, NULL, 3, 1, false, NULL,
 true, false, true, 829),

('cccccccc-0034-0000-0000-000000000034', u2, c_pne, l_hinjewadi,
 'Hinjewadi Phase 3, Pune', 18.5820, 73.7200, '411057',
 3, 1, 'RERA Plot for Sale, Hinjewadi Phase 3',
 'Commercial/residential NA plot in Hinjewadi Phase 3. Excellent appreciation potential. MIDC and Phase 3 IT park within 1km. Clear title and registered layout.',
 NULL, NULL, 2400, NULL, NULL, 0, 8400000, true, NULL, 1, 1, true, 'MH/PUNE/2024/006677',
 false, false, true, 245),

-- ─── DELHI ─────────────────────────────────────────────────────────────────
('cccccccc-0035-0000-0000-000000000035', u3, c_del, l_dwarka,
 'Sector 10, Dwarka, New Delhi', 28.5750, 77.0596, '110075',
 1, 1, '3BHK Builder Floor, Dwarka Sector 10',
 'Well-constructed 3BHK builder floor in Dwarka''s most sought-after sector. Metro station walking distance, schools and hospital nearby. Vastu-compliant.',
 3, 3, 1400, 2, 3, 6, 14500000, true, NULL, 2, 1, false, NULL,
 false, false, true, 623),

('cccccccc-0036-0000-0000-000000000036', u4, c_del, l_vasant,
 'Vasant Enclave, Vasant Kunj, New Delhi', 28.5209, 77.1566, '110070',
 2, 1, '4BHK Villa in Vasant Enclave, South Delhi',
 'Elegant 4BHK independent villa in prestigious Vasant Enclave. Terrace garden, covered parking for 3 cars, central AC. Close to DLF Promenade and Ambiance.',
 4, 4, 3500, 0, 3, 12, 55000000, false, NULL, 3, 1, false, NULL,
 false, true, true, 1423),

('cccccccc-0037-0000-0000-000000000037', u1, c_del, l_dwarka,
 'Sector 18B, Dwarka, New Delhi', 28.5660, 77.0540, '110078',
 1, 2, '2BHK for Rent, Dwarka Sector 18B — Affordable',
 'Affordable 2BHK available for rent in Dwarka. 10-minute walk to sector 9 metro. Ideal for couples or small families. Zero brokerage.',
 2, 2, 1100, 3, 4, 8, 20000, false, NULL, 2, 1, false, NULL,
 true, false, true, 456),

-- ─── HYDERABAD ─────────────────────────────────────────────────────────────
('cccccccc-0038-0000-0000-000000000038', u2, c_hyd, l_hitech,
 'Hitech City Main Road, Hyderabad', 17.4486, 78.3908, '500081',
 1, 1, '3BHK Premium Flat, Hitech City — Walk to Office',
 'Move-in-ready 3BHK adjacent to Cyber Towers. High-floor unit with city views. Excellent club with 3 pools, squash court and wellness spa.',
 3, 3, 1780, 18, 28, 3, 16500000, false, 6500, 3, 1, true, 'TS/HYD/2022/007712',
 false, true, true, 1812),

('cccccccc-0039-0000-0000-000000000039', u3, c_hyd, l_madhapur,
 'Jubilee Enclave, Madhapur, Hyderabad', 17.4400, 78.3827, '500081',
 1, 2, '2BHK Fully Furnished in Madhapur — IT Ready',
 'Fully furnished 2BHK with high-speed broadband, UPS backup, AC in all rooms. Walking distance to Cyber Towers and T-Hub. Flexible lease terms.',
 2, 2, 1050, 4, 10, 2, 28000, false, NULL, 3, 1, false, NULL,
 false, false, true, 734),

('cccccccc-0040-0000-0000-000000000040', u4, c_hyd, l_gachib,
 'ISB Road, Gachibowli, Hyderabad', 17.4320, 78.3560, '500032',
 2, 1, 'Luxury Villa — ISB Road Gachibowli',
 'Ultra-luxury villa in a gated enclave on ISB Road. Steps from IIM Udaipur campus. 4 bedrooms, private terrace with Hussain Sagar view, heated pool, smart home.',
 4, 4, 4000, 0, 3, 0, 45000000, false, NULL, 3, 3, true, 'TS/HYD/2024/001122',
 false, true, true, 2312),

-- ─── MORE ACROSS CITIES ───────────────────────────────────────────────────
('cccccccc-0041-0000-0000-000000000041', u1, c_ahm, l_sg_hwy,
 'SG Highway, Near CIMS Hospital, Ahmedabad', 23.0510, 72.5120, '380060',
 4, 3, 'PG / Co-living near CIMS Hospital, SG Highway',
 'Premium co-living space ideal for doctors, interns and hospital staff. AC rooms, meals included, 24/7 security, housekeeping. On-demand laundry service.',
 1, 1, 280, 1, 5, 2, 14000, false, NULL, 3, 1, false, NULL,
 true, false, true, 567),

('cccccccc-0042-0000-0000-000000000042', u2, c_blr, l_hsr,
 'HSR Layout Sector 1, Bangalore', 12.9180, 77.6340, '560102',
 1, 1, '2BHK Investment Property, HSR Sector 1',
 'Excellent 2BHK in a newly delivered project in HSR. Clean title. Rental yield 4.2% pa. Corner unit, 3 balconies, 2 covered parks. RERA registered.',
 2, 2, 1150, 7, 12, 0, 12800000, false, 3800, 2, 1, true, 'KA/BANG/2024/002345',
 false, false, true, 389),

('cccccccc-0043-0000-0000-000000000043', u3, c_pne, l_baner,
 'Balewadi Road, Baner, Pune', 18.5630, 73.7780, '411021',
 1, 1, '3BHK in Baner — Newly Developed Society',
 'Contemporary 3BHK in an award-winning green society in Baner. Features rainwater harvesting, EV charging bays, solar-powered common areas. Schools and metro nearby.',
 3, 3, 1480, 5, 15, 0, 13200000, true, 4800, 2, 3, true, 'MH/PUNE/2024/007788',
 false, false, true, 412),

('cccccccc-0044-0000-0000-000000000044', u4, c_mum, l_andheri,
 'DN Nagar, Andheri West, Mumbai', 19.1060, 72.8340, '400053',
 1, 1, '1BHK Affordable Flat, Andheri West',
 'Compact but smart 1BHK in a well-maintained building. Ideal for first-time buyers or investors seeking rental income. 1km from D.N. Nagar metro station.',
 1, 1, 550, 4, 8, 12, 9500000, true, 2500, 2, 1, false, NULL,
 false, false, true, 723),

('cccccccc-0045-0000-0000-000000000045', u1, c_hyd, l_hitech,
 'Cyber Gateway, Hitech City, Hyderabad', 17.4501, 78.3891, '500081',
 5, 2, 'Managed Office Space for Rent, Cyber Gateway',
 'Plug-and-play 12-seat managed office in Cyber Gateway Tower 2. Includes high-speed internet, conference rooms, printing and pantry. 6-month minimum.',
 NULL, 2, 600, 12, 25, 5, 180000, false, NULL, 3, 1, false, NULL,
 false, false, true, 298),

('cccccccc-0046-0000-0000-000000000046', u2, c_del, l_hauz_khas,
 'Hauz Khas Village, New Delhi', 28.5510, 77.2030, '110016',
 1, 1, '2BHK Studio Apartment — Hauz Khas Village',
 'Artsy studio apartment in the heart of Hauz Khas Village. Exposed brick, skylight, open kitchen. Surrounded by galleries, restaurants and Deer Park.',
 2, 1, 750, 3, 5, 20, 15000000, false, NULL, 3, 1, false, NULL,
 false, false, true, 834),

('cccccccc-0047-0000-0000-000000000047', u3, c_ahm, l_bopal,
 'Bopal Extension, Ahmedabad', 23.0185, 72.4560, '380058',
 3, 1, 'Residential Plot in Bopal Extension — Corner',
 'East-facing corner plot in a fully developed residential layout. All utilities available. 2-side road access. RERA-approved layout. 3km from Bopal Circle.',
 NULL, NULL, 1800, NULL, NULL, 0, 5400000, true, NULL, 1, 1, true, 'GJ/AHMD/2023/010023',
 false, false, true, 312),

('cccccccc-0048-0000-0000-000000000048', u4, c_blr, l_mara,
 'Outer Ring Road, Marathahalli, Bangalore', 12.9620, 77.7010, '560037',
 1, 1, '3BHK Near ITPL, Marathahalli — Verified',
 'RERA-verified 3BHK in a premium society near ITPL. World-class club with cricket net, squash, basketball. Dedicated school bus stops. High rental potential.',
 3, 3, 1680, 9, 20, 2, 15800000, false, 5200, 2, 1, true, 'KA/BANG/2023/008901',
 false, false, true, 1234),

('cccccccc-0049-0000-0000-000000000049', u1, c_pne, l_wakad,
 'Wakad Bridge, Wakad, Pune', 18.6050, 73.7580, '411057',
 1, 2, '1BHK Ready to Move, Wakad — Zero Brokerage',
 'Ready-to-move 1BHK in Wakad at competitive rent. Walking distance to PCMC bus depot and Xion Mall. Owner-direct listing.',
 1, 1, 580, 3, 7, 4, 14000, false, NULL, 2, 1, false, NULL,
 true, false, true, 567),

('cccccccc-0050-0000-0000-000000000050', u2, c_mum, l_bandra,
 'Pali Hill, Bandra West, Mumbai', 19.0600, 72.8260, '400050',
 2, 2, 'Bungalow for Rent, Pali Hill — Bollywood Address',
 'Iconic standalone bungalow on Pali Hill available for premium monthly rental. 3 bedrooms, private garden, covered garage. Former celebrity residence.',
 3, 3, 2800, 0, 2, 35, 350000, false, NULL, 3, 1, false, NULL,
 false, false, true, 4521)

ON CONFLICT (id) DO NOTHING;

-- ── Images for new properties ────────────────────────────────
INSERT INTO property_images (property_id, url, is_primary, sort_order) VALUES
  ('cccccccc-0021-0000-0000-000000000021','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',true,0),
  ('cccccccc-0021-0000-0000-000000000021','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',false,1),
  ('cccccccc-0022-0000-0000-000000000022','https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',true,0),
  ('cccccccc-0023-0000-0000-000000000023','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',true,0),
  ('cccccccc-0023-0000-0000-000000000023','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',false,1),
  ('cccccccc-0024-0000-0000-000000000024','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',true,0),
  ('cccccccc-0025-0000-0000-000000000025','https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',true,0),
  ('cccccccc-0026-0000-0000-000000000026','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',true,0),
  ('cccccccc-0027-0000-0000-000000000027','https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',true,0),
  ('cccccccc-0028-0000-0000-000000000028','https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',true,0),
  ('cccccccc-0028-0000-0000-000000000028','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',false,1),
  ('cccccccc-0029-0000-0000-000000000029','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',true,0),
  ('cccccccc-0030-0000-0000-000000000030','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',true,0),
  ('cccccccc-0031-0000-0000-000000000031','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',true,0),
  ('cccccccc-0031-0000-0000-000000000031','https://images.unsplash.com/photo-1600566753376-12c8ab8c17e8?w=800&q=80',false,1),
  ('cccccccc-0032-0000-0000-000000000032','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',true,0),
  ('cccccccc-0033-0000-0000-000000000033','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',true,0),
  ('cccccccc-0034-0000-0000-000000000034','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',true,0),
  ('cccccccc-0035-0000-0000-000000000035','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',true,0),
  ('cccccccc-0036-0000-0000-000000000036','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',true,0),
  ('cccccccc-0036-0000-0000-000000000036','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',false,1),
  ('cccccccc-0037-0000-0000-000000000037','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',true,0),
  ('cccccccc-0038-0000-0000-000000000038','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',true,0),
  ('cccccccc-0038-0000-0000-000000000038','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',false,1),
  ('cccccccc-0039-0000-0000-000000000039','https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80',true,0),
  ('cccccccc-0040-0000-0000-000000000040','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',true,0),
  ('cccccccc-0040-0000-0000-000000000040','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',false,1),
  ('cccccccc-0041-0000-0000-000000000041','https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',true,0),
  ('cccccccc-0042-0000-0000-000000000042','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',true,0),
  ('cccccccc-0043-0000-0000-000000000043','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',true,0),
  ('cccccccc-0044-0000-0000-000000000044','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',true,0),
  ('cccccccc-0045-0000-0000-000000000045','https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',true,0),
  ('cccccccc-0046-0000-0000-000000000046','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',true,0),
  ('cccccccc-0047-0000-0000-000000000047','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',true,0),
  ('cccccccc-0048-0000-0000-000000000048','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',true,0),
  ('cccccccc-0048-0000-0000-000000000048','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',false,1),
  ('cccccccc-0049-0000-0000-000000000049','https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80',true,0),
  ('cccccccc-0050-0000-0000-000000000050','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',true,0),
  ('cccccccc-0050-0000-0000-000000000050','https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',false,1)
ON CONFLICT DO NOTHING;

-- ── Final count ──────────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM properties WHERE is_active = true)  AS total_properties,
  (SELECT COUNT(*) FROM localities)                          AS total_localities,
  (SELECT COUNT(*) FROM property_images)                     AS total_images,
  (SELECT COUNT(*) FROM vw_properties WHERE is_active = true) AS via_view;
END $$;
