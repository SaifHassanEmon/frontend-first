import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState, DemoTag } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/counterfeit")({
  head: () => seo("Counterfeit Detection", "Compare product specifications and flag suspicious components."),
  component: () => (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Counterfeit Detection" subtitle="Compare product specifications and flag suspicious components." actions={<DemoTag />} />
      <EmptyState text="This module is coming next in the demo build." />
    </div>
  ),
});
