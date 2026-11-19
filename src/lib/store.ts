import { create } from "zustand";
import { persist } from "zustand/middleware";

// Browser-only state. Investigations, suppliers, counterfeit listings, evidence and recall
// match decisions live in Lovable Cloud (see src/lib/db.ts).

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
  settings: SystemSettings;
  notifications: Notice[];
  updateSettings: (s: SystemSettings) => void;
  markAllRead: () => void;
  notify: (title: string) => void;
}

export const useApp = create<State>()(
  persist(
    (set) => ({
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
      notifications: [
        { id: "n1", title: "Critical: BatteryPro XZ-100 recall escalated", time: "4m", read: false },
        { id: "n2", title: "Typhoon advisory affects 4 suppliers", time: "22m", read: false },
        { id: "n3", title: "Weekly risk report is ready", time: "3h", read: true },
      ],
      updateSettings: (settings) => set({ settings }),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      notify: (title) =>
        set((s) => ({
          notifications: [{ id: String(Date.now()), title, time: "now", read: false }, ...s.notifications],
        })),
    }),
    {
      name: "recallmesh-local-db",
      version: 2,
      skipHydration: true,
      // Drop records from the old browser-only version; they now come from the database.
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<State>;
        return { settings: p.settings, notifications: p.notifications } as State;
      },
      partialize: (s) => ({ settings: s.settings, notifications: s.notifications }) as State,
    },
  ),
);
