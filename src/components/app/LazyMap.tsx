import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { MapPoint } from "./MapView";
const MapView = lazy(() => import("./MapView"));
export type { MapPoint };
export function LazyMap(props: { points: MapPoint[]; onSelect?: (id: string) => void; selectedId?: string | null; zoom?: number }) {
  const fb = <div className="grid h-full w-full place-items-center grid-bg text-xs text-muted-foreground">Loading map…</div>;
  return <ClientOnly fallback={fb}><Suspense fallback={fb}><MapView {...props} /></Suspense></ClientOnly>;
}
