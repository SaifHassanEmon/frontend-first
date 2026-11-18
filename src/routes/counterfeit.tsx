import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ScanSearch,
  AlertOctagon,
  ShieldAlert,
  Search,
  ExternalLink,
  ChevronRight,
  FileText,
  BadgeAlert,
  CheckCircle2,
  DollarSign,
  Barcode,
  Scale,
  Send,
  Sparkles,
} from "lucide-react";
import { PageHeader, DemoTag, RiskBadge, StatusBadge, Confidence, Panel, KpiCard } from "@/components/app/ui";
import { useApp } from "@/lib/store";
import { type CounterfeitListing } from "@/data/mock";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/counterfeit")({
  head: () => seo("Counterfeit Detection", "Marketplace anomalies, GTIN collisions, and physical component discrepancies."),
  component: CounterfeitDetectionPage,
});

function CounterfeitDetectionPage() {
  const counterfeitListings = useApp((s) => s.counterfeits);
  const updateStatus = useApp((s) => s.updateCounterfeitStatus);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [activeItem, setActiveItem] = useState<CounterfeitListing | null>(counterfeitListings[0] ?? null);

  const filteredListings = useMemo(() => {
    return counterfeitListings.filter((c) => {
      if (selectedStatus !== "ALL" && c.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.targetProduct.toLowerCase().includes(q) ||
          c.seller.toLowerCase().includes(q) ||
          c.platform.toLowerCase().includes(q) ||
          c.gtin.includes(q) ||
          c.sku.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedStatus, counterfeitListings]);

  return (
    <div className="mx-auto max-w-[1450px] space-y-4">
      <PageHeader
        title="Counterfeit Detection"
        subtitle="Marketplace anomaly signals, duplicate GTIN barcodes, and physical spec variance analysis."
        actions={
          <div className="flex items-center gap-2">
            <DemoTag label="Marketplace scraper & GTIN match engine" />
            <button
              onClick={() => alert("Batch DMCA takedown requests drafted for 2 confirmed listings.")}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Send className="size-3.5" />
              Issue Takedown Notices
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Flagged Listings"
          value="18 Listings"
          trend="+5"
          up={true}
          icon={ScanSearch}
          tone="critical"
        />
        <KpiCard
          label="GTIN Barcode Collisions"
          value="4 SKUs"
          trend="+1"
          up={true}
          icon={Barcode}
          tone="warning"
        />
        <KpiCard
          label="Avg Price Undercut"
          value="-48.5%"
          trend="-6.2%"
          up={false}
          icon={DollarSign}
          tone="critical"
        />
        <KpiCard
          label="Takedowns Enforced"
          value="11 Cleared"
          trend="+3"
          up={true}
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search product, seller, marketplace, GTIN…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Status:</span>
            {["ALL", "Confirmed Fake", "Takedown Issued", "Under Review", "Flagged"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={cn(
                  "rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                  selectedStatus === st
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {(search || selectedStatus !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedStatus("ALL");
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Main Table + Specimen Inspector */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Flagged Listings Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-card lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Suspect Listing & Product</th>
                  <th className="px-4 py-3 font-medium">Marketplace & Seller</th>
                  <th className="px-4 py-3 font-medium">Price Delta</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredListings.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-accent/40",
                      activeItem?.id === item.id && "bg-primary/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{item.targetProduct}</div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground mt-0.5">
                        <span>SKU: {item.sku}</span>
                        <span>·</span>
                        <span>GTIN: {item.gtin}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{item.platform}</div>
                      <div className="text-[11px] text-muted-foreground">{item.seller} ({item.region})</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-critical font-medium">
                      {item.priceDelta}
                    </td>
                    <td className="px-4 py-3">
                      <Confidence value={item.confidence} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveItem(item);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                      >
                        Inspect <ChevronRight className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Specimen Discrepancy Dossier */}
        <div className="lg:col-span-1">
          {activeItem ? (
            <div className="space-y-4 rounded-lg border border-border bg-card p-4 fade-up">
              <div className="border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-primary">Case {activeItem.id}</span>
                  <StatusBadge status={activeItem.status} />
                </div>
                <h3 className="mt-1 text-base font-semibold">{activeItem.targetProduct}</h3>
                <p className="text-xs text-muted-foreground">Detected on {activeItem.dateDetected}</p>
              </div>

              {/* Physical Discrepancy Checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Scale className="size-3.5 text-primary" />
                  <span>Physical Specimen Anomaly Checklist:</span>
                </div>
                <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3">
                  {activeItem.anomalies.map((anom) => (
                    <div key={anom} className="flex items-start gap-2 text-[11px] text-foreground/90">
                      <BadgeAlert className="size-3.5 shrink-0 text-critical mt-0.5" />
                      <span>{anom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Merchant & Listing Data */}
              <div className="space-y-2 text-xs">
                <div className="rounded border border-border bg-muted/30 p-2.5">
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">Marketplace Listing</p>
                  <p className="mt-0.5 font-medium">{activeItem.seller}</p>
                  <p className="text-[11px] text-muted-foreground">{activeItem.platform} · {activeItem.region}</p>
                </div>
                <div className="rounded border border-border bg-muted/30 p-2.5">
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">Barcode Discrepancy</p>
                  <p className="mt-0.5 font-mono text-[11px]">GTIN: {activeItem.gtin}</p>
                  <p className="text-[11px] text-critical">Barcode duplicate detected across multiple unverified storefronts</p>
                </div>
              </div>

              {/* Linked Evidence */}
              <div className="rounded border border-border p-2.5 text-xs">
                <span className="text-muted-foreground text-[11px]">Primary Evidence Reference:</span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono font-medium text-primary">{activeItem.evidenceRef}</span>
                  <Link
                    to="/evidence"
                    className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                  >
                    View Document <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    updateStatus(activeItem.id, "Takedown Issued");
                    alert(`Cease & Desist / Platform Takedown issued for ${activeItem.seller} on ${activeItem.platform}. Status updated.`);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-critical py-2 text-xs font-medium text-white hover:bg-critical/90"
                >
                  <ShieldAlert className="size-3.5" /> Generate Legal Takedown
                </button>
                <Link
                  to="/investigations"
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-2 text-xs font-medium hover:border-primary/50"
                >
                  Escalate to Investigation Case
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid h-64 place-items-center rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              Select an anomaly listing to inspect specimen comparison and evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
