import {
  LayoutGrid,
  Search,
  Globe,
  GitFork,
  FileText,
  Database,
  FileBarChart,
  Settings,
} from "lucide-react";

export const navGroups = [
  {
    label: "Main",
    items: [
      { title: "Overview", url: "/", icon: LayoutGrid },
      { title: "Investigation Center", url: "/investigations", icon: Search },
      { title: "Global Risk Map", url: "/risk-map", icon: Globe },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { title: "Supply Chain Graph", url: "/graph", icon: GitFork },
      { title: "Evidence Explorer", url: "/evidence", icon: FileText },
      { title: "Data Sources", url: "/data-sources", icon: Database },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Reports", url: "/reports", icon: FileBarChart },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
] as const;
