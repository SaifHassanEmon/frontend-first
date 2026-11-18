import { Link, useRouterState } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { navGroups } from "./nav";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-1 py-1.5">
          <div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary glow"><Hexagon className="size-4" /></div>
          {!collapsed && <div className="leading-tight"><p className="text-sm font-semibold">RecallMesh <span className="text-primary">X</span></p><p className="text-[10px] text-muted-foreground">Global Commerce Intelligence</p></div>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">{g.label}</SidebarGroupLabel>
            <SidebarGroupContent><SidebarMenu>
              {g.items.map((i) => (
                <SidebarMenuItem key={i.url}>
                  <SidebarMenuButton asChild isActive={path === i.url} tooltip={i.title} className="data-[active=true]:text-primary">
                    <Link to={i.url}><i.icon className="size-4" /><span>{i.title}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu></SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-info/20 text-xs font-semibold text-info">AM</div>
          {!collapsed && <div className="min-w-0 leading-tight"><p className="truncate text-sm font-medium">Alex Morgan</p><p className="truncate text-[11px] text-muted-foreground">Risk Analyst · GlobalTrade Inc.</p></div>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
