
import type React from 'react';

export interface HeroChallenge {
  id: string;
  title: string;
  icon: React.ElementType; // Expecting a Lucide icon component
  level: number;
  currentValue: number;
  targetValue: number;
  unit?: string; // e.g., "MIN" for time, or empty for counts
}

export interface Hero {
  id: string;
  name: string;
  portraitUrl: string;
  heroSubBadges: number;
  winSubBadges: number;
  timePlayedSubBadges: number;
  personalGoalXP: number;
  challenges?: HeroChallenge[];
}

export interface LevelDetails {
  level: number;
  xpTowardsNextLevel: number; // XP earned within the current level bar
  xpNeededForNextLevel: number; // Total XP for the current level bar (i.e. 5000 or 60000)
  currentLevelBaseXp: number; // Cumulative XP at the start of this level
  nextLevelBaseXp: number; // Cumulative XP to reach the next level (complete current)
  totalXp: number;
}

export interface HeroCalculated extends Hero, LevelDetails {}
