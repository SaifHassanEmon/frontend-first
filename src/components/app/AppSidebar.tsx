import { Link, useRouterState } from "@tanstack/react-router";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { RecallMeshLogo } from "./Logo";
import { navGroups } from "./nav";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-1 py-1.5 transition-opacity hover:opacity-90">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 border border-primary/20 glow">
            <RecallMeshLogo className="size-5" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-sidebar-foreground">
                RecallMesh <span className="text-primary font-extrabold">X</span>
              </p>
              <p className="text-[10px] font-medium text-muted-foreground">
                Commerce Intelligence
              </p>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((i) => (
                  <SidebarMenuItem key={i.url}>
                    <SidebarMenuButton asChild isActive={path === i.url} tooltip={i.title} className="data-[active=true]:text-primary font-medium">
                      <Link to={i.url}>
                        <i.icon className="size-4" />
                        <span>{i.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            AM
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Alex Morgan</p>
              <p className="truncate text-[11px] text-muted-foreground">Risk Analyst · Enterprise</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
