import fs from "node:fs";
import path from "node:path";
import {
  investigations as initialInvestigations,
  suppliers as initialSuppliers,
  disruptionEvents as initialDisruptions,
  counterfeitListings as initialCounterfeits,
  unknownExposures as initialExposures,
  evidence as initialEvidence,
  reports as initialReports,
  dataSources as initialDataSources,
  type Investigation,
  type CounterfeitListing,
  type UnknownExposureItem,
} from "../data/mock";

export interface DatabaseSchema {
  investigations: Investigation[];
  suppliers: typeof initialSuppliers;
  disruptions: typeof initialDisruptions;
  counterfeits: CounterfeitListing[];
  unknownExposures: UnknownExposureItem[];
  evidence: typeof initialEvidence;
  reports: typeof initialReports;
  dataSources: typeof initialDataSources;
  settings: {
    regulatoryWeight: number;
    spofWeight: number;
    disruptionWeight: number;
    counterfeitWeight: number;
    notifyCritical: boolean;
    notifySlack: boolean;
    notifyDailyDigest: boolean;
    slackWebhook: string;
  };
  lastUpdated: string;
}

const DB_DIR = path.resolve(process.cwd(), ".data");
const DB_PATH = path.join(DB_DIR, "db.json");

function getDefaultData(): DatabaseSchema {
  return {
    investigations: initialInvestigations,
    suppliers: initialSuppliers,
    disruptions: initialDisruptions,
    counterfeits: initialCounterfeits,
    unknownExposures: initialExposures,
    evidence: initialEvidence,
    reports: initialReports,
    dataSources: initialDataSources,
    settings: {
      regulatoryWeight: 40,
      spofWeight: 30,
      disruptionWeight: 20,
      counterfeitWeight: 10,
      notifyCritical: true,
      notifySlack: true,
      notifyDailyDigest: true,
      slackWebhook: "https://hooks.slack.com/services/T00/B00/XXXXXX",
    },
    lastUpdated: new Date().toISOString(),
  };
}

export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      const initial = getDefaultData();
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as DatabaseSchema;
  } catch (error) {
    console.error("Failed to read local database, using in-memory fallback:", error);
    return getDefaultData();
  }
}

export function writeDb(updater: (db: DatabaseSchema) => void): DatabaseSchema {
  try {
    const db = readDb();
    updater(db);
    db.lastUpdated = new Date().toISOString();
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
    return db;
  } catch (error) {
    console.error("Failed to write to local database:", error);
    const fallback = readDb();
    updater(fallback);
    return fallback;
  }
}

// Investigations CRUD
export function getInvestigations() {
  return readDb().investigations;
}

export function createInvestigation(item: Investigation) {
  return writeDb((db) => {
    db.investigations.unshift(item);
  });
}

export function updateInvestigationStatus(id: string, status: Investigation["status"]) {
  return writeDb((db) => {
    const inv = db.investigations.find((i) => i.id === id);
    if (inv) inv.status = status;
  });
}

// Suppliers CRUD
export function getSuppliers() {
  return readDb().suppliers;
}

export function updateSupplierRisk(id: string, riskScore: number) {
  return writeDb((db) => {
    const s = db.suppliers.find((sup) => sup.id === id);
    if (s) {
      s.risk = riskScore;
    }
  });
}

// Counterfeits CRUD
export function getCounterfeits() {
  return readDb().counterfeits;
}

export function updateCounterfeitStatus(id: string, status: CounterfeitListing["status"]) {
  return writeDb((db) => {
    const c = db.counterfeits.find((item) => item.id === id);
    if (c) c.status = status;
  });
}

// Evidence CRUD
export function getEvidence() {
  return readDb().evidence;
}

export function verifyEvidenceRecord(id: string) {
  return writeDb((db) => {
    const ev = db.evidence.find((item) => item.id === id);
    if (ev) ev.status = "Verified";
  });
}

// Settings CRUD
export function getSettings() {
  return readDb().settings;
}

export function saveSettings(settings: DatabaseSchema["settings"]) {
  return writeDb((db) => {
    db.settings = settings;
  });
}
