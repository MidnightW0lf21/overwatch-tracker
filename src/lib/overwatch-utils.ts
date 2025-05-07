
import type { Hero, HeroChallenge, LevelDetails } from '@/types/overwatch';
import { Shell, Crosshair, Skull, Shapes, HeartPulse, Eye, Clock, Trophy, Zap, ShieldQuestion, Sword } from 'lucide-react';

export const XP_PER_HERO_SUB_BADGE = 200;
export const XP_PER_WIN_SUB_BADGE = 1200;
export const XP_PER_TIME_PLAYED_SUB_BADGE = 5600;

const MAX_EARLY_LEVEL = 20; // Levels 1 through 19 are early, level 20 starts the late progression.
const XP_FOR_EACH_EARLY_LEVEL = 5000; // XP needed to pass one early level.
const XP_FOR_EACH_LATE_LEVEL = 60000; // XP needed to pass one late level (L20+).

const cumulativeXpToCompleteLevel: number[] = [0]; 
for (let i = 1; i < MAX_EARLY_LEVEL; i++) { 
  cumulativeXpToCompleteLevel[i] = cumulativeXpToCompleteLevel[i-1] + XP_FOR_EACH_EARLY_LEVEL;
}

export function calculateTotalXP(hero: Pick<Hero, 'heroSubBadges' | 'winSubBadges' | 'timePlayedSubBadges'>): number {
  return (
    hero.heroSubBadges * XP_PER_HERO_SUB_BADGE +
    hero.winSubBadges * XP_PER_WIN_SUB_BADGE +
    hero.timePlayedSubBadges * XP_PER_TIME_PLAYED_SUB_BADGE
  );
}

export function calculateLevelDetails(totalXp: number): Omit<LevelDetails, 'totalXp'> {
  let level = 1;
  let xpAtLevelStart = 0; 
  let xpForThisLevel = XP_FOR_EACH_EARLY_LEVEL; 

  if (totalXp < cumulativeXpToCompleteLevel[MAX_EARLY_LEVEL - 1]) { 
    for (let i = 1; i < MAX_EARLY_LEVEL; i++) { 
      if (totalXp < cumulativeXpToCompleteLevel[i]) {
        level = i; 
        xpAtLevelStart = cumulativeXpToCompleteLevel[i-1]; 
        xpForThisLevel = XP_FOR_EACH_EARLY_LEVEL;
        break;
      }
    }
  } else { 
    level = MAX_EARLY_LEVEL; 
    xpAtLevelStart = cumulativeXpToCompleteLevel[MAX_EARLY_LEVEL - 1]; 
    
    const xpIntoLateLevels = totalXp - xpAtLevelStart; 
    const lateLevelsGained = Math.floor(xpIntoLateLevels / XP_FOR_EACH_LATE_LEVEL);
    
    level += lateLevelsGained;
    xpAtLevelStart += lateLevelsGained * XP_FOR_EACH_LATE_LEVEL;
    xpForThisLevel = XP_FOR_EACH_LATE_LEVEL;
  }

  const xpTowardsNextLevel = totalXp - xpAtLevelStart;
  const nextLevelBaseXp = xpAtLevelStart + xpForThisLevel; 

  return {
    level,
    xpTowardsNextLevel,
    xpNeededForNextLevel: xpForThisLevel,
    currentLevelBaseXp: xpAtLevelStart,
    nextLevelBaseXp,
  };
}

const soldierChallenges: HeroChallenge[] = [
  { id: 's76_damage_dealt', title: 'Damage Dealt', icon: Shell, level: 110, currentValue: 5565, targetValue: 19000 },
  { id: 's76_critical_hits', title: 'Critical Hits', icon: Crosshair, level: 101, currentValue: 15, targetValue: 85 },
  { id: 's76_helix_direct', title: 'Helix Rocket Direct Hits', icon: Skull, level: 98, currentValue: 13, targetValue: 25 },
  { id: 's76_helix_final_blows', title: 'Helix Rocket Final Blows', icon: Shapes, level: 97, currentValue: 8, targetValue: 10 },
  { id: 's76_biotic_healing', title: 'Biotic Field Healing', icon: HeartPulse, level: 120, currentValue: 1381, targetValue: 2800 },
  { id: 's76_visor_kills', title: 'Tactical Visor Kills', icon: Eye, level: 90, currentValue: 1, targetValue: 8 },
  { id: 's76_time_played', title: 'Time Played', icon: Clock, level: 109, currentValue: 16, targetValue: 20, unit: 'MIN' },
  { id: 's76_wins', title: 'Wins', icon: Trophy, level: 130, currentValue: 0, targetValue: 1 },
];

export const initialHeroesData: Hero[] = [
  { 
    id: 'soldier76', 
    name: 'Soldier: 76', 
    portraitUrl: 'https://picsum.photos/seed/soldier/100/100', 
    heroSubBadges: 5, 
    winSubBadges: 10, 
    timePlayedSubBadges: 2, 
    personalGoalXP: 200000,
    challenges: soldierChallenges,
  },
  { 
    id: 'tracer', 
    name: 'Tracer', 
    portraitUrl: 'https://picsum.photos/seed/tracer/100/100', 
    heroSubBadges: 2, 
    winSubBadges: 5, 
    timePlayedSubBadges: 1, 
    personalGoalXP: 150000,
    challenges: [
      { id: 'tracer_pulse_kills', title: 'Pulse Bomb Kills', icon: Zap, level: 15, currentValue: 3, targetValue: 10 },
      { id: 'tracer_recall_healed', title: 'Health Recalled', icon: HeartPulse, level: 22, currentValue: 1200, targetValue: 5000 },
    ],
  },
  { 
    id: 'mercy', 
    name: 'Mercy', 
    portraitUrl: 'https://picsum.photos/seed/mercy/100/100', 
    heroSubBadges: 10, 
    winSubBadges: 20, 
    timePlayedSubBadges: 3, 
    personalGoalXP: 250000,
    challenges: [], // Example of hero with no specific challenges initially
  },
  { 
    id: 'reinhardt', 
    name: 'Reinhardt', 
    portraitUrl: 'https://picsum.photos/seed/reinhardt/100/100', 
    heroSubBadges: 3, 
    winSubBadges: 8, 
    timePlayedSubBadges: 1, 
    personalGoalXP: 180000,
    challenges: [
      { id: 'rein_shatter_stuns', title: 'Earthshatter Stuns', icon: ShieldQuestion, level: 40, currentValue: 25, targetValue: 50 },
      { id: 'rein_charge_pins', title: 'Charge Pins', icon: Zap, level: 33, currentValue: 10, targetValue: 30 },
    ],
  },
  { 
    id: 'ana', 
    name: 'Ana', 
    portraitUrl: 'https://picsum.photos/seed/ana/100/100', 
    heroSubBadges: 12, 
    winSubBadges: 15, 
    timePlayedSubBadges: 2, 
    personalGoalXP: 220000,
    challenges: [],
  },
  { 
    id: 'genji', 
    name: 'Genji', 
    portraitUrl: 'https://picsum.photos/seed/genji/100/100', 
    heroSubBadges: 7, 
    winSubBadges: 12, 
    timePlayedSubBadges: 1, 
    personalGoalXP: 190000,
    challenges: [
       { id: 'genji_blade_kills', title: 'Dragonblade Kills', icon: Sword, level: 50, currentValue: 12, targetValue: 25 },
    ],
  },
];
