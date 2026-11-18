import { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, HelpCircle, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useApp } from "@/lib/store";
import { navGroups } from "./nav";
import { toast } from "sonner";

const all = navGroups.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })));

export function Topbar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const cur = all.find((i) => i.url === path);
  const { notifications, markAllRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const results = q ? all.filter((i) => i.title.toLowerCase().includes(q.toLowerCase())) : [];
  return (
    <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b border-border bg-background/85 px-3 backdrop-blur">
      <SidebarTrigger />
      <nav className="hidden text-xs text-muted-foreground sm:block">{cur?.group ?? "App"} <span className="mx-1">/</span> <span className="text-foreground">{cur?.title ?? "Page"}</span></nav>
      <div className="relative ml-auto w-full max-w-xs">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search modules, investigations…" className="h-8 w-full rounded-md border border-input bg-card pl-8 pr-2 text-xs outline-none focus:border-primary/50" />
        {results.length > 0 && <div className="absolute mt-1 w-full rounded-md border border-border bg-popover p-1 shadow-lg">{results.map((r) => <button key={r.url} onClick={() => { nav({ to: r.url }); setQ(""); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-accent"><r.icon className="size-3.5 text-primary" />{r.title}</button>)}</div>}
      </div>
      <Popover>
        <PopoverTrigger className="relative grid size-8 place-items-center rounded-md hover:bg-accent" aria-label="Notifications"><Bell className="size-4" />{unread > 0 && <span className="absolute right-1 top-1 grid size-3.5 place-items-center rounded-full bg-critical text-[9px] font-semibold text-destructive-foreground">{unread}</span>}</PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between border-b border-border px-3 py-2"><p className="text-sm font-medium">Notifications</p><button onClick={markAllRead} className="text-[11px] text-primary">Mark all read</button></div>
          {notifications.map((n) => <div key={n.id} className="flex gap-2 border-b border-border px-3 py-2 text-xs last:border-0">{!n.read && <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />}<p className="flex-1">{n.title}</p><span className="text-muted-foreground">{n.time}</span></div>)}
        </PopoverContent>
      </Popover>
      <button onClick={() => toast("Help center", { description: "Demo build — documentation is not connected." })} className="grid size-8 place-items-center rounded-md hover:bg-accent" aria-label="Help"><HelpCircle className="size-4" /></button>
      <div className="grid size-7 place-items-center rounded-full bg-info/20 text-[10px] font-semibold text-info">AM</div>
    </header>
  );
}
