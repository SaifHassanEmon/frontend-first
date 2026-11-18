import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState, DemoTag } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/reports")({
  head: () => seo("Reports", "Investigation, risk and recall impact reports."),
  component: () => (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Reports" subtitle="Investigation, risk and recall impact reports." actions={<DemoTag />} />
      <EmptyState text="This module is coming next in the demo build." />
    </div>
  ),
});
