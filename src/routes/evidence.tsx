import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  FileSearch,
  FileText,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  UploadCloud,
  FileCode,
  Download,
  AlertCircle,
} from "lucide-react";
import { PageHeader, DemoTag, StatusBadge, Confidence, Panel, KpiCard } from "@/components/app/ui";
import { useApp } from "@/lib/store";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/evidence")({
  head: () => seo("Evidence Explorer", "Chain-of-custody audit trail, OCR documents, and regulatory filings."),
  component: EvidenceExplorerPage,
});

function EvidenceExplorerPage() {
  const evidenceList = useApp((s) => s.evidence);
  const verifyEvidence = useApp((s) => s.verifyEvidence);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [activeItem, setActiveItem] = useState<(typeof evidenceList)[number] | null>(evidenceList[0] ?? null);

  const docTypes = useMemo(() => {
    return ["ALL", ...Array.from(new Set(evidenceList.map((e) => e.type)))];
  }, [evidenceList]);

  const filteredItems = useMemo(() => {
    return evidenceList.filter((item) => {
      if (selectedType !== "ALL" && item.type !== selectedType) return false;
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.entity.toLowerCase().includes(q) ||
          item.investigation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedType, selectedStatus, evidenceList]);

  return (
    <div className="mx-auto max-w-[1450px] space-y-4">
      <PageHeader
        title="Evidence Explorer"
        subtitle="Verifiable regulatory filings, shipping manifests, bill-of-materials, and lab test reports."
        actions={
          <div className="flex items-center gap-2">
            <DemoTag label="Chain-of-custody archive" />
            <button
              onClick={() => alert("Upload dialog simulated: drag & drop PDF, scan or JSON manifest.")}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <UploadCloud className="size-3.5" />
              Upload Evidence
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Indexed Documents"
          value="142 Records"
          trend="+18"
          up={true}
          icon={FileSearch}
          tone="primary"
        />
        <KpiCard
          label="Verified Authenticity"
          value="91.4%"
          trend="+3.2%"
          up={false}
          icon={ShieldCheck}
          tone="success"
        />
        <KpiCard
          label="Pending Review"
          value="14 Files"
          trend="-2"
          up={false}
          icon={Clock}
          tone="warning"
        />
        <KpiCard
          label="Avg Confidence Score"
          value="84%"
          trend="+5%"
          up={true}
          icon={CheckCircle2}
          tone="info"
        />
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search document, ID, entity, source…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Type:</span>
            {docTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={cn(
                  "rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                  selectedType === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "ALL" ? "All" : t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Status:</span>
            {["ALL", "Verified", "Pending", "Unverified"].map((st) => (
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

        {(search || selectedType !== "ALL" || selectedStatus !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedType("ALL");
              setSelectedStatus("ALL");
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Main Table + Document Viewer Drawer */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Evidence Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-card lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Evidence ID & Name</th>
                  <th className="px-4 py-3 font-medium">Source & Entity</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-accent/40",
                      activeItem?.id === item.id && "bg-primary/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="font-mono text-primary font-medium">{item.id}</div>
                      <div className="font-medium text-foreground truncate max-w-xs">{item.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{item.entity}</div>
                      <div className="text-[11px] text-muted-foreground">{item.source}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px]">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Confidence value={item.confidence} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveItem(item);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                      >
                        Preview <ChevronRight className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Inspection Drawer */}
        <div className="lg:col-span-1">
          {activeItem ? (
            <div className="space-y-4 rounded-lg border border-border bg-card p-4 fade-up">
              <div className="border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary">{activeItem.id}</span>
                  <StatusBadge status={activeItem.status} />
                </div>
                <h3 className="mt-1 text-sm font-semibold">{activeItem.name}</h3>
                <p className="text-xs text-muted-foreground">Logged {activeItem.date} via {activeItem.source}</p>
              </div>

              {/* Confidence & Entity */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Extraction Confidence</span>
                  <Confidence value={activeItem.confidence} />
                </div>
                <div className="rounded border border-border bg-muted/20 p-2.5">
                  <span className="text-muted-foreground text-[11px]">Primary Subject Entity:</span>
                  <p className="font-medium text-foreground mt-0.5">{activeItem.entity}</p>
                </div>
              </div>

              {/* OCR Extracted Text Box */}
              <div className="space-y-1.5 text-xs">
                <span className="text-muted-foreground font-medium">Extracted Text & Metadata:</span>
                <div className="max-h-48 overflow-y-auto rounded border border-border bg-background p-3 font-mono text-[11px] leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {activeItem.text}
                </div>
              </div>

              {/* Linked Investigation */}
              <div className="rounded border border-border p-2.5 text-xs">
                <span className="text-muted-foreground text-[11px]">Associated Investigation:</span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono font-medium text-primary">{activeItem.investigation}</span>
                  <Link
                    to="/investigations"
                    className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                  >
                    Open Investigation <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    verifyEvidence(activeItem.id);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <ShieldCheck className="size-3.5" /> Confirm Verified Authenticity
                </button>
                <button
                  onClick={() => alert(`Downloaded raw artifact: ${activeItem.name}`)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-2 text-xs font-medium hover:border-primary/50"
                >
                  <Download className="size-3.5" /> Download Source Document
                </button>
              </div>
            </div>
          ) : (
            <div className="grid h-64 place-items-center rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              Select an evidence file from the table to preview extracted text and metadata.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
