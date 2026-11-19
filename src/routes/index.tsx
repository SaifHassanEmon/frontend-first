import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  FolderSearch,
  Globe2,
  Network,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Flame,
} from "lucide-react";
import { KpiCard, Panel, PageHeader, RiskBadge, StatusBadge, Confidence, sevColor, DemoTag } from "@/components/app/ui";
import { kpis, signals } from "@/data/mock";
import { useInvestigations } from "@/lib/db";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("Global Risk Overview", "Executive commerce risk posture, active investigations, and early-warning signals."),
  component: Overview,
});

function Overview() {
  const { data: invs = [] } = useInvestigations();

  return (
    <div className="mx-auto max-w-[1400px] space-y-4">
      <PageHeader
        title="Risk Overview"
        subtitle="Global threat telemetry, critical investigations, and active risk mitigation queue."
        actions={
          <div className="flex items-center gap-2">
            <DemoTag label="Live Telemetry" />
            <Link
              to="/investigations"
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <FolderSearch className="size-3.5" />
              New Investigation
            </Link>
          </div>
        }
      />

      {/* Primary 4 Vital KPIs */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard
          label="Active Investigations"
          value={String(invs.length || "128")}
          trend="+12%"
          up={true}
          icon={Activity}
          tone="primary"
        />
        <KpiCard
          label="Critical Risk Escalations"
          value="17"
          trend="+3"
          up={true}
          icon={Flame}
          tone="critical"
        />
        <KpiCard
          label="Exposed Suppliers"
          value="346"
          trend="-2.1%"
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

      {/* Critical Priority Alert Banner */}
      <section className="relative overflow-hidden rounded-lg border border-critical/30 bg-card p-4 fade-up">
        <div className="absolute inset-y-0 left-0 w-1 bg-critical" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md bg-critical/12 text-critical">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase text-critical">High Priority Alert</span>
                <span className="rounded bg-critical/15 px-1.5 py-0.5 text-[10px] font-medium text-critical">Class I Recall</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mt-0.5">
                BatteryPro XZ-100 Lithium Cell Overheating Incident
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/graph"
              className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/50"
            >
              <Network className="size-3.5" />
              Inspect Graph
            </Link>
            <Link
              to="/investigations"
              className="flex items-center gap-1 rounded-md bg-critical px-3 py-1.5 text-xs font-medium text-white hover:bg-critical/90"
            >
              Open Case <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Launchpad Navigation */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          to="/investigations"
          className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50"
        >
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
              <FolderSearch className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Investigation Center</p>
              <p className="text-[11px] text-muted-foreground">Manage active risk cases</p>
            </div>
          </div>
          <ArrowRight className="size-3.5 text-muted-foreground" />
        </Link>

        <Link
          to="/risk-map"
          className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50"
        >
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-md bg-info/10 text-info">
              <Globe2 className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Global Risk Map</p>
              <p className="text-[11px] text-muted-foreground">Interactive supplier geo-map</p>
            </div>
          </div>
          <ArrowRight className="size-3.5 text-muted-foreground" />
        </Link>

        <Link
          to="/graph"
          className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50"
        >
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-md bg-success/10 text-success">
              <Network className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Supply Chain Graph</p>
              <p className="text-[11px] text-muted-foreground">Multi-tier dependency tracing</p>
            </div>
          </div>
          <ArrowRight className="size-3.5 text-muted-foreground" />
        </Link>
      </div>

      {/* Main Focus: Priority Investigations & Emerging Signals */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Priority Investigations Table */}
        <Panel
          title="Priority Investigations"
          className="lg:col-span-2"
          bodyClass="p-0"
          action={
            <Link to="/investigations" className="flex items-center gap-1 text-xs text-primary hover:underline">
              View all ({invs.length}) <ArrowRight className="size-3" />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-medium">Case ID</th>
                  <th className="px-4 py-2.5 font-medium">Investigation Title</th>
                  <th className="px-4 py-2.5 font-medium">Domain</th>
                  <th className="px-4 py-2.5 font-medium">Risk Level</th>
                  <th className="px-4 py-2.5 font-medium">Confidence</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invs.slice(0, 6).map((i) => (
                  <tr key={i.id} className="transition-colors hover:bg-accent/40">
                    <td className="px-4 py-3 font-mono font-medium text-primary">{i.id}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{i.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{i.domain}</td>
                    <td className="px-4 py-3">
                      <RiskBadge level={i.severity} />
                    </td>
                    <td className="px-4 py-3">
                      <Confidence value={i.confidence} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={i.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">{i.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Emerging Risk Signals Feed */}
        <Panel
          title="Emerging Risk Signals"
          bodyClass="p-0"
          action={<span className="text-[11px] text-muted-foreground">Automated Feeds</span>}
        >
          <ul className="divide-y divide-border">
            {signals.slice(0, 5).map((s) => (
              <li key={s.title} className="flex items-start gap-3 p-3.5 transition-colors hover:bg-muted/20">
                <span
                  className="mt-1 size-2 shrink-0 rounded-full"
                  style={{ background: sevColor[s.severity] }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground leading-snug">{s.title}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {s.country} · {s.category} · {s.time}
                  </p>
                </div>
                <RiskBadge level={s.severity} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
