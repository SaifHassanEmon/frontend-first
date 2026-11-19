import type { Severity } from "@/data/mock";

export interface DetailedSupplier {
  id: string;
  name: string;
  country: string;
  city: string;
  tier: 1 | 2 | 3;
  risk: number;
  severity: Severity;
  category: string;
  singleSource: boolean;
  status: "Verified" | "Needs verification" | "High risk";
  leiCode: string;
  esgScore: number;
  leadTimeDays: number;
  certifications: string[];
  lastAuditDate: string;
  downstreamProducts: string[];
  notes: string;
}

export const seedDetailedSuppliers: DetailedSupplier[] = [
  {
    id: "s1",
    name: "BatteryPro Cells Co.",
    country: "China",
    city: "Shenzhen",
    tier: 1,
    risk: 88,
    severity: "critical",
    category: "Lithium cells & battery packs",
    singleSource: true,
    status: "High risk",
    leiCode: "549300BPCELLS88X01",
    esgScore: 61,
    leadTimeDays: 45,
    certifications: ["ISO 9001 (Revoked)", "UN 38.3 (Under Review)"],
    lastAuditDate: "2026-03-14",
    downstreamProducts: ["Smartphone A", "Electric Scooter B", "Power Bank C"],
    notes: "Primary origin facility for thermal overheating recall. Sub-tier supplier disclosure refused.",
  },
  {
    id: "s2",
    name: "Formosa Capacitor Ltd.",
    country: "Taiwan",
    city: "Kaohsiung",
    tier: 2,
    risk: 76,
    severity: "high",
    category: "Dielectric Capacitors",
    singleSource: true,
    status: "High risk",
    leiCode: "5493001KJTIIGC8Y1R12",
    esgScore: 82,
    leadTimeDays: 60,
    certifications: ["ISO 9001:2015", "IATF 16949"],
    lastAuditDate: "2026-08-19",
    downstreamProducts: ["Smartphone A", "Electric Scooter B"],
    notes: "Sole source for ultra-thin SMD capacitors. High typhoon exposure in coastal Kaohsiung cluster.",
  },
  {
    id: "s3",
    name: "Mekong Bearings JSC",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    tier: 2,
    risk: 61,
    severity: "medium",
    category: "Precision Bearings",
    singleSource: false,
    status: "Needs verification",
    leiCode: "549300MKBEAR99021B",
    esgScore: 54,
    leadTimeDays: 30,
    certifications: ["ISO 9001 (Expired 2026-09)"],
    lastAuditDate: "2025-11-20",
    downstreamProducts: ["Electric Scooter B"],
    notes: "Missing documentation for sub-tier steel suppliers. Pending on-site compliance re-audit.",
  },
  {
    id: "s4",
    name: "Chennai Relay Works",
    country: "India",
    city: "Chennai",
    tier: 2,
    risk: 57,
    severity: "medium",
    category: "Solid State Relays",
    singleSource: false,
    status: "Needs verification",
    leiCode: "549300CHRELAY5501A",
    esgScore: 71,
    leadTimeDays: 35,
    certifications: ["ISO 9001:2015", "RoHS Compliant"],
    lastAuditDate: "2026-05-10",
    downstreamProducts: ["Power Bank C", "Industrial Relay K"],
    notes: "Thermal variance detected during random batch sampling in EU distribution.",
  },
  {
    id: "s5",
    name: "Monterrey Electro SA",
    country: "Mexico",
    city: "Monterrey",
    tier: 1,
    risk: 28,
    severity: "low",
    category: "Final Sub-Assembly",
    singleSource: false,
    status: "Verified",
    leiCode: "549300MTRYELEC1244",
    esgScore: 88,
    leadTimeDays: 14,
    certifications: ["ISO 9001:2015", "ISO 14001", "C-TPAT"],
    lastAuditDate: "2026-10-02",
    downstreamProducts: ["Smartphone A (Alt Line)", "Charger 45W"],
    notes: "Qualified nearshore assembler with redundant production lines and high reliability record.",
  },
  {
    id: "s6",
    name: "Nordic Polymer AB",
    country: "Sweden",
    city: "Gothenburg",
    tier: 3,
    risk: 22,
    severity: "low",
    category: "Flame-Retardant Resins",
    singleSource: false,
    status: "Verified",
    leiCode: "549300NORDICPOLY01",
    esgScore: 94,
    leadTimeDays: 20,
    certifications: ["ISO 9001", "ISO 14001", "REACH Registered"],
    lastAuditDate: "2026-09-12",
    downstreamProducts: ["Polymer Housings", "Insulators"],
    notes: "Excellent ESG and REACH compliance ratings. Multi-warehouse delivery network in EU.",
  },
  {
    id: "s7",
    name: "Sichuan Lithium Refining",
    country: "China",
    city: "Chengdu",
    tier: 3,
    risk: 74,
    severity: "high",
    category: "Battery Grade LiOH",
    singleSource: true,
    status: "Needs verification",
    leiCode: "549300SICHUANLITH9",
    esgScore: 48,
    leadTimeDays: 55,
    certifications: ["ISO 9001:2015"],
    lastAuditDate: "2026-01-18",
    downstreamProducts: ["BatteryPro XZ-100"],
    notes: "High regional power curtailment risk. Single-source chemical supplier for BatteryPro Cells.",
  },
];
