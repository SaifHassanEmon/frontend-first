export type Severity = "critical" | "high" | "medium" | "low";
export type Domain = "Product Recall" | "Supplier Risk" | "Counterfeit" | "Disruption";
export type Status = "Open" | "In Review" | "Escalated" | "Resolved";

export interface Investigation {
  id: string; title: string; domain: Domain; severity: Severity; confidence: number;
  status: Status; date: string; riskScore: number; evidence: number; identifier?: string; description?: string;
}

export const investigations: Investigation[] = [
  { id: "INV-2026-0128", title: "BatteryPro XZ-100 downstream exposure", domain: "Product Recall", severity: "critical", confidence: 94, status: "Escalated", date: "2026-11-17", riskScore: 92, evidence: 38 },
  { id: "INV-2026-0127", title: "Shenzhen capacitor single-source dependency", domain: "Supplier Risk", severity: "high", confidence: 81, status: "In Review", date: "2026-11-16", riskScore: 78, evidence: 21 },
  { id: "INV-2026-0126", title: "Duplicate GTIN on USB-C charger listings", domain: "Counterfeit", severity: "high", confidence: 72, status: "Open", date: "2026-11-15", riskScore: 74, evidence: 14 },
  { id: "INV-2026-0125", title: "Port of Rotterdam congestion impact", domain: "Disruption", severity: "medium", confidence: 88, status: "In Review", date: "2026-11-14", riskScore: 61, evidence: 27 },
  { id: "INV-2026-0124", title: "Infant formula contamination trace", domain: "Product Recall", severity: "critical", confidence: 90, status: "Open", date: "2026-11-13", riskScore: 89, evidence: 42 },
  { id: "INV-2026-0123", title: "Typhoon impact on Kaohsiung fabs", domain: "Disruption", severity: "high", confidence: 76, status: "Open", date: "2026-11-12", riskScore: 70, evidence: 19 },
  { id: "INV-2026-0122", title: "Unverified bearing supplier in Vietnam", domain: "Supplier Risk", severity: "medium", confidence: 58, status: "Open", date: "2026-11-10", riskScore: 55, evidence: 9 },
  { id: "INV-2026-0121", title: "Spec mismatch on industrial relays", domain: "Counterfeit", severity: "low", confidence: 64, status: "Resolved", date: "2026-11-08", riskScore: 34, evidence: 11 },
];

export const kpis = [
  { label: "Active Investigations", value: "128", trend: "+12%", up: true, tone: "primary" as const },
  { label: "Critical Risks", value: "17", trend: "+3", up: true, tone: "critical" as const },
  { label: "Potentially Affected Products", value: "2,840", trend: "+8.4%", up: true, tone: "warning" as const },
  { label: "Exposed Suppliers", value: "346", trend: "-2.1%", up: false, tone: "info" as const },
  { label: "Unknown Exposure Alerts", value: "52", trend: "+6", up: true, tone: "warning" as const },
];

export const riskDistribution = [
  { name: "Product Recall", value: 38, color: "var(--chart-1)" },
  { name: "Supplier Risk", value: 27, color: "var(--chart-2)" },
  { name: "Counterfeit", value: 18, color: "var(--chart-3)" },
  { name: "Disruption", value: 17, color: "var(--chart-4)" },
];

export type MarkerKind = "risk" | "supplier" | "hub" | "warehouse" | "port" | "disruption";
export interface MapMarker { id: string; name: string; country: string; lng: number; lat: number; severity: Severity; domain: Domain; kind: MarkerKind; detail: string; }

export const mapMarkers: MapMarker[] = [
  { id: "m1", name: "Shenzhen Battery Cluster", country: "China", lng: 114.06, lat: 22.54, severity: "critical", domain: "Product Recall", kind: "hub", detail: "Origin site linked to XZ-100 cell production (simulated)." },
  { id: "m2", name: "Kaohsiung Fab District", country: "Taiwan", lng: 120.31, lat: 22.63, severity: "high", domain: "Disruption", kind: "hub", detail: "Typhoon warning affecting 4 tier-2 suppliers." },
  { id: "m3", name: "Port of Rotterdam", country: "Netherlands", lng: 4.47, lat: 51.92, severity: "medium", domain: "Disruption", kind: "port", detail: "Berth congestion; 7-day average delay." },
  { id: "m4", name: "Ho Chi Minh Supplier Park", country: "Vietnam", lng: 106.63, lat: 10.82, severity: "medium", domain: "Supplier Risk", kind: "supplier", detail: "Unverified bearing supplier, missing registry data." },
  { id: "m5", name: "Los Angeles DC-04", country: "United States", lng: -118.24, lat: 34.05, severity: "high", domain: "Product Recall", kind: "warehouse", detail: "12,400 units of potentially affected stock." },
  { id: "m6", name: "Dubai Free Zone", country: "UAE", lng: 55.27, lat: 25.2, severity: "high", domain: "Counterfeit", kind: "warehouse", detail: "Duplicate GTIN listings traced to reseller." },
  { id: "m7", name: "Monterrey Assembly", country: "Mexico", lng: -100.31, lat: 25.67, severity: "low", domain: "Supplier Risk", kind: "hub", detail: "Alternative supplier candidate." },
  { id: "m8", name: "Hamburg Logistics", country: "Germany", lng: 9.99, lat: 53.55, severity: "low", domain: "Product Recall", kind: "warehouse", detail: "EU distribution for Smartphone A." },
  { id: "m9", name: "Chennai Component Works", country: "India", lng: 80.27, lat: 13.08, severity: "medium", domain: "Counterfeit", kind: "supplier", detail: "Spec inconsistency on relay datasheets." },
  { id: "m10", name: "Suez Canal Transit", country: "Egypt", lng: 32.55, lat: 30.0, severity: "critical", domain: "Disruption", kind: "disruption", detail: "Geopolitical disruption; reroutes via Cape." },
  { id: "m11", name: "São Paulo Retail Hub", country: "Brazil", lng: -46.63, lat: -23.55, severity: "low", domain: "Product Recall", kind: "warehouse", detail: "Retailer stock under review." },
  { id: "m12", name: "Osaka Supplier Shutdown", country: "Japan", lng: 135.5, lat: 34.69, severity: "high", domain: "Disruption", kind: "supplier", detail: "Plant shutdown after fire (simulated)." },
  { id: "m13", name: "Port of Singapore", country: "Singapore", lng: 103.82, lat: 1.35, severity: "low", domain: "Disruption", kind: "port", detail: "Normal operations." },
  { id: "m14", name: "Lagos Import Gateway", country: "Nigeria", lng: 3.38, lat: 6.52, severity: "medium", domain: "Counterfeit", kind: "port", detail: "Customs seizure of suspicious chargers." },
];

export const signals = [
  { title: "New CPSC notice: lithium cell overheating", country: "United States", category: "Product Recall", time: "4 min ago", severity: "critical" as Severity },
  { title: "Typhoon Kong-rey track shifts toward Taiwan", country: "Taiwan", category: "Disruption", time: "22 min ago", severity: "high" as Severity },
  { title: "Duplicate GTIN detected across 3 marketplaces", country: "UAE", category: "Counterfeit", time: "1 h ago", severity: "high" as Severity },
  { title: "Tier-2 supplier lost ISO certification", country: "Vietnam", category: "Supplier Risk", time: "2 h ago", severity: "medium" as Severity },
  { title: "Rotterdam berth waiting time +18%", country: "Netherlands", category: "Disruption", time: "5 h ago", severity: "medium" as Severity },
];

export const timeline = [
  { time: "09:42", text: "Alex Morgan escalated INV-2026-0128 to critical", tone: "critical" },
  { time: "09:15", text: "3 new component identity matches suggested", tone: "primary" },
  { time: "08:50", text: "Evidence EV-3391 verified by analyst review", tone: "success" },
  { time: "08:12", text: "Supplier BP-77 flagged as single-source", tone: "warning" },
  { time: "Yesterday", text: "Report 'Q4 Recall Impact' generated", tone: "primary" },
];

export const recallMatches = [
  { id: "rm1", product: "Smartphone A", manufacturer: "Nova Mobile Ltd.", component: "XZ-100", confidence: 98, evidence: 14, status: "Confirmed Demo Match" },
  { id: "rm2", product: "Electric Scooter B", manufacturer: "Urban Glide Co.", component: "XZ100-L", confidence: 84, evidence: 8, status: "Potential Match" },
  { id: "rm3", product: "Power Bank C", manufacturer: "VoltCarry Inc.", component: "Supplier Code BP-77", confidence: 62, evidence: 3, status: "Needs Verification" },
];

export const suppliers = [
  { id: "s1", name: "BatteryPro Cells Co.", country: "China", tier: 1, risk: 88, category: "Lithium cells", singleSource: true, status: "High risk" },
  { id: "s2", name: "Formosa Capacitor Ltd.", country: "Taiwan", tier: 2, risk: 76, category: "Capacitors", singleSource: true, status: "High risk" },
  { id: "s3", name: "Mekong Bearings JSC", country: "Vietnam", tier: 2, risk: 61, category: "Bearings", singleSource: false, status: "Needs verification" },
  { id: "s4", name: "Nordic Polymer AB", country: "Sweden", tier: 3, risk: 24, category: "Polymers", singleSource: false, status: "Verified" },
  { id: "s5", name: "Monterrey Electro SA", country: "Mexico", tier: 1, risk: 32, category: "Assembly", singleSource: false, status: "Verified" },
  { id: "s6", name: "Chennai Relay Works", country: "India", tier: 2, risk: 57, category: "Relays", singleSource: false, status: "Needs verification" },
];

export const disruptionEvents = [
  { id: "d1", type: "Port Closure", title: "Partial closure — Port of Rotterdam", location: "Rotterdam, NL", lng: 4.47, lat: 51.92, severity: "medium" as Severity, region: "Western Europe", suppliers: ["Nordic Polymer AB", "Hamburg Logistics"], products: ["Smartphone A", "Router R2"], description: "Labour action closes 3 container terminals for an estimated 5 days.", recommendation: "Assess inbound shipments with ETA < 14 days and evaluate Antwerp rerouting." },
  { id: "d2", type: "Severe Weather", title: "Typhoon Kong-rey approaching Taiwan", location: "Kaohsiung, TW", lng: 120.31, lat: 22.63, severity: "high" as Severity, region: "East Asia", suppliers: ["Formosa Capacitor Ltd."], products: ["Electric Scooter B", "Smartphone A"], description: "Category 4 typhoon expected landfall within 48h; fab shutdowns likely.", recommendation: "Request capacity confirmation from tier-2 capacitor suppliers." },
  { id: "d3", type: "Geopolitical Disruption", title: "Red Sea / Suez transit restrictions", location: "Suez, EG", lng: 32.55, lat: 30.0, severity: "critical" as Severity, region: "Middle East", suppliers: ["Chennai Relay Works", "BatteryPro Cells Co."], products: ["Power Bank C", "Industrial Relay K"], description: "Carriers rerouting via Cape of Good Hope adding 10–14 days.", recommendation: "Quantify exposure on Asia→EU lanes and identify air-freight candidates." },
  { id: "d4", type: "Supplier Shutdown", title: "Osaka plant fire — precision motors", location: "Osaka, JP", lng: 135.5, lat: 34.69, severity: "high" as Severity, region: "East Asia", suppliers: ["Kansai Motor KK"], products: ["Electric Scooter B"], description: "Fire halts production line 2; restart timeline unknown.", recommendation: "Verify alternative motor sourcing and inventory buffer at DC-04." },
];

export const evidence = [
  { id: "EV-3391", name: "CPSC Recall Notice 26-014.pdf", source: "CPSC", entity: "BatteryPro XZ-100", type: "Regulatory notice", status: "Verified", confidence: 99, date: "2026-11-15", url: "https://www.cpsc.gov/Recalls (demo reference)", text: "BatteryPro Inc. is recalling XZ-100 lithium-ion battery packs. The battery can overheat, posing fire and burn hazards. Consumers should immediately stop using the recalled batteries…", investigation: "INV-2026-0128" },
  { id: "EV-3388", name: "Bill of Materials — Smartphone A rev.4", source: "Internal ERP (demo)", entity: "Smartphone A", type: "BOM", status: "Verified", confidence: 95, date: "2026-11-14", url: "erp://bom/SMA-r4 (demo)", text: "Line 14: Battery pack, Li-ion 3.85V 4500mAh, P/N XZ-100, Vendor BatteryPro Cells Co.", investigation: "INV-2026-0128" },
  { id: "EV-3380", name: "Bill of Lading MSKU-7731", source: "Shipping manifest (demo)", entity: "Shipment SH-7731", type: "Shipment record", status: "Pending", confidence: 78, date: "2026-11-12", url: "manifest://MSKU-7731 (demo)", text: "Consignee: Urban Glide Co. Description: battery modules XZ100-L, 2,400 units, origin Shenzhen.", investigation: "INV-2026-0128" },
  { id: "EV-3372", name: "Marketplace listing capture #A91", source: "Web capture (demo)", entity: "USB-C Charger 65W", type: "Web capture", status: "Unverified", confidence: 54, date: "2026-11-10", url: "https://marketplace.example/listing/a91", text: "Brand: VoltMax. GTIN 0614141000012. 65W GaN. Ships from Dubai.", investigation: "INV-2026-0126" },
  { id: "EV-3365", name: "GLEIF entity record — Formosa Capacitor", source: "GLEIF", entity: "Formosa Capacitor Ltd.", type: "Registry record", status: "Verified", confidence: 92, date: "2026-11-08", url: "https://search.gleif.org (demo reference)", text: "LEI 5493001KJTIIGC8Y1R12. Status: ISSUED. Parent: Formosa Holdings.", investigation: "INV-2026-0127" },
  { id: "EV-3359", name: "NOAA advisory WP242026", source: "NOAA", entity: "Kaohsiung region", type: "Weather advisory", status: "Verified", confidence: 97, date: "2026-11-07", url: "https://www.nhc.noaa.gov (demo reference)", text: "Typhoon warning issued. Max sustained winds 210 km/h. Expected landfall within 48 hours.", investigation: "INV-2026-0123" },
  { id: "EV-3351", name: "Supplier questionnaire — Mekong Bearings", source: "Supplier portal (demo)", entity: "Mekong Bearings JSC", type: "Questionnaire", status: "Unverified", confidence: 41, date: "2026-11-05", url: "portal://sq/MB-22 (demo)", text: "Sub-tier suppliers: not disclosed. Certifications: ISO 9001 (expired 2026-09).", investigation: "INV-2026-0122" },
];

export const reports = [
  { id: "RPT-501", title: "BatteryPro XZ-100 Recall Impact", type: "Recall impact", domain: "Product Recall" as Domain, date: "2026-11-17", pages: 14 },
  { id: "RPT-498", title: "Q4 Supplier Dependency Assessment", type: "Supplier dependency", domain: "Supplier Risk" as Domain, date: "2026-11-12", pages: 22 },
  { id: "RPT-493", title: "USB-C Charger Counterfeit Signals", type: "Investigation", domain: "Counterfeit" as Domain, date: "2026-11-09", pages: 8 },
  { id: "RPT-490", title: "East Asia Weather Disruption Outlook", type: "Disruption", domain: "Disruption" as Domain, date: "2026-11-06", pages: 11 },
  { id: "RPT-486", title: "Global Risk Assessment — October", type: "Risk assessment", domain: "Supplier Risk" as Domain, date: "2026-11-01", pages: 31 },
  { id: "RPT-480", title: "Infant Formula Trace Investigation", type: "Investigation", domain: "Product Recall" as Domain, date: "2026-10-27", pages: 17 },
];

export const dataSources = [
  { name: "CPSC", desc: "US Consumer Product Safety Commission recall notices.", domain: "Product Recall", type: "Government API" },
  { name: "FDA openFDA", desc: "Food, drug and device enforcement reports.", domain: "Product Recall", type: "Government API" },
  { name: "EU Safety Gate", desc: "EU rapid alert system for dangerous non-food products.", domain: "Product Recall", type: "Government feed" },
  { name: "OECD GlobalRecalls", desc: "International portal aggregating product recalls.", domain: "Product Recall", type: "Intergovernmental portal" },
  { name: "GS1", desc: "Global product identifiers (GTIN) and verification.", domain: "Counterfeit", type: "Standards registry" },
  { name: "OpenCorporates", desc: "Open database of company registrations.", domain: "Supplier Risk", type: "Corporate registry" },
  { name: "GLEIF", desc: "Legal Entity Identifier records and ownership.", domain: "Supplier Risk", type: "Corporate registry" },
  { name: "NOAA", desc: "Weather alerts, storms and hazard advisories.", domain: "Disruption", type: "Government API" },
  { name: "USGS", desc: "Earthquake and geological hazard feeds.", domain: "Disruption", type: "Government API" },
  { name: "ReliefWeb", desc: "Humanitarian crisis and disaster reports.", domain: "Disruption", type: "UN OCHA API" },
  { name: "GDELT", desc: "Global news event and tone monitoring.", domain: "Disruption", type: "Open dataset" },
];

export interface CounterfeitListing {
  id: string;
  targetProduct: string;
  sku: string;
  gtin: string;
  platform: string;
  seller: string;
  region: string;
  confidence: number;
  priceDelta: string;
  status: "Flagged" | "Takedown Issued" | "Under Review" | "Confirmed Fake";
  anomalies: string[];
  dateDetected: string;
  evidenceRef: string;
}

export const counterfeitListings: CounterfeitListing[] = [
  {
    id: "CF-2026-081",
    targetProduct: "UltraCharge 65W GaN Adapter",
    sku: "UC-65W-BLK",
    gtin: "0614141000012",
    platform: "Global Express Market",
    seller: "FastTech Electronics FZE",
    region: "Dubai, UAE",
    confidence: 96,
    priceDelta: "-58% ($14.99 vs MSRP $35.99)",
    status: "Confirmed Fake",
    anomalies: ["Weight is 82g (OEM 120g)", "Missing UL certification stamp", "Duplicate GTIN barcode barcode", "Substandard thermal paste"],
    dateDetected: "2026-11-16",
    evidenceRef: "EV-3372",
  },
  {
    id: "CF-2026-082",
    targetProduct: "ProAudio Wireless Earbuds V3",
    sku: "PAW-V3-SIL",
    gtin: "0614141000088",
    platform: "Apex B2B Wholesale",
    seller: "Shenzhen Apex Trade Ltd",
    region: "Shenzhen, China",
    confidence: 89,
    priceDelta: "-45% ($39.00 vs MSRP $79.00)",
    status: "Takedown Issued",
    anomalies: ["Bluetooth MAC prefix unallocated", "Silk-screen logo font kerning error", "Lithium battery lacks IEC 62133 label"],
    dateDetected: "2026-11-14",
    evidenceRef: "EV-3380",
  },
  {
    id: "CF-2026-083",
    targetProduct: "Industrial 24V Power Relay Unit",
    sku: "IND-RELAY-24V",
    gtin: "0614141000190",
    platform: "EuroParts Direct",
    seller: "Continental Surplus Sp. z o.o.",
    region: "Katowice, Poland",
    confidence: 78,
    priceDelta: "-30% ($22.50 vs MSRP $32.00)",
    status: "Under Review",
    anomalies: ["Contact resistance deviates +24%", "Re-stamped date code from 2021", "Unsealed protective casing"],
    dateDetected: "2026-11-11",
    evidenceRef: "EV-3365",
  },
  {
    id: "CF-2026-084",
    targetProduct: "AeroShield Ceramic Brake Pads",
    sku: "AS-BP-440",
    gtin: "0614141000215",
    platform: "AutoParts Hub Online",
    seller: "Veloce Spares Ltd",
    region: "Manchester, UK",
    confidence: 94,
    priceDelta: "-62% ($18.00 vs MSRP $48.00)",
    status: "Takedown Issued",
    anomalies: ["Asbestos trace detected in friction material", "Holographic security seal non-reflective", "Non-compliant friction coefficient"],
    dateDetected: "2026-11-09",
    evidenceRef: "EV-3391",
  },
];

export interface UnknownExposureItem {
  id: string;
  category: "Concentration Risk" | "Hidden Sub-tier" | "Regulatory Blind Spot" | "Sole Sourcing";
  title: string;
  tierDepth: number;
  primaryEntity: string;
  country: string;
  exposureScore: number;
  severity: Severity;
  downstreamProducts: string[];
  impactEstimate: string;
  discoverySource: string;
  recommendation: string;
}

export const unknownExposures: UnknownExposureItem[] = [
  {
    id: "EXP-901",
    category: "Concentration Risk",
    title: "Critical dependency on single Kaohsiung dielectric ceramic line",
    tierDepth: 3,
    primaryEntity: "Formosa Capacitor Ltd. (Sub-facility B)",
    country: "Taiwan",
    exposureScore: 89,
    severity: "critical",
    downstreamProducts: ["Smartphone A", "Electric Scooter B", "Power Bank C"],
    impactEstimate: "Estimated $14.2M revenue at risk if stalled > 10 days",
    discoverySource: "Import Customs Manifest ML entity resolution",
    recommendation: "Qualify Monterrey Electro SA secondary line or activate reserve buffer stock.",
  },
  {
    id: "EXP-902",
    category: "Hidden Sub-tier",
    title: "Undisclosed cobalt processing facility in Katanga corridor",
    tierDepth: 4,
    primaryEntity: "Kivu Mineral Refinery",
    country: "DR Congo",
    exposureScore: 84,
    severity: "high",
    downstreamProducts: ["BatteryPro XZ-100", "Smartphone A"],
    impactEstimate: "High ESG/OECD compliance breach liability and consumer backlash",
    discoverySource: "GLEIF corporate parentage traversal & NGO conflict mineral reports",
    recommendation: "Issue immediate Tier-1 sub-supplier disclosure audit to BatteryPro Cells Co.",
  },
  {
    id: "EXP-903",
    category: "Regulatory Blind Spot",
    title: "Expired EU RoHS 3 exemption on specialty soldering flux",
    tierDepth: 2,
    primaryEntity: "Mekong Bearings JSC",
    country: "Vietnam",
    exposureScore: 71,
    severity: "medium",
    downstreamProducts: ["Electric Scooter B"],
    impactEstimate: "Potential EU customs impoundment of 4,200 finished units",
    discoverySource: "EU Safety Gate cross-index & chemical compliance registry",
    recommendation: "Demand updated chemical laboratory test certificates within 5 business days.",
  },
  {
    id: "EXP-904",
    category: "Sole Sourcing",
    title: "Proprietary microcontroller packaging single-tooled in Penang",
    tierDepth: 2,
    primaryEntity: "Penang Micro-Assembly Ltd",
    country: "Malaysia",
    exposureScore: 68,
    severity: "high",
    downstreamProducts: ["Router R2", "Smartphone A"],
    impactEstimate: "Lead time buffer is only 14 days against 60-day tooling cycle",
    discoverySource: "BOM deep-traversal cross-analysis",
    recommendation: "Fund dual-tooling qualification at Guadalajara partner facility.",
  },
];

export const copilotScript: Record<string, string> = {
  "Find products potentially affected by this battery recall.": "I traced component identities XZ-100, XZ100-L and supplier code BP-77 across your BOM and shipment data. 3 products show potential exposure: Smartphone A (98% confidence, confirmed demo match), Electric Scooter B (84%, potential) and Power Bank C (62%, needs verification). Estimated 12,400 units sit in Los Angeles DC-04.",
  "Identify hidden supplier dependencies.": "Formosa Capacitor Ltd. is a single-source tier-2 supplier for 4 tier-1 assemblers. 71% of your capacitor volume is concentrated in Taiwan. Monterrey Electro SA is a viable alternative with partial capability overlap.",
  "Explain suspicious component matches.": "The USB-C charger listing shares GTIN 0614141000012 with an authorised product, but its rated output, weight (−38 g) and manufacturer address differ. This is suspicious, not confirmed counterfeit — a GS1 verification request is recommended.",
  "Investigate a port disruption.": "Rotterdam terminal closure affects 23 inbound shipments over the next 14 days, including 2 lots of Smartphone A. Rerouting via Antwerp adds ~1.5 days; Hamburg capacity is available.",
  "Show missing evidence in this investigation.": "INV-2026-0128 lacks: batch identifiers for 2 shipments, sub-tier disclosure from BatteryPro Cells Co., and retailer sell-through data. Requesting the batch IDs would raise overall confidence by an estimated 11 points.",
};
