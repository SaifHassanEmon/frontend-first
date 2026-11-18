# RecallMesh X — Frontend-only build

A dark, enterprise-grade intelligence app with synthetic demo data. No backend, login, or real AI; everything runs in the browser, and the demo state is saved locally.

## Design
- Dark navy theme (#080D18 background, #0D1422 sidebar, #111B2B cards), thin borders, cyan/electric-blue accents. Green = verified, amber = risk, red = critical.
- Geist font, Lucide icons, small animations, compact spacing.

## App shell
- A collapsible sidebar with groups: Main, Intelligence, Analysis, System. Its footer shows Alex Morgan, Risk Analyst, GlobalTrade Inc.
- A top bar with breadcrumbs, global search, a notifications popover, help, and the profile.
- A floating AI Copilot button on every page. It opens a demo chat with preset prompts, a typing indicator, and fixed scripted answers, and is clearly labeled "Demo simulation".

## Pages (each with its own address)
1. **Overview**: 5 KPI cards, a world risk map with hover/select markers, a risk distribution donut, a recent investigations table, an emerging signals feed, and an activity timeline.
2. **Investigation Center**: search, domain/severity/status filters, and investigation cards. A "New Investigation" window adds an investigation to the list and shows a simulated result.
3. **Global Risk Map**: a full-page map with layer filters (Recall, Supplier, Counterfeit, Disruption) and marker types (suppliers, hubs, warehouses, ports, events). Clicking a marker opens a side detail panel.
4. **Product Recall**: KPIs, the RECALL-2026-001 BatteryPro alert panel, Component Identity Discovery chips, a match table with approve/reject buttons, and a detail panel with tabs (relationships, exposure, inventory, shipments, evidence). Everything is labeled "Synthetic demo".
5. **Supplier Intelligence**: KPIs, supplier profile cards, a multi-tier dependency chain, concentration, alternative suppliers, and missing-relationship notes.
6. **Counterfeit Detection**: lists of flags plus a side-by-side spec comparison with differences highlighted, using Verified/Suspicious/Needs Verification labels only.
7. **Disruption Intelligence**: KPIs, 4 event cards, an event map, and an event detail drawer.
8. **Supply Chain Graph**: an interactive network graph with 9 entity types and draggable nodes, zoom/pan, search, connected-node highlighting, relationship filters, risk-path highlighting, a legend, and a node detail drawer. Verified links are solid, inferred links dashed, and unknown links dotted.
9. **Evidence Explorer**: a searchable, filterable table and a preview drawer showing the source URL, extracted text, and an investigation link.
10. **Unknown Exposure**: a scorecard, information-gap categories, the reasons a link can't be confirmed, and a recommended next information request.
11. **Reports**: search, domain filter, report cards, a preview window, and a sample download as a text/markdown file.
12. **Data Sources**: 11 source cards, all marked "Demo / Not Connected".
13. **Settings**: simple preference toggles.

## Technical notes
- TanStack Router file routes (the project's router; React Router isn't used). Libraries: recharts, @xyflow/react, maplibre-gl loaded in the browser only, with a free dark map style.
- Mock data lives in `src/data/*`. A small zustand store saved to localStorage holds investigations, match decisions, and notifications.
- Reusable parts: KpiCard, RiskBadge, DataTable, DetailDrawer, InvestigationCard, graph node types.
- Each page gets its own title and description.
