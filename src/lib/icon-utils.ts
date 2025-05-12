
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
  UserCheck
};

const componentToIconNameMap = new Map<React.ElementType, string>();
Object.entries(iconNameMap).forEach(([name, component]) => {
  componentToIconNameMap.set(component, name);
});

export function getIconComponent(iconName?: string): React.ElementType {
  if (!iconName) return ShieldQuestion; // Fallback for undefined iconName
  const Icon = iconNameMap[iconName];
  if (!Icon) {
    // console.warn(`Lucide icon component not found for name: ${iconName}. Falling back to ShieldQuestion.`);
    return ShieldQuestion; // Fallback Lucide icon
  }
  return Icon;
}

export function getIconName(iconComponent?: React.ElementType): string | undefined {
  if (!iconComponent) {
    return undefined;
  }
  return componentToIconNameMap.get(iconComponent);
}
