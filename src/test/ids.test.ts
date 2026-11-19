import { describe, expect, it } from "vitest";
import { nextInvestigationId } from "@/lib/ids";

describe("nextInvestigationId", () => {
  it("continues after the highest existing investigation number", () => {
    expect(nextInvestigationId([{ id: "INV-2026-0128" }, { id: "INV-2026-0121" }], 2026)).toBe("INV-2026-0129");
  });
  it("starts at 0001 when there are no investigations", () => {
    expect(nextInvestigationId([], 2026)).toBe("INV-2026-0001");
  });
});
