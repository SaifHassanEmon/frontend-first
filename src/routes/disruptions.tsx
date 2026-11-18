import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState, DemoTag } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/disruptions")({
  head: () => seo("Disruption Intelligence", "Monitor global disruption events and exposed suppliers."),
  component: () => (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Disruption Intelligence" subtitle="Monitor global disruption events and exposed suppliers." actions={<DemoTag />} />
      <EmptyState text="This module is coming next in the demo build." />
    </div>
  ),
});
