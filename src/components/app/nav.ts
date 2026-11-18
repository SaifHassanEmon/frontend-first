import { LayoutDashboard, FolderSearch, Globe2, PackageX, Factory, ScanSearch, CloudLightning, Network, FileSearch, FileBarChart, Database, Settings, EyeOff } from "lucide-react";
export const navGroups = [
  { label: "Main", items: [
    { title: "Overview", url: "/", icon: LayoutDashboard },
    { title: "Investigation Center", url: "/investigations", icon: FolderSearch },
    { title: "Global Risk Map", url: "/risk-map", icon: Globe2 },
  ] },
  { label: "Intelligence", items: [
    { title: "Product Recall", url: "/product-recall", icon: PackageX },
    { title: "Supplier Intelligence", url: "/suppliers", icon: Factory },
    { title: "Counterfeit Detection", url: "/counterfeit", icon: ScanSearch },
    { title: "Disruption Intelligence", url: "/disruptions", icon: CloudLightning },
    { title: "Unknown Exposure", url: "/unknown-exposure", icon: EyeOff },
  ] },
  { label: "Analysis", items: [
    { title: "Supply Chain Graph", url: "/graph", icon: Network },
    { title: "Evidence Explorer", url: "/evidence", icon: FileSearch },
    { title: "Reports", url: "/reports", icon: FileBarChart },
  ] },
  { label: "System", items: [
    { title: "Data Sources", url: "/data-sources", icon: Database },
    { title: "Settings", url: "/settings", icon: Settings },
  ] },
] as const;
