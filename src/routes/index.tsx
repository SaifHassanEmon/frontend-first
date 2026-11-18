import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity, AlertOctagon, Boxes, Factory, EyeOff, ArrowRight } from "lucide-react";
import { KpiCard, Panel, PageHeader, RiskBadge, StatusBadge, Confidence, sevColor, DemoTag } from "@/components/app/ui";
import { LazyMap } from "@/components/app/LazyMap";
import { RiskDonut } from "@/components/app/RiskDonut";
import { kpis, mapMarkers, signals, timeline } from "@/data/mock";
import { useApp } from "@/lib/store";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => seo("Global Risk Overview", "Monitor emerging threats across global commerce networks."),
  component: Overview,
});

const icons = [Activity, AlertOctagon, Boxes, Factory, EyeOff];

function Overview() {
  const invs = useApp((s) => s.investigations);
  const [sel, setSel] = useState<string | null>(null);
  const points = useMemo(() => mapMarkers.map((m) => ({ id: m.id, lng: m.lng, lat: m.lat, color: sevColor[m.severity], label: m.name, sub: `${m.country} · ${m.domain}`, pulse: m.severity === "critical" })), []);
  const selected = mapMarkers.find((m) => m.id === sel);
  return (
    <div className="mx-auto max-w-[1400px] space-y-4">
      <PageHeader title="Global Risk Overview" subtitle="Monitor emerging threats across global commerce networks." actions={<DemoTag />} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">{kpis.map((k, i) => <KpiCard key={k.label} {...k} icon={icons[i]} />)}</div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Global Risk Map" className="xl:col-span-2" bodyClass="p-0" action={<div className="flex gap-3 text-[11px] text-muted-foreground">{(["critical", "high", "medium", "low"] as const).map((s) => <span key={s} className="flex items-center gap-1 capitalize"><span className="size-2 rounded-full" style={{ background: sevColor[s] }} />{s}</span>)}</div>}>
          <div className="relative h-[360px] overflow-hidden rounded-b-lg">
            <LazyMap points={points} onSelect={setSel} selectedId={sel} />
            {selected && <div className="absolute bottom-3 left-3 w-72 rounded-lg border border-border bg-popover/95 p-3 text-xs backdrop-blur fade-up"><div className="flex items-center justify-between"><p className="font-medium">{selected.name}</p><RiskBadge level={selected.severity} /></div><p className="mt-1 text-muted-foreground">{selected.country} · {selected.domain}</p><p className="mt-2">{selected.detail}</p></div>}
          </div>
        </Panel>
        <Panel title="Risk Distribution"><RiskDonut /></Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Recent Investigations" className="xl:col-span-2" bodyClass="p-0" action={<Link to="/investigations" className="flex items-center gap-1 text-xs text-primary">View all <ArrowRight className="size-3" /></Link>}>
          <div className="overflow-x-auto"><table className="w-full text-xs">
            <thead className="text-left text-muted-foreground"><tr className="border-b border-border">{["ID", "Title", "Domain", "Risk", "Confidence", "Status", "Date"].map((h) => <th key={h} className="px-4 py-2 font-normal">{h}</th>)}</tr></thead>
            <tbody>{invs.slice(0, 6).map((i) => <tr key={i.id} className="border-b border-border last:border-0 hover:bg-accent/40"><td className="px-4 py-2.5 font-mono text-primary">{i.id}</td><td className="px-4 py-2.5">{i.title}</td><td className="px-4 py-2.5 text-muted-foreground">{i.domain}</td><td className="px-4 py-2.5"><RiskBadge level={i.severity} /></td><td className="px-4 py-2.5"><Confidence value={i.confidence} /></td><td className="px-4 py-2.5"><StatusBadge status={i.status} /></td><td className="px-4 py-2.5 font-mono text-muted-foreground">{i.date}</td></tr>)}</tbody>
          </table></div>
        </Panel>
        <Panel title="Emerging Risk Signals" bodyClass="p-0">
          <ul>{signals.map((s) => <li key={s.title} className="flex gap-3 border-b border-border px-4 py-3 last:border-0"><span className="mt-1 size-2 shrink-0 rounded-full" style={{ background: sevColor[s.severity] }} /><div className="min-w-0 flex-1"><p className="text-xs font-medium">{s.title}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{s.country} · {s.category} · {s.time}</p></div><RiskBadge level={s.severity} /></li>)}</ul>
        </Panel>
      </div>
      <Panel title="Investigation Activity">
        <ol className="relative ml-2 space-y-4 border-l border-border pl-5">{timeline.map((t) => <li key={t.text} className="relative"><span className={cn("absolute -left-[25px] top-1 size-2.5 rounded-full ring-4 ring-card", t.tone === "critical" ? "bg-critical" : t.tone === "success" ? "bg-success" : t.tone === "warning" ? "bg-warning" : "bg-primary")} /><p className="text-xs">{t.text}</p><p className="font-mono text-[11px] text-muted-foreground">{t.time}</p></li>)}</ol>
      </Panel>
    </div>
  );
}
