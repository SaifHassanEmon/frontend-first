import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  CloudLightning,
  AlertTriangle,
  Ship,
  Wind,
  Flame,
  Globe2,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Navigation,
} from "lucide-react";
import { PageHeader, DemoTag, RiskBadge, Panel, KpiCard, sevColor } from "@/components/app/ui";
import { LazyMap } from "@/components/app/LazyMap";
import { disruptionEvents, type Severity } from "@/data/mock";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/disruptions")({
  head: () => seo("Disruption Intelligence", "Global port bottlenecks, severe weather events, and geopolitical logistics alerts."),
  component: DisruptionIntelligencePage,
});

const eventIcons: Record<string, typeof CloudLightning> = {
  "Port Closure": Ship,
  "Severe Weather": Wind,
  "Geopolitical Disruption": Globe2,
  "Supplier Shutdown": Flame,
};

function DisruptionIntelligencePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(disruptionEvents[0]?.id ?? null);

  const categories = useMemo(() => {
    return ["ALL", ...Array.from(new Set(disruptionEvents.map((d) => d.type)))];
  }, []);

  const filteredEvents = useMemo(() => {
    return disruptionEvents.filter((e) => {
      if (selectedCategory !== "ALL" && e.type !== selectedCategory) return false;
      if (selectedSeverity !== "ALL" && e.severity !== selectedSeverity) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.region.toLowerCase().includes(q) ||
          e.suppliers.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, selectedSeverity, search]);

  const mapPoints = useMemo(() => {
    return disruptionEvents.map((e) => ({
      id: e.id,
      lng: e.lng,
      lat: e.lat,
      color: sevColor[e.severity],
      label: e.title,
      sub: `${e.location} · ${e.type}`,
      pulse: e.severity === "critical",
    }));
  }, []);

  const activeEvent = disruptionEvents.find((e) => e.id === selectedEventId) ?? disruptionEvents[0];

  return (
    <div className="mx-auto max-w-[1450px] space-y-4">
      <PageHeader
        title="Disruption Intelligence"
        subtitle="Real-time maritime corridors, weather anomalies, geopolitical chokepoints, and plant shutdowns."
        actions={<DemoTag label="Logistics & Freight Telemetry" />}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Active Disruption Alerts"
          value="4 Events"
          trend="+2"
          up={true}
          icon={CloudLightning}
          tone="critical"
        />
        <KpiCard
          label="Delayed Inbound Freight"
          value="38 TEUs"
          trend="+12%"
          up={true}
          icon={Ship}
          tone="warning"
        />
        <KpiCard
          label="Average ETA Drift"
          value="+9.4 Days"
          trend="+1.8d"
          up={true}
          icon={Clock}
          tone="warning"
        />
        <KpiCard
          label="Downstream Product Value"
          value="$28.4M"
          trend="+4.2%"
          up={true}
          icon={AlertTriangle}
          tone="info"
        />
      </div>

      {/* Interactive Map of Disruptions */}
      <Panel
        title="Disruption Chokepoints & Corridor Tracking"
        bodyClass="p-0"
        action={
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            {(["critical", "high", "medium", "low"] as const).map((s) => (
              <span key={s} className="flex items-center gap-1 capitalize">
                <span className="size-2 rounded-full" style={{ background: sevColor[s] }} />
                {s}
              </span>
            ))}
          </div>
        }
      >
        <div className="relative h-[320px] overflow-hidden rounded-b-lg">
          <LazyMap points={mapPoints} onSelect={setSelectedEventId} selectedId={selectedEventId} />
          {activeEvent && (
            <div className="absolute bottom-3 left-3 w-80 rounded-lg border border-border bg-popover/95 p-3 text-xs backdrop-blur fade-up">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{activeEvent.title}</p>
                <RiskBadge level={activeEvent.severity} />
              </div>
              <p className="mt-1 text-muted-foreground">{activeEvent.location} · {activeEvent.type}</p>
              <p className="mt-2 line-clamp-2 text-foreground/90">{activeEvent.description}</p>
            </div>
          )}
        </div>
      </Panel>

      {/* Search and Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search disruption event, location, supplier…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={cn(
                  "rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                  selectedCategory === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {c === "ALL" ? "All" : c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Severity:</span>
            {["ALL", "critical", "high", "medium", "low"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={cn(
                  "rounded px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
                  selectedSeverity === sev
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {(search || selectedCategory !== "ALL" || selectedSeverity !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("ALL");
              setSelectedSeverity("ALL");
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Disruption Feed & Event Detail Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Disruption List */}
        <div className="space-y-3 lg:col-span-2">
          {filteredEvents.map((evt) => {
            const Icon = eventIcons[evt.type] ?? CloudLightning;
            const isSelected = activeEvent?.id === evt.id;
            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className={cn(
                  "cursor-pointer rounded-lg border bg-card p-4 transition-all duration-200 hover:border-primary/50 fade-up",
                  isSelected ? "border-primary ring-1 ring-primary/30" : "border-border"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-muted text-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                          {evt.type}
                        </span>
                        <h4 className="text-sm font-semibold text-foreground">{evt.title}</h4>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {evt.location} ({evt.region})
                      </p>
                    </div>
                  </div>
                  <RiskBadge level={evt.severity} />
                </div>

                <p className="mt-3 text-xs text-foreground/90 leading-relaxed">{evt.description}</p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">Affected Suppliers:</span>
                    <div className="flex flex-wrap gap-1">
                      {evt.suppliers.map((s) => (
                        <span key={s} className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="flex items-center gap-1 font-medium text-primary text-[11px] hover:underline">
                    Inspect Rerouting <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Event Action & Impact Panel */}
        <div className="lg:col-span-1">
          {activeEvent ? (
            <div className="space-y-4 rounded-lg border border-border bg-card p-4 fade-up">
              <div className="border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-primary">Incident {activeEvent.id}</span>
                  <RiskBadge level={activeEvent.severity} />
                </div>
                <h3 className="mt-1 text-base font-semibold">{activeEvent.title}</h3>
                <p className="text-xs text-muted-foreground">{activeEvent.location} · {activeEvent.region}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground font-medium">Situation Assessment:</span>
                  <p className="mt-1 rounded border border-border bg-muted/30 p-2.5 leading-relaxed">
                    {activeEvent.description}
                  </p>
                </div>

                <div className="rounded border border-warning/30 bg-warning/10 p-3 text-warning">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Navigation className="size-3.5" />
                    <span>Recommended Mitigation Action</span>
                  </div>
                  <p className="mt-1 text-[11px] text-warning/90 leading-relaxed">
                    {activeEvent.recommendation}
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground font-medium">Downstream Exposed Products:</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {activeEvent.products.map((p) => (
                      <span key={p} className="rounded border border-border bg-background px-2 py-0.5 text-[11px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Link
                    to="/graph"
                    className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-2 text-xs font-medium hover:border-primary/50"
                  >
                    Trace in Supply Chain Graph <ArrowRight className="size-3.5" />
                  </Link>
                  <button
                    onClick={() => alert(`Logistics escalation alert sent to Freight Operations for ${activeEvent.title}.`)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Notify Logistics & Carriers
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid h-64 place-items-center rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              Select an incident to view logistics impact and mitigation recommendations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
