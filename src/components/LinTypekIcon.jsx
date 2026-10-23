import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  ExternalLink,
  Figma,
  FileText,
  Github,
  Globe,
  Youtube,
} from "lucide-react";

export function normalizeLinkType(linkType = "") {
    return linkType?.replaceAll("_", "") || "";
}

export function LinkTypeIcon({ linkType = "", className = "" }) {
  const iconMaps = {
    PROPOSAL: FileText,
    GITHUB: Github,
    GITHUB_SECONDARY: Github,
    FIGMA: Figma,
    FIGMA_PROTOTYPE: Figma,
    YOUTUBE: Youtube,
    DEPLOYMENT: Globe,
    OTHER: InfoCircledIcon,
    DEFAULT: ExternalLink,
  };

  const uppercased = linkType?.toUpperCase();
  const Icon = iconMaps[uppercased] ?? iconMaps["DEFAULT"];

  return (
    <Icon className={cn("h-3.5 w-3.5 text-muted-foreground", className)} />
  );
}
