
import type { Hero, HeroChallenge, LevelDetails, StoredHero, StoredHeroChallenge } from '@/types/overwatch';
import { getIconComponent, getIconName } from './icon-utils';
// Lucide icons are imported in icon-utils.ts and mapped there. Direct imports here are not strictly necessary
// unless used for default values or other direct instantiations not covered by the map.
// For safety and clarity, specific icons can be imported if needed, but the map in icon-utils.ts is the primary source.


export const XP_PER_HERO_TYPE_BADGE_LEVEL = 200;
export const XP_PER_WIN_TYPE_BADGE_LEVEL = 1200;
export const XP_PER_TIME_TYPE_BADGE_LEVEL = 5600;

const MAX_EARLY_LEVEL = 20;
const XP_FOR_EACH_EARLY_LEVEL = 5000;
const XP_FOR_EACH_LATE_LEVEL = 60000;

const cumulativeXpToCompleteLevel: number[] = [0]; 
for (let i = 1; i < MAX_EARLY_LEVEL; i++) { 
  cumulativeXpToCompleteLevel[i] = cumulativeXpToCompleteLevel[i-1] + XP_FOR_EACH_EARLY_LEVEL;
}

export function calculateTotalXP(heroChallenges: HeroChallenge[]): number {
  return heroChallenges.reduce((total, challenge) => {
    return total + (challenge.level * challenge.xpPerLevel);
  }, 0);
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

// initialHeroesData now uses StoredHero[] with iconName
export const initialHeroesData: StoredHero[] = [
  { 
    id: 'soldier76', 
    name: 'Soldier: 76', 
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/2b/Icon-Soldier_76.png', 
    personalGoalXP: 200000,
    challenges: [
      { id: 's76_damage_dealt', title: 'Damage Dealt', iconName: 'Shell', level: 10, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_critical_hits', title: 'Critical Hits', iconName: 'Crosshair', level: 5, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_helix_direct', title: 'Helix Rocket Direct Hits', iconName: 'Skull', level: 3, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_helix_final_blows', title: 'Helix Rocket Final Blows', iconName: 'Shapes', level: 2, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_biotic_healing', title: 'Biotic Field Healing', iconName: 'HeartPulse', level: 8, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_visor_kills', title: 'Tactical Visor Kills', iconName: 'Eye', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_time_played', title: 'Time Played', iconName: 'Clock', level: 2, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
      { id: 's76_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'tracer', 
    name: 'Tracer', 
    portraitUrl: 'https://picsum.photos/seed/tracer/100/100', 
    personalGoalXP: 150000,
    challenges: [
      { id: 'tracer_pulse_kills', title: 'Pulse Bomb Kills', iconName: 'Zap', level: 3, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'tracer_recall_healed', title: 'Health Recalled', iconName: 'HeartPulse', level: 5, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'tracer_time_played', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
      { id: 'tracer_wins', title: 'Wins', iconName: 'Trophy', level: 2, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'mercy', 
    name: 'Mercy', 
    portraitUrl: 'https://picsum.photos/seed/mercy/100/100', 
    personalGoalXP: 250000,
    challenges: [
        { id: 'mercy_healing_done', title: 'Healing Done', iconName: 'HeartPulse', level: 15, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'mercy_rez', title: 'Resurrections', iconName: 'Zap', level: 10, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'mercy_wins', title: 'Wins', iconName: 'Trophy', level: 5, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'reinhardt', 
    name: 'Reinhardt', 
    portraitUrl: 'https://picsum.photos/seed/reinhardt/100/100', 
    personalGoalXP: 180000,
    challenges: [
      { id: 'rein_shatter_stuns', title: 'Earthshatter Stuns', iconName: 'ShieldQuestion', level: 7, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'rein_charge_pins', title: 'Charge Pins', iconName: 'Zap', level: 4, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'rein_damage_blocked', title: 'Damage Blocked', iconName: 'ShieldQuestion', level: 10, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'rein_wins', title: 'Wins', iconName: 'Trophy', level: 3, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'ana', 
    name: 'Ana', 
    portraitUrl: 'https://picsum.photos/seed/ana/100/100', 
    personalGoalXP: 220000,
    challenges: [
        { id: 'ana_sleep_darts', title: 'Sleep Darts Hit', iconName: 'Zap', level: 8, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'ana_biotic_grenade_assists', title: 'Biotic Grenade Assists', iconName: 'HeartPulse', level: 6, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'ana_nano_boosts', title: 'Nano Boosts Applied', iconName: 'Shapes', level: 4, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'ana_wins', title: 'Wins', iconName: 'Trophy', level: 4, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'genji', 
    name: 'Genji', 
    portraitUrl: 'https://picsum.photos/seed/genji/100/100', 
    personalGoalXP: 190000,
    challenges: [
       { id: 'genji_blade_kills', title: 'Dragonblade Kills', iconName: 'Sword', level: 5, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
       { id: 'genji_deflect_damage', title: 'Damage Deflected', iconName: 'ShieldQuestion', level: 7, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
       { id: 'genji_wins', title: 'Wins', iconName: 'Trophy', level: 3, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
];

// Helper to convert StoredHero[] to Hero[] (hydrating icons)
export function hydrateHeroes(storedHeroes: StoredHero[]): Hero[] {
  return storedHeroes.map(sh => ({
    ...sh,
    challenges: sh.challenges.map((sc: StoredHeroChallenge) => ({
      ...sc,
      icon: getIconComponent(sc.iconName),
    })),
  }));
}

// Helper to convert Hero[] to StoredHero[] (dehydrating icons for storage)
export function dehydrateHeroes(heroes: Hero[]): StoredHero[] {
  return heroes.map(h => ({
    ...h,
    challenges: h.challenges.map((c: HeroChallenge) => {
      const iconName = getIconName(c.icon);
      if (!iconName) {
        console.warn(`Could not find icon name for component in challenge: ${c.title}. Using default 'ShieldQuestion'.`);
      }
      // Create a new object that matches StoredHeroChallenge structure
      const { icon, ...challengeWithoutIcon } = c;
      return {
        ...challengeWithoutIcon,
        iconName: iconName || 'ShieldQuestion', // Fallback icon name
      };
    }),
  }));
}
