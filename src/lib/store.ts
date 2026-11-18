import { create } from "zustand";
import { persist } from "zustand/middleware";
import { investigations as seed, type Investigation } from "@/data/mock";

export interface Notice { id: string; title: string; time: string; read: boolean }

interface State {
  investigations: Investigation[];
  matchDecisions: Record<string, "approved" | "rejected">;
  notifications: Notice[];
  addInvestigation: (i: Investigation) => void;
  decide: (id: string, d: "approved" | "rejected") => void;
  markAllRead: () => void;
  notify: (title: string) => void;
}

export const useApp = create<State>()(
  persist(
    (set) => ({
      investigations: seed,
      matchDecisions: {},
      notifications: [
        { id: "n1", title: "Critical: BatteryPro XZ-100 recall escalated", time: "4m", read: false },
        { id: "n2", title: "Typhoon advisory affects 4 suppliers", time: "22m", read: false },
        { id: "n3", title: "Weekly risk report is ready", time: "3h", read: true },
      ],
      addInvestigation: (i) => set((s) => ({ investigations: [i, ...s.investigations] })),
      decide: (id, d) => set((s) => ({ matchDecisions: { ...s.matchDecisions, [id]: d } })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      notify: (title) => set((s) => ({ notifications: [{ id: String(Date.now()), title, time: "now", read: false }, ...s.notifications] })),
    }),
    { name: "recallmesh-demo", skipHydration: true },
  ),
);
