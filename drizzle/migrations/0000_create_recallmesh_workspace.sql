CREATE TABLE public.investigations (
  id text PRIMARY KEY,
  title text NOT NULL,
  domain text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  confidence integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Open',
  date text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  risk_score integer NOT NULL DEFAULT 0,
  evidence integer NOT NULL DEFAULT 0,
  identifier text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.suppliers (
  id text PRIMARY KEY,
  name text NOT NULL,
  country text NOT NULL,
  city text NOT NULL DEFAULT '',
  tier integer NOT NULL DEFAULT 1,
  risk integer NOT NULL DEFAULT 0,
  severity text NOT NULL DEFAULT 'low',
  category text NOT NULL DEFAULT '',
  single_source boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'Needs verification',
  lei_code text NOT NULL DEFAULT '',
  esg_score integer NOT NULL DEFAULT 0,
  lead_time_days integer NOT NULL DEFAULT 0,
  certifications text[] NOT NULL DEFAULT '{}',
  last_audit_date text NOT NULL DEFAULT '',
  downstream_products text[] NOT NULL DEFAULT '{}',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.counterfeit_listings (
  id text PRIMARY KEY,
  target_product text NOT NULL,
  sku text NOT NULL DEFAULT '',
  gtin text NOT NULL DEFAULT '',
  platform text NOT NULL DEFAULT '',
  seller text NOT NULL DEFAULT '',
  region text NOT NULL DEFAULT '',
  confidence integer NOT NULL DEFAULT 0,
  price_delta text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Flagged',
  anomalies text[] NOT NULL DEFAULT '{}',
  date_detected text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  evidence_ref text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.evidence (
  id text PRIMARY KEY,
  name text NOT NULL,
  source text NOT NULL DEFAULT '',
  entity text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Unverified',
  confidence integer NOT NULL DEFAULT 0,
  date text NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  url text NOT NULL DEFAULT '',
  text text NOT NULL DEFAULT '',
  investigation text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.recall_match_decisions (
  match_id text PRIMARY KEY,
  decision text NOT NULL CHECK (decision IN ('approved', 'rejected')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.investigations TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.suppliers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.counterfeit_listings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.evidence TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.recall_match_decisions TO anon, authenticated;
GRANT ALL ON public.investigations, public.suppliers, public.counterfeit_listings, public.evidence, public.recall_match_decisions TO service_role;

ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counterfeit_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recall_match_decisions ENABLE ROW LEVEL SECURITY;

-- No sign-in yet: the shared workspace is open to everyone with the link (read, add, update; no deletes).
CREATE POLICY "Anyone can view investigations" ON public.investigations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add investigations" ON public.investigations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update investigations" ON public.investigations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can view suppliers" ON public.suppliers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add suppliers" ON public.suppliers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update suppliers" ON public.suppliers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can view counterfeit listings" ON public.counterfeit_listings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add counterfeit listings" ON public.counterfeit_listings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update counterfeit listings" ON public.counterfeit_listings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can view evidence" ON public.evidence FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add evidence" ON public.evidence FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update evidence" ON public.evidence FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can view match decisions" ON public.recall_match_decisions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add match decisions" ON public.recall_match_decisions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update match decisions" ON public.recall_match_decisions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO public.investigations (id, title, domain, severity, confidence, status, date, risk_score, evidence, identifier, description) VALUES
  ('INV-2026-0128', 'BatteryPro XZ-100 downstream exposure', 'Product Recall', 'critical', 94, 'Escalated', '2026-11-17', 92, 38, NULL, NULL),
  ('INV-2026-0127', 'Shenzhen capacitor single-source dependency', 'Supplier Risk', 'high', 81, 'In Review', '2026-11-16', 78, 21, NULL, NULL),
  ('INV-2026-0126', 'Duplicate GTIN on USB-C charger listings', 'Counterfeit', 'high', 72, 'Open', '2026-11-15', 74, 14, NULL, NULL),
  ('INV-2026-0125', 'Port of Rotterdam congestion impact', 'Disruption', 'medium', 88, 'In Review', '2026-11-14', 61, 27, NULL, NULL),
  ('INV-2026-0124', 'Infant formula contamination trace', 'Product Recall', 'critical', 90, 'Open', '2026-11-13', 89, 42, NULL, NULL),
  ('INV-2026-0123', 'Typhoon impact on Kaohsiung fabs', 'Disruption', 'high', 76, 'Open', '2026-11-12', 70, 19, NULL, NULL),
  ('INV-2026-0122', 'Unverified bearing supplier in Vietnam', 'Supplier Risk', 'medium', 58, 'Open', '2026-11-10', 55, 9, NULL, NULL),
  ('INV-2026-0121', 'Spec mismatch on industrial relays', 'Counterfeit', 'low', 64, 'Resolved', '2026-11-08', 34, 11, NULL, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.suppliers (id, name, country, city, tier, risk, severity, category, single_source, status, lei_code, esg_score, lead_time_days, certifications, last_audit_date, downstream_products, notes) VALUES
  ('s1', 'BatteryPro Cells Co.', 'China', 'Shenzhen', 1, 88, 'critical', 'Lithium cells & battery packs', true, 'High risk', '549300BPCELLS88X01', 61, 45, ARRAY['ISO 9001 (Revoked)','UN 38.3 (Under Review)']::text[], '2026-03-14', ARRAY['Smartphone A','Electric Scooter B','Power Bank C']::text[], 'Primary origin facility for thermal overheating recall. Sub-tier supplier disclosure refused.'),
  ('s2', 'Formosa Capacitor Ltd.', 'Taiwan', 'Kaohsiung', 2, 76, 'high', 'Dielectric Capacitors', true, 'High risk', '5493001KJTIIGC8Y1R12', 82, 60, ARRAY['ISO 9001:2015','IATF 16949']::text[], '2026-08-19', ARRAY['Smartphone A','Electric Scooter B']::text[], 'Sole source for ultra-thin SMD capacitors. High typhoon exposure in coastal Kaohsiung cluster.'),
  ('s3', 'Mekong Bearings JSC', 'Vietnam', 'Ho Chi Minh City', 2, 61, 'medium', 'Precision Bearings', false, 'Needs verification', '549300MKBEAR99021B', 54, 30, ARRAY['ISO 9001 (Expired 2026-09)']::text[], '2025-11-20', ARRAY['Electric Scooter B']::text[], 'Missing documentation for sub-tier steel suppliers. Pending on-site compliance re-audit.'),
  ('s4', 'Chennai Relay Works', 'India', 'Chennai', 2, 57, 'medium', 'Solid State Relays', false, 'Needs verification', '549300CHRELAY5501A', 71, 35, ARRAY['ISO 9001:2015','RoHS Compliant']::text[], '2026-05-10', ARRAY['Power Bank C','Industrial Relay K']::text[], 'Thermal variance detected during random batch sampling in EU distribution.'),
  ('s5', 'Monterrey Electro SA', 'Mexico', 'Monterrey', 1, 28, 'low', 'Final Sub-Assembly', false, 'Verified', '549300MTRYELEC1244', 88, 14, ARRAY['ISO 9001:2015','ISO 14001','C-TPAT']::text[], '2026-10-02', ARRAY['Smartphone A (Alt Line)','Charger 45W']::text[], 'Qualified nearshore assembler with redundant production lines and high reliability record.'),
  ('s6', 'Nordic Polymer AB', 'Sweden', 'Gothenburg', 3, 22, 'low', 'Flame-Retardant Resins', false, 'Verified', '549300NORDICPOLY01', 94, 20, ARRAY['ISO 9001','ISO 14001','REACH Registered']::text[], '2026-09-12', ARRAY['Polymer Housings','Insulators']::text[], 'Excellent ESG and REACH compliance ratings. Multi-warehouse delivery network in EU.'),
  ('s7', 'Sichuan Lithium Refining', 'China', 'Chengdu', 3, 74, 'high', 'Battery Grade LiOH', true, 'Needs verification', '549300SICHUANLITH9', 48, 55, ARRAY['ISO 9001:2015']::text[], '2026-01-18', ARRAY['BatteryPro XZ-100']::text[], 'High regional power curtailment risk. Single-source chemical supplier for BatteryPro Cells.')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.counterfeit_listings (id, target_product, sku, gtin, platform, seller, region, confidence, price_delta, status, anomalies, date_detected, evidence_ref) VALUES
  ('CF-2026-081', 'UltraCharge 65W GaN Adapter', 'UC-65W-BLK', '0614141000012', 'Global Express Market', 'FastTech Electronics FZE', 'Dubai, UAE', 96, '-58% ($14.99 vs MSRP $35.99)', 'Confirmed Fake', ARRAY['Weight is 82g (OEM 120g)','Missing UL certification stamp','Duplicate GTIN barcode barcode','Substandard thermal paste']::text[], '2026-11-16', 'EV-3372'),
  ('CF-2026-082', 'ProAudio Wireless Earbuds V3', 'PAW-V3-SIL', '0614141000088', 'Apex B2B Wholesale', 'Shenzhen Apex Trade Ltd', 'Shenzhen, China', 89, '-45% ($39.00 vs MSRP $79.00)', 'Takedown Issued', ARRAY['Bluetooth MAC prefix unallocated','Silk-screen logo font kerning error','Lithium battery lacks IEC 62133 label']::text[], '2026-11-14', 'EV-3380'),
  ('CF-2026-083', 'Industrial 24V Power Relay Unit', 'IND-RELAY-24V', '0614141000190', 'EuroParts Direct', 'Continental Surplus Sp. z o.o.', 'Katowice, Poland', 78, '-30% ($22.50 vs MSRP $32.00)', 'Under Review', ARRAY['Contact resistance deviates +24%','Re-stamped date code from 2021','Unsealed protective casing']::text[], '2026-11-11', 'EV-3365'),
  ('CF-2026-084', 'AeroShield Ceramic Brake Pads', 'AS-BP-440', '0614141000215', 'AutoParts Hub Online', 'Veloce Spares Ltd', 'Manchester, UK', 94, '-62% ($18.00 vs MSRP $48.00)', 'Takedown Issued', ARRAY['Asbestos trace detected in friction material','Holographic security seal non-reflective','Non-compliant friction coefficient']::text[], '2026-11-09', 'EV-3391')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.evidence (id, name, source, entity, type, status, confidence, date, url, text, investigation) VALUES
  ('EV-3391', 'CPSC Recall Notice 26-014.pdf', 'CPSC', 'BatteryPro XZ-100', 'Regulatory notice', 'Verified', 99, '2026-11-15', 'https://www.cpsc.gov/Recalls (demo reference)', 'BatteryPro Inc. is recalling XZ-100 lithium-ion battery packs. The battery can overheat, posing fire and burn hazards. Consumers should immediately stop using the recalled batteries…', 'INV-2026-0128'),
  ('EV-3388', 'Bill of Materials — Smartphone A rev.4', 'Internal ERP (demo)', 'Smartphone A', 'BOM', 'Verified', 95, '2026-11-14', 'erp://bom/SMA-r4 (demo)', 'Line 14: Battery pack, Li-ion 3.85V 4500mAh, P/N XZ-100, Vendor BatteryPro Cells Co.', 'INV-2026-0128'),
  ('EV-3380', 'Bill of Lading MSKU-7731', 'Shipping manifest (demo)', 'Shipment SH-7731', 'Shipment record', 'Pending', 78, '2026-11-12', 'manifest://MSKU-7731 (demo)', 'Consignee: Urban Glide Co. Description: battery modules XZ100-L, 2,400 units, origin Shenzhen.', 'INV-2026-0128'),
  ('EV-3372', 'Marketplace listing capture #A91', 'Web capture (demo)', 'USB-C Charger 65W', 'Web capture', 'Unverified', 54, '2026-11-10', 'https://marketplace.example/listing/a91', 'Brand: VoltMax. GTIN 0614141000012. 65W GaN. Ships from Dubai.', 'INV-2026-0126'),
  ('EV-3365', 'GLEIF entity record — Formosa Capacitor', 'GLEIF', 'Formosa Capacitor Ltd.', 'Registry record', 'Verified', 92, '2026-11-08', 'https://search.gleif.org (demo reference)', 'LEI 5493001KJTIIGC8Y1R12. Status: ISSUED. Parent: Formosa Holdings.', 'INV-2026-0127'),
  ('EV-3359', 'NOAA advisory WP242026', 'NOAA', 'Kaohsiung region', 'Weather advisory', 'Verified', 97, '2026-11-07', 'https://www.nhc.noaa.gov (demo reference)', 'Typhoon warning issued. Max sustained winds 210 km/h. Expected landfall within 48 hours.', 'INV-2026-0123'),
  ('EV-3351', 'Supplier questionnaire — Mekong Bearings', 'Supplier portal (demo)', 'Mekong Bearings JSC', 'Questionnaire', 'Unverified', 41, '2026-11-05', 'portal://sq/MB-22 (demo)', 'Sub-tier suppliers: not disclosed. Certifications: ISO 9001 (expired 2026-09).', 'INV-2026-0122')
ON CONFLICT (id) DO NOTHING;