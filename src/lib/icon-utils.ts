
import type React from 'react';
import {
  Shell,
  Crosshair,
  Skull,
  Shapes,
  HeartPulse,
  Eye,
  Clock,
  Trophy,
  Zap,
  ShieldQuestion,
  Sword,
  Swords,
  Target,
  Shield,
  Medal,
  Gauge,
  Timer,
  Bomb,
  Brain,
  Wand2,
  Activity,
  UserCheck
  // Add other Lucide icons here if needed, but they must be explicitly imported.
} from 'lucide-react';

// This map is for Lucide icons.
export const iconNameMap: Record<string, React.ElementType> = {
  Shell,
  Crosshair,
  Skull,
  Shapes,
  HeartPulse,
  Eye,
  Clock,
  Trophy,
  Zap,
  ShieldQuestion,
  Sword,
  Swords,
  Target,
  Shield,
  Medal,
  Gauge,
  Timer,
  Bomb,
  Brain,
  Wand2,
  Activity,
  UserCheck,
  // Map new icons here:
  // NewIconName: NewIconComponent,
};

const componentToIconNameMap = new Map<React.ElementType, string>();
Object.entries(iconNameMap).forEach(([name, component]) => {
  componentToIconNameMap.set(component, name);
});

// Returns the Lucide component or ShieldQuestion as fallback.
export function getIconComponent(iconName?: string): React.ElementType {
  if (!iconName) return ShieldQuestion; 
  const Icon = iconNameMap[iconName];
  return Icon || ShieldQuestion; 
}

// Returns the string name of a Lucide component, or undefined if not found.
export function getIconName(iconComponent?: React.ElementType): string | undefined {
  if (!iconComponent) {
    return undefined;
  }
  return componentToIconNameMap.get(iconComponent);
}
