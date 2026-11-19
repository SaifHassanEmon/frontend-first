import { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, HelpCircle, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useApp } from "@/lib/store";
import { ThemeToggle } from "./ThemeToggle";
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
    <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b border-border bg-background/85 px-3 backdrop-blur transition-colors">
      <SidebarTrigger />
      <nav className="hidden text-xs text-muted-foreground sm:block">
        {cur?.group ?? "App"} <span className="mx-1">/</span> <span className="font-medium text-foreground">{cur?.title ?? "Page"}</span>
      </nav>

      {/* Global Quick Search */}
      <div className="relative ml-auto w-full max-w-xs">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search modules, investigations..."
          className="h-8 w-full rounded-md border border-input bg-card pl-8 pr-2 text-xs text-foreground outline-none transition-colors focus:border-primary/60"
        />
        {results.length > 0 && (
          <div className="absolute mt-1 w-full rounded-md border border-border bg-popover p-1 shadow-lg z-30">
            {results.map((r) => (
              <button
                key={r.url}
                onClick={() => {
                  nav({ to: r.url });
                  setQ("");
                }}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-popover-foreground hover:bg-accent"
              >
                <r.icon className="size-3.5 text-primary" />
                {r.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Light / Dark Mode Toggle */}
      <ThemeToggle />

      {/* Notifications Popover */}
      <Popover>
        <PopoverTrigger className="relative grid size-8 place-items-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-accent" aria-label="Notifications">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 grid size-3.5 place-items-center rounded-full bg-critical text-[9px] font-semibold text-white">
              {unread}
            </span>
          )}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <p className="text-sm font-semibold">Notifications</p>
            <button onClick={markAllRead} className="text-[11px] font-medium text-primary hover:underline">
              Mark all read
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-2 border-b border-border px-3 py-2 text-xs last:border-0 hover:bg-muted/30">
                {!n.read && <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />}
                <p className="flex-1 text-foreground">{n.title}</p>
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Help */}
      <button
        onClick={() => toast("RecallMesh X Support", { description: "Global commerce risk intelligence engine. v2.4 Active." })}
        className="grid size-8 place-items-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-accent"
        aria-label="Help"
      >
        <HelpCircle className="size-4" />
      </button>

      {/* User Avatar */}
      <div className="grid size-7 place-items-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
        AM
      </div>
    </header>
  );
}
