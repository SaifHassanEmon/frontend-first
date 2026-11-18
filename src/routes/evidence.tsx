import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState, DemoTag } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/evidence")({
  head: () => seo("Evidence Explorer", "Search and preview investigation evidence."),
  component: () => (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Evidence Explorer" subtitle="Search and preview investigation evidence." actions={<DemoTag />} />
      <EmptyState text="This module is coming next in the demo build." />
    </div>
  ),
});
