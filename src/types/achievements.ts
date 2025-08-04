
import type React from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isUnlocked: (heroes: HeroCalculated[], globalLevelDetails?: LevelDetails, totalTimePlayedMinutes?: number) => boolean; // Function to check if unlocked
  xpReward?: number; // Optional XP reward for unlocking
  category: 'Global' | 'Time' | 'Hero Specific' | 'Completion';
}

// These types are duplicated from overwatch.ts to avoid circular dependencies if achievement-utils needs them.
// Consider a shared types file if this becomes an issue.
export interface StoredHeroChallenge {
  id: string;
  badgeId: string;
  level: number;
}

export interface HeroChallenge {
  id: string;
  badgeId: string;
  title: string;
  icon: React.ElementType;
  level: number;
  xpPerLevel: number;
}

export interface Hero {
  id: string;
  name: string;
  portraitUrl: string;
  personalGoalLevel: number;
  challenges: HeroChallenge[];
  isPinned?: boolean;
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
