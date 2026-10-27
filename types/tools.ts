import { ReactNode } from "react";

export type ToolCategory =
  | "all"
  | "pdf"
  | "image"
  | "video-audio"
  | "downloaders"
  | "edit-convert"
  | "more";

export type RadialPosition =
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left";

export type ClayColor =
  | "clay-red"
  | "clay-green"
  | "clay-blue"
  | "clay-pink"
  | "clay-cyan"
  | "clay-yellow"
  | "clay-purple"
  | "clay-orange";

export type ToolStatus = "published" | "draft" | "coming-soon";

export interface ToolItem {
  id: string;
  title: string;
  category: ToolCategory;
  description: string;
  clayColor: ClayColor;
  iconType: string;
  badge?: string;
  isFeaturedRadial?: boolean;
  radialPosition?: RadialPosition;
  handwrittenNote?: {
    line1: string;
    line2?: string;
    rotationClass: string;
    positionClass: string;
    arrowSvg: ReactNode;
  };
  quickBadge?: {
    bg: string;
    text: string;
  };
  acceptedFormats?: string;
  actionText?: string;
  badgeText?: string;
  badgeColor?: string;
  squircleColor?: string;
  isPrimaryAction?: boolean;
  status?: ToolStatus;
  isPublished?: boolean;
  lastModified?: string | Date;
  seoDescription?: string;
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  count: number;
  iconName: string;
}
