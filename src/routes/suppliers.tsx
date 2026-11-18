import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Factory,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  FileCheck2,
  Building2,
  MapPin,
  ExternalLink,
  ChevronRight,
  X,
  Plus,
  FileDown,
} from "lucide-react";
import { PageHeader, DemoTag, RiskBadge, StatusBadge, Confidence, Panel, KpiCard } from "@/components/app/ui";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Severity } from "@/data/mock";

export const Route = createFileRoute("/suppliers")({
  head: () => seo("Supplier Intelligence", "Multi-tier supplier dependency, compliance, and risk analysis."),
  component: SupplierIntelligencePage,
});

interface DetailedSupplier {
  id: string;
  name: string;
  country: string;
  city: string;
  tier: 1 | 2 | 3;
  risk: number;
  severity: Severity;
  category: string;
  singleSource: boolean;
  status: "Verified" | "Needs verification" | "High risk";
  leiCode: string;
  esgScore: number;
  leadTimeDays: number;
  certifications: string[];
  lastAuditDate: string;
  downstreamProducts: string[];
  notes: string;
}

const suppliersList: DetailedSupplier[] = [
  {
    id: "s1",
    name: "BatteryPro Cells Co.",
    country: "China",
    city: "Shenzhen",
    tier: 1,
    risk: 88,
    severity: "critical",
    category: "Lithium cells & battery packs",
    singleSource: true,
    status: "High risk",
    leiCode: "549300BPCELLS88X01",
    esgScore: 61,
    leadTimeDays: 45,
    certifications: ["ISO 9001 (Revoked)", "UN 38.3 (Under Review)"],
    lastAuditDate: "2026-03-14",
    downstreamProducts: ["Smartphone A", "Electric Scooter B", "Power Bank C"],
    notes: "Primary origin facility for thermal overheating recall. Sub-tier supplier disclosure refused.",
  },
  {
    id: "s2",
    name: "Formosa Capacitor Ltd.",
    country: "Taiwan",
    city: "Kaohsiung",
    tier: 2,
    risk: 76,
    severity: "high",
    category: "Dielectric Capacitors",
    singleSource: true,
    status: "High risk",
    leiCode: "5493001KJTIIGC8Y1R12",
    esgScore: 82,
    leadTimeDays: 60,
    certifications: ["ISO 9001:2015", "IATF 16949"],
    lastAuditDate: "2026-08-19",
    downstreamProducts: ["Smartphone A", "Electric Scooter B"],
    notes: "Sole source for ultra-thin SMD capacitors. High typhoon exposure in coastal Kaohsiung cluster.",
  },
  {
    id: "s3",
    name: "Mekong Bearings JSC",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    tier: 2,
    risk: 61,
    severity: "medium",
    category: "Precision Bearings",
    singleSource: false,
    status: "Needs verification",
    leiCode: "549300MKBEAR99021B",
    esgScore: 54,
    leadTimeDays: 30,
    certifications: ["ISO 9001 (Expired 2026-09)"],
    lastAuditDate: "2025-11-20",
    downstreamProducts: ["Electric Scooter B"],
    notes: "Missing documentation for sub-tier steel suppliers. Pending on-site compliance re-audit.",
  },
  {
    id: "s4",
    name: "Chennai Relay Works",
    country: "India",
    city: "Chennai",
    tier: 2,
    risk: 57,
    severity: "medium",
    category: "Solid State Relays",
    singleSource: false,
    status: "Needs verification",
    leiCode: "549300CHRELAY5501A",
    esgScore: 71,
    leadTimeDays: 35,
    certifications: ["ISO 9001:2015", "RoHS Compliant"],
    lastAuditDate: "2026-05-10",
    downstreamProducts: ["Power Bank C", "Industrial Relay K"],
    notes: "Thermal variance detected during random batch sampling in EU distribution.",
  },
  {
    id: "s5",
    name: "Monterrey Electro SA",
    country: "Mexico",
    city: "Monterrey",
    tier: 1,
    risk: 28,
    severity: "low",
    category: "Final Sub-Assembly",
    singleSource: false,
    status: "Verified",
    leiCode: "549300MTRYELEC1244",
    esgScore: 88,
    leadTimeDays: 14,
    certifications: ["ISO 9001:2015", "ISO 14001", "C-TPAT"],
    lastAuditDate: "2026-10-02",
    downstreamProducts: ["Smartphone A (Alt Line)", "Charger 45W"],
    notes: "Qualified nearshore assembler with redundant production lines and high reliability record.",
  },
  {
    id: "s6",
    name: "Nordic Polymer AB",
    country: "Sweden",
    city: "Gothenburg",
    tier: 3,
    risk: 22,
    severity: "low",
    category: "Flame-Retardant Resins",
    singleSource: false,
    status: "Verified",
    leiCode: "549300NORDICPOLY01",
    esgScore: 94,
    leadTimeDays: 20,
    certifications: ["ISO 9001", "ISO 14001", "REACH Registered"],
    lastAuditDate: "2026-09-12",
    downstreamProducts: ["Polymer Housings", "Insulators"],
    notes: "Excellent ESG and REACH compliance ratings. Multi-warehouse delivery network in EU.",
  },
  {
    id: "s7",
    name: "Sichuan Lithium Refining",
    country: "China",
    city: "Chengdu",
    tier: 3,
    risk: 74,
    severity: "high",
    category: "Battery Grade LiOH",
    singleSource: true,
    status: "Needs verification",
    leiCode: "549300SICHUANLITH9",
    esgScore: 48,
    leadTimeDays: 55,
    certifications: ["ISO 9001:2015"],
    lastAuditDate: "2026-01-18",
    downstreamProducts: ["BatteryPro XZ-100"],
    notes: "High regional power curtailment risk. Single-source chemical supplier for BatteryPro Cells.",
  },
];

function SupplierIntelligencePage() {
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<number | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [singleSourceOnly, setSingleSourceOnly] = useState(false);
  const [activeSupplier, setActiveSupplier] = useState<DetailedSupplier | null>(suppliersList[0]);

  const filteredSuppliers = useMemo(() => {
    return suppliersList.filter((s) => {
      if (selectedTier !== "ALL" && s.tier !== selectedTier) return false;
      if (selectedStatus !== "ALL" && s.status !== selectedStatus) return false;
      if (singleSourceOnly && !s.singleSource) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedTier, selectedStatus, singleSourceOnly]);

  return (
    <div className="mx-auto max-w-[1450px] space-y-4">
      <PageHeader
        title="Supplier Intelligence"
        subtitle="Multi-tier supplier risk scoring, dependency mapping, and compliance monitoring."
        actions={
          <div className="flex items-center gap-2">
            <DemoTag label="Live directory & audit ledger" />
            <button
              onClick={() => alert("Supplier audit dossier exported as PDF simulation.")}
              className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary/50"
            >
              <FileDown className="size-3.5" />
              Export Dossier
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Monitored Suppliers"
          value="346"
          trend="+14"
          up={true}
          icon={Factory}
          tone="primary"
        />
        <KpiCard
          label="Elevated Risk Entities"
          value="18"
          trend="+3"
          up={true}
          icon={AlertTriangle}
          tone="critical"
        />
        <KpiCard
          label="Single Source Bottlenecks"
          value="12"
          trend="-1"
          up={false}
          icon={ShieldAlert}
          tone="warning"
        />
        <KpiCard
          label="Audit Verification Rate"
          value="87.4%"
          trend="+2.1%"
          up={false}
          icon={CheckCircle2}
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
              placeholder="Search supplier, location, category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>

          {/* Tier buttons */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Tier:</span>
            {(["ALL", 1, 2, 3] as const).map((t) => (
              <button
                key={String(t)}
                onClick={() => setSelectedTier(t)}
                className={cn(
                  "rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                  selectedTier === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "ALL" ? "All" : `Tier ${t}`}
              </button>
            ))}
          </div>

          {/* Status buttons */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Status:</span>
            {["ALL", "Verified", "Needs verification", "High risk"].map((st) => (
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

          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={singleSourceOnly}
              onChange={(e) => setSingleSourceOnly(e.target.checked)}
              className="rounded border-border text-primary focus:ring-0"
            />
            <span>Single Source Only</span>
          </label>
        </div>

        {(search || selectedTier !== "ALL" || selectedStatus !== "ALL" || singleSourceOnly) && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedTier("ALL");
              setSelectedStatus("ALL");
              setSingleSourceOnly(false);
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Main Table + 360 Scorecard Drawer */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Suppliers Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-card lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Supplier Entity</th>
                  <th className="px-4 py-3 font-medium">Tier & Category</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Risk Score</th>
                  <th className="px-4 py-3 font-medium">Compliance</th>
                  <th className="px-4 py-3 font-medium">Sourcing</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSuppliers.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setActiveSupplier(s)}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-accent/40",
                      activeSupplier?.id === s.id && "bg-primary/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{s.name}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{s.leiCode}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        T{s.tier}
                      </span>
                      <span className="ml-1.5 text-muted-foreground">{s.category}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.city}, {s.country}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <RiskBadge level={s.severity} />
                        <span className="font-mono text-[11px] text-muted-foreground">{s.risk}/100</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-4 py-3">
                      {s.singleSource ? (
                        <span className="inline-flex items-center gap-1 font-medium text-critical text-[11px]">
                          <AlertTriangle className="size-3" /> SPOF
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">Redundant</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSupplier(s);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                      >
                        Details <ChevronRight className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 360 Supplier Dossier Panel */}
        <div className="lg:col-span-1">
          {activeSupplier ? (
            <div className="space-y-4 rounded-lg border border-border bg-card p-4 fade-up">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-primary">
                      Tier {activeSupplier.tier} Supplier
                    </span>
                    <StatusBadge status={activeSupplier.status} />
                  </div>
                  <h3 className="mt-1 text-base font-semibold">{activeSupplier.name}</h3>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="size-3 text-muted-foreground" />
                    {activeSupplier.city}, {activeSupplier.country}
                  </p>
                </div>
                <RiskBadge level={activeSupplier.severity} />
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded border border-border bg-muted/20 p-2.5">
                  <span className="text-muted-foreground text-[11px]">Risk Score</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-base font-bold">{activeSupplier.risk}/100</span>
                  </div>
                </div>
                <div className="rounded border border-border bg-muted/20 p-2.5">
                  <span className="text-muted-foreground text-[11px]">ESG Rating</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-base font-bold">{activeSupplier.esgScore}/100</span>
                  </div>
                </div>
                <div className="rounded border border-border bg-muted/20 p-2.5">
                  <span className="text-muted-foreground text-[11px]">Lead Time</span>
                  <p className="mt-1 font-mono text-sm font-semibold">{activeSupplier.leadTimeDays} days</p>
                </div>
                <div className="rounded border border-border bg-muted/20 p-2.5">
                  <span className="text-muted-foreground text-[11px]">Last Audit</span>
                  <p className="mt-1 font-mono text-xs font-semibold">{activeSupplier.lastAuditDate}</p>
                </div>
              </div>

              {/* Single Source Alert */}
              {activeSupplier.singleSource && (
                <div className="flex items-start gap-2 rounded border border-critical/30 bg-critical/10 p-2.5 text-xs text-critical">
                  <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Sole-Source Critical Vulnerability</p>
                    <p className="text-[11px] text-critical/90 mt-0.5">
                      This facility has no alternate qualified supplier. Any downtime immediately halts downstream lines.
                    </p>
                  </div>
                </div>
              )}

              {/* Certifications */}
              <div className="space-y-1.5 text-xs">
                <span className="text-muted-foreground font-medium">Compliance Certifications:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSupplier.certifications.map((c) => (
                    <span
                      key={c}
                      className={cn(
                        "rounded border px-2 py-0.5 text-[11px]",
                        c.includes("Revoked") || c.includes("Expired")
                          ? "border-critical/40 bg-critical/10 text-critical"
                          : "border-border bg-background text-foreground"
                      )}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Downstream Products */}
              <div className="space-y-1.5 text-xs">
                <span className="text-muted-foreground font-medium">Supplied Finished Products:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSupplier.downstreamProducts.map((p) => (
                    <span key={p} className="rounded border border-border bg-background px-2 py-0.5 text-[11px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Analyst Notes */}
              <div className="rounded border border-border bg-muted/30 p-2.5 text-xs">
                <span className="text-muted-foreground font-medium">Intelligence Notes:</span>
                <p className="mt-1 text-muted-foreground leading-relaxed">{activeSupplier.notes}</p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Link
                  to="/graph"
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-2 text-xs font-medium hover:border-primary/50"
                >
                  Inspect in Dependency Graph <ExternalLink className="size-3.5" />
                </Link>
                <button
                  onClick={() => alert(`Supplier Audit Request dispatched to ${activeSupplier.name} (LEI: ${activeSupplier.leiCode})`)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <FileCheck2 className="size-3.5" /> Initiate Compliance Audit
                </button>
              </div>
            </div>
          ) : (
            <div className="grid h-64 place-items-center rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              Select a supplier from the table to view their full 360 intelligence scorecard.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
