import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState, DemoTag } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/data-sources")({
  head: () => seo("Data Sources", "External data sources — all shown as Demo / Not Connected."),
  component: () => (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Data Sources" subtitle="External data sources — all shown as Demo / Not Connected." actions={<DemoTag />} />
      <EmptyState text="This module is coming next in the demo build." />
    </div>
  ),
});
