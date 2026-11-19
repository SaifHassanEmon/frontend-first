/** Next free investigation number, based on the highest existing INV-YYYY-NNNN id. */
export function nextInvestigationId(existing: { id: string }[], year = new Date().getFullYear()): string {
  const max = existing.reduce((m, i) => {
    const n = Number(i.id.split("-").pop());
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `INV-${year}-${String(max + 1).padStart(4, "0")}`;
}
