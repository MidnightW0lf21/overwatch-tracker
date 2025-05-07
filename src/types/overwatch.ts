
import type React from 'react';

// Runtime version used by components
export interface HeroChallenge {
  id: string;
  title: string;
  icon: React.ElementType; // Actual component for rendering
  level: number;
  xpPerLevel: number;
}

// Storage version (localStorage, initial data configuration)
export interface StoredHeroChallenge {
  id: string;
  title: string;
  iconName: string; // Name of the icon for serialization
  level: number;
  xpPerLevel: number;
}

export interface Hero {
  id: string;
  name: string;
  portraitUrl: string;
  personalGoalXP: number;
  challenges: HeroChallenge[]; // Runtime uses actual components
}

export interface StoredHero {
  id: string;
  name: string;
  portraitUrl: string;
  personalGoalXP: number;
  challenges: StoredHeroChallenge[]; // Storage uses icon names
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
