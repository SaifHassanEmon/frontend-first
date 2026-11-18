import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Database,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  Plus,
  Radio,
  Server,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { PageHeader, DemoTag, Panel, KpiCard } from "@/components/app/ui";
import { dataSources } from "@/data/mock";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/data-sources")({
  head: () => seo("Data Sources & Integrations", "Global regulatory feeds, customs registries, and real-time APIs."),
  component: DataSourcesPage,
});

interface DataSourceMeta {
  syncFrequency: string;
  lastSync: string;
  recordCount: string;
  latencyMs: number;
  status: "Operational" | "Syncing" | "Scheduled";
}

const sourceMeta: Record<string, DataSourceMeta> = {
  CPSC: { syncFrequency: "Every 15 min", lastSync: "4 min ago", recordCount: "148,200", latencyMs: 142, status: "Operational" },
  "FDA openFDA": { syncFrequency: "Every 30 min", lastSync: "12 min ago", recordCount: "820,400", latencyMs: 210, status: "Operational" },
  "EU Safety Gate": { syncFrequency: "Hourly", lastSync: "25 min ago", recordCount: "215,900", latencyMs: 180, status: "Operational" },
  "OECD GlobalRecalls": { syncFrequency: "Daily", lastSync: "3 h ago", recordCount: "430,100", latencyMs: 340, status: "Operational" },
  GS1: { syncFrequency: "Real-time webhook", lastSync: "1 min ago", recordCount: "1,204,000", latencyMs: 85, status: "Operational" },
  OpenCorporates: { syncFrequency: "Daily", lastSync: "5 h ago", recordCount: "640,000", latencyMs: 290, status: "Operational" },
  GLEIF: { syncFrequency: "Every 6 hours", lastSync: "1 h ago", recordCount: "389,000", latencyMs: 195, status: "Operational" },
  NOAA: { syncFrequency: "Every 10 min", lastSync: "2 min ago", recordCount: "95,000", latencyMs: 95, status: "Operational" },
  USGS: { syncFrequency: "Every 15 min", lastSync: "8 min ago", recordCount: "44,200", latencyMs: 110, status: "Operational" },
  ReliefWeb: { syncFrequency: "Every 2 hours", lastSync: "45 min ago", recordCount: "18,400", latencyMs: 310, status: "Operational" },
  GDELT: { syncFrequency: "Continuous stream", lastSync: "Just now", recordCount: "2,840,000", latencyMs: 70, status: "Operational" },
};

function DataSourcesPage() {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [syncingAll, setSyncingAll] = useState(false);

  const filteredSources = useMemo(() => {
    return dataSources.filter((s) => {
      if (selectedDomain !== "ALL" && s.domain !== selectedDomain) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.desc.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedDomain]);

  const handleSyncAll = () => {
    setSyncingAll(true);
    setTimeout(() => {
      setSyncingAll(false);
      alert("All 11 data source pipelines synced successfully. Ingested 142 new delta records.");
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-[1450px] space-y-4">
      <PageHeader
        title="Data Sources & Ingestion Feeds"
        subtitle="Manage government regulatory feeds, global corporate registries, weather sensors, and GTIN standards."
        actions={
          <div className="flex items-center gap-2">
            <DemoTag label="Multi-source ingestion pipeline" />
            <button
              onClick={handleSyncAll}
              disabled={syncingAll}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <RefreshCw className={cn("size-3.5", syncingAll && "animate-spin")} />
              {syncingAll ? "Syncing Feeds…" : "Trigger Global Sync"}
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Active Feed Connectors"
          value="11 Pipelines"
          trend="All Healthy"
          up={false}
          icon={Database}
          tone="primary"
        />
        <KpiCard
          label="Ingested Telemetry"
          value="6.8M Records"
          trend="+142k today"
          up={true}
          icon={Server}
          tone="info"
        />
        <KpiCard
          label="Pipeline Uptime"
          value="99.94%"
          trend="0 downtime"
          up={false}
          icon={ShieldCheck}
          tone="success"
        />
        <KpiCard
          label="Avg Pipeline Latency"
          value="158 ms"
          trend="-12ms"
          up={false}
          icon={Activity}
          tone="success"
        />
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search feed, registry, agency…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Domain:</span>
            {["ALL", "Product Recall", "Counterfeit", "Supplier Risk", "Disruption"].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={cn(
                  "rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                  selectedDomain === d
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {d === "ALL" ? "All" : d}
              </button>
            ))}
          </div>
        </div>

        {(search || selectedDomain !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedDomain("ALL");
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Connectors Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSources.map((src) => {
          const meta = sourceMeta[src.name] ?? {
            syncFrequency: "Hourly",
            lastSync: "15 min ago",
            recordCount: "50,000",
            latencyMs: 160,
            status: "Operational",
          };

          return (
            <div
              key={src.name}
              className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-primary/50 fade-up"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {src.type}
                    </span>
                    <h3 className="mt-1.5 text-sm font-semibold text-foreground">{src.name}</h3>
                  </div>
                  <span className="flex items-center gap-1 rounded border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                    <span className="size-1.5 rounded-full bg-success animate-pulse" />
                    {meta.status}
                  </span>
                </div>

                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{src.desc}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded border border-border bg-muted/20 p-2.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground">Frequency</span>
                    <p className="font-mono text-[11px] font-medium">{meta.syncFrequency}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground">Last Synced</span>
                    <p className="font-mono text-[11px] font-medium">{meta.lastSync}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground">Records</span>
                    <p className="font-mono text-[11px] font-medium">{meta.recordCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground">API Latency</span>
                    <p className="font-mono text-[11px] font-medium text-success">{meta.latencyMs} ms</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  {src.domain}
                </span>
                <button
                  onClick={() => alert(`Connection ping test to ${src.name} returned 200 OK (${meta.latencyMs}ms)`)}
                  className="flex items-center gap-1 font-medium text-primary hover:underline text-[11px]"
                >
                  <Radio className="size-3" /> Test Connection
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
