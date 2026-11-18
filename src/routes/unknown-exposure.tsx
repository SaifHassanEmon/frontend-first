import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState, DemoTag } from "@/components/app/ui";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/unknown-exposure")({
  head: () => seo("Unknown Exposure", "Information gaps that block confident risk conclusions."),
  component: () => (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Unknown Exposure" subtitle="Information gaps that block confident risk conclusions." actions={<DemoTag />} />
      <EmptyState text="This module is coming next in the demo build." />
    </div>
  ),
});
