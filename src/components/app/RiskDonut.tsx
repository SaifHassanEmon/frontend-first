import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { riskDistribution } from "@/data/mock";
export function RiskDonut() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative size-40 shrink-0">
        <ResponsiveContainer><PieChart>
          <Pie data={riskDistribution} dataKey="value" innerRadius={52} outerRadius={72} paddingAngle={3} stroke="none">{riskDistribution.map((d) => <Cell key={d.name} fill={d.color} />)}</Pie>
          <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} itemStyle={{ color: "var(--foreground)" }} formatter={(v) => `${v}%`} />
        </PieChart></ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="font-mono text-xl font-semibold">128</p><p className="text-[10px] text-muted-foreground">active</p></div></div>
      </div>
      <ul className="flex-1 space-y-2.5">{riskDistribution.map((d) => <li key={d.name} className="flex items-center gap-2 text-xs"><span className="size-2 rounded-sm" style={{ background: d.color }} /><span className="flex-1 text-muted-foreground">{d.name}</span><span className="font-mono">{d.value}%</span></li>)}</ul>
    </div>
  );
}
