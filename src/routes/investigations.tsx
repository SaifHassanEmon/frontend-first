import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PageHeader, RiskBadge, StatusBadge, Chip, Confidence, EmptyState, DemoTag } from "@/components/app/ui";
import { useInvestigations, useAddInvestigation, nextInvestigationId } from "@/lib/db";
import type { Domain, Investigation, Severity, Status } from "@/data/mock";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/investigations")({
  head: () => seo("Investigation Center", "Search, filter and open risk investigations."),
  component: Page,
});

const domains: Domain[] = ["Product Recall", "Supplier Risk", "Counterfeit", "Disruption"];
const sevs: Severity[] = ["critical", "high", "medium", "low"];
const statuses: Status[] = ["Open", "In Review", "Escalated", "Resolved"];

function Page() {
  const { data: investigations = [], isLoading } = useInvestigations();
  const addInvestigation = useAddInvestigation();
  const [q, setQ] = useState(""); const [d, setD] = useState<Domain | null>(null); const [s, setS] = useState<Severity | null>(null); const [st, setSt] = useState<Status | null>(null);
  const [open, setOpen] = useState(false); const [result, setResult] = useState<Investigation | null>(null);
  const [form, setForm] = useState({ name: "", domain: "Product Recall" as Domain, identifier: "", description: "" });
  const [running, setRunning] = useState(false);
  const list = investigations.filter((i) => (!q || (i.title + i.id).toLowerCase().includes(q.toLowerCase())) && (!d || i.domain === d) && (!s || i.severity === s) && (!st || i.status === st));

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); if (!form.name.trim()) { toast.error("Investigation name is required"); return; }
    setRunning(true);
    setTimeout(() => {
      const score = 55 + ((form.name.length * 7) % 40);
      const inv: Investigation = { id: nextInvestigationId(investigations), title: form.name, domain: form.domain, identifier: form.identifier, description: form.description, severity: score > 85 ? "critical" : score > 70 ? "high" : "medium", confidence: 60 + (score % 30), status: "Open", date: new Date().toISOString().slice(0, 10), riskScore: score, evidence: 3 + (score % 12) };
      addInvestigation.mutate(inv, {
        onSuccess: () => { setOpen(false); setResult(inv); setForm({ name: "", domain: "Product Recall", identifier: "", description: "" }); },
        onError: (err) => toast.error(`Could not save investigation: ${err.message}`),
        onSettled: () => setRunning(false),
      });
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Investigation Center" subtitle={isLoading ? "Loading investigations…" : `${investigations.length} investigations in workspace`} actions={<Button onClick={() => setOpen(true)}><Plus />New Investigation</Button>} />
      <div className="mb-4 space-y-3 rounded-lg border border-border bg-card p-3">
        <div className="relative max-w-sm"><Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search investigations" className="h-8 w-full rounded-md border border-input bg-background pl-8 text-xs outline-none focus:border-primary/50" /></div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs"><span className="w-16 text-muted-foreground">Domain</span><Chip active={!d} onClick={() => setD(null)}>All</Chip>{domains.map((x) => <Chip key={x} active={d === x} onClick={() => setD(x)}>{x}</Chip>)}</div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs"><span className="w-16 text-muted-foreground">Severity</span><Chip active={!s} onClick={() => setS(null)}>All</Chip>{sevs.map((x) => <Chip key={x} active={s === x} onClick={() => setS(x)}><span className="capitalize">{x}</span></Chip>)}</div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs"><span className="w-16 text-muted-foreground">Status</span><Chip active={!st} onClick={() => setSt(null)}>All</Chip>{statuses.map((x) => <Chip key={x} active={st === x} onClick={() => setSt(x)}>{x}</Chip>)}</div>
      </div>
      {list.length === 0 ? <EmptyState text="No investigations match these filters." /> : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{list.map((i) => (
          <button key={i.id} onClick={() => setResult(i)} className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 fade-up">
            <div className="flex items-center justify-between"><span className="font-mono text-[11px] text-primary">{i.id}</span><StatusBadge status={i.status} /></div>
            <p className="mt-2 text-sm font-medium">{i.title}</p><p className="text-xs text-muted-foreground">{i.domain}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
              <div><p className="text-muted-foreground">Risk score</p><p className="font-mono text-base">{i.riskScore}</p></div>
              <div><p className="text-muted-foreground">Confidence</p><p className="font-mono text-base">{i.confidence}%</p></div>
              <div><p className="text-muted-foreground">Evidence</p><p className="font-mono text-base">{i.evidence}</p></div>
            </div>
            <div className="mt-3"><RiskBadge level={i.severity} /></div>
          </button>
        ))}</div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Investigation</DialogTitle><DialogDescription>Results are simulated from demo data.</DialogDescription></DialogHeader>
          <form onSubmit={submit} className="space-y-3 text-sm">
            <label className="block"><span className="text-xs text-muted-foreground">Investigation name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 outline-none focus:border-primary/50" placeholder="e.g. XZ-100 exposure in EU retail" /></label>
            <label className="block"><span className="text-xs text-muted-foreground">Risk domain</span><select value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value as Domain })} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 outline-none">{domains.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label className="block"><span className="text-xs text-muted-foreground">Product / Supplier / Component / Event identifier</span><input value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 font-mono outline-none focus:border-primary/50" placeholder="XZ-100" /></label>
            <label className="block"><span className="text-xs text-muted-foreground">Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary/50" /></label>
            <div className="flex justify-end gap-2 pt-1"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button disabled={running}>{running ? "Analyzing…" : "Start investigation"}</Button></div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!result} onOpenChange={(o) => !o && setResult(null)}>
        <DialogContent>
          {result && <>
            <DialogHeader><DialogTitle className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" />{result.title}</DialogTitle><DialogDescription className="font-mono">{result.id} · {result.domain}</DialogDescription></DialogHeader>
            <DemoTag label="Simulated investigation result" />
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-md border border-border p-3"><p className="text-muted-foreground">Risk score</p><p className="font-mono text-xl">{result.riskScore}</p></div>
              <div className="rounded-md border border-border p-3"><p className="text-muted-foreground">Confidence</p><div className="mt-2"><Confidence value={result.confidence} /></div></div>
              <div className="rounded-md border border-border p-3"><p className="text-muted-foreground">Severity</p><div className="mt-2"><RiskBadge level={result.severity} /></div></div>
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex gap-2"><FileText className="size-3.5 text-primary" />{result.evidence} evidence items linked across 4 sources</li>
              <li className="flex gap-2"><FileText className="size-3.5 text-primary" />{Math.ceil(result.riskScore / 20)} potentially connected entities found in the supply chain graph</li>
              <li className="flex gap-2"><FileText className="size-3.5 text-warning" />2 information gaps need verification before conclusions</li>
            </ul>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
