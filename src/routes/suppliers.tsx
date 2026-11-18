import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState, DemoTag } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/suppliers")({
  head: () => seo("Supplier Intelligence", "Multi-tier supplier dependency and risk analysis."),
  component: () => (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Supplier Intelligence" subtitle="Multi-tier supplier dependency and risk analysis." actions={<DemoTag />} />
      <EmptyState text="This module is coming next in the demo build." />
    </div>
  ),
});
