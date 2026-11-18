import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Check, Flame, PackageX, ShieldAlert, Building2, X, Fingerprint } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Confidence, DemoTag, KpiCard, PageHeader, Panel, StatusBadge } from "@/components/app/ui";
import { recallMatches, evidence } from "@/data/mock";
import { useApp } from "@/lib/store";
import { seo } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/product-recall")({
  head: () => seo("Product Recall Intelligence", "Trace recalled components to potentially affected products and inventory."),
  component: Page,
});

const identities = ["XZ-100", "XZ100-L", "Portable Battery 100", "Supplier Code BP-77"];

function Page() {
  const { matchDecisions, decide } = useApp();
  const [active, setActive] = useState(identities[0]);
  const [sel, setSel] = useState(recallMatches[0].id);
  const m = recallMatches.find((x) => x.id === sel)!;
  return (
    <div className="mx-auto max-w-[1400px] space-y-4">
      <PageHeader title="Product Recall Intelligence" subtitle="Trace recalled components through your product network." actions={<DemoTag />} />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Total recalls" value="214" trend="+9" up icon={PackageX} />
        <KpiCard label="Critical recalls" value="11" trend="+2" up icon={Flame} tone="critical" />
        <KpiCard label="Products under investigation" value="86" trend="+14%" up icon={ShieldAlert} tone="warning" />
        <KpiCard label="Potentially exposed businesses" value="1,203" trend="-3%" icon={Building2} tone="info" />
      </div>
      <section className="relative overflow-hidden rounded-lg border border-critical/30 bg-card p-5 fade-up">
        <div className="absolute inset-y-0 left-0 w-1 bg-critical" />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex gap-3"><div className="grid size-10 place-items-center rounded-md bg-critical/12 text-critical"><AlertTriangle className="size-5" /></div>
            <div><p className="font-mono text-xs text-critical">RECALL-2026-001</p><h2 className="text-lg font-semibold">BatteryPro XZ-100 Lithium Battery</h2><p className="text-sm text-muted-foreground">Hazard: Overheating and Fire Risk</p></div></div>
          <div className="flex gap-2"><StatusBadge status="In Review" /><span className="rounded border border-border px-1.5 py-0.5 text-[11px]">Under Investigation</span></div>
        </div>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">The XZ-100 lithium-ion cell pack can overheat during charging, posing fire and burn hazards. Approximately 410,000 units were distributed to OEMs between January and August 2026.</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs md:grid-cols-5">{[["Manufacturer", "BatteryPro Inc."], ["Recall date", "2026-11-15"], ["Category", "Batteries & power"], ["Hazard class", "Fire / Thermal (Class I)"], ["Source", "CPSC (Demo Scenario)"]].map(([k, v]) => <div key={k} className="rounded-md border border-border bg-background/40 p-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>)}</dl>
      </section>
      <Panel title={<span className="flex items-center gap-2"><Fingerprint className="size-4 text-primary" />Component Identity Discovery</span>} action={<DemoTag />}>
        <p className="mb-3 text-xs text-muted-foreground">Candidate identities the recalled component may appear under across BOMs, invoices and listings.</p>
        <div className="flex flex-wrap gap-2">{identities.map((i) => <button key={i} onClick={() => setActive(i)} className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${active === i ? "border-primary/50 bg-primary/12 text-primary glow" : "border-border hover:border-primary/30"}`}>{i}</button>)}</div>
      </Panel>
      <Panel title="Product Match Results" bodyClass="p-0" action={<DemoTag label="Synthetic demo results" />}>
        <div className="overflow-x-auto"><table className="w-full text-xs">
          <thead className="text-left text-muted-foreground"><tr className="border-b border-border">{["Product", "Manufacturer", "Component Identifier", "Match Confidence", "Evidence", "Match Status", "Analyst decision"].map((h) => <th key={h} className="px-4 py-2 font-normal">{h}</th>)}</tr></thead>
          <tbody>{recallMatches.map((r) => { const dcs = matchDecisions[r.id]; return (
            <tr key={r.id} onClick={() => setSel(r.id)} className={`cursor-pointer border-b border-border last:border-0 ${sel === r.id ? "bg-primary/6" : "hover:bg-accent/40"}`}>
              <td className="px-4 py-3 font-medium">{r.product}</td><td className="px-4 py-3 text-muted-foreground">{r.manufacturer}</td><td className="px-4 py-3 font-mono">{r.component}</td><td className="px-4 py-3"><Confidence value={r.confidence} /></td><td className="px-4 py-3 font-mono">{r.evidence}</td><td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>{dcs ? <span className={`text-xs capitalize ${dcs === "approved" ? "text-success" : "text-critical"}`}>{dcs} · <button className="text-muted-foreground underline" onClick={() => decide(r.id, dcs === "approved" ? "rejected" : "approved")}>change</button></span> : <div className="flex gap-1"><Button size="sm" variant="outline" className="h-7" onClick={() => { decide(r.id, "approved"); toast.success(`${r.product} match approved`); }}><Check />Approve</Button><Button size="sm" variant="ghost" className="h-7" onClick={() => { decide(r.id, "rejected"); toast(`${r.product} match rejected`); }}><X />Reject</Button></div>}</td>
            </tr>); })}</tbody>
        </table></div>
      </Panel>
      <Panel title={`Investigation detail — ${m.product}`}>
        <Tabs defaultValue="rel">
          <TabsList><TabsTrigger value="rel">Relationships</TabsTrigger><TabsTrigger value="exp">Downstream exposure</TabsTrigger><TabsTrigger value="inv">Warehouse inventory</TabsTrigger><TabsTrigger value="ship">Shipments</TabsTrigger><TabsTrigger value="ev">Evidence</TabsTrigger></TabsList>
          <TabsContent value="rel" className="pt-3"><div className="flex flex-wrap items-center gap-2 text-xs">{["BatteryPro Cells Co.", m.component, `${m.manufacturer}`, m.product, "Distributor: TechFlow EU", "Retail: 340 stores"].map((n, i, a) => <span key={n} className="flex items-center gap-2"><span className="rounded-md border border-border bg-background/40 px-2.5 py-1.5">{n}</span>{i < a.length - 1 && <span className="text-primary">→</span>}</span>)}</div></TabsContent>
          <TabsContent value="exp" className="pt-3 text-xs"><div className="grid gap-3 md:grid-cols-3">{[["Units in market", "~58,000"], ["Retailers exposed", "41"], ["Countries", "US, DE, BR, MX"]].map(([k, v]) => <div key={k} className="rounded-md border border-border p-3"><p className="text-muted-foreground">{k}</p><p className="mt-1 font-mono text-lg">{v}</p></div>)}</div></TabsContent>
          <TabsContent value="inv" className="pt-3"><table className="w-full text-xs"><tbody>{[["Los Angeles DC-04", "12,400", "Quarantine recommended"], ["Hamburg Logistics", "3,150", "Under review"], ["São Paulo Retail Hub", "880", "Under review"]].map((r) => <tr key={r[0]} className="border-b border-border last:border-0">{r.map((c) => <td key={c} className="py-2">{c}</td>)}</tr>)}</tbody></table></TabsContent>
          <TabsContent value="ship" className="pt-3"><table className="w-full text-xs"><tbody>{[["SH-7731", "Shenzhen → Long Beach", "Delivered 2026-10-02"], ["SH-7804", "Shenzhen → Rotterdam", "In transit · ETA 2026-11-24"], ["SH-7812", "Shenzhen → Santos", "Batch ID missing"]].map((r) => <tr key={r[0]} className="border-b border-border last:border-0">{r.map((c, i) => <td key={c} className={`py-2 ${i === 0 ? "font-mono text-primary" : ""}`}>{c}</td>)}</tr>)}</tbody></table></TabsContent>
          <TabsContent value="ev" className="pt-3"><ul className="space-y-2 text-xs">{evidence.filter((e) => e.investigation === "INV-2026-0128").map((e) => <li key={e.id} className="flex items-center justify-between rounded-md border border-border p-2.5"><span><span className="font-mono text-primary">{e.id}</span> · {e.name}</span><StatusBadge status={e.status} /></li>)}</ul></TabsContent>
        </Tabs>
      </Panel>
    </div>
  );
}
