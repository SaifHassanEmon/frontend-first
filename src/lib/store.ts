import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  investigations as seedInvestigations,
  suppliers as seedSuppliers,
  counterfeitListings as seedCounterfeits,
  evidence as seedEvidence,
  type Investigation,
  type CounterfeitListing,
} from "@/data/mock";

export interface Notice {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

export interface SystemSettings {
  regulatoryWeight: number;
  spofWeight: number;
  disruptionWeight: number;
  counterfeitWeight: number;
  notifyCritical: boolean;
  notifySlack: boolean;
  notifyDailyDigest: boolean;
  slackWebhook: string;
}

interface State {
  investigations: Investigation[];
  suppliers: typeof seedSuppliers;
  counterfeits: CounterfeitListing[];
  evidence: typeof seedEvidence;
  settings: SystemSettings;
  matchDecisions: Record<string, "approved" | "rejected">;
  notifications: Notice[];

  // Actions
  addInvestigation: (i: Investigation) => void;
  updateInvestigationStatus: (id: string, status: Investigation["status"]) => void;
  updateCounterfeitStatus: (id: string, status: CounterfeitListing["status"]) => void;
  verifyEvidence: (id: string) => void;
  updateSettings: (s: SystemSettings) => void;
  decide: (id: string, d: "approved" | "rejected") => void;
  markAllRead: () => void;
  notify: (title: string) => void;
}

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      investigations: seedInvestigations,
      suppliers: seedSuppliers,
      counterfeits: seedCounterfeits,
      evidence: seedEvidence,
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
      matchDecisions: {},
      notifications: [
        { id: "n1", title: "Critical: BatteryPro XZ-100 recall escalated", time: "4m", read: false },
        { id: "n2", title: "Typhoon advisory affects 4 suppliers", time: "22m", read: false },
        { id: "n3", title: "Weekly risk report is ready", time: "3h", read: true },
      ],

      addInvestigation: (i) => {
        set((s) => ({ investigations: [i, ...s.investigations] }));
        get().notify(`Created new investigation: ${i.title}`);
      },

      updateInvestigationStatus: (id, status) => {
        set((s) => ({
          investigations: s.investigations.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
        }));
      },

      updateCounterfeitStatus: (id, status) => {
        set((s) => ({
          counterfeits: s.counterfeits.map((item) => (item.id === id ? { ...item, status } : item)),
        }));
      },

      verifyEvidence: (id) => {
        set((s) => ({
          evidence: s.evidence.map((ev) => (ev.id === id ? { ...ev, status: "Verified" } : ev)),
        }));
        get().notify(`Evidence record ${id} verified`);
      },

      updateSettings: (settings) => {
        set({ settings });
      },

      decide: (id, d) => set((s) => ({ matchDecisions: { ...s.matchDecisions, [id]: d } })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      notify: (title) =>
        set((s) => ({
          notifications: [
            { id: String(Date.now()), title, time: "now", read: false },
            ...s.notifications,
          ],
        })),
    }),
    { name: "recallmesh-local-db", skipHydration: true },
  ),
);
