
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
const CUSTOM_SVG_ICON_NAME = '_customSvg';

export function calculateTotalXP(heroChallenges: StoredHeroChallenge[]): number {
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
  { id: 'ana',
    name: 'Ana',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/3/3d/Icon-Ana.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'ana_healing_done', title: 'Healing Done', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ana_players_saved', title: 'Players Saved', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ana_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ana_enemies_slept', title: 'Enemies Slept', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ana_nano_assists', title: 'Nano Boost Assists', iconName: 'Swords', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ana_ally_applied', title: 'Ally Granades Applied', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ana_enemy_applied', title: 'Enemy Granades Applied', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ana_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'ana_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'ashe',
    name: 'Ashe',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/b/be/Icon-Ashe.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'ashe_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ashe_unscoped_hits', title: 'Weapon Unscoped Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ashe_scoped_hits', title: 'Weapon Scoped Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ashe_critical_hits', title: 'Critical Hits', iconName: 'Crosshair', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ashe_dyno_damage', title: 'Dynamite Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ashe_bob_kills', title: 'BOB Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ashe_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'ashe_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'baptiste',
    name: 'Baptiste',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/70/BaptisteVAC.webp',
    personalGoalLevel: 500,
    challenges: [
    { id: 'baptiste_heal_done', title: 'Healing Done', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'baptiste_players_saved', title: 'Players Saved', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'baptiste_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'baptiste_elimination', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'baptiste_dmg_amplified', title: 'Damage Amplified', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'baptiste_heal_amplified', title: 'Healing Amplified', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'baptiste_immortality_save', title: 'Immortality Field Saves', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'baptiste_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'baptiste_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'bastion',
    name: 'Bastion',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/51/Icon-Bastion.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'bastion_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'bastion_nonhero_dmg', title: 'Non-Hero Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'bastion_recon_critical', title: 'Recon Critical Hits', iconName: 'Crosshair', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'bastion_assault_kills', title: 'Assault Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'bastion_grenade_direct', title: 'Grenade Direct Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'bastion_artillery_kills', title: 'Artillery Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'bastion_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'bastion_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'brigitte',
    name: 'Brigitte',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a6/Icon-Brigitte.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'brigitte_healing_done', title: 'Healing Done', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'brigitte_players_saved', title: 'Players Saved', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'brigitte_weapon_dmg', title: 'Weapon Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'brigitte_whipshot_hits', title: 'Whipshot Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'brigitte_shield_hits', title: 'Shield Bash Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'brigitte_rally_assists', title: 'Rally Assists', iconName: 'Swords', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'brigitte_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'brigitte_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'cassidy',
    name: 'Cassidy',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/5b/Icon-cassidy.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'cassidy_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'cassidy_weapon_kills', title: 'Weapon Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'cassidy_hammer_kills', title: 'Fan the Hammer Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'cassidy_critical_hits', title: 'Critical Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'cassidy_maggrenade_kills', title: 'Magnetic Grenade Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'cassidy_deadeye_kills', title: 'Deadeye Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'cassidy_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'cassidy_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'dva',
    name: 'D.Va',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/19/Icon-D.Va.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'dva_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'dva_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'dva_gun_dmg', title: 'Light Gun Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'dva_missile_kills', title: 'Micro Missile Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'dva_solo_kills', title: 'Solo Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'dva_destruct_kills', title: 'Self-Destruct Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'dva_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'dva_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'doomfist',
    name: 'Doomfist',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a1/Icon-Doomfist.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'doomfist_overhealt_created', title: 'Overhealth Created', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'doomfist_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'doomfist_slam_kills', title: 'Seismic Slam Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'doomfist_punch_empowered', title: 'Punch Empowered', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'doomfist_wall_stuns', title: 'Wall Stuns', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'doomfist_meteor_kills', title: 'Meteor Strike Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'doomfist_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'doomfist_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'echo',
    name: 'Echo',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/d/d6/Icon-Echo.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'echo_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'echo_weapon_kills', title: 'Weapon Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'echo_beam_blows', title: 'Beam Final Blows', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'echo_bomb_dmg', title: 'Sticky Bomb Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'echo_duplicate_kills', title: 'Duplicate Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'echo_duplicate_ults', title: 'Duplicate Ultimates', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'echo_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'echo_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'freja',
    name: 'Freja',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/0/04/Icon-Freja.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'freja_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'freja_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'freja_final_blows', title: 'Final Blows', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'freja_aim_kills', title: 'Take Aim Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'freja_bola_sticks', title: 'Bola Shot Sticks', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'freja_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'freja_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'genji',
    name: 'Genji',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/1c/Icon-Genji.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'genji_primary_dmg', title: 'Primary Fire Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'genji_secondary_dmg', title: 'Secondary Fire Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'genji_dmg_reflected', title: 'Damage Reflected', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'genji_strike_resets', title: 'Swift Strike Resets', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'genji_solo_kills', title: 'Solo Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'genji_dragonblade_kills', title: 'Dragonblade Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'genji_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'genji_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'hanzo',
    name: 'Hanzo',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/71/Icon-Hanzo.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'hanzo_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'hanzo_weapon_kills', title: 'Weapon Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'hanzo_critical_hits', title: 'Critical Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'hanzo_storm_kills', title: 'Storm Arrow Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'hanzo_recon_assists', title: 'Recon Assists', iconName: 'Swords', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'hanzo_dragonstrike_kills', title: 'Dragonstrike Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'hanzo_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'hanzo_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'hazard',
    name: 'Hazard',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/54/Icon-Hazard.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'hazard_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'hazard_spike_guard', title: 'Spike Guard', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'hazard_leap_kills', title: 'Violent Leap Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'hazard_wall_assists', title: 'Jagged Wall Assists', iconName: 'Swords', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'hazard_downpour_roots', title: 'Downpour Roots', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'hazard_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'hazard_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'illari',
    name: 'Illari',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/8/86/Icon-Illari.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'illari_secondary_heal', title: 'Secondary Fire Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'illari_pylon_heal', title: 'Pylon Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'illari_players_saved', title: 'Players Saved', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'illari_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'illari_knockback_kills', title: 'Knockback Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'illari_sunstruck_detonations', title: 'Sunstruck Detonations', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'illari_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'illari_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'junker_queen',
    name: 'Junker Queen',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/2b/Icon-Junker_Queen.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'junker_queen_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junker_queen_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junker_queen_wound_dmg', title: 'Wound Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junker_queen_blade_kills', title: 'Jagged Blade Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junker_queen_carnage_kills', title: 'Carnage Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junker_queen_rampage_kills', title: 'Rampage Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junker_queen_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'junker_queen_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'junkrat',
    name: 'Junkrat',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/9/99/Icon-Junkrat.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'junkrat_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junkrat_nonhero_dmg', title: 'Non-Hero Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junkrat_weapon_direct', title: 'Weapon Direct Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junkrat_mine_kills', title: 'Concussion Mine Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junkrat_enemies_trapped', title: 'Enemies Trapped', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junkrat_tire_kills', title: 'Rip-Tire Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'junkrat_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'junkrat_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'juno',
    name: 'Juno',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/c7/Icon-Juno.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'juno_heal_done', title: 'Healing Done', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'juno_players_saved', title: 'Players Saved', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'juno_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'juno_ring_assists', title: 'Hyper Ring Assists', iconName: 'Swords', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'juno_dmg_amplified', title: 'Damage Amplified', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'juno_orbital_assists', title: 'Orbital Ray Assists', iconName: 'Swords', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'juno_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'juno_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'kiriko',
    name: 'Kiriko',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/ca/Icon-kiriko.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'kiriko_healing_done', title: 'Healing Done', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'kiriko_players_saved', title: 'Players Saved', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'kiriko_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'kiriko_critical_hits', title: 'Critical Hits', iconName: 'Crosshair', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'kiriko_debuff_cleansed', title: 'Debuffs Cleansed', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'kiriko_swift_escapes', title: 'Swift Step Escapes', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'kiriko_kitsune_assists', title: 'Kitsune Rush Assists', iconName: 'Swords', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'kiriko_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'kiriko_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'lifeweaver',
    name: 'Lifeweaver',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/8/86/Icon-Lifeweaver.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'lifeweaver_blossom_heal', title: 'Blossom Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lifeweaver_players_saved', title: 'Players Saved', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lifeweaver_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lifeweaver_grip_saves', title: 'Life Grip Saves', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lifeweaver_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lifeweaver_tree_heal', title: 'Tree of Life Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lifeweaver_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'lifeweaver_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'lucio',
    name: 'Lúcio',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/51/Icon-Lúcio.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'lucio_healing_done', title: 'Healing Done', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lucio_players_saved', title: 'Players Saved', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lucio_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lucio_speed_assists', title: 'Speed Boost Assists', iconName: 'Swords', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lucio_environmental_kills', title: 'Environmental Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lucio_barrier_dmg_mit', title: 'Sound Barrier DMG MIT', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'lucio_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'lucio_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'mauga',
    name: 'Mauga',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/3/39/Icon-Mauga.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'mauga_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mauga_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mauga_crit_dmg_dealt', title: 'Critical Damage Dealt', iconName: 'Crosshair', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mauga_enemy_ignitions', title: 'Enemy Ignitions', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mauga_knockback_hits', title: 'Knockback Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mauga_heal_done', title: 'Healing Done', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mauga_cage_kills', title: 'Cage Fight Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mauga_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'mauga_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'mei',
    name: 'Mei',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/9/99/Icon-Mei.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'mei_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mei_primary_dmg', title: 'Primary Fire Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mei_icicle_critical', title: 'Icicle Critical Hits', iconName: 'Crosshair', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mei_objective_contest', title: 'Objective Contest Time', iconName: 'Timer', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mei_self_heal', title: 'Self Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mei_enemies_frozen', title: 'Enemies Frozen', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mei_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'mei_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'mercy',
    name: 'Mercy',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/0/03/Icon-Mercy.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'mercy_heal_done', title: 'Healing Done', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mercy_players_saved', title: 'Players Saved', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mercy_dmg_amplified', title: 'Damage Amplified', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mercy_players_resurrected', title: 'Players Resurrected', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mercy_blaster_kills', title: 'Blaster Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mercy_valkyrie_assists', title: 'Valkyrie Assists', iconName: 'Swords', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'mercy_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'mercy_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'moira',
    name: 'Moira',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/55/Icon-Moira.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'moira_grasp_heal', title: 'Biotic Grasp Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'moira_orb_heal', title: 'Biotic Orb Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'moira_players_saved', title: 'Players Saved', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'moira_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'moira_nonultimate_dmg', title: 'Non-Ultimate Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'moira_coalescence', title: 'Coalescence', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'moira_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'moira_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'orisa',
    name: 'Orisa',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/11/Icon-Orisa.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'orisa_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'orisa_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'orisa_critical_dmg', title: 'Critical Damage', iconName: 'Crosshair', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'orisa_javelin_hits', title: 'Javelin Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'orisa_javelin_wall_pins', title: 'Javelin Wall Pins', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'orisa_terra_kills', title: 'Terra Surge Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'orisa_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'orisa_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'pharah',
    name: 'Pharah',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/29/Icon-Pharah.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'pharah_elimination', title: 'Elimination', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'pharah_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'pharah_weapon_direct_hits', title: 'Weapon Direct Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'pharah_concussive_hits', title: 'Concussive Blast Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'pharah_environmental_kills', title: 'Environmental Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'pharah_barrage_kills', title: 'Barrage Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'pharah_aerial_kills', title: 'Aerial Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'pharah_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'pharah_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'ramattra',
    name: 'Ramattra',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/6/6f/Icon-Ramattra.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'ramattra_block_dmg_mit', title: 'Block DMG Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ramattra_barrier_dmg_mit', title: 'Barrier DMG Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ramattra_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ramattra_weapon_dmg', title: 'Weapon Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ramattra_pummel_dmg', title: 'Pummel Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ramattra_vortex_kills', title: 'Ravenous Vortex Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ramattra_annihilation_kills', title: 'Annihilation Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'ramattra_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'ramattra_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'reaper',
    name: 'Reaper',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a9/Icon-Reaper.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'reaper_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reaper_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reaper_solo_kills', title: 'Solo Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reaper_self_heal', title: 'Self Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reaper_teleport_kills', title: 'Teleport Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reaper_blossom_kills', title: 'Death Blossom Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reaper_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'reaper_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'reinhardt',
    name: 'Reinhardt',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/8/83/Icon-Reinhardt.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'reinhardt_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reinhardt_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reinhardt_weapon_kills', title: 'Weapon Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reinhardt_charge_pins', title: 'Charge Pins', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reinhardt_fire_strike_hits', title: 'Fire Strike Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reinhardt_earthshatter_stuns', title: 'Earthshatter Stuns', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reinhardt_earthshatter_kills', title: 'Earthshatter Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'reinhardt_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'reinhardt_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'roadhog',
    name: 'Roadhog',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/16/Icon-Roadhog.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'roadhog_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'roadhog_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'roadhog_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'roadhog_chain_hooked', title: 'Enemies Chain Hooked', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'roadhog_enemies_trapped', title: 'Enemies Trapped', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'roadhog_self_heal', title: 'Self Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'roadhog_whole_hog_kills', title: 'Whole Hog Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'roadhog_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'roadhog_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'sigma',
    name: 'Sigma',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/e/e0/Icon-Sigma.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'sigma_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sigma_overhealth_created', title: 'Overhealth Created', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sigma_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sigma_weapon_direct_hits', title: 'Weapon Direct Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sigma_accretion_hits', title: 'Accretion Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sigma_flux_kills', title: 'Gravitic Flux Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sigma_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'sigma_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'sojourn',
    name: 'Sojourn',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/e/e0/Icon-Sojourn.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'sojourn_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sojourn_weapon_kill', title: 'Weapon Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sojourn_charged_final_blows', title: 'Charged Shot Final Blows', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sojourn_slide_kills', title: 'Power Slide Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sojourn_disruptor_dmg', title: 'Disruptor Shot Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sojourn_overclock_hits', title: 'Overclock Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sojourn_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'sojourn_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'soldier76',
    name: 'Soldier: 76',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/2b/Icon-Soldier_76.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'soldier76_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'soldier76_critical_hits', title: 'Critical Hits', iconName: 'Crosshair', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'soldier76_helix_direct_hits', title: 'Helix Rocket Direct Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'soldier76_helix_final_blows', title: 'Helix Rocket Final Blows', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'soldier76_biotic_heal', title: 'Biotic Field Healing', iconName: 'HeartPulse ', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'soldier76_tactical_kills', title: 'Tactical Visor Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'soldier76_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'soldier76_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'sombra',
    name: 'Sombra',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/70/Icon-Sombra.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'sombra_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sombra_solo_kills', title: 'Solo Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sombra_enemies_hacked', title: 'Enemies Hacked', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sombra_low_h_teleports', title: 'Low Health Teleports', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sombra_heal_pack_heal', title: 'Health Pack Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sombra_emp_kills', title: 'EMP Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sombra_virus_kills', title: 'Virus Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'sombra_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'sombra_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'symmetra',
    name: 'Symmetra',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/0/06/Icon-Symmetra.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'symmetra_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'symmetra_nonhero_dmg', title: 'Non-Hero Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'symmetra_secondary_direct_hits', title: 'Secondary Fire Direct Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'symmetra_turret_kills', title: 'Sentry Turret Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'symmetra_teleport_kills', title: 'Teleport Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'symmetra_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'symmetra_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'symmetra_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'torbjorn',
    name: 'Torbjörn',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/ca/Icon-Torbjörn.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'torbjorn_primary_dmg', title: 'Primary Fire Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'torbjorn_secondary_dmg', title: 'Secondary Fire Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'torbjorn_hammer_kills', title: 'Hammer Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'torbjorn_turret_kills', title: 'Turret Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'torbjorn_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'torbjorn_molten_kills', title: 'Molten Core Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'torbjorn_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'torbjorn_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'tracer',
    name: 'Tracer',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/29/Icon-Tracer.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'tracer_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'tracer_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'tracer_self_heal', title: 'Self Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'tracer_heal_pack_heal', title: 'Health Pack Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'tracer_bomb_attached', title: 'Pulse Bomb Attached', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'tracer_bomb_kills', title: 'Pulse Bomb Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'tracer_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'tracer_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'venture',
    name: 'Venture',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a0/Icon-Venture.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'venture_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'venture_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'venture_dash_knockbacks', title: 'Drill Dash Knockbacks', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'venture_borrow_hits', title: 'Borrow Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'venture_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'venture_tectonic_kills', title: 'Tectonic Shock Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'venture_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'venture_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'widowmaker',
    name: 'Widowmaker',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/54/Icon-Widowmaker.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'widowmaker_scoped_crit_hits', title: 'Scoped Critical Hits', iconName: 'Crosshair', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'widowmaker_solo_kills', title: 'Solo Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'widowmaker_unscoped_kills', title: 'Unscoped Weapon Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'widowmaker_venom_applied', title: 'Venom Mines Applied', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'widowmaker_recon_assists', title: 'Recon Assists', iconName: 'Swords', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'widowmaker_recon_final_blows', title: 'Recon Final Blows', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'widowmaker_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'widowmaker_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'winston',
    name: 'Winston',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/f/f8/Icon-Winston.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'winston_dmg_mitigated', title: 'Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'winston_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'winston_jump_kills', title: 'Jump Pack Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'winston_secondary_hits', title: 'Secondary Fire Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'winston_environmental_kills', title: 'Environmental Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'winston_primal_kills', title: 'Primal Rage Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'winston_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'winston_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'wrecking_ball',
    name: 'Hammond',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/ca/Icon-Wrecking_Ball.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'wrecking_ball_overhealt_created', title: 'Overhealt Created', iconName: 'Sword', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'wrecking_ball_dmg_dealt', title: 'Damage Dealt', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'wrecking_ball_piledriver_kills', title: 'Piledriver Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'wrecking_ball_knockback_hits', title: 'Knockback Hits', iconName: 'Target', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'wrecking_ball_heal_pack_heal', title: 'Health Pack Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'wrecking_ball_minefield_kills', title: 'Minefield Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'wrecking_ball_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'wrecking_ball_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'zarya',
    name: 'Zarya',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/75/Icon-Zarya.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'zarya_self_dmg_mitigated', title: 'Self Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zarya_ally_dmg_mitigated', title: 'Ally Damage Mitigated', iconName: 'Shield', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zarya_primary_dmg', title: 'Primary Fire Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zarya_secondary_dmg', title: 'Secondary Fire Damage', iconName: 'Zap', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zarya_high_energy_kills', title: 'High Energy Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zarya_graviton_kills', title: 'Graviton Surge Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zarya_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'zarya_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
    
    { id: 'zenyatta',
    name: 'Zenyatta',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/f/f7/Icon-Zenyatta.png',
    personalGoalLevel: 500,
    challenges: [
    { id: 'zenyatta_orb_heal', title: 'Harmony Orb Healing', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zenyatta_players_saved', title: 'Players Saved', iconName: 'Activity', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zenyatta_eliminations', title: 'Eliminations', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zenyatta_critical_hits', title: 'Critical Hits', iconName: 'Crosshair', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zenyatta_offensive_assists', title: 'Offensive Assists', iconName: 'Swords', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zenyatta_volley_kills', title: 'Charged Volley Kills', iconName: 'Skull', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zenyatta_transcendence', title: 'Transcendence', iconName: 'HeartPulse', level: 1, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
    { id: 'zenyatta_time', title: 'Time Played', iconName: 'Clock', level: 1, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
    { id: 'zenyatta_wins', title: 'Wins', iconName: 'Trophy', level: 1, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
    ],
    },
];

export function hydrateHeroes(storedHeroes: StoredHero[]): Hero[] {
  return storedHeroes.map(sh => {
    const challenges = sh.challenges.map((sc: StoredHeroChallenge) => {
      const heroChallenge: Partial<HeroChallenge> = {
        id: sc.id,
        title: sc.title,
        level: sc.level,
        xpPerLevel: sc.xpPerLevel,
      };
      if (sc.iconName === CUSTOM_SVG_ICON_NAME && sc.customIconSvg) {
        heroChallenge.customIconSvg = sc.customIconSvg;
      } else {
        heroChallenge.icon = getIconComponent(sc.iconName);
      }
      return heroChallenge as HeroChallenge;
    });
    return { ...sh, challenges };
  });
}

export function dehydrateHeroes(heroes: Hero[]): StoredHero[] {
  return heroes.map(h => {
    const challenges = h.challenges.map((c: HeroChallenge) => {
      const storedChallenge: Partial<StoredHeroChallenge> = {
        id: c.id,
        title: c.title,
        level: c.level,
        xpPerLevel: c.xpPerLevel,
      };
      if (c.customIconSvg) {
        storedChallenge.iconName = CUSTOM_SVG_ICON_NAME;
        storedChallenge.customIconSvg = c.customIconSvg;
      } else if (c.icon) {
        storedChallenge.iconName = getIconName(c.icon) || 'ShieldQuestion';
      } else {
        // Fallback if neither is present, though this case should be avoided by form validation
        storedChallenge.iconName = 'ShieldQuestion';
      }
      return storedChallenge as StoredHeroChallenge;
    });
    return {
      id: h.id,
      name: h.name,
      portraitUrl: h.portraitUrl,
      personalGoalXP: h.personalGoalXP,
      challenges,
    };
  });
}
