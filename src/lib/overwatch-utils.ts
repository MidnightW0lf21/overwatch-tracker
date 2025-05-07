
import type { Hero, HeroChallenge, LevelDetails, StoredHero, StoredHeroChallenge } from '@/types/overwatch';
import { getIconComponent, getIconName } from './icon-utils';

export const XP_PER_HERO_TYPE_BADGE_LEVEL = 200;
export const XP_PER_WIN_TYPE_BADGE_LEVEL = 1200;
export const XP_PER_TIME_TYPE_BADGE_LEVEL = 5600;

// New level progression data based on the provided table
interface LevelTier {
  level: number;
  totalXpToReachThisLevel: number; // Cumulative XP required to START this level
  xpToNextLevel: number;           // XP needed to advance from this level to the next
}

const levelProgressionTiers: LevelTier[] = [
  { level: 1, totalXpToReachThisLevel: 0, xpToNextLevel: 2000 },
  { level: 2, totalXpToReachThisLevel: 2000, xpToNextLevel: 4000 },
  { level: 3, totalXpToReachThisLevel: 6000, xpToNextLevel: 8000 },
  { level: 4, totalXpToReachThisLevel: 14000, xpToNextLevel: 12000 },
  { level: 5, totalXpToReachThisLevel: 26000, xpToNextLevel: 12000 },
  { level: 6, totalXpToReachThisLevel: 38000, xpToNextLevel: 12000 },
  { level: 7, totalXpToReachThisLevel: 50000, xpToNextLevel: 16000 },
  { level: 8, totalXpToReachThisLevel: 66000, xpToNextLevel: 16000 },
  { level: 9, totalXpToReachThisLevel: 82000, xpToNextLevel: 16000 },
  { level: 10, totalXpToReachThisLevel: 98000, xpToNextLevel: 20000 },
  { level: 11, totalXpToReachThisLevel: 118000, xpToNextLevel: 24000 },
  { level: 12, totalXpToReachThisLevel: 142000, xpToNextLevel: 28000 },
  { level: 13, totalXpToReachThisLevel: 170000, xpToNextLevel: 32000 },
  { level: 14, totalXpToReachThisLevel: 202000, xpToNextLevel: 36000 },
  { level: 15, totalXpToReachThisLevel: 238000, xpToNextLevel: 40000 },
  { level: 16, totalXpToReachThisLevel: 278000, xpToNextLevel: 44000 },
  { level: 17, totalXpToReachThisLevel: 322000, xpToNextLevel: 48000 },
  { level: 18, totalXpToReachThisLevel: 370000, xpToNextLevel: 52000 },
  { level: 19, totalXpToReachThisLevel: 422000, xpToNextLevel: 56000 },
  { level: 20, totalXpToReachThisLevel: 478000, xpToNextLevel: 60000 },
  { level: 21, totalXpToReachThisLevel: 538000, xpToNextLevel: 60000 },
  { level: 22, totalXpToReachThisLevel: 598000, xpToNextLevel: 60000 },
  { level: 23, totalXpToReachThisLevel: 658000, xpToNextLevel: 60000 },
  { level: 24, totalXpToReachThisLevel: 718000, xpToNextLevel: 60000 },
  { level: 25, totalXpToReachThisLevel: 778000, xpToNextLevel: 60000 },
];

const XP_PER_LEVEL_AFTER_TABLE = 60000; // For levels beyond L25

export function calculateTotalXP(heroChallenges: StoredHeroChallenge[]): number {
  return heroChallenges.reduce((total, challenge) => {
    // Badge level 0 contributes 0 XP. Only levels > 0 count.
    if (challenge.level > 0) {
      return total + (challenge.level * challenge.xpPerLevel);
    }
    return total;
  }, 0);
}


export function calculateLevelDetails(totalXp: number): Omit<LevelDetails, 'totalXp'> {
  for (let i = 0; i < levelProgressionTiers.length; i++) {
    const currentTier = levelProgressionTiers[i];
    const xpAtStartOfThisTier = currentTier.totalXpToReachThisLevel;
    const xpNeededForThisTier = currentTier.xpToNextLevel;
    const xpAtStartOfNextTier = xpAtStartOfThisTier + xpNeededForThisTier;

    if (totalXp < xpAtStartOfNextTier) {
      return {
        level: currentTier.level,
        xpTowardsNextLevel: totalXp - xpAtStartOfThisTier,
        xpNeededForNextLevel: xpNeededForThisTier,
        currentLevelBaseXp: xpAtStartOfThisTier,
        nextLevelBaseXp: xpAtStartOfNextTier,
      };
    }
  }

  // If totalXp is beyond the defined table (i.e., >= start of Level 26)
  const maxTableLevelEntry = levelProgressionTiers[levelProgressionTiers.length - 1]; // Level 25 entry
  const xpAtStartOfMaxTableLevelPlus1 = maxTableLevelEntry.totalXpToReachThisLevel + maxTableLevelEntry.xpToNextLevel; // XP to start Level 26

  const xpOverMaxTable = totalXp - xpAtStartOfMaxTableLevelPlus1;
  const levelsGainedOverMaxTable = Math.floor(xpOverMaxTable / XP_PER_LEVEL_AFTER_TABLE);

  const currentLevel = maxTableLevelEntry.level + 1 + levelsGainedOverMaxTable;
  const xpAtLevelStart = xpAtStartOfMaxTableLevelPlus1 + (levelsGainedOverMaxTable * XP_PER_LEVEL_AFTER_TABLE);
  
  return {
    level: currentLevel,
    xpTowardsNextLevel: totalXp - xpAtLevelStart,
    xpNeededForNextLevel: XP_PER_LEVEL_AFTER_TABLE,
    currentLevelBaseXp: xpAtLevelStart,
    nextLevelBaseXp: xpAtLevelStart + XP_PER_LEVEL_AFTER_TABLE,
  };
}


// initialHeroesData now uses StoredHero[] with iconName
// All badge levels are initialized to 0, so they don't contribute XP initially.
export const initialHeroesData: StoredHero[] = [
  { 
    id: 'soldier76', 
    name: 'Soldier: 76', 
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/2b/Icon-Soldier_76.png', 
    personalGoalXP: 200000,
    challenges: [
      { id: 's76_damage_dealt', title: 'Damage Dealt', iconName: 'Shell', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_critical_hits', title: 'Critical Hits', iconName: 'Crosshair', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_helix_direct', title: 'Helix Rocket Direct Hits', iconName: 'Skull', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_helix_final_blows', title: 'Helix Rocket Final Blows', iconName: 'Shapes', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_biotic_healing', title: 'Biotic Field Healing', iconName: 'HeartPulse', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_visor_kills', title: 'Tactical Visor Kills', iconName: 'Eye', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 's76_time_played', title: 'Time Played', iconName: 'Clock', level: 0, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
      { id: 's76_wins', title: 'Wins', iconName: 'Trophy', level: 0, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'tracer', 
    name: 'Tracer', 
    portraitUrl: 'https://picsum.photos/seed/tracer/100/100', 
    personalGoalXP: 150000,
    challenges: [
      { id: 'tracer_pulse_kills', title: 'Pulse Bomb Kills', iconName: 'Zap', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'tracer_recall_healed', title: 'Health Recalled', iconName: 'HeartPulse', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'tracer_time_played', title: 'Time Played', iconName: 'Clock', level: 0, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
      { id: 'tracer_wins', title: 'Wins', iconName: 'Trophy', level: 0, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'mercy', 
    name: 'Mercy', 
    portraitUrl: 'https://picsum.photos/seed/mercy/100/100', 
    personalGoalXP: 250000,
    challenges: [
        { id: 'mercy_healing_done', title: 'Healing Done', iconName: 'HeartPulse', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'mercy_rez', title: 'Resurrections', iconName: 'Zap', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'mercy_wins', title: 'Wins', iconName: 'Trophy', level: 0, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'reinhardt', 
    name: 'Reinhardt', 
    portraitUrl: 'https://picsum.photos/seed/reinhardt/100/100', 
    personalGoalXP: 180000,
    challenges: [
      { id: 'rein_shatter_stuns', title: 'Earthshatter Stuns', iconName: 'ShieldQuestion', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'rein_charge_pins', title: 'Charge Pins', iconName: 'Zap', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'rein_damage_blocked', title: 'Damage Blocked', iconName: 'ShieldQuestion', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
      { id: 'rein_wins', title: 'Wins', iconName: 'Trophy', level: 0, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'ana', 
    name: 'Ana', 
    portraitUrl: 'https://picsum.photos/seed/ana/100/100', 
    personalGoalXP: 220000,
    challenges: [
        { id: 'ana_sleep_darts', title: 'Sleep Darts Hit', iconName: 'Zap', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'ana_biotic_grenade_assists', title: 'Biotic Grenade Assists', iconName: 'HeartPulse', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'ana_nano_boosts', title: 'Nano Boosts Applied', iconName: 'Shapes', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
        { id: 'ana_wins', title: 'Wins', iconName: 'Trophy', level: 0, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
  },
  { 
    id: 'genji', 
    name: 'Genji', 
    portraitUrl: 'https://picsum.photos/seed/genji/100/100', 
    personalGoalXP: 190000,
    challenges: [
       { id: 'genji_blade_kills', title: 'Dragonblade Kills', iconName: 'Sword', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
       { id: 'genji_deflect_damage', title: 'Damage Deflected', iconName: 'ShieldQuestion', level: 0, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
       { id: 'genji_wins', title: 'Wins', iconName: 'Trophy', level: 0, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
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
    // Spreading h first to ensure all properties are included.
    // The `totalXp`, `level`, etc., from HeroCalculated are not part of StoredHero,
    // but if they exist on h, they will be effectively omitted by explicitly defining StoredHero properties.
    id: h.id,
    name: h.name,
    portraitUrl: h.portraitUrl,
    personalGoalXP: h.personalGoalXP,
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

    