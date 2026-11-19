// Shared workspace data stored in Lovable Cloud. No sign-in yet: everyone with the link
// reads and edits the same records (see the table access rules in the database).
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { CounterfeitListing, Domain, Investigation, Severity, Status } from "@/data/mock";
import type { DetailedSupplier } from "@/data/suppliers-detail";
import { useApp } from "@/lib/store";

export interface EvidenceItem {
  id: string; name: string; source: string; entity: string; type: string; status: string;
  confidence: number; date: string; url: string; text: string; investigation: string;
}
export type MatchDecision = "approved" | "rejected";

export const keys = {
  investigations: ["investigations"] as const,
  suppliers: ["suppliers"] as const,
  counterfeits: ["counterfeit_listings"] as const,
  evidence: ["evidence"] as const,
  decisions: ["recall_match_decisions"] as const,
};

// ---------- mappers (database rows -> app shapes) ----------
export const toInvestigation = (r: Tables<"investigations">): Investigation => ({
  id: r.id, title: r.title, domain: r.domain as Domain, severity: r.severity as Severity,
  confidence: r.confidence, status: r.status as Status, date: r.date, riskScore: r.risk_score,
  evidence: r.evidence,
  ...(r.identifier ? { identifier: r.identifier } : {}),
  ...(r.description ? { description: r.description } : {}),
});
const toSupplier = (r: Tables<"suppliers">): DetailedSupplier => ({
  id: r.id, name: r.name, country: r.country, city: r.city, tier: r.tier as 1 | 2 | 3, risk: r.risk,
  severity: r.severity as Severity, category: r.category, singleSource: r.single_source,
  status: r.status as DetailedSupplier["status"], leiCode: r.lei_code, esgScore: r.esg_score,
  leadTimeDays: r.lead_time_days, certifications: r.certifications, lastAuditDate: r.last_audit_date,
  downstreamProducts: r.downstream_products, notes: r.notes,
});
const toCounterfeit = (r: Tables<"counterfeit_listings">): CounterfeitListing => ({
  id: r.id, targetProduct: r.target_product, sku: r.sku, gtin: r.gtin, platform: r.platform,
  seller: r.seller, region: r.region, confidence: r.confidence, priceDelta: r.price_delta,
  status: r.status as CounterfeitListing["status"], anomalies: r.anomalies,
  dateDetected: r.date_detected, evidenceRef: r.evidence_ref,
});
const toEvidence = (r: Tables<"evidence">): EvidenceItem => ({
  id: r.id, name: r.name, source: r.source, entity: r.entity, type: r.type, status: r.status,
  confidence: r.confidence, date: r.date, url: r.url, text: r.text, investigation: r.investigation,
});

// ---------- reads ----------
export function useInvestigations() {
  return useQuery({
    queryKey: keys.investigations,
    queryFn: async () => {
      const { data, error } = await supabase.from("investigations").select("*").order("date", { ascending: false }).order("id", { ascending: false });
      if (error) throw error;
      return data.map(toInvestigation);
    },
  });
}
export function useSuppliers() {
  return useQuery({
    queryKey: keys.suppliers,
    queryFn: async () => {
      const { data, error } = await supabase.from("suppliers").select("*").order("id");
      if (error) throw error;
      return data.map(toSupplier);
    },
  });
}
export function useCounterfeits() {
  return useQuery({
    queryKey: keys.counterfeits,
    queryFn: async () => {
      const { data, error } = await supabase.from("counterfeit_listings").select("*").order("id");
      if (error) throw error;
      return data.map(toCounterfeit);
    },
  });
}
export function useEvidence() {
  return useQuery({
    queryKey: keys.evidence,
    queryFn: async () => {
      const { data, error } = await supabase.from("evidence").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data.map(toEvidence);
    },
  });
}
export function useMatchDecisions() {
  return useQuery({
    queryKey: keys.decisions,
    queryFn: async () => {
      const { data, error } = await supabase.from("recall_match_decisions").select("match_id, decision");
      if (error) throw error;
      return Object.fromEntries(data.map((d) => [d.match_id, d.decision as MatchDecision])) as Record<string, MatchDecision>;
    },
  });
}

// ---------- writes ----------
export function useAddInvestigation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (i: Investigation) => {
      const { error } = await supabase.from("investigations").insert({
        id: i.id, title: i.title, domain: i.domain, severity: i.severity, confidence: i.confidence,
        status: i.status, date: i.date, risk_score: i.riskScore, evidence: i.evidence,
        identifier: i.identifier || null, description: i.description || null,
      });
      if (error) throw error;
      return i;
    },
    onSuccess: (i) => {
      useApp.getState().notify(`Created new investigation: ${i.title}`);
      return qc.invalidateQueries({ queryKey: keys.investigations });
    },
  });
}
export function useUpdateCounterfeitStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CounterfeitListing["status"] }) => {
      const { error } = await supabase.from("counterfeit_listings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.counterfeits }),
  });
}
export function useVerifyEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("evidence").update({ status: "Verified" }).eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      useApp.getState().notify(`Evidence record ${id} verified`);
      return qc.invalidateQueries({ queryKey: keys.evidence });
    },
  });
}
export function useDecideMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, decision }: { id: string; decision: MatchDecision }) => {
      const { error } = await supabase.from("recall_match_decisions").upsert({ match_id: id, decision, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.decisions }),
  });
}

export { nextInvestigationId } from "@/lib/ids";
