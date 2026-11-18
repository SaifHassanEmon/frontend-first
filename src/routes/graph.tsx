import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState, DemoTag } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/graph")({
  head: () => seo("Supply Chain Graph", "Explore entities and risk propagation paths."),
  component: () => (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Supply Chain Graph" subtitle="Explore entities and risk propagation paths." actions={<DemoTag />} />
      <EmptyState text="This module is coming next in the demo build." />
    </div>
  ),
});
