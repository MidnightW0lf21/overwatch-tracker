
import type React from 'react';

// Runtime version used by components
export interface HeroChallenge {
  id: string;
  title: string;
  icon?: React.ElementType; // Actual Lucide component for rendering (optional)
  customIconSvg?: string; // Custom SVG string (optional)
  level: number;
  xpPerLevel: number;
}

// Storage version (localStorage, initial data configuration)
export interface StoredHeroChallenge {
  id: string;
  title: string;
  iconName: string; // Name of the Lucide icon, or a special value like '_customSvg'
  customIconSvg?: string; // SVG string, present if iconName indicates a custom SVG
  level: number;
  xpPerLevel: number;
}

export interface Hero {
  id: string;
  name: string;
  portraitUrl: string;
  personalGoalLevel: number; // Changed from personalGoalXP
  challenges: HeroChallenge[]; // Runtime uses actual components or SVG strings
}

export interface StoredHero {
  id: string;
  name: string;
  portraitUrl: string;
  personalGoalLevel: number; // Changed from personalGoalXP
  challenges: StoredHeroChallenge[]; // Storage uses icon names or custom SVG indicators
}

export interface LevelDetails {
  level: number;
  xpTowardsNextLevel: number;
  xpNeededForNextLevel: number;
  currentLevelBaseXp: number;
  nextLevelBaseXp: number;
  totalXp: number;
}

export interface HeroCalculated extends Hero, LevelDetails {}

