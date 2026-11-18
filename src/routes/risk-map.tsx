import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { LazyMap } from "@/components/app/LazyMap";
import { Chip, DemoTag, PageHeader, RiskBadge, sevColor } from "@/components/app/ui";
import { mapMarkers, type Domain, type MarkerKind } from "@/data/mock";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/risk-map")({
  head: () => seo("Global Risk Map", "Interactive map of suppliers, hubs, ports and disruption events."),
  component: Page,
});
const domains: Domain[] = ["Product Recall", "Supplier Risk", "Counterfeit", "Disruption"];
const kinds: MarkerKind[] = ["supplier", "hub", "warehouse", "port", "disruption"];

function Page() {
  const [on, setOn] = useState<Domain[]>(domains);
  const [k, setK] = useState<MarkerKind[]>(kinds);
  const [sel, setSel] = useState<string | null>(null);
  const list = mapMarkers.filter((m) => on.includes(m.domain) && k.includes(m.kind));
  const points = useMemo(() => list.map((m) => ({ id: m.id, lng: m.lng, lat: m.lat, color: sevColor[m.severity], label: m.name, sub: `${m.kind} · ${m.domain}`, pulse: m.severity === "critical" })), [list]);
  const s = mapMarkers.find((m) => m.id === sel);
  const tog = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader title="Global Risk Map" subtitle="All locations are simulated for demonstration." actions={<DemoTag label="Simulated locations" />} />
      <div className="mb-3 flex flex-wrap gap-1.5">{domains.map((d) => <Chip key={d} active={on.includes(d)} onClick={() => setOn(tog(on, d))}>{d}</Chip>)}<span className="mx-2 w-px bg-border" />{kinds.map((x) => <Chip key={x} active={k.includes(x)} onClick={() => setK(tog(k, x))}><span className="capitalize">{x}</span></Chip>)}</div>
      <div className="relative h-[calc(100vh-190px)] min-h-[480px] overflow-hidden rounded-lg border border-border">
        <LazyMap points={points} onSelect={setSel} selectedId={sel} zoom={1.6} />
        <div className="absolute left-3 top-3 rounded-md border border-border bg-popover/90 px-3 py-2 text-[11px] backdrop-blur">{list.length} markers visible</div>
        {s && <aside className="absolute right-3 top-14 w-80 rounded-lg border border-border bg-popover/95 p-4 backdrop-blur fade-up">
          <div className="flex items-start justify-between"><div><p className="text-sm font-semibold">{s.name}</p><p className="text-xs text-muted-foreground">{s.country}</p></div><button onClick={() => setSel(null)} aria-label="Close"><X className="size-4" /></button></div>
          <div className="mt-3 flex gap-2"><RiskBadge level={s.severity} /><span className="rounded border border-border px-1.5 py-0.5 text-[11px] capitalize">{s.kind}</span></div>
          <dl className="mt-3 space-y-2 text-xs"><div className="flex justify-between"><dt className="text-muted-foreground">Domain</dt><dd>{s.domain}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Coordinates</dt><dd className="font-mono">{s.lat.toFixed(2)}, {s.lng.toFixed(2)}</dd></div></dl>
          <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed">{s.detail}</p>
        </aside>}
      </div>
    </div>
  );
}
