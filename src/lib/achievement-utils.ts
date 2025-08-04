
import type { Achievement, HeroCalculated, LevelDetails } from '@/types/achievements';
import { Medal, Star, Clock, Zap, Trophy, Shield, Swords, Users, TrendingUp, Award } from 'lucide-react';
import { getBadgeDefinition, XP_PER_TIME_TYPE_BADGE_LEVEL } from '@/lib/badge-definitions';


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
    id: 'global_level_100',
    title: 'Global Level 100',
    description: 'Reach Global Level 100 across all heroes.',
    icon: Medal,
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
    id: 'global_level_750',
    title: 'Global Level 750',
    description: 'Reach Global Level 750 across all heroes.',
    icon: Trophy,
    category: 'Global',
    isUnlocked: (_, globalLevelDetails) => (globalLevelDetails?.level ?? 0) >= 750,
  },
  {
    id: 'global_level_2500',
    title: 'Global Level 2500',
    description: 'Reach Global Level 2500 across all heroes. True Dedication!',
    icon: Award,
    category: 'Global',
    isUnlocked: (_, globalLevelDetails) => (globalLevelDetails?.level ?? 0) >= 2500,
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
    id: 'time_played_250_hours',
    title: 'Time Tracker: 250 Hours',
    description: 'Accrue 250 hours of playtime based on Time Played badges.',
    icon: Clock,
    category: 'Time',
    isUnlocked: (_, __, totalTimePlayedMinutes) => (totalTimePlayedMinutes ?? 0) >= 250 * 60,
  },
  {
    id: 'time_played_1000_hours',
    title: 'Time Tracker: 1000 Hours',
    description: 'Accrue 1000 hours of playtime based on Time Played badges. Seasoned Veteran!',
    icon: Clock,
    category: 'Time',
    isUnlocked: (_, __, totalTimePlayedMinutes) => (totalTimePlayedMinutes ?? 0) >= 1000 * 60,
  },
  {
    id: 'time_played_5000_hours',
    title: 'Time Tracker: 5000 Hours',
    description: 'Accrue 5000 hours of playtime. Truly a Hero of Overwatch!',
    icon: Clock,
    category: 'Time',
    isUnlocked: (_, __, totalTimePlayedMinutes) => (totalTimePlayedMinutes ?? 0) >= 5000 * 60,
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
    description: 'Reach Level 250 with any hero.',
    icon: Star,
    category: 'Hero Specific',
    isUnlocked: (heroes) => heroes.some(hero => hero.level >= 250),
  },
  {
    id: 'hero_max_level',
    title: 'Hero Max Level',
    description: 'Reach Max Level 500 with any hero. Mastery Achieved!',
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
    id: 'all_heroes_level_100',
    title: 'Jack of All Trades',
    description: 'Reach Level 100 with all available heroes.',
    icon: TrendingUp,
    category: 'Hero Specific',
    isUnlocked: (heroes) => heroes.length > 0 && heroes.every(hero => hero.level >= 100),
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
        return globalLevelDetails.totalXp >= 1000000;
    },
  },
  {
    id: 'all_badges_one_hero_max',
    title: 'Badge Collector',
    description: 'Max out all badges for a single hero (acquire level 2500 for each badge).',
    icon: Shield,
    category: 'Completion',
    isUnlocked: (heroes) => {
      const MAX_BADGE_LEVEL_FOR_ACHIEVEMENT = 2500; // Define a "max" for this achievement
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
