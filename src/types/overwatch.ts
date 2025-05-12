
import type React from 'react';

// Stored version (localStorage, initial data configuration, form data)
export interface StoredHeroChallenge {
  id: string; // Unique ID for this specific badge instance on a hero
  title: string;
  iconName: string; // Name of the Lucide icon
  xpPerLevel: number;
  level: number;
}

// Runtime version used by components that render badges
export interface HeroChallenge {
  id: string;
  title: string;
  icon?: React.ElementType; // Actual Lucide component for rendering
  level: number;
  xpPerLevel: number;
}

export interface Hero {
  id: string;
  name: string;
  portraitUrl: string;
  personalGoalLevel: number;
  challenges: HeroChallenge[]; // Runtime uses actual components
}

export interface StoredHero {
  id: string;
  name: string;
  portraitUrl: string;
  personalGoalLevel: number;
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
