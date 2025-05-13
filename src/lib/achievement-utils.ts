
import type { Achievement, HeroCalculated, LevelDetails } from '@/types/achievements';
import { Medal, Star, Clock, Zap, Trophy, Shield, Swords, Users, TrendingUp, Award } from 'lucide-react';
import { calculateXpToReachLevel, XP_PER_TIME_TYPE_BADGE_LEVEL } from '@/lib/overwatch-utils';
import { getBadgeDefinition } from '@/lib/badge-definitions';


export const achievementsList: Achievement[] = [
  // Global Level Milestones
  {
    id: 'global_level_10',
    title: 'Global Level 10',
    description: 'Reach Global Level 10 across all heroes.',
    icon: Medal,
    category: 'Global',
    isUnlocked: (_, globalLevelDetails) => (globalLevelDetails?.level ?? 0) >= 10,
  },
  {
    id: 'global_level_50',
    title: 'Global Level 50',
    description: 'Reach Global Level 50 across all heroes.',
    icon: Medal,
    category: 'Global',
    isUnlocked: (_, globalLevelDetails) => (globalLevelDetails?.level ?? 0) >= 50,
  },
  {
    id: 'global_level_100',
    title: 'Global Level 100',
    description: 'Reach Global Level 100 across all heroes.',
    icon: Trophy,
    category: 'Global',
    isUnlocked: (_, globalLevelDetails) => (globalLevelDetails?.level ?? 0) >= 100,
  },
  {
    id: 'global_level_250',
    title: 'Global Level 250',
    description: 'Reach Global Level 250 across all heroes.',
    icon: Trophy,
    category: 'Global',
    isUnlocked: (_, globalLevelDetails) => (globalLevelDetails?.level ?? 0) >= 250,
  },
  {
    id: 'global_level_500',
    title: 'Global Level 500',
    description: 'Reach Global Level 500 across all heroes. True Dedication!',
    icon: Award,
    category: 'Global',
    isUnlocked: (_, globalLevelDetails) => (globalLevelDetails?.level ?? 0) >= 500,
  },

  // Time Played Milestones
  {
    id: 'time_played_10_hours',
    title: 'Time Tracker: 10 Hours',
    description: 'Accrue 10 hours of playtime based on Time Played badges.',
    icon: Clock,
    category: 'Time',
    isUnlocked: (_, __, totalTimePlayedMinutes) => (totalTimePlayedMinutes ?? 0) >= 10 * 60,
  },
  {
    id: 'time_played_50_hours',
    title: 'Time Tracker: 50 Hours',
    description: 'Accrue 50 hours of playtime based on Time Played badges.',
    icon: Clock,
    category: 'Time',
    isUnlocked: (_, __, totalTimePlayedMinutes) => (totalTimePlayedMinutes ?? 0) >= 50 * 60,
  },
  {
    id: 'time_played_100_hours',
    title: 'Time Tracker: 100 Hours',
    description: 'Accrue 100 hours of playtime based on Time Played badges. Seasoned Veteran!',
    icon: Clock,
    category: 'Time',
    isUnlocked: (_, __, totalTimePlayedMinutes) => (totalTimePlayedMinutes ?? 0) >= 100 * 60,
  },
  {
    id: 'time_played_500_hours',
    title: 'Time Tracker: 500 Hours',
    description: 'Accrue 500 hours of playtime. Truly a Hero of Overwatch!',
    icon: Clock,
    category: 'Time',
    isUnlocked: (_, __, totalTimePlayedMinutes) => (totalTimePlayedMinutes ?? 0) >= 500 * 60,
  },
  
  // Hero Specific Milestones
  {
    id: 'hero_level_50',
    title: 'Hero Level 50',
    description: 'Reach Level 50 with any hero.',
    icon: Star,
    category: 'Hero Specific',
    isUnlocked: (heroes) => heroes.some(hero => hero.level >= 50),
  },
  {
    id: 'hero_level_100',
    title: 'Hero Level 100',
    description: 'Reach Level 100 with any hero.',
    icon: Star,
    category: 'Hero Specific',
    isUnlocked: (heroes) => heroes.some(hero => hero.level >= 100),
  },
  {
    id: 'hero_level_250',
    title: 'Hero Level 250',
    description: 'Reach Level 250 with any hero. Mastery Achieved!',
    icon: Star,
    category: 'Hero Specific',
    isUnlocked: (heroes) => heroes.some(hero => hero.level >= 250),
  },
  {
    id: 'hero_max_level',
    title: 'Hero Max Level',
    description: 'Reach Max Level (500) with any hero.',
    icon: Award,
    category: 'Hero Specific',
    isUnlocked: (heroes) => heroes.some(hero => hero.level >= 500),
  },
   {
    id: 'five_heroes_level_50',
    title: 'Versatile Veteran',
    description: 'Reach Level 50 with at least 5 different heroes.',
    icon: Users,
    category: 'Hero Specific',
    isUnlocked: (heroes) => heroes.filter(hero => hero.level >= 50).length >= 5,
  },
   {
    id: 'all_heroes_level_10',
    title: 'Jack of All Trades',
    description: 'Reach Level 10 with all available heroes.',
    icon: TrendingUp,
    category: 'Hero Specific',
    isUnlocked: (heroes) => heroes.length > 0 && heroes.every(hero => hero.level >= 10),
  },

  // Completion Milestones
  {
    id: 'all_heroes_max_level',
    title: 'Grand Master Tracker',
    description: 'Reach Max Level (500) with ALL heroes. Legendary!',
    icon: Swords, // Using Swords for a more epic feel
    category: 'Completion',
    isUnlocked: (heroes) => heroes.length > 0 && heroes.every(hero => hero.level >= 500),
  },
  {
    id: 'one_million_global_xp',
    title: 'XP Millionaire',
    description: 'Accumulate 1,000,000 Global XP.',
    icon: Zap,
    category: 'Global',
    isUnlocked: (_, globalLevelDetails) => {
        if (!globalLevelDetails) return false;
        // Total XP for global level 500 is the XP to reach level 501.
        const xpForGlobal500 = calculateXpToReachLevel(500 + 1); 
        // This achievement is for earning 1M XP BEYOND what's needed for Global Level 500.
        // Or just 1M total if that's more intuitive. Let's go with 1M total.
        return globalLevelDetails.totalXp >= 1000000;
    },
  },
  {
    id: 'all_badges_one_hero_max',
    title: 'Badge Collector',
    description: 'Max out all badges for a single hero (assuming a reasonable max badge level, e.g., 100 for this achievement).',
    icon: Shield,
    category: 'Completion',
    isUnlocked: (heroes) => {
      const MAX_BADGE_LEVEL_FOR_ACHIEVEMENT = 100; // Define a "max" for this achievement
      return heroes.some(hero => 
        hero.challenges.length > 0 && // Hero must have badges
        hero.challenges.every(challenge => challenge.level >= MAX_BADGE_LEVEL_FOR_ACHIEVEMENT)
      );
    },
  },
];

export function calculateTotalTimePlayedMinutes(heroes: HeroCalculated[]): number {
  let totalMinutes = 0;
  heroes.forEach(hero => {
    hero.challenges.forEach(challenge => {
      const badgeDef = getBadgeDefinition(challenge.badgeId);
      if (badgeDef && badgeDef.xpPerLevel === XP_PER_TIME_TYPE_BADGE_LEVEL && challenge.level > 1) {
        totalMinutes += (challenge.level - 1) * 20; // 20 minutes per level for time badges
      }
    });
  });
  return totalMinutes;
}
