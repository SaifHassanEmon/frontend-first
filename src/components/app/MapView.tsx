import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";

export interface MapPoint { id: string; lng: number; lat: number; color: string; label: string; sub?: string; pulse?: boolean }

maplibregl.setWorkerUrl(workerUrl);

export default function MapView({ points, onSelect, selectedId, zoom = 1.2 }: { points: MapPoint[]; onSelect?: (id: string) => void; selectedId?: string | null; zoom?: number }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const cb = useRef(onSelect); cb.current = onSelect;

  useEffect(() => {
    if (!el.current) return;
    map.current = new maplibregl.Map({ container: el.current, style: "https://tiles.openfreemap.org/styles/dark", center: [40, 22], zoom, attributionControl: { compact: true } });
    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    return () => map.current?.remove();
  }, [zoom]);

  useEffect(() => {
    const m = map.current; if (!m) return;
    markers.current.forEach((x) => x.remove());
    markers.current = points.map((p) => {
      const d = document.createElement("button");
      const size = p.id === selectedId ? 18 : 12;
      d.style.cssText = `position:relative;width:${size}px;height:${size}px;border-radius:9999px;background:${p.color};border:2px solid var(--background);box-shadow:0 0 12px ${p.color};cursor:pointer`;
      if (p.pulse) { const r = document.createElement("span"); r.className = "pulse-ring"; r.style.cssText = `position:absolute;inset:-2px;border-radius:9999px;border:2px solid ${p.color};pointer-events:none`; d.appendChild(r); }
      const popup = new maplibregl.Popup({ closeButton: false, offset: 10 }).setHTML(`<strong>${p.label}</strong>${p.sub ? `<div style="opacity:.7">${p.sub}</div>` : ""}`);
      d.onmouseenter = () => popup.setLngLat([p.lng, p.lat]).addTo(m);
      d.onmouseleave = () => popup.remove();
      d.onclick = () => cb.current?.(p.id);
      return new maplibregl.Marker({ element: d }).setLngLat([p.lng, p.lat]).addTo(m);
    });
  }, [points, selectedId]);

  return <div ref={el} className="h-full w-full" />;
}
