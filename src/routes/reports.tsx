import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  FileBarChart,
  FileDown,
  Printer,
  Calendar,
  Share2,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { PageHeader, DemoTag, Panel, KpiCard } from "@/components/app/ui";
import { reports, type Domain } from "@/data/mock";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => seo("Reports & Regulatory Filings", "Compliance dossiers, recall filing drafts, and executive risk summaries."),
  component: ReportsPage,
});

type ReportItem = (typeof reports)[number];

const reportDetails: Record<string, { summary: string; findings: string[]; recipients: string }> = {
  "RPT-501": {
    summary: "Comprehensive multi-tier impact assessment of the BatteryPro XZ-100 recall notice. Traced across 3 finished consumer goods and 12,400 quarantined units in Los Angeles DC-04.",
    findings: [
      "Confirmed defect in lithium cell batch #88A manufactured in Shenzhen cluster",
      "Tier-1 assembly exposure verified for Nova Mobile and Urban Glide",
      "Immediate CPSC Fast Track filing recommended to preempt civil penalties",
    ],
    recipients: "Executive Committee, Legal Counsel, Chief Supply Chain Officer",
  },
  "RPT-498": {
    summary: "Quarterly vulnerability audit of single-source component providers with focus on East Asian semiconductor and capacitor concentration.",
    findings: [
      "71% of capacitor volume is concentrated in a single Kaohsiung industrial park",
      "Alternative Mexican assembler Monterrey Electro SA qualified for 40% overflow",
      "Recommended 30-day buffer inventory increase at European distribution hubs",
    ],
    recipients: "Global Sourcing Board, Operations VP",
  },
  "RPT-493": {
    summary: "Investigation into counterfeit 65W GaN charger listings on Middle Eastern and European secondary ecommerce marketplaces.",
    findings: [
      "Duplicate GTIN detected across 3 unauthorized seller profiles",
      "Specimen lab testing revealed -38g weight deficit and absent thermal cutout fuse",
      "Formal cease-and-desist notifications prepared for marketplace enforcement teams",
    ],
    recipients: "Brand Protection Group, IP Legal Directorate",
  },
};

function ReportsPage() {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [activeReport, setActiveReport] = useState<ReportItem | null>(reports[0] ?? null);
  const [generating, setGenerating] = useState(false);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (selectedDomain !== "ALL" && r.domain !== selectedDomain) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedDomain]);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert("New Regulatory Dossier compiled: 'Rapid Recall Impact Report' ready for export.");
    }, 1100);
  };

  const currentDetail = activeReport ? reportDetails[activeReport.id] ?? {
    summary: "Automated risk intelligence report compiled from real-time supply chain sensor telemetry and open-source intelligence feeds.",
    findings: [
      "Routine threshold monitoring within expected baseline parameters",
      "No critical regulatory escalations logged during this reporting window",
    ],
    recipients: "Risk Analysis Team, Regional Operations",
  } : null;

  return (
    <div className="mx-auto max-w-[1450px] space-y-4">
      <PageHeader
        title="Reports & Regulatory Filings"
        subtitle="Automated compliance dossiers, exportable executive briefs, and regulatory submission templates."
        actions={
          <div className="flex items-center gap-2">
            <DemoTag label="PDF & CSV Dossier Generator" />
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Sparkles className={cn("size-3.5", generating && "animate-spin")} />
              {generating ? "Compiling Dossier…" : "Generate New Report"}
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Published Dossiers"
          value="48 Reports"
          trend="+8"
          up={true}
          icon={FileBarChart}
          tone="primary"
        />
        <KpiCard
          label="Regulatory Filings"
          value="12 Filings"
          trend="+2"
          up={true}
          icon={ShieldCheck}
          tone="critical"
        />
        <KpiCard
          label="Scheduled Automation"
          value="6 Recurring"
          trend="Daily"
          up={false}
          icon={Clock}
          tone="info"
        />
        <KpiCard
          label="Audit Compliance Score"
          value="98.2%"
          trend="+1.1%"
          up={false}
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reports by title, ID, type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Domain:</span>
            {["ALL", "Product Recall", "Supplier Risk", "Counterfeit", "Disruption"].map((d) => (
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

      {/* Main Table + Report Preview Drawer */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Reports Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-card lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Report Dossier</th>
                  <th className="px-4 py-3 font-medium">Domain</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Pages</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredReports.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setActiveReport(r)}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-accent/40",
                      activeReport?.id === r.id && "bg-primary/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="font-mono text-primary font-medium">{r.id}</div>
                      <div className="font-medium text-foreground">{r.title}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        {r.domain}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {r.type}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {r.date}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {r.pages} pgs
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReport(r);
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

        {/* Report Preview Panel */}
        <div className="lg:col-span-1">
          {activeReport ? (
            <div className="space-y-4 rounded-lg border border-border bg-card p-4 fade-up">
              <div className="border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary">{activeReport.id}</span>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px]">
                    {activeReport.pages} Pages
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-semibold">{activeReport.title}</h3>
                <p className="text-xs text-muted-foreground">Compiled {activeReport.date} · {activeReport.domain}</p>
              </div>

              {/* Executive Summary */}
              {currentDetail && (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-muted-foreground font-medium">Executive Summary:</span>
                    <p className="mt-1 rounded border border-border bg-muted/20 p-2.5 text-foreground/90 leading-relaxed">
                      {currentDetail.summary}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground font-medium">Key Findings:</span>
                    <ul className="mt-1.5 space-y-1.5">
                      {currentDetail.findings.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[11px] text-foreground/90">
                          <CheckCircle2 className="size-3.5 shrink-0 text-primary mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded border border-border bg-muted/30 p-2.5">
                    <span className="text-[10px] uppercase text-muted-foreground font-mono">Distribution List</span>
                    <p className="mt-0.5 text-[11px] text-foreground">{currentDetail.recipients}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => alert(`Generating printable PDF for ${activeReport.title}...`)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <FileDown className="size-3.5" /> Download Official PDF
                </button>
                <button
                  onClick={() => alert(`Exported raw dataset for ${activeReport.id} as CSV.`)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-2 text-xs font-medium hover:border-primary/50"
                >
                  <Share2 className="size-3.5" /> Share Report Link
                </button>
              </div>
            </div>
          ) : (
            <div className="grid h-64 place-items-center rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              Select a report from the table to preview executive summary and findings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
