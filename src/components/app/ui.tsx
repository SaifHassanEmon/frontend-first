import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Severity } from "@/data/mock";

export const toneText = { primary: "text-primary", critical: "text-critical", warning: "text-warning", success: "text-success", info: "text-info", high: "text-warning", medium: "text-info", low: "text-success" } as const;
export const toneBg = { primary: "bg-primary/10", critical: "bg-critical/10", warning: "bg-warning/10", success: "bg-success/10", info: "bg-info/10" } as const;
export type Tone = keyof typeof toneBg;

const sevStyles: Record<string, string> = {
  critical: "bg-critical/12 text-critical border-critical/30",
  high: "bg-warning/12 text-warning border-warning/30",
  medium: "bg-info/12 text-info border-info/30",
  low: "bg-success/12 text-success border-success/30",
};
export const sevColor: Record<Severity, string> = { critical: "var(--critical)", high: "var(--warning)", medium: "var(--info)", low: "var(--success)" };

export function RiskBadge({ level, className }: { level: Severity; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[11px] font-medium capitalize", sevStyles[level], className)}><span className="size-1.5 rounded-full bg-current" />{level}</span>;
}

const statusTone: Record<string, string> = {
  Verified: "bg-success/12 text-success border-success/30", "Confirmed Demo Match": "bg-success/12 text-success border-success/30", Resolved: "bg-success/12 text-success border-success/30",
  Suspicious: "bg-critical/12 text-critical border-critical/30", Escalated: "bg-critical/12 text-critical border-critical/30", "High risk": "bg-critical/12 text-critical border-critical/30",
  "Needs Verification": "bg-warning/12 text-warning border-warning/30", "Needs verification": "bg-warning/12 text-warning border-warning/30", "Potential Match": "bg-warning/12 text-warning border-warning/30", Pending: "bg-warning/12 text-warning border-warning/30", Unverified: "bg-warning/12 text-warning border-warning/30", "In Review": "bg-info/12 text-info border-info/30",
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex whitespace-nowrap rounded border px-1.5 py-0.5 text-[11px] font-medium", statusTone[status] ?? "bg-muted text-muted-foreground border-border")}>{status}</span>;
}

export function DemoTag({ label = "Synthetic demo data" }: { label?: string }) {
  return <span className="inline-flex items-center gap-1 rounded border border-primary/25 bg-primary/8 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary"><FlaskConical className="size-3" />{label}</span>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-xl font-semibold tracking-tight">{title}</h1>{subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className, bodyClass }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClass?: string }) {
  return (
    <section className={cn("rounded-lg border border-border bg-card fade-up", className)}>
      {title && <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3"><h2 className="text-sm font-medium">{title}</h2>{action}</header>}
      <div className={cn("p-4", bodyClass)}>{children}</div>
    </section>
  );
}

export function KpiCard({ label, value, trend, up, icon: Icon, tone = "primary" }: { label: string; value: string; trend?: string; up?: boolean; icon: LucideIcon; tone?: Tone }) {
  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 fade-up">
      <div className="flex items-start justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span className={cn("grid size-7 place-items-center rounded-md", toneBg[tone], toneText[tone])}><Icon className="size-3.5" /></span>
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight">{value}</p>
      {trend && <p className={cn("mt-1 flex items-center gap-0.5 text-[11px]", up ? "text-warning" : "text-success")}>{up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}{trend} <span className="text-muted-foreground">vs last 30d</span></p>}
    </div>
  );
}

export function Confidence({ value }: { value: number }) {
  const c = value >= 85 ? "bg-success" : value >= 65 ? "bg-warning" : "bg-critical";
  return <div className="flex items-center gap-2"><div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full", c)} style={{ width: `${value}%` }} /></div><span className="font-mono text-xs">{value}%</span></div>;
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return <button onClick={onClick} className={cn("rounded-md border px-2.5 py-1 text-xs transition-colors", active ? "border-primary/40 bg-primary/12 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>{children}</button>;
}

export function EmptyState({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">{text}</div>;
}
