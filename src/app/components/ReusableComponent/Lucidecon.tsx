import * as LucideIcons from "lucide-react";
import { type LucideIcon } from "lucide-react";

export function getLucideIcon(iconName: string | undefined) : LucideIcon {
  const Icon = LucideIcons[iconName as keyof typeof LucideIcons];
  if (Icon){
    return Icon as LucideIcon;
  }
  return LucideIcons.Ellipsis; // fallback icon
}