import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X } from "lucide-react";
import { copilotScript } from "@/data/mock";
import { DemoTag } from "./ui";
import { cn } from "@/lib/utils";

type Msg = { role: "ai" | "user"; text: string };
const prompts = Object.keys(copilotScript);

export function Copilot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: "Hello Alex. I've identified 3 emerging risk signals across your commerce network. What would you like to investigate?" }]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, typing]);

  const ask = (q: string) => {
    if (!q.trim() || typing) return;
    setMsgs((m) => [...m, { role: "user", text: q }]); setInput(""); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "ai", text: copilotScript[q] ?? "In this demo I can answer the suggested investigation prompts. Try one of them below — responses are pre-scripted and no AI service is connected." }]);
    }, 1100);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-primary glow transition-transform hover:scale-105"><Sparkles className="size-4" />Copilot</button>
      {open && (
        <div className="fixed bottom-20 right-5 z-40 flex h-[560px] w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-xl border border-border bg-popover shadow-2xl fade-up">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div><p className="flex items-center gap-1.5 text-sm font-semibold"><Sparkles className="size-4 text-primary" />Investigation Copilot</p><div className="mt-1"><DemoTag label="Demo simulation · not connected AI" /></div></div>
            <button onClick={() => setOpen(false)} aria-label="Close"><X className="size-4 text-muted-foreground" /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => <div key={i} className={cn("max-w-[88%] rounded-lg px-3 py-2 text-[13px] leading-relaxed", m.role === "ai" ? "bg-card border border-border" : "ml-auto bg-primary text-primary-foreground")}>{m.text}</div>)}
            {typing && <div className="flex w-14 gap-1 rounded-lg border border-border bg-card px-3 py-3">{[0, 1, 2].map((d) => <span key={d} className="size-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: `${d * 120}ms` }} />)}</div>}
            <div ref={end} />
          </div>
          <div className="flex gap-1.5 overflow-x-auto border-t border-border px-3 py-2">{prompts.map((p) => <button key={p} onClick={() => ask(p)} className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-primary">{p}</button>)}</div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2 border-t border-border p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a risk…" className="h-9 flex-1 rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-primary/50" />
            <button className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground" aria-label="Send"><Send className="size-4" /></button>
          </form>
        </div>
      )}
    </>
  );
}
