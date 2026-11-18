import { createServerFn } from "@tanstack/react-start";
import {
  readDb,
  createInvestigation,
  updateInvestigationStatus,
  updateCounterfeitStatus,
  verifyEvidenceRecord,
  saveSettings,
  type DatabaseSchema,
} from "./db";
import type { Investigation, CounterfeitListing } from "../data/mock";

// Server function: fetch all database collections
export const getDatabaseDataFn = createServerFn({ method: "GET" }).handler(async (): Promise<DatabaseSchema> => {
  return readDb();
});

// Server function: add investigation
export const addInvestigationFn = createServerFn({ method: "POST" })
  .validator((data: Investigation) => data)
  .handler(async ({ data }) => {
    createInvestigation(data);
    return { success: true, item: data };
  });

// Server function: update investigation status
export const updateInvestigationStatusFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: Investigation["status"] }) => data)
  .handler(async ({ data }) => {
    updateInvestigationStatus(data.id, data.status);
    return { success: true };
  });

// Server function: update counterfeit listing status
export const updateCounterfeitStatusFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: CounterfeitListing["status"] }) => data)
  .handler(async ({ data }) => {
    updateCounterfeitStatus(data.id, data.status);
    return { success: true };
  });

// Server function: verify an evidence document
export const verifyEvidenceRecordFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    verifyEvidenceRecord(data.id);
    return { success: true };
  });

// Server function: update system settings
export const saveSystemSettingsFn = createServerFn({ method: "POST" })
  .validator((data: DatabaseSchema["settings"]) => data)
  .handler(async ({ data }) => {
    saveSettings(data);
    return { success: true };
  });
