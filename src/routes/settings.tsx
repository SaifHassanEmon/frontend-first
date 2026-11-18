import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState, DemoTag } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/settings")({
  head: () => seo("Settings", "Workspace preferences."),
  component: () => (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Settings" subtitle="Workspace preferences." actions={<DemoTag />} />
      <EmptyState text="This module is coming next in the demo build." />
    </div>
  ),
});
