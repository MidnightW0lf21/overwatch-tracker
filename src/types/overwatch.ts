
import type React from 'react';
// BadgeDefinition is no longer directly imported here, as HeroChallenge will get its properties from badge-definitions.ts via badgeId

export interface StoredHeroChallenge {
  id: string; // Unique ID for this specific badge instance on a hero
  badgeId: string; // ID referencing the badge definition
  level: number;
}

export interface HeroChallenge {
  id: string; // Unique ID for the challenge instance
  badgeId: string; // ID referencing the badge definition
  title: string; // Title of the HeroChallenge, fetched from BadgeDefinition
  icon: React.ElementType; // Actual Lucide component for rendering (fetched from BadgeDefinition)
  level: number;
  xpPerLevel: number; // XP/Level, fetched from BadgeDefinition
}

export interface Hero {
  id: string;
  name: string;
  portraitUrl: string;
  personalGoalLevel: number;
  challenges: HeroChallenge[];
}

export interface StoredHero {
  id: string;
  name: string;
  portraitUrl: string;
  personalGoalLevel: number;
  challenges: StoredHeroChallenge[];
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
