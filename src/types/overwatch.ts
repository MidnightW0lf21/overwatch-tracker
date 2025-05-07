
import type React from 'react';

export interface HeroChallenge {
  id: string;
  title: string;
  icon: React.ElementType; // Expecting a Lucide icon component
  level: number; // User-editable level for this specific badge
  xpPerLevel: number; // XP awarded for each level of this badge
}

export interface Hero {
  id: string;
  name: string;
  portraitUrl: string;
  personalGoalXP: number;
  challenges: HeroChallenge[]; // Renamed from 'challenges?' to 'challenges' assuming all heroes have them
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
