
import type { Hero, HeroChallenge, LevelDetails } from '@/types/overwatch';
import { Shell, Crosshair, Skull, Shapes, HeartPulse, Eye, Clock, Trophy, Zap, ShieldQuestion, Sword } from 'lucide-react';

export const XP_PER_HERO_TYPE_BADGE_LEVEL = 200;
export const XP_PER_WIN_TYPE_BADGE_LEVEL = 1200;
export const XP_PER_TIME_TYPE_BADGE_LEVEL = 5600;

// These constants remain for level calculation logic for the hero's overall level
const MAX_EARLY_LEVEL = 20;
const XP_FOR_EACH_EARLY_LEVEL = 5000;
const XP_FOR_EACH_LATE_LEVEL = 60000;

const cumulativeXpToCompleteLevel: number[] = [0]; 
for (let i = 1; i < MAX_EARLY_LEVEL; i++) { 
  cumulativeXpToCompleteLevel[i] = cumulativeXpToCompleteLevel[i-1] + XP_FOR_EACH_EARLY_LEVEL;
}

// Calculates total XP based on hero's badges and their levels
export function calculateTotalXP(heroChallenges: HeroChallenge[]): number {
  return heroChallenges.reduce((total, challenge) => {
    return total + (challenge.level * challenge.xpPerLevel);
  }, 0);
}

// Calculates hero's overall level details based on total XP
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

const soldierBadges: HeroChallenge[] = [
  { id: 's76_damage_dealt', title: 'Damage Dealt', icon: Shell, level: 10, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  { id: 's76_critical_hits', title: 'Critical Hits', icon: Crosshair, level: 5, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  { id: 's76_helix_direct', title: 'Helix Rocket Direct Hits', icon: Skull, level: 3, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  { id: 's76_helix_final_blows', title: 'Helix Rocket Final Blows', icon: Shapes, level: 2, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  { id: 's76_biotic_healing', title: 'Biotic Field Healing', icon: HeartPulse, level: 8, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  { id: 's76_visor_kills', title: 'Tactical Visor Kills', icon: Eye, level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  { id: 's76_time_played', title: 'Time Played', icon: Clock, level: 2, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL }, // Assuming this is a "time played" type badge
  { id: 's76_wins', title: 'Wins', icon: Trophy, level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL }, // Assuming this is a "win" type badge
];

export const initialHeroesData: Hero[] = [
  { 
    id: 'soldier76', 
    name: 'Soldier: 76', 
    portraitUrl: 'https://picsum.photos/seed/soldier/100/100', 
    personalGoalXP: 200000,
    challenges: soldierBadges,
  },
  { 
    id: 'tracer', 
    name: 'Tracer', 
    portraitUrl: 'https://picsum.photos/seed/tracer/100/100', 
    personalGoalXP: 150000,
    challenges: [
      { id: 'tracer_pulse_kills', title: 'Pulse Bomb Kills', icon: Zap, level: 3, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'tracer_recall_healed', title: 'Health Recalled', icon: HeartPulse, level: 5, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'tracer_wins', title: 'Wins', icon: Trophy, level: 2, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'mercy', 
    name: 'Mercy', 
    portraitUrl: 'https://picsum.photos/seed/mercy/100/100', 
    personalGoalXP: 250000,
    challenges: [
        { id: 'mercy_healing_done', title: 'Healing Done', icon: HeartPulse, level: 15, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'mercy_rez', title: 'Resurrections', icon: Zap, level: 10, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'mercy_wins', title: 'Wins', icon: Trophy, level: 5, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'reinhardt', 
    name: 'Reinhardt', 
    portraitUrl: 'https://picsum.photos/seed/reinhardt/100/100', 
    personalGoalXP: 180000,
    challenges: [
      { id: 'rein_shatter_stuns', title: 'Earthshatter Stuns', icon: ShieldQuestion, level: 7, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'rein_charge_pins', title: 'Charge Pins', icon: Zap, level: 4, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'rein_damage_blocked', title: 'Damage Blocked', icon: ShieldQuestion, level: 10, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'rein_wins', title: 'Wins', icon: Trophy, level: 3, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'ana', 
    name: 'Ana', 
    portraitUrl: 'https://picsum.photos/seed/ana/100/100', 
    personalGoalXP: 220000,
    challenges: [
        { id: 'ana_sleep_darts', title: 'Sleep Darts Hit', icon: Zap, level: 8, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'ana_biotic_grenade_assists', title: 'Biotic Grenade Assists', icon: HeartPulse, level: 6, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'ana_nano_boosts', title: 'Nano Boosts Applied', icon: Shapes, level: 4, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'ana_wins', title: 'Wins', icon: Trophy, level: 4, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'genji', 
    name: 'Genji', 
    portraitUrl: 'https://picsum.photos/seed/genji/100/100', 
    personalGoalXP: 190000,
    challenges: [
       { id: 'genji_blade_kills', title: 'Dragonblade Kills', icon: Sword, level: 5, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
       { id: 'genji_deflect_damage', title: 'Damage Deflected', icon: ShieldQuestion, level: 7, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
       { id: 'genji_wins', title: 'Wins', icon: Trophy, level: 3, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
];
