import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings,
  Sliders,
  Bell,
  KeyRound,
  User,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  SlidersHorizontal,
} from "lucide-react";
import { PageHeader, DemoTag, Panel } from "@/components/app/ui";
import { useApp } from "@/lib/store";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => seo("System Settings", "Configure risk scoring thresholds, notifications, and API integrations."),
  component: SettingsPage,
});

function SettingsPage() {
  const currentSettings = useApp((s) => s.settings);
  const updateSettings = useApp((s) => s.updateSettings);

  const [tab, setTab] = useState<"scoring" | "notifications" | "api" | "profile">("scoring");

  // Scoring Weights
  const [regulatoryWeight, setRegulatoryWeight] = useState(currentSettings?.regulatoryWeight ?? 40);
  const [spofWeight, setSpofWeight] = useState(currentSettings?.spofWeight ?? 30);
  const [disruptionWeight, setDisruptionWeight] = useState(currentSettings?.disruptionWeight ?? 20);
  const [counterfeitWeight, setCounterfeitWeight] = useState(currentSettings?.counterfeitWeight ?? 10);

  // Notifications
  const [notifyCritical, setNotifyCritical] = useState(currentSettings?.notifyCritical ?? true);
  const [notifySlack, setNotifySlack] = useState(currentSettings?.notifySlack ?? true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(currentSettings?.notifyDailyDigest ?? true);
  const [slackWebhook, setSlackWebhook] = useState(currentSettings?.slackWebhook ?? "https://hooks.slack.com/services/T00/B00/XXXXXX");

  // API Keys state
  const [showKeys, setShowKeys] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    updateSettings({
      regulatoryWeight,
      spofWeight,
      disruptionWeight,
      counterfeitWeight,
      notifyCritical,
      notifySlack,
      notifyDailyDigest,
      slackWebhook,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="mx-auto max-w-[1450px] space-y-4">
      <PageHeader
        title="Settings & Risk Engine Configuration"
        subtitle="Calibrate risk scoring multipliers, webhook dispatchers, and external API credentials."
        actions={
          <div className="flex items-center gap-2">
            <DemoTag label="Config engine simulation" />
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Save className="size-3.5" />
              Save Configuration
            </button>
          </div>
        }
      />

      {savedToast && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-xs font-medium text-success fade-up">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>System configuration parameters successfully committed and propagated across all analytics modules.</span>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex gap-2 border-b border-border pb-2 text-xs">
        <button
          onClick={() => setTab("scoring")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors",
            tab === "scoring" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sliders className="size-3.5" /> Risk Scoring Multipliers
        </button>
        <button
          onClick={() => setTab("notifications")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors",
            tab === "notifications" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Bell className="size-3.5" /> Alerts & Webhooks
        </button>
        <button
          onClick={() => setTab("api")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors",
            tab === "api" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <KeyRound className="size-3.5" /> API Keys & Registry Feeds
        </button>
        <button
          onClick={() => setTab("profile")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors",
            tab === "profile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="size-3.5" /> Analyst Profile
        </button>
      </div>

      {/* Tab 1: Risk Scoring Multipliers */}
      {tab === "scoring" && (
        <div className="space-y-4 fade-up">
          <Panel title="Risk Score Calculation Weights (Total 100%)">
            <div className="max-w-2xl space-y-5 text-xs">
              <p className="text-muted-foreground">
                Tune how individual risk vectors contribute to the unified Composite Risk Score across suppliers and investigations.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Regulatory & Recall Enforcement Penalty</span>
                  <span className="font-mono text-primary font-bold">{regulatoryWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={regulatoryWeight}
                  onChange={(e) => setRegulatoryWeight(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Single-Point-of-Failure (SPOF) Multiplier</span>
                  <span className="font-mono text-primary font-bold">{spofWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={spofWeight}
                  onChange={(e) => setSpofWeight(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Maritime & Geopolitical Disruption Sensitivity</span>
                  <span className="font-mono text-primary font-bold">{disruptionWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={disruptionWeight}
                  onChange={(e) => setDisruptionWeight(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Counterfeit & Spec Deviation Index</span>
                  <span className="font-mono text-primary font-bold">{counterfeitWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={counterfeitWeight}
                  onChange={(e) => setCounterfeitWeight(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="rounded border border-border bg-muted/20 p-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Normalized Weight Total:</span>
                  <span className="font-mono text-success">
                    {regulatoryWeight + spofWeight + disruptionWeight + counterfeitWeight}%
                  </span>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* Tab 2: Notifications */}
      {tab === "notifications" && (
        <div className="space-y-4 fade-up">
          <Panel title="Incident Alerts & Webhook Dispatchers">
            <div className="max-w-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-semibold text-foreground">Critical Severity Instant Alert</p>
                  <p className="text-muted-foreground mt-0.5">Push immediate notification when risk score exceeds 85/100</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyCritical}
                  onChange={(e) => setNotifyCritical(e.target.checked)}
                  className="size-4 rounded border-border text-primary"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-semibold text-foreground">Slack Incident Room Dispatcher</p>
                  <p className="text-muted-foreground mt-0.5">Automatically stream newly opened investigations into dedicated Slack channel</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifySlack}
                  onChange={(e) => setNotifySlack(e.target.checked)}
                  className="size-4 rounded border-border text-primary"
                />
              </div>

              {notifySlack && (
                <div className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3">
                  <label className="text-[11px] font-medium text-muted-foreground">Slack Incoming Webhook URL</label>
                  <input
                    type="text"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    className="h-8 w-full rounded border border-input bg-background px-3 font-mono text-[11px] outline-none focus:border-primary"
                  />
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-semibold text-foreground">Daily Intelligence Digest PDF</p>
                  <p className="text-muted-foreground mt-0.5">Send 08:00 UTC summary of all emerging signals and open investigations</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDailyDigest}
                  onChange={(e) => setNotifyDailyDigest(e.target.checked)}
                  className="size-4 rounded border-border text-primary"
                />
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* Tab 3: API Keys */}
      {tab === "api" && (
        <div className="space-y-4 fade-up">
          <Panel
            title="External Intelligence & Registry Credentials"
            action={
              <button
                onClick={() => setShowKeys(!showKeys)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {showKeys ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                {showKeys ? "Hide Keys" : "Reveal Keys"}
              </button>
            }
          >
            <div className="max-w-2xl space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-foreground">GS1 Registry Access Token</label>
                <div className="flex gap-2">
                  <input
                    type={showKeys ? "text" : "password"}
                    readOnly
                    value="gs1_live_998a44b120fec3381a"
                    className="h-8 flex-1 rounded border border-input bg-muted/40 px-3 font-mono text-[11px] outline-none"
                  />
                  <button
                    onClick={() => alert("Copied GS1 token to clipboard.")}
                    className="grid size-8 place-items-center rounded border border-border hover:bg-muted"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">openFDA Government API Key</label>
                <div className="flex gap-2">
                  <input
                    type={showKeys ? "text" : "password"}
                    readOnly
                    value="fda_sec_8849200aa9128f77"
                    className="h-8 flex-1 rounded border border-input bg-muted/40 px-3 font-mono text-[11px] outline-none"
                  />
                  <button
                    onClick={() => alert("Copied FDA key to clipboard.")}
                    className="grid size-8 place-items-center rounded border border-border hover:bg-muted"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">MapLibre GL Vector Tile Key</label>
                <div className="flex gap-2">
                  <input
                    type={showKeys ? "text" : "password"}
                    readOnly
                    value="map_pk_cyber_dark_4410294"
                    className="h-8 flex-1 rounded border border-input bg-muted/40 px-3 font-mono text-[11px] outline-none"
                  />
                  <button
                    onClick={() => alert("Copied MapLibre key to clipboard.")}
                    className="grid size-8 place-items-center rounded border border-border hover:bg-muted"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* Tab 4: Analyst Profile */}
      {tab === "profile" && (
        <div className="space-y-4 fade-up">
          <Panel title="Active Analyst Session">
            <div className="max-w-2xl space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-info/20 text-sm font-bold text-info">
                  AM
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Alex Morgan</h4>
                  <p className="text-muted-foreground">Lead Risk Analyst · GlobalTrade Inc.</p>
                  <p className="font-mono text-[11px] text-primary">alex.morgan@globaltrade.example.com</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded border border-border p-3">
                  <span className="text-[10px] uppercase text-muted-foreground">Assigned Cases</span>
                  <p className="mt-1 font-mono text-base font-bold">14 Active</p>
                </div>
                <div className="rounded border border-border p-3">
                  <span className="text-[10px] uppercase text-muted-foreground">Clearance Level</span>
                  <p className="mt-1 font-mono text-base font-bold text-success">Level 4 (Admin)</p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
