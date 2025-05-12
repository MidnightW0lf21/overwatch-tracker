
import type { Hero, HeroChallenge, LevelDetails, StoredHero, StoredHeroChallenge } from '@/types/overwatch';
import { getBadgeDefinition } from '@/lib/badge-definitions';
import { ShieldQuestion } from 'lucide-react'; // Import ShieldQuestion for fallback

export const XP_PER_HERO_TYPE_BADGE_LEVEL = 200;
export const XP_PER_WIN_TYPE_BADGE_LEVEL = 1200;
export const XP_PER_TIME_TYPE_BADGE_LEVEL = 5600;

interface LevelTier {
  level: number;
  totalXpToReachThisLevel: number; 
  xpToNextLevel: number;           
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

const XP_PER_LEVEL_AFTER_TABLE = 60000;

export function calculateTotalXP(heroChallenges: Array<{ level: number; xpPerLevel: number }>): number {
  return heroChallenges.reduce((total, challenge) => {
    if (challenge.level > 1) {
      return total + ((challenge.level -1) * challenge.xpPerLevel);
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

  const maxTableLevelEntry = levelProgressionTiers[levelProgressionTiers.length - 1]; 
  const xpAtStartOfMaxTableLevelPlus1 = maxTableLevelEntry.totalXpToReachThisLevel + maxTableLevelEntry.xpToNextLevel; 

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

export function calculateXpToReachLevel(targetLevel: number): number {
  if (targetLevel <= 0) return 0;
  if (targetLevel === 1) return levelProgressionTiers[0].totalXpToReachThisLevel;

  const tier = levelProgressionTiers.find(t => t.level === targetLevel);
  if (tier) {
    return tier.totalXpToReachThisLevel; 
  }

  const lastTierInTable = levelProgressionTiers[levelProgressionTiers.length - 1]; 
  const xpAtStartOfFirstLevelBeyondTable = lastTierInTable.totalXpToReachThisLevel + lastTierInTable.xpToNextLevel;

  if (targetLevel === lastTierInTable.level + 1) { 
      return xpAtStartOfFirstLevelBeyondTable;
  }
  
  const levelsBeyondTablePlusOne = targetLevel - (lastTierInTable.level + 1);
  const xpBeyondTable = levelsBeyondTablePlusOne * XP_PER_LEVEL_AFTER_TABLE;
  return xpAtStartOfFirstLevelBeyondTable + xpBeyondTable;
}

export const initialHeroesData: StoredHero[] = [
  { 
    id: 'soldier76', 
    name: 'Soldier: 76', 
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/2b/Icon-Soldier_76.png', 
    personalGoalLevel: 100,
    challenges: [
      { id: 's76_damage_dealt_instance', badgeId: 's76_damage_dealt', level: 1 },
      { id: 's76_critical_hits_instance', badgeId: 's76_critical_hits', level: 1 },
      { id: 's76_helix_direct_instance', badgeId: 's76_helix_direct', level: 1 },
      { id: 's76_helix_final_blows_instance', badgeId: 's76_helix_final_blows', level: 1 },
      { id: 's76_biotic_healing_instance', badgeId: 's76_biotic_healing', level: 1 },
      { id: 's76_visor_kills_instance', badgeId: 's76_visor_kills', level: 1 },
      { id: 's76_time_played_instance', badgeId: 's76_time_played', level: 1 },
      { id: 's76_wins_instance', badgeId: 's76_wins', level: 1 },
    ],
  },
  { 
    id: 'tracer', 
    name: 'Tracer', 
    portraitUrl: 'https://picsum.photos/seed/tracer/100/100', 
    personalGoalLevel: 75,
    challenges: [
      { id: 'tracer_pulse_kills_instance', badgeId: 'tracer_pulse_kills', level: 1 },
      { id: 'tracer_recall_healed_instance', badgeId: 'tracer_recall_healed', level: 1 },
      { id: 'tracer_time_played_instance', badgeId: 'tracer_time_played', level: 1 },
      { id: 'tracer_wins_instance', badgeId: 'tracer_wins', level: 1 },
    ],
  },
  { 
    id: 'mercy', 
    name: 'Mercy', 
    portraitUrl: 'https://picsum.photos/seed/mercy/100/100', 
    personalGoalLevel: 120,
    challenges: [
        { id: 'mercy_healing_done_instance', badgeId: 'mercy_healing_done', level: 1 },
        { id: 'mercy_rez_instance', badgeId: 'mercy_rez', level: 1 },
        { id: 'mercy_wins_instance', badgeId: 'mercy_wins', level: 1 },
        { id: 'mercy_time_played_instance', badgeId: 'mercy_time_played', level: 1 },
    ],
  },
  { 
    id: 'reinhardt', 
    name: 'Reinhardt', 
    portraitUrl: 'https://picsum.photos/seed/reinhardt/100/100', 
    personalGoalLevel: 90,
    challenges: [
      { id: 'rein_shatter_stuns_instance', badgeId: 'rein_shatter_stuns', level: 1 },
      { id: 'rein_charge_pins_instance', badgeId: 'rein_charge_pins', level: 1 },
      { id: 'rein_damage_blocked_instance', badgeId: 'rein_damage_blocked', level: 1 },
      { id: 'rein_wins_instance', badgeId: 'rein_wins', level: 1 },
      { id: 'rein_time_played_instance', badgeId: 'rein_time_played', level: 1 },
    ],
  },
  { 
    id: 'ana', 
    name: 'Ana', 
    portraitUrl: 'https://picsum.photos/seed/ana/100/100', 
    personalGoalLevel: 110,
    challenges: [
        { id: 'ana_sleep_darts_instance', badgeId: 'ana_sleep_darts', level: 1 },
        { id: 'ana_biotic_grenade_assists_instance', badgeId: 'ana_biotic_grenade_assists', level: 1 },
        { id: 'ana_nano_boosts_instance', badgeId: 'ana_nano_boosts', level: 1 },
        { id: 'ana_wins_instance', badgeId: 'ana_wins', level: 1 },
        { id: 'ana_time_played_instance', badgeId: 'ana_time_played', level: 1 },
    ],
  },
  { 
    id: 'genji', 
    name: 'Genji', 
    portraitUrl: 'https://picsum.photos/seed/genji/100/100', 
    personalGoalLevel: 95,
    challenges: [
       { id: 'genji_blade_kills_instance', badgeId: 'genji_blade_kills', level: 1 },
       { id: 'genji_deflect_damage_instance', badgeId: 'genji_deflect_damage', level: 1 },
       { id: 'genji_wins_instance', badgeId: 'genji_wins', level: 1 },
       { id: 'genji_time_played_instance', badgeId: 'genji_time_played', level: 1 },
    ],
  },
  {
    id: 'venture',
    name: 'Venture',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/c7/OW2_Venture.png',
    personalGoalLevel: 50,
    challenges: [
      { id: 'venture_burrow_damage_instance', badgeId: 'venture_burrow_damage', level: 1 },
      { id: 'venture_drill_dash_damage_instance', badgeId: 'venture_drill_dash_damage', level: 1 },
      { id: 'venture_tectonic_shock_kills_instance', badgeId: 'venture_tectonic_shock_kills', level: 1 },
      { id: 'venture_wins_instance', badgeId: 'venture_wins', level: 1 },
      { id: 'venture_time_played_instance', badgeId: 'venture_time_played', level: 1 },
    ]
  }
];

export function hydrateHeroes(storedHeroes: StoredHero[]): Hero[] {
  return storedHeroes.map(sh => {
    const challenges = sh.challenges.map((sc: StoredHeroChallenge) => {
      const badgeDef = getBadgeDefinition(sc.badgeId);
      if (!badgeDef) {
        console.warn(`Badge definition not found for ID: ${sc.badgeId}. Using fallback.`);
        return { 
          id: sc.id,
          badgeId: sc.badgeId,
          title: "Unknown Badge",
          icon: ShieldQuestion,
          xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL, // Now defined in this file
          level: sc.level,
        } as HeroChallenge;
      }

      const heroChallenge: HeroChallenge = {
        id: sc.id,
        badgeId: sc.badgeId,
        title: badgeDef.title,
        icon: badgeDef.icon, 
        level: sc.level,
        xpPerLevel: badgeDef.xpPerLevel,
      };
      return heroChallenge;
    }).filter(Boolean) as HeroChallenge[];

    return { 
      id: sh.id,
      name: sh.name,
      portraitUrl: sh.portraitUrl.trimStart(), 
      personalGoalLevel: sh.personalGoalLevel || 0,
      challenges 
    };
  });
}

export function dehydrateHeroes(heroes: Hero[]): StoredHero[] {
  return heroes.map(h => ({
    id: h.id,
    name: h.name,
    portraitUrl: h.portraitUrl,
    personalGoalLevel: h.personalGoalLevel || 0,
    challenges: h.challenges.map(c => ({
      id: c.id,
      badgeId: c.badgeId,
      level: c.level,
    })),
  }));
}
