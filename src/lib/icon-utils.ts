
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
  // Fist, // Fist icon does not exist, removing
  Activity, 
  UserCheck 
} from 'lucide-react';

// Add any new icons here if they are used in initialHeroesData or can be dynamically added
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
  // Fist, // Removing from map
  Activity,
  UserCheck
  // Add other icons used by heroes here, e.g., for Mercy, Reinhardt, Ana, Genji if they have unique ones.
  // For now, the provided initialHeroesData mostly reuses these.
};

const componentToIconNameMap = new Map<React.ElementType, string>();
Object.entries(iconNameMap).forEach(([name, component]) => {
  componentToIconNameMap.set(component, name);
});

export function getIconComponent(iconName: string): React.ElementType {
  const Icon = iconNameMap[iconName];
  if (!Icon) {
    console.warn(`Icon component not found for name: ${iconName}. Falling back to ShieldQuestion.`);
    return ShieldQuestion; // Fallback icon
  }
  return Icon;
}

export function getIconName(iconComponent: React.ElementType): string | undefined {
  return componentToIconNameMap.get(iconComponent);
}

