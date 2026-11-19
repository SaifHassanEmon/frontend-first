/**
 * useExternalData.ts
 * TanStack Query hooks wrapping the external-apis.ts fetchers.
 * All fetches happen client-side (no server imports needed).
 */
import { useQuery } from "@tanstack/react-query";
import {
  fetchCpscRecalls,
  fetchFdaEnforcements,
  fetchGleifEntities,
  fetchGleifByLei,
  fetchComtradeData,
  fetchEdgarFilings,
  fetchGs1Verify,
  normalizeCpscRecall,
  normalizeFdaResult,
  type NormalizedRecall,
  type GleifEntity,
  type ComtradeRecord,
  type EdgarFiling,
  type Gs1VerifyResult,
  type FdaCategory,
} from "@/lib/external-apis";

// ─── CPSC Recalls ──────────────────────────────────────────────────────────────

export function useCpscRecalls(params?: {
  RecallDateStart?: string;
  ProductName?: string;
  Manufacturer?: string;
  limit?: number;
}) {
  return useQuery<NormalizedRecall[]>({
    queryKey: ["cpsc-recalls", params],
    queryFn: async () => {
      const raw = await fetchCpscRecalls(params);
      return raw.map(normalizeCpscRecall);
    },
    staleTime: 15 * 60 * 1000, // 15 min
    retry: 2,
  });
}

// ─── FDA Enforcements ──────────────────────────────────────────────────────────

export function useFdaEnforcements(
  category: FdaCategory = "food",
  params?: { search?: string; limit?: number }
) {
  return useQuery<{ results: NormalizedRecall[]; total: number }>({
    queryKey: ["fda-enforcements", category, params],
    queryFn: async () => {
      const raw = await fetchFdaEnforcements(category, params);
      return {
        results: raw.results.map((r) => normalizeFdaResult(r, category)),
        total: raw.total,
      };
    },
    staleTime: 30 * 60 * 1000, // 30 min
    retry: 2,
  });
}

// ─── Combined recalls (CPSC + FDA food + FDA drug + FDA device) ────────────────

export function useAllRecalls(limit = 30) {
  const cpsc = useCpscRecalls({ RecallDateStart: "2024-01-01", limit });
  const fdaFood = useFdaEnforcements("food", { limit: 10 });
  const fdaDrug = useFdaEnforcements("drug", { limit: 10 });
  const fdaDevice = useFdaEnforcements("device", { limit: 10 });

  const allRecalls: NormalizedRecall[] = [
    ...(cpsc.data ?? []),
    ...(fdaFood.data?.results ?? []),
    ...(fdaDrug.data?.results ?? []),
    ...(fdaDevice.data?.results ?? []),
  ].sort((a, b) => (b.date > a.date ? 1 : -1));

  return {
    data: allRecalls,
    isLoading: cpsc.isLoading || fdaFood.isLoading || fdaDrug.isLoading || fdaDevice.isLoading,
    isError: cpsc.isError && fdaFood.isError && fdaDrug.isError && fdaDevice.isError,
    cpscCount: cpsc.data?.length ?? 0,
    fdaTotal: (fdaFood.data?.total ?? 0) + (fdaDrug.data?.total ?? 0) + (fdaDevice.data?.total ?? 0),
  };
}

// ─── GLEIF Entities ────────────────────────────────────────────────────────────

export function useGleifSearch(name: string, enabled = true) {
  return useQuery<GleifEntity[]>({
    queryKey: ["gleif-search", name],
    queryFn: () => fetchGleifEntities(name, 10),
    enabled: enabled && name.length > 2,
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    retry: 1,
  });
}

export function useGleifByLei(lei: string) {
  return useQuery<GleifEntity | null>({
    queryKey: ["gleif-lei", lei],
    queryFn: () => fetchGleifByLei(lei),
    enabled: lei.length === 20,
    staleTime: 6 * 60 * 60 * 1000,
    retry: 1,
  });
}

// ─── UN Comtrade ───────────────────────────────────────────────────────────────

export function useComtradeData(params?: {
  reporterCode?: number;
  cmdCode?: string;
  period?: string;
}) {
  return useQuery<ComtradeRecord[]>({
    queryKey: ["comtrade", params],
    queryFn: () => fetchComtradeData(params),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (annual data)
    retry: 1,
  });
}

// ─── SEC EDGAR ─────────────────────────────────────────────────────────────────

export function useEdgarFilings(company: string, formType = "10-K") {
  return useQuery<EdgarFiling[]>({
    queryKey: ["edgar", company, formType],
    queryFn: () => fetchEdgarFilings(company, formType, 5),
    enabled: company.length > 2,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });
}

// ─── GS1 Verification ──────────────────────────────────────────────────────────

export function useGs1Verify(gtin: string) {
  return useQuery<Gs1VerifyResult>({
    queryKey: ["gs1", gtin],
    queryFn: () => fetchGs1Verify(gtin),
    enabled: gtin.replace(/\D/g, "").length >= 8,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}

// ─── Aggregate connector health (for Data Sources page) ───────────────────────

export interface ConnectorHealth {
  name: string;
  status: "live" | "error" | "loading";
  recordCount?: number;
  total?: number;
  latencyMs?: number;
  lastFetchedAt: string;
}

export function useConnectorHealth() {
  const cpsc = useCpscRecalls({ RecallDateStart: "2024-01-01", limit: 5 });
  const fdaFood = useFdaEnforcements("food", { limit: 1 });
  const fdaDrug = useFdaEnforcements("drug", { limit: 1 });
  const gleif = useGleifSearch("Apple", true);
  const comtrade = useComtradeData();
  const edgar = useEdgarFilings("Apple", "10-K");

  const now = new Date().toISOString();

  const connectors: ConnectorHealth[] = [
    {
      name: "CPSC",
      status: cpsc.isLoading ? "loading" : cpsc.isError ? "error" : "live",
      recordCount: cpsc.data?.length,
      lastFetchedAt: now,
    },
    {
      name: "FDA openFDA (Food)",
      status: fdaFood.isLoading ? "loading" : fdaFood.isError ? "error" : "live",
      total: fdaFood.data?.total,
      lastFetchedAt: now,
    },
    {
      name: "FDA openFDA (Drug)",
      status: fdaDrug.isLoading ? "loading" : fdaDrug.isError ? "error" : "live",
      total: fdaDrug.data?.total,
      lastFetchedAt: now,
    },
    {
      name: "GLEIF",
      status: gleif.isLoading ? "loading" : gleif.isError ? "error" : "live",
      recordCount: gleif.data?.length,
      lastFetchedAt: now,
    },
    {
      name: "UN Comtrade",
      status: comtrade.isLoading ? "loading" : comtrade.isError ? "error" : "live",
      recordCount: comtrade.data?.length,
      lastFetchedAt: now,
    },
    {
      name: "SEC EDGAR",
      status: edgar.isLoading ? "loading" : edgar.isError ? "error" : "live",
      recordCount: edgar.data?.length,
      lastFetchedAt: now,
    },
  ];

  return {
    connectors,
    isLoading: cpsc.isLoading || fdaFood.isLoading || fdaDrug.isLoading || gleif.isLoading,
  };
}
