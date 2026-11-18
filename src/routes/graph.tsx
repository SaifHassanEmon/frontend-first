import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import {
  Boxes,
  Factory,
  Layers,
  AlertTriangle,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  ShieldAlert,
  Info,
  X,
  ExternalLink,
} from "lucide-react";
import { PageHeader, DemoTag, RiskBadge, Panel, Confidence } from "@/components/app/ui";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Severity } from "@/data/mock";

export const Route = createFileRoute("/graph")({
  head: () => seo("Supply Chain Graph", "Explore multi-tier entity relationships and risk propagation paths."),
  component: SupplyChainGraphPage,
});

interface EntityNodeData {
  id: string;
  label: string;
  tier: "OEM" | "Tier 1" | "Tier 2" | "Tier 3";
  category: string;
  country: string;
  severity: Severity;
  riskScore: number;
  singleSource?: boolean;
  affectedProducts?: string[];
  investigationRef?: string;
  detail: string;
  [key: string]: unknown;
}

const initialEntityNodes: Node<EntityNodeData>[] = [
  // OEM Brands (X: 850)
  {
    id: "oem-nova",
    type: "entityNode",
    position: { x: 880, y: 80 },
    data: {
      id: "oem-nova",
      label: "Nova Mobile Ltd.",
      tier: "OEM",
      category: "Consumer Electronics",
      country: "United States",
      severity: "critical",
      riskScore: 92,
      affectedProducts: ["Smartphone A", "Tablet Neo"],
      investigationRef: "INV-2026-0128",
      detail: "OEM manufacturer of Smartphone A. Exposed to BatteryPro XZ-100 recall lot #88A.",
    },
  },
  {
    id: "oem-urban",
    type: "entityNode",
    position: { x: 880, y: 280 },
    data: {
      id: "oem-urban",
      label: "Urban Glide Co.",
      tier: "OEM",
      category: "Micro-mobility",
      country: "Germany",
      severity: "high",
      riskScore: 84,
      affectedProducts: ["Electric Scooter B"],
      investigationRef: "INV-2026-0128",
      detail: "European e-mobility assembler. Secondary consumer of XZ100-L battery modules.",
    },
  },
  {
    id: "oem-volt",
    type: "entityNode",
    position: { x: 880, y: 480 },
    data: {
      id: "oem-volt",
      label: "VoltCarry Inc.",
      tier: "OEM",
      category: "Power Accessories",
      country: "United Kingdom",
      severity: "medium",
      riskScore: 62,
      affectedProducts: ["Power Bank C"],
      investigationRef: "INV-2026-0126",
      detail: "Power bank vendor with potential duplicate GTIN issues and unverified cells.",
    },
  },

  // Tier 1 Assembly (X: 580)
  {
    id: "t1-batterypro",
    type: "entityNode",
    position: { x: 580, y: 120 },
    data: {
      id: "t1-batterypro",
      label: "BatteryPro Cells Co.",
      tier: "Tier 1",
      category: "Lithium cells & packs",
      country: "China",
      severity: "critical",
      riskScore: 94,
      singleSource: true,
      affectedProducts: ["XZ-100", "XZ100-L"],
      investigationRef: "INV-2026-0128",
      detail: "Primary origin facility for recalled lithium battery packs. Single-source for Nova Mobile.",
    },
  },
  {
    id: "t1-monterrey",
    type: "entityNode",
    position: { x: 580, y: 380 },
    data: {
      id: "t1-monterrey",
      label: "Monterrey Electro SA",
      tier: "Tier 1",
      category: "Final Sub-Assembly",
      country: "Mexico",
      severity: "low",
      riskScore: 28,
      singleSource: false,
      affectedProducts: ["Smartphone A (Alt Line)", "Charger 45W"],
      detail: "Nearshore contract manufacturer. Currently evaluated as redundant alternative source.",
    },
  },

  // Tier 2 Component Suppliers (X: 280)
  {
    id: "t2-formosa",
    type: "entityNode",
    position: { x: 280, y: 40 },
    data: {
      id: "t2-formosa",
      label: "Formosa Capacitor Ltd.",
      tier: "Tier 2",
      category: "Dielectric Capacitors",
      country: "Taiwan",
      severity: "high",
      riskScore: 81,
      singleSource: true,
      affectedProducts: ["Capacitor C-44", "High-Volt SMD"],
      investigationRef: "INV-2026-0127",
      detail: "Single-source tier-2 dependency for BatteryPro and Monterrey. High weather disruption exposure.",
    },
  },
  {
    id: "t2-mekong",
    type: "entityNode",
    position: { x: 280, y: 220 },
    data: {
      id: "t2-mekong",
      label: "Mekong Bearings JSC",
      tier: "Tier 2",
      category: "Precision Bearings",
      country: "Vietnam",
      severity: "medium",
      riskScore: 61,
      singleSource: false,
      affectedProducts: ["Bearing B-12"],
      investigationRef: "INV-2026-0122",
      detail: "Unverified sub-tier supplier; ISO 9001 expired September 2026.",
    },
  },
  {
    id: "t2-chennai",
    type: "entityNode",
    position: { x: 280, y: 420 },
    data: {
      id: "t2-chennai",
      label: "Chennai Relay Works",
      tier: "Tier 2",
      category: "Solid State Relays",
      country: "India",
      severity: "medium",
      riskScore: 57,
      singleSource: false,
      affectedProducts: ["Relay SSR-24"],
      investigationRef: "INV-2026-0121",
      detail: "Spec inconsistency flagged on thermal impedance datasheets.",
    },
  },

  // Tier 3 Raw Materials & Chemistry (X: 0)
  {
    id: "t3-lithium",
    type: "entityNode",
    position: { x: 0, y: 100 },
    data: {
      id: "t3-lithium",
      label: "Sichuan Lithium Refining",
      tier: "Tier 3",
      category: "Battery Grade LiOH",
      country: "China",
      severity: "high",
      riskScore: 78,
      singleSource: true,
      affectedProducts: ["LiOH 99.5%"],
      detail: "Critical cathode feedstock provider with 48% regional concentration.",
    },
  },
  {
    id: "t3-nordic",
    type: "entityNode",
    position: { x: 0, y: 320 },
    data: {
      id: "t3-nordic",
      label: "Nordic Polymer AB",
      tier: "Tier 3",
      category: "Flame-Retardant Resins",
      country: "Sweden",
      severity: "low",
      riskScore: 24,
      singleSource: false,
      affectedProducts: ["Polymer FR-90"],
      detail: "ISO 14001 verified green polymer supplier with multiple redundancy warehouses in Europe.",
    },
  },
];

const initialEdges: Edge[] = [
  // Tier 3 -> Tier 2
  {
    id: "e-t3-lith-formosa",
    source: "t3-lithium",
    target: "t2-formosa",
    label: "Lithium Salts",
    style: { stroke: "var(--warning)", strokeWidth: 1.5 },
  },
  {
    id: "e-t3-lith-batterypro",
    source: "t3-lithium",
    target: "t1-batterypro",
    label: "Refined LiOH",
    animated: true,
    style: { stroke: "var(--critical)", strokeWidth: 2.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--critical)" },
  },
  {
    id: "e-t3-nordic-mekong",
    source: "t3-nordic",
    target: "t2-mekong",
    label: "Polymer Seals",
    style: { stroke: "var(--border)", strokeWidth: 1.5 },
  },
  {
    id: "e-t3-nordic-chennai",
    source: "t3-nordic",
    target: "t2-chennai",
    label: "Casing Resin",
    style: { stroke: "var(--border)", strokeWidth: 1.5 },
  },

  // Tier 2 -> Tier 1
  {
    id: "e-t2-formosa-batterypro",
    source: "t2-formosa",
    target: "t1-batterypro",
    label: "SMD Capacitors (Sole Source)",
    animated: true,
    style: { stroke: "var(--critical)", strokeWidth: 2.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--critical)" },
  },
  {
    id: "e-t2-formosa-monterrey",
    source: "t2-formosa",
    target: "t1-monterrey",
    label: "Passive SMD",
    style: { stroke: "var(--warning)", strokeWidth: 1.5 },
  },
  {
    id: "e-t2-mekong-urban",
    source: "t2-mekong",
    target: "oem-urban",
    label: "Direct Wheel Bearings",
    style: { stroke: "var(--info)", strokeWidth: 1.5 },
  },
  {
    id: "e-t2-chennai-volt",
    source: "t2-chennai",
    target: "oem-volt",
    label: "Circuit Protection Relays",
    style: { stroke: "var(--info)", strokeWidth: 1.5 },
  },

  // Tier 1 -> OEM
  {
    id: "e-t1-batterypro-nova",
    source: "t1-batterypro",
    target: "oem-nova",
    label: "Recalled XZ-100 Packs",
    animated: true,
    style: { stroke: "var(--critical)", strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--critical)" },
  },
  {
    id: "e-t1-batterypro-urban",
    source: "t1-batterypro",
    target: "oem-urban",
    label: "XZ100-L Modules",
    animated: true,
    style: { stroke: "var(--critical)", strokeWidth: 2.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--critical)" },
  },
  {
    id: "e-t1-batterypro-volt",
    source: "t1-batterypro",
    target: "oem-volt",
    label: "BP-77 Sub-components",
    style: { stroke: "var(--warning)", strokeWidth: 1.5 },
  },
  {
    id: "e-t1-monterrey-nova",
    source: "t1-monterrey",
    target: "oem-nova",
    label: "Qualified Alt Assembly",
    style: { stroke: "var(--success)", strokeWidth: 1.5, strokeDasharray: "4 4" },
  },
];

function CustomEntityNode({ data, selected }: NodeProps<Node<EntityNodeData>>) {
  const isCritical = data.severity === "critical";
  const isHigh = data.severity === "high";

  return (
    <div
      className={cn(
        "group relative w-64 rounded-lg border bg-card/95 p-3.5 shadow-md backdrop-blur transition-all duration-200",
        selected ? "border-primary ring-2 ring-primary/40 glow" : "border-border hover:border-primary/50",
        isCritical && "border-critical/60 hover:border-critical",
        isHigh && "border-warning/60 hover:border-warning"
      )}
    >
      <Handle type="target" position={Position.Left} className="!size-2.5 !border-border !bg-primary" />
      
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
            data.tier === "OEM" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {data.tier}
        </span>
        <RiskBadge level={data.severity} />
      </div>

      <div className="mt-2">
        <p className="truncate text-xs font-semibold text-foreground group-hover:text-primary">
          {data.label}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {data.category} · {data.country}
        </p>
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2 text-[10px]">
        <span className="font-mono text-muted-foreground">Risk: <strong className="text-foreground">{data.riskScore}/100</strong></span>
        {data.singleSource ? (
          <span className="flex items-center gap-1 font-medium text-critical">
            <AlertTriangle className="size-3" /> SPOF
          </span>
        ) : (
          <span className="text-muted-foreground">Multi-sourced</span>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!size-2.5 !border-border !bg-primary" />
    </div>
  );
}

const nodeTypes = {
  entityNode: CustomEntityNode,
};

function SupplyChainGraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<EntityNodeData>>(initialEntityNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] = useState<EntityNodeData | null>(initialEntityNodes[0].data);
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightRecallOnly, setHighlightRecallOnly] = useState(false);

  // Filtered nodes logic
  const filteredNodes = useMemo(() => {
    return initialEntityNodes.map((n) => {
      let isHidden = false;
      if (tierFilter !== "ALL" && n.data.tier !== tierFilter) isHidden = true;
      if (severityFilter !== "ALL" && n.data.severity !== severityFilter) isHidden = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = n.data.label.toLowerCase().includes(q) || n.data.category.toLowerCase().includes(q) || n.data.country.toLowerCase().includes(q);
        if (!match) isHidden = true;
      }
      if (highlightRecallOnly) {
        const recallPathIds = ["t3-lithium", "t2-formosa", "t1-batterypro", "oem-nova", "oem-urban"];
        if (!recallPathIds.includes(n.id)) isHidden = true;
      }
      return {
        ...n,
        hidden: isHidden,
      };
    });
  }, [tierFilter, severityFilter, searchQuery, highlightRecallOnly]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as EntityNodeData);
  }, []);

  const resetFilters = () => {
    setTierFilter("ALL");
    setSeverityFilter("ALL");
    setSearchQuery("");
    setHighlightRecallOnly(false);
  };

  return (
    <div className="mx-auto max-w-[1450px] space-y-4">
      <PageHeader
        title="Supply Chain Graph"
        subtitle="Interactive multi-tier supplier network and risk propagation map."
        actions={
          <div className="flex items-center gap-2">
            <DemoTag label="Multi-tier dependency topology" />
            <button
              onClick={() => setHighlightRecallOnly(!highlightRecallOnly)}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                highlightRecallOnly
                  ? "border-critical bg-critical/15 text-critical"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <Flame className="size-3.5" />
              {highlightRecallOnly ? "Showing Recall Path" : "Trace Recall Flow"}
            </button>
          </div>
        }
      />

      {/* Control & Filter Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search entities, categories, countries…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>

          {/* Tier Selector */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Tier:</span>
            {["ALL", "OEM", "Tier 1", "Tier 2", "Tier 3"].map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={cn(
                  "rounded px-2 py-1 text-[11px] font-medium transition-colors",
                  tierFilter === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Risk Selector */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Risk:</span>
            {["ALL", "critical", "high", "medium", "low"].map((r) => (
              <button
                key={r}
                onClick={() => setSeverityFilter(r)}
                className={cn(
                  "rounded px-2 py-1 text-[11px] font-medium capitalize transition-colors",
                  severityFilter === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {(tierFilter !== "ALL" || severityFilter !== "ALL" || searchQuery || highlightRecallOnly) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3" /> Reset filters
          </button>
        )}
      </div>

      {/* Main Canvas + Side Drawer */}
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="relative h-[620px] overflow-hidden rounded-lg border border-border bg-card/60 lg:col-span-3">
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="color-mix(in oklab, var(--foreground) 10%, transparent)" />
            <Controls className="!border-border !bg-card" />
            <MiniMap
              nodeColor={(n) => {
                const sev = (n.data as EntityNodeData)?.severity;
                if (sev === "critical") return "var(--critical)";
                if (sev === "high") return "var(--warning)";
                if (sev === "medium") return "var(--info)";
                return "var(--success)";
              }}
              className="!border-border !bg-card/90"
              zoomable
              pannable
            />
          </ReactFlow>

          {/* Legend overlay */}
          <div className="absolute left-3 top-3 flex items-center gap-3 rounded-md border border-border bg-card/90 px-3 py-1.5 text-[11px] backdrop-blur">
            <span className="text-muted-foreground font-medium">Flow:</span>
            <span className="text-muted-foreground">Raw Materials (T3) → Components (T2) → Assembly (T1) → OEM Brands</span>
          </div>
        </div>

        {/* Selected Entity Side Detail Panel */}
        <div className="lg:col-span-1">
          {selectedNode ? (
            <div className="h-[620px] overflow-y-auto rounded-lg border border-border bg-card p-4 fade-up">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-primary">
                    {selectedNode.tier} Entity
                  </span>
                  <h3 className="mt-1 text-base font-semibold">{selectedNode.label}</h3>
                  <p className="text-xs text-muted-foreground">{selectedNode.country} · {selectedNode.category}</p>
                </div>
                <RiskBadge level={selectedNode.severity} />
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <span className="text-muted-foreground">Risk Assessment Score</span>
                  <div className="mt-1 flex items-center justify-between">
                    <Confidence value={selectedNode.riskScore} />
                  </div>
                </div>

                <div className="rounded border border-border bg-muted/30 p-2.5">
                  <p className="font-medium text-foreground">Operational Overview</p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">{selectedNode.detail}</p>
                </div>

                {selectedNode.singleSource && (
                  <div className="flex items-start gap-2 rounded border border-critical/30 bg-critical/10 p-2.5 text-critical">
                    <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs">Single-Source Bottleneck</p>
                      <p className="text-[11px] text-critical/90 mt-0.5">
                        No active second source registered. Disruption here propagates immediately downstream.
                      </p>
                    </div>
                  </div>
                )}

                {selectedNode.affectedProducts && (
                  <div>
                    <span className="text-muted-foreground font-medium">Downstream Affected Products:</span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {selectedNode.affectedProducts.map((p) => (
                        <span key={p} className="rounded border border-border bg-background px-2 py-0.5 text-[11px]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.investigationRef && (
                  <div className="rounded border border-border p-2.5">
                    <span className="text-[11px] text-muted-foreground">Linked Investigation</span>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-mono font-medium text-primary">{selectedNode.investigationRef}</span>
                      <Link
                        to="/investigations"
                        className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                      >
                        Open Case <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    to="/suppliers"
                    className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    View in Supplier Intelligence <ExternalLink className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid h-[620px] place-items-center rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              Select any supplier or brand node in the graph to view dependency details.
            </div>
          )}
        </div>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Panel className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Mapped Network Entities</p>
          <p className="mt-1 font-mono text-xl font-semibold">10 Nodes</p>
        </Panel>
        <Panel className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Dependency Edges</p>
          <p className="mt-1 font-mono text-xl font-semibold">12 Edges</p>
        </Panel>
        <Panel className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Single-Point-of-Failure (SPOF)</p>
          <p className="mt-1 font-mono text-xl font-semibold text-critical">3 Critical</p>
        </Panel>
        <Panel className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Propagation Path Health</p>
          <p className="mt-1 font-mono text-xl font-semibold text-warning">Elevated Risk</p>
        </Panel>
      </div>
    </div>
  );
}
