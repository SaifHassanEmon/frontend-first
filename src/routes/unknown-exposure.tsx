import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  EyeOff,
  AlertTriangle,
  Layers,
  Network,
  ShieldAlert,
  Search,
  Scan,
  Sparkles,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { PageHeader, DemoTag, RiskBadge, Confidence, Panel, KpiCard } from "@/components/app/ui";
import { unknownExposures, type UnknownExposureItem } from "@/data/mock";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/unknown-exposure")({
  head: () => seo("Unknown Exposure", "Discover unmapped sub-tier suppliers, concentration risks, and blind spots."),
  component: UnknownExposurePage,
});

function UnknownExposurePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [isScanning, setIsScanning] = useState(false);

  const categories = ["ALL", "Concentration Risk", "Hidden Sub-tier", "Regulatory Blind Spot", "Sole Sourcing"];

  const filteredItems = useMemo(() => {
    return unknownExposures.filter((item) => {
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
      if (selectedSeverity !== "ALL" && item.severity !== selectedSeverity) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.primaryEntity.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          item.downstreamProducts.some((p) => p.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, selectedCategory, selectedSeverity]);

  const runDiscoveryScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert("ML Entity Traversal complete: Scanned 14,200 shipping records. 4 blind spots flagged.");
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-[1450px] space-y-4">
      <PageHeader
        title="Unknown Exposure & Blind-Spot Intelligence"
        subtitle="AI-driven discovery of unmapped sub-tier suppliers, shadow facilities, and multi-tier concentration risks."
        actions={
          <div className="flex items-center gap-2">
            <DemoTag label="Recursive BOM & Manifest Traversal" />
            <button
              onClick={runDiscoveryScan}
              disabled={isScanning}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Sparkles className={cn("size-3.5", isScanning && "animate-spin")} />
              {isScanning ? "Scanning Manifests…" : "Run ML Discovery Scan"}
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Unmonitored Entities Flagged"
          value="52 Blind Spots"
          trend="+6"
          up={true}
          icon={EyeOff}
          tone="warning"
        />
        <KpiCard
          label="Critical Concentration Clusters"
          value="8 Clusters"
          trend="+2"
          up={true}
          icon={AlertTriangle}
          tone="critical"
        />
        <KpiCard
          label="Max Multi-Tier Depth"
          value="Tier 4 Depth"
          trend="+1 level"
          up={true}
          icon={Layers}
          tone="info"
        />
        <KpiCard
          label="Exposed Revenue Buffer"
          value="$36.8M"
          trend="+8.5%"
          up={true}
          icon={TrendingUp}
          tone="critical"
        />
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search entity, downstream product, country…"
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

      {/* Cards List */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 fade-up"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-primary">
                    {item.category}
                  </span>
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    Tier {item.tierDepth} Depth
                  </span>
                </div>
                <RiskBadge level={item.severity} />
              </div>

              <h3 className="mt-2 text-sm font-semibold text-foreground leading-snug">{item.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Discovered Entity: <strong className="text-foreground">{item.primaryEntity}</strong> ({item.country})
              </p>

              <div className="mt-3 rounded border border-border bg-muted/20 p-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Exposure Risk Index</span>
                  <span className="font-mono font-bold text-foreground">{item.exposureScore}/100</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      item.exposureScore >= 80 ? "bg-critical" : "bg-warning"
                    )}
                    style={{ width: `${item.exposureScore}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] font-medium text-foreground">{item.impactEstimate}</p>
              </div>

              <div className="mt-3 space-y-1.5 text-xs">
                <div className="text-[11px] text-muted-foreground">
                  Discovery Trace: <span className="text-foreground">{item.discoverySource}</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-muted-foreground">Exposed Products:</span>
                  {item.downstreamProducts.map((p) => (
                    <span key={p} className="rounded bg-background border border-border px-1.5 py-0.2">
                      {p}
                    </span>
                  ))}
                </div>

                <div className="rounded border border-primary/20 bg-primary/5 p-2 text-[11px] text-foreground/90">
                  <span className="font-semibold text-primary">Recommended Action: </span>
                  {item.recommendation}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
              <Link
                to="/graph"
                className="flex items-center gap-1 font-medium text-primary hover:underline"
              >
                Inspect in Graph <ExternalLink className="size-3" />
              </Link>
              <button
                onClick={() => alert(`Added ${item.primaryEntity} to Monitored Suppliers Watchlist.`)}
                className="flex items-center gap-1 rounded bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-accent"
              >
                <PlusCircle className="size-3" /> Convert to Monitored
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
