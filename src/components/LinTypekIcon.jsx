import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  ExternalLink,
  Figma,
  FileCheck,
  FileText,
  Github,
  Globe,
  Presentation,
  Youtube,
} from "lucide-react";

export const linkTypes = [
  "PROPOSAL",
  "PRESENTATION",
  "ORIGINALITY_STATEMENT",
  "GITHUB",
  "GITHUB_SECONDARY",
  "FIGMA",
  "FIGMA_PROTOTYPE",
  "DEPLOYMENT",
  "YOUTUBE",
  "OTHER",
];

export function normalizeLinkType(linkType = "") {
    return linkType?.toLowerCase().replaceAll("_", " ") || "";
}

export function LinkTypeIcon({ linkType = "", className = "" }) {
  const iconMaps = {
    PROPOSAL: FileText,
    PRESENTATION: Presentation,
    ORIGINALITY_STATEMENT: FileCheck,
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

export function getTopSubmissionLinks(n = 10, submissionLinks = []) {
  let topN = [];

  if (Array.isArray(submissionLinks)) {
    const subLinkMap = new Map(submissionLinks.map((l) => [l.link_type, l]));

    for (const linkType of linkTypes) {
      if (topN.length === n) break;
      if (subLinkMap.has(linkType)) topN.push(subLinkMap.get(linkType));
    }
  }

  return topN;
}