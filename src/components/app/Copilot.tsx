import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X, Bot, RefreshCw } from "lucide-react";
import { copilotScript, suppliers, investigations, disruptionEvents, counterfeitListings, unknownExposures } from "@/data/mock";
import { DemoTag } from "./ui";
import { cn } from "@/lib/utils";

type Msg = { role: "ai" | "user"; text: string };
const prompts = [
  "Find products potentially affected by this battery recall.",
  "Identify hidden supplier dependencies.",
  "Explain suspicious component matches.",
  "Investigate a port disruption.",
  "Show unmapped sub-tier blind spots.",
];

function generateAnswer(query: string): string {
  const q = query.toLowerCase();

  if (copilotScript[query]) {
    return copilotScript[query];
  }

  if (q.includes("battery") || q.includes("recall") || q.includes("xz-100") || q.includes("nova")) {
    return "Recall Investigation INV-2026-0128: BatteryPro XZ-100 lithium-ion cells exhibit thermal runaway hazards. Downstream exposure has been verified for Nova Mobile (Smartphone A, 98% confidence) and Urban Glide (Electric Scooter B, 84% confidence). 12,400 units are currently isolated in Los Angeles DC-04.";
  }

  if (q.includes("supplier") || q.includes("dependency") || q.includes("formosa") || q.includes("spof")) {
    return "Single-Point-of-Failure Analysis: Formosa Capacitor Ltd. (Kaohsiung, TW) is a sole-source Tier-2 supplier for 4 Tier-1 assemblers. Any downtime halts production of Smartphone A and Scooter B. Qualified secondary candidate: Monterrey Electro SA (Mexico).";
  }

  if (q.includes("port") || q.includes("rotterdam") || q.includes("disruption") || q.includes("weather") || q.includes("suez")) {
    return "Active Disruption Alert: Port of Rotterdam is facing partial container terminal closures with 7-day berth congestion. 23 inbound shipments (including Smartphone A lots) are impacted. Rerouting via Antwerp or utilizing Hamburg buffer capacity is recommended.";
  }

  if (q.includes("counterfeit") || q.includes("fake") || q.includes("gtin") || q.includes("charger")) {
    return "Counterfeit Detection: Flagged UltraCharge 65W GaN Adapter with duplicate GTIN 0614141000012 on Dubai secondary marketplaces. Lab testing verified -38g weight deficit, missing thermal cutout, and absent UL certification. Automated takedown issued.";
  }

  if (q.includes("blind spot") || q.includes("unknown") || q.includes("exposure") || q.includes("tier 3") || q.includes("tier 4")) {
    return "Unknown Exposure Scanner: Identified 4 high-risk unmapped dependencies, including Tier-4 cobalt processing in DR Congo (EXP-902) and 89/100 concentration risk on a single Kaohsiung dielectric line. Immediate on-site audit dispatch recommended.";
  }

  if (q.includes("status") || q.includes("overview") || q.includes("how many") || q.includes("count")) {
    return `System Status Summary: 128 Active Investigations (${investigations.filter((i) => i.severity === "critical").length} Critical), 346 Monitored Suppliers (${suppliers.filter((s) => s.singleSource).length} Single-Source SPOF), ${counterfeitListings.length} Counterfeit Anomalies, and ${unknownExposures.length} Discovered Sub-Tier Blind Spots.`;
  }

  return `Analysis Result: I searched the RecallMesh intelligence mesh for "${query}". Cross-referencing BOMs, GLEIF registry, and live shipping telemetry shows 3 correlated nodes across East Asia and North America. You can view the full entity propagation path in the Supply Chain Graph (/graph) or review detailed dossiers in the Investigation Center.`;
}

export function Copilot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: "Hello Alex. I've indexed 128 active investigations, multi-tier supply chain dependencies, and global disruption feeds. What would you like to investigate?",
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const ask = (q: string) => {
    if (!q.trim() || typing) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "ai", text: generateAnswer(q) }]);
    }, 850);
  };

  const clearChat = () => {
    setMsgs([
      {
        role: "ai",
        text: "Conversation reset. What supply chain vulnerability or recall alert would you like to explore?",
      },
    ]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-primary glow transition-transform hover:scale-105"
      >
        <Sparkles className="size-4" /> Copilot
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 flex h-[580px] w-[400px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-xl border border-border bg-popover shadow-2xl fade-up">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <Sparkles className="size-4 text-primary" /> Intelligence Copilot
              </p>
              <div className="mt-1">
                <DemoTag label="Multi-tier Graph & Risk Mesh" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Reset conversation"
                className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted"
              >
                <RefreshCw className="size-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[88%] rounded-lg px-3 py-2 text-[13px] leading-relaxed",
                  m.role === "ai"
                    ? "border border-border bg-card text-foreground"
                    : "ml-auto bg-primary text-primary-foreground"
                )}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="flex w-14 gap-1 rounded-lg border border-border bg-card px-3 py-3">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="size-1.5 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: `${d * 120}ms` }}
                  />
                ))}
              </div>
            )}
            <div ref={end} />
          </div>

          <div className="flex gap-1.5 overflow-x-auto border-t border-border px-3 py-2">
            {prompts.map((p) => (
              <button
                key={p}
                onClick={() => ask(p)}
                className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-primary"
              >
                {p}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about recalls, suppliers, disruptions…"
              className="h-9 flex-1 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary/50"
            />
            <button
              className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
