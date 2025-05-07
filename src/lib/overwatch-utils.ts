import type { Hero, LevelDetails } from '@/types/overwatch';

export const XP_PER_HERO_SUB_BADGE = 200;
export const XP_PER_WIN_SUB_BADGE = 1200;
export const XP_PER_TIME_PLAYED_SUB_BADGE = 5600;

const MAX_EARLY_LEVEL = 20; // Levels 1 through 19 are early, level 20 starts the late progression.
const XP_FOR_EACH_EARLY_LEVEL = 5000; // XP needed to pass one early level.
const XP_FOR_EACH_LATE_LEVEL = 60000; // XP needed to pass one late level (L20+).

// cumulativeXpToCompleteLevel[i] = total XP needed to complete level i (1-indexed) and reach level i+1.
// e.g. cumulativeXpToCompleteLevel[1] = 5000 (to complete L1, reach L2)
//      cumulativeXpToCompleteLevel[19] = 95000 (to complete L19, reach L20)
const cumulativeXpToCompleteLevel: number[] = [0]; // cumulativeXpToCompleteLevel[0] is XP to complete L0 (0 XP)
for (let i = 1; i < MAX_EARLY_LEVEL; i++) { // up to level 19 (MAX_EARLY_LEVEL - 1)
  cumulativeXpToCompleteLevel[i] = cumulativeXpToCompleteLevel[i-1] + XP_FOR_EACH_EARLY_LEVEL;
}
// cumulativeXpToCompleteLevel will be [0, 5000, 10000, ..., 90000, 95000]
// Index i means XP to complete level i.
// cumulativeXpToCompleteLevel[19] is XP to complete level 19 (95,000 XP).

export function calculateTotalXP(hero: Pick<Hero, 'heroSubBadges' | 'winSubBadges' | 'timePlayedSubBadges'>): number {
  return (
    hero.heroSubBadges * XP_PER_HERO_SUB_BADGE +
    hero.winSubBadges * XP_PER_WIN_SUB_BADGE +
    hero.timePlayedSubBadges * XP_PER_TIME_PLAYED_SUB_BADGE
  );
}

export function calculateLevelDetails(totalXp: number): Omit<LevelDetails, 'totalXp'> {
  let level = 1;
  let xpAtLevelStart = 0; // Cumulative XP needed to start the current level
  let xpForThisLevel = XP_FOR_EACH_EARLY_LEVEL; // XP requirement for the current level bar

  // XP to complete level 19 is cumulativeXpToCompleteLevel[19]
  if (totalXp < cumulativeXpToCompleteLevel[MAX_EARLY_LEVEL - 1]) { 
    // Early levels (1-19)
    // Find which early level we are in. Level 'i' is completed when totalXp >= cumulativeXpToCompleteLevel[i]
    for (let i = 1; i < MAX_EARLY_LEVEL; i++) { // i is the level number
      if (totalXp < cumulativeXpToCompleteLevel[i]) {
        level = i; // Currently on level i
        xpAtLevelStart = cumulativeXpToCompleteLevel[i-1]; // XP needed to start level i
        xpForThisLevel = XP_FOR_EACH_EARLY_LEVEL;
        break;
      }
      // If totalXp is exactly cumulativeXpToCompleteLevel[i], it means level i is completed,
      // and we are starting level i+1. This loop structure correctly assigns the *current* level.
      // e.g. totalXp = 0. 0 < 5000. level = 1. xpAtLevelStart = 0. Correct.
      // e.g. totalXp = 5000. 5000 < 5000 is false. Next loop.
      //      i=2. 5000 < 10000. level = 2. xpAtLevelStart = 5000. Correct.
    }
  } else { 
    // Late levels (20+)
    // Player has at least completed level 19 (i.e., has at least cumulativeXpToCompleteLevel[19] XP)
    level = MAX_EARLY_LEVEL; // Start at level 20
    xpAtLevelStart = cumulativeXpToCompleteLevel[MAX_EARLY_LEVEL - 1]; // XP needed to start level 20
    
    const xpIntoLateLevels = totalXp - xpAtLevelStart; // XP earned after starting L20
    const lateLevelsGained = Math.floor(xpIntoLateLevels / XP_FOR_EACH_LATE_LEVEL);
    
    level += lateLevelsGained;
    xpAtLevelStart += lateLevelsGained * XP_FOR_EACH_LATE_LEVEL;
    xpForThisLevel = XP_FOR_EACH_LATE_LEVEL;
  }

  const xpTowardsNextLevel = totalXp - xpAtLevelStart;
  const nextLevelBaseXp = xpAtLevelStart + xpForThisLevel; // Cumulative XP to complete current level

  return {
    level,
    xpTowardsNextLevel,
    xpNeededForNextLevel: xpForThisLevel,
    currentLevelBaseXp: xpAtLevelStart,
    nextLevelBaseXp,
  };
}

export const initialHeroesData: Hero[] = [
  { id: 'soldier76', name: 'Soldier: 76', portraitUrl: 'https://picsum.photos/seed/soldier/100/100', heroSubBadges: 5, winSubBadges: 10, timePlayedSubBadges: 2, personalGoalXP: 200000 },
  { id: 'tracer', name: 'Tracer', portraitUrl: 'https://picsum.photos/seed/tracer/100/100', heroSubBadges: 2, winSubBadges: 5, timePlayedSubBadges: 1, personalGoalXP: 150000 },
  { id: 'mercy', name: 'Mercy', portraitUrl: 'https://picsum.photos/seed/mercy/100/100', heroSubBadges: 10, winSubBadges: 20, timePlayedSubBadges: 3, personalGoalXP: 250000 },
  { id: 'reinhardt', name: 'Reinhardt', portraitUrl: 'https://picsum.photos/seed/reinhardt/100/100', heroSubBadges: 3, winSubBadges: 8, timePlayedSubBadges: 1, personalGoalXP: 180000 },
  { id: 'ana', name: 'Ana', portraitUrl: 'https://picsum.photos/seed/ana/100/100', heroSubBadges: 12, winSubBadges: 15, timePlayedSubBadges: 2, personalGoalXP: 220000 },
  { id: 'genji', name: 'Genji', portraitUrl: 'https://picsum.photos/seed/genji/100/100', heroSubBadges: 7, winSubBadges: 12, timePlayedSubBadges: 1, personalGoalXP: 190000 },
];
