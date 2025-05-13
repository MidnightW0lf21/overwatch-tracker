
import type { Hero, HeroChallenge, LevelDetails, StoredHero, StoredHeroChallenge } from '@/types/overwatch';
import { getBadgeDefinition } from '@/lib/badge-definitions';
import { ShieldQuestion } from 'lucide-react';

// XP constants are now primarily defined and used in badge-definitions.ts
// They are kept here for reference or potential direct use if needed elsewhere,
// but badge instances themselves don't store xpPerLevel.

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
    id: 'ana',
    name: 'Ana',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/3/3d/Icon-Ana.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'ana_healing_done_instance', badgeId: 'ana_healing_done', level: 1 },
      { id: 'ana_players_saved_instance', badgeId: 'ana_players_saved', level: 1 },
      { id: 'ana_eliminations_instance', badgeId: 'ana_eliminations', level: 1 },
      { id: 'ana_enemies_slept_instance', badgeId: 'ana_enemies_slept', level: 1 },
      { id: 'ana_nano_assists_instance', badgeId: 'ana_nano_assists', level: 1 },
      { id: 'ana_ally_applied_instance', badgeId: 'ana_ally_applied', level: 1 },
      { id: 'ana_enemy_applied_instance', badgeId: 'ana_enemy_applied', level: 1 },
      { id: 'ana_time_instance', badgeId: 'ana_time_played', level: 1 }, // Corrected badgeId
      { id: 'ana_wins_instance', badgeId: 'ana_wins', level: 1 },
    ],
  },
  {
    id: 'ashe',
    name: 'Ashe',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/b/be/Icon-Ashe.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'ashe_eliminations_instance', badgeId: 'ashe_eliminations', level: 1 },
      { id: 'ashe_unscoped_hits_instance', badgeId: 'ashe_unscoped_hits', level: 1 },
      { id: 'ashe_scoped_hits_instance', badgeId: 'ashe_scoped_hits', level: 1 },
      { id: 'ashe_critical_hits_instance', badgeId: 'ashe_critical_hits', level: 1 },
      { id: 'ashe_dyno_damage_instance', badgeId: 'ashe_dyno_damage', level: 1 },
      { id: 'ashe_bob_kills_instance', badgeId: 'ashe_bob_kills', level: 1 },
      { id: 'ashe_time_instance', badgeId: 'ashe_time_played', level: 1 }, // Corrected badgeId
      { id: 'ashe_wins_instance', badgeId: 'ashe_wins', level: 1 },
    ],
  },
  {
    id: 'baptiste',
    name: 'Baptiste',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/70/BaptisteVAC.webp',
    personalGoalLevel: 500,
    challenges: [
      { id: 'baptiste_heal_done_instance', badgeId: 'baptiste_heal_done', level: 1 },
      { id: 'baptiste_players_saved_instance', badgeId: 'baptiste_players_saved', level: 1 },
      { id: 'baptiste_dmg_dealt_instance', badgeId: 'baptiste_dmg_dealt', level: 1 },
      { id: 'baptiste_elimination_instance', badgeId: 'baptiste_elimination', level: 1 },
      { id: 'baptiste_dmg_amplified_instance', badgeId: 'baptiste_dmg_amplified', level: 1 },
      { id: 'baptiste_heal_amplified_instance', badgeId: 'baptiste_heal_amplified', level: 1 },
      { id: 'baptiste_immortality_save_instance', badgeId: 'baptiste_immortality_save', level: 1 },
      { id: 'baptiste_time_instance', badgeId: 'baptiste_time_played', level: 1 }, // Corrected badgeId
      { id: 'baptiste_wins_instance', badgeId: 'baptiste_wins', level: 1 },
    ],
  },
  {
    id: 'bastion',
    name: 'Bastion',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/51/Icon-Bastion.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'bastion_dmg_dealt_instance', badgeId: 'bastion_dmg_dealt', level: 1 },
      { id: 'bastion_nonhero_dmg_instance', badgeId: 'bastion_nonhero_dmg', level: 1 },
      { id: 'bastion_recon_critical_instance', badgeId: 'bastion_recon_critical', level: 1 },
      { id: 'bastion_assault_kills_instance', badgeId: 'bastion_assault_kills', level: 1 },
      { id: 'bastion_grenade_direct_instance', badgeId: 'bastion_grenade_direct', level: 1 },
      { id: 'bastion_artillery_kills_instance', badgeId: 'bastion_artillery_kills', level: 1 },
      { id: 'bastion_time_instance', badgeId: 'bastion_time_played', level: 1 }, // Corrected badgeId
      { id: 'bastion_wins_instance', badgeId: 'bastion_wins', level: 1 },
    ],
  },
  {
    id: 'brigitte',
    name: 'Brigitte',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a6/Icon-Brigitte.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'brigitte_healing_done_instance', badgeId: 'brigitte_healing_done', level: 1 },
      { id: 'brigitte_players_saved_instance', badgeId: 'brigitte_players_saved', level: 1 },
      { id: 'brigitte_weapon_dmg_instance', badgeId: 'brigitte_weapon_dmg', level: 1 },
      { id: 'brigitte_whipshot_hits_instance', badgeId: 'brigitte_whipshot_hits', level: 1 },
      { id: 'brigitte_shield_hits_instance', badgeId: 'brigitte_shield_hits', level: 1 },
      { id: 'brigitte_rally_assists_instance', badgeId: 'brigitte_rally_assists', level: 1 },
      { id: 'brigitte_time_instance', badgeId: 'brigitte_time_played', level: 1 }, // Corrected badgeId
      { id: 'brigitte_wins_instance', badgeId: 'brigitte_wins', level: 1 },
    ],
  },
  {
    id: 'cassidy',
    name: 'Cassidy',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/5b/Icon-cassidy.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'cassidy_dmg_dealt_instance', badgeId: 'cassidy_dmg_dealt', level: 1 },
      { id: 'cassidy_weapon_kills_instance', badgeId: 'cassidy_weapon_kills', level: 1 },
      { id: 'cassidy_hammer_kills_instance', badgeId: 'cassidy_hammer_kills', level: 1 },
      { id: 'cassidy_critical_hits_instance', badgeId: 'cassidy_critical_hits', level: 1 },
      { id: 'cassidy_maggrenade_kills_instance', badgeId: 'cassidy_maggrenade_kills', level: 1 },
      { id: 'cassidy_deadeye_kills_instance', badgeId: 'cassidy_deadeye_kills', level: 1 },
      { id: 'cassidy_time_instance', badgeId: 'cassidy_time_played', level: 1 }, // Corrected badgeId
      { id: 'cassidy_wins_instance', badgeId: 'cassidy_wins', level: 1 },
    ],
  },
  {
    id: 'dva',
    name: 'D.Va',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/19/Icon-D.Va.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'dva_dmg_mitigated_instance', badgeId: 'dva_dmg_mitigated', level: 1 },
      { id: 'dva_dmg_dealt_instance', badgeId: 'dva_dmg_dealt', level: 1 },
      { id: 'dva_gun_dmg_instance', badgeId: 'dva_gun_dmg', level: 1 },
      { id: 'dva_missile_kills_instance', badgeId: 'dva_missile_kills', level: 1 },
      { id: 'dva_solo_kills_instance', badgeId: 'dva_solo_kills', level: 1 },
      { id: 'dva_destruct_kills_instance', badgeId: 'dva_destruct_kills', level: 1 },
      { id: 'dva_time_instance', badgeId: 'dva_time_played', level: 1 }, // Corrected badgeId
      { id: 'dva_wins_instance', badgeId: 'dva_wins', level: 1 },
    ],
  },
  {
    id: 'doomfist',
    name: 'Doomfist',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a1/Icon-Doomfist.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'doomfist_overhealth_created_instance', badgeId: 'doomfist_overhealth_created', level: 1 },
      { id: 'doomfist_dmg_dealt_instance', badgeId: 'doomfist_dmg_dealt', level: 1 },
      { id: 'doomfist_slam_kills_instance', badgeId: 'doomfist_slam_kills', level: 1 },
      { id: 'doomfist_punch_empowered_instance', badgeId: 'doomfist_punch_empowered', level: 1 },
      { id: 'doomfist_wall_stuns_instance', badgeId: 'doomfist_wall_stuns', level: 1 },
      { id: 'doomfist_meteor_kills_instance', badgeId: 'doomfist_meteor_kills', level: 1 },
      { id: 'doomfist_time_instance', badgeId: 'doomfist_time_played', level: 1 }, // Corrected badgeId
      { id: 'doomfist_wins_instance', badgeId: 'doomfist_wins', level: 1 },
    ],
  },
  {
    id: 'echo',
    name: 'Echo',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/d/d6/Icon-Echo.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'echo_dmg_dealt_instance', badgeId: 'echo_dmg_dealt', level: 1 },
      { id: 'echo_weapon_kills_instance', badgeId: 'echo_weapon_kills', level: 1 },
      { id: 'echo_beam_blows_instance', badgeId: 'echo_beam_blows', level: 1 },
      { id: 'echo_bomb_dmg_instance', badgeId: 'echo_bomb_dmg', level: 1 },
      { id: 'echo_duplicate_kills_instance', badgeId: 'echo_duplicate_kills', level: 1 },
      { id: 'echo_duplicate_ults_instance', badgeId: 'echo_duplicate_ults', level: 1 },
      { id: 'echo_time_instance', badgeId: 'echo_time_played', level: 1 }, // Corrected badgeId
      { id: 'echo_wins_instance', badgeId: 'echo_wins', level: 1 },
    ],
  },
  {
    id: 'freja',
    name: 'Freja',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/0/04/Icon-Freja.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'freja_eliminations_instance', badgeId: 'freja_eliminations', level: 1 },
      { id: 'freja_dmg_dealt_instance', badgeId: 'freja_dmg_dealt', level: 1 },
      { id: 'freja_final_blows_instance', badgeId: 'freja_final_blows', level: 1 },
      { id: 'freja_aim_kills_instance', badgeId: 'freja_aim_kills', level: 1 },
      { id: 'freja_bola_sticks_instance', badgeId: 'freja_bola_sticks', level: 1 },
      { id: 'freja_time_instance', badgeId: 'freja_time_played', level: 1 }, // Corrected badgeId
      { id: 'freja_wins_instance', badgeId: 'freja_wins', level: 1 },
    ],
  },
  {
    id: 'genji',
    name: 'Genji',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/1c/Icon-Genji.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'genji_primary_dmg_instance', badgeId: 'genji_primary_dmg', level: 1 },
      { id: 'genji_secondary_dmg_instance', badgeId: 'genji_secondary_dmg', level: 1 },
      { id: 'genji_dmg_reflected_instance', badgeId: 'genji_dmg_reflected', level: 1 },
      { id: 'genji_strike_resets_instance', badgeId: 'genji_strike_resets', level: 1 },
      { id: 'genji_solo_kills_instance', badgeId: 'genji_solo_kills', level: 1 },
      { id: 'genji_dragonblade_kills_instance', badgeId: 'genji_blade_kills', level: 1 }, // Corrected badgeId
      { id: 'genji_time_instance', badgeId: 'genji_time_played', level: 1 }, // Corrected badgeId
      { id: 'genji_wins_instance', badgeId: 'genji_wins', level: 1 },
    ],
  },
  {
    id: 'hanzo',
    name: 'Hanzo',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/71/Icon-Hanzo.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'hanzo_dmg_dealt_instance', badgeId: 'hanzo_dmg_dealt', level: 1 },
      { id: 'hanzo_weapon_kills_instance', badgeId: 'hanzo_weapon_kills', level: 1 },
      { id: 'hanzo_critical_hits_instance', badgeId: 'hanzo_critical_hits', level: 1 },
      { id: 'hanzo_storm_kills_instance', badgeId: 'hanzo_storm_kills', level: 1 },
      { id: 'hanzo_recon_assists_instance', badgeId: 'hanzo_recon_assists', level: 1 },
      { id: 'hanzo_dragonstrike_kills_instance', badgeId: 'hanzo_dragonstrike_kills', level: 1 },
      { id: 'hanzo_time_instance', badgeId: 'hanzo_time_played', level: 1 }, // Corrected badgeId
      { id: 'hanzo_wins_instance', badgeId: 'hanzo_wins', level: 1 },
    ],
  },
  {
    id: 'hazard',
    name: 'Hazard',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/54/Icon-Hazard.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'hazard_dmg_mitigated_instance', badgeId: 'hazard_dmg_mitigated', level: 1 },
      { id: 'hazard_spike_guard_instance', badgeId: 'hazard_spike_guard', level: 1 },
      { id: 'hazard_leap_kills_instance', badgeId: 'hazard_leap_kills', level: 1 },
      { id: 'hazard_wall_assists_instance', badgeId: 'hazard_wall_assists', level: 1 },
      { id: 'hazard_downpour_roots_instance', badgeId: 'hazard_downpour_roots', level: 1 },
      { id: 'hazard_time_instance', badgeId: 'hazard_time_played', level: 1 }, // Corrected badgeId
      { id: 'hazard_wins_instance', badgeId: 'hazard_wins', level: 1 },
    ],
  },
  {
    id: 'illari',
    name: 'Illari',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/8/86/Icon-Illari.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'illari_secondary_heal_instance', badgeId: 'illari_secondary_heal', level: 1 },
      { id: 'illari_pylon_heal_instance', badgeId: 'illari_pylon_heal', level: 1 },
      { id: 'illari_players_saved_instance', badgeId: 'illari_players_saved', level: 1 },
      { id: 'illari_eliminations_instance', badgeId: 'illari_eliminations', level: 1 },
      { id: 'illari_knockback_kills_instance', badgeId: 'illari_knockback_kills', level: 1 },
      { id: 'illari_sunstruck_detonations_instance', badgeId: 'illari_sunstruck_detonations', level: 1 },
      { id: 'illari_time_instance', badgeId: 'illari_time_played', level: 1 }, // Corrected badgeId
      { id: 'illari_wins_instance', badgeId: 'illari_wins', level: 1 },
    ],
  },
  {
    id: 'junker_queen',
    name: 'Junker Queen',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/2b/Icon-Junker_Queen.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'junker_queen_dmg_mitigated_instance', badgeId: 'junker_queen_dmg_mitigated', level: 1 },
      { id: 'junker_queen_dmg_dealt_instance', badgeId: 'junker_queen_dmg_dealt', level: 1 },
      { id: 'junker_queen_wound_dmg_instance', badgeId: 'junker_queen_wound_dmg', level: 1 },
      { id: 'junker_queen_blade_kills_instance', badgeId: 'junker_queen_blade_kills', level: 1 },
      { id: 'junker_queen_carnage_kills_instance', badgeId: 'junker_queen_carnage_kills', level: 1 },
      { id: 'junker_queen_rampage_kills_instance', badgeId: 'junker_queen_rampage_kills', level: 1 },
      { id: 'junker_queen_time_instance', badgeId: 'junker_queen_time_played', level: 1 }, // Corrected badgeId
      { id: 'junker_queen_wins_instance', badgeId: 'junker_queen_wins', level: 1 },
    ],
  },
  {
    id: 'junkrat',
    name: 'Junkrat',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/9/99/Icon-Junkrat.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'junkrat_dmg_dealt_instance', badgeId: 'junkrat_dmg_dealt', level: 1 },
      { id: 'junkrat_nonhero_dmg_instance', badgeId: 'junkrat_nonhero_dmg', level: 1 },
      { id: 'junkrat_weapon_direct_instance', badgeId: 'junkrat_weapon_direct', level: 1 },
      { id: 'junkrat_mine_kills_instance', badgeId: 'junkrat_mine_kills', level: 1 },
      { id: 'junkrat_enemies_trapped_instance', badgeId: 'junkrat_enemies_trapped', level: 1 },
      { id: 'junkrat_tire_kills_instance', badgeId: 'junkrat_tire_kills', level: 1 },
      { id: 'junkrat_time_instance', badgeId: 'junkrat_time_played', level: 1 }, // Corrected badgeId
      { id: 'junkrat_wins_instance', badgeId: 'junkrat_wins', level: 1 },
    ],
  },
  {
    id: 'juno',
    name: 'Juno',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/c7/Icon-Juno.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'juno_heal_done_instance', badgeId: 'juno_heal_done', level: 1 },
      { id: 'juno_players_saved_instance', badgeId: 'juno_players_saved', level: 1 },
      { id: 'juno_eliminations_instance', badgeId: 'juno_eliminations', level: 1 },
      { id: 'juno_ring_assists_instance', badgeId: 'juno_ring_assists', level: 1 },
      { id: 'juno_dmg_amplified_instance', badgeId: 'juno_dmg_amplified', level: 1 },
      { id: 'juno_orbital_assists_instance', badgeId: 'juno_orbital_assists', level: 1 },
      { id: 'juno_time_instance', badgeId: 'juno_time_played', level: 1 }, // Corrected badgeId
      { id: 'juno_wins_instance', badgeId: 'juno_wins', level: 1 },
    ],
  },
  {
    id: 'kiriko',
    name: 'Kiriko',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/ca/Icon-kiriko.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'kiriko_healing_done_instance', badgeId: 'kiriko_healing_done', level: 1 },
      { id: 'kiriko_players_saved_instance', badgeId: 'kiriko_players_saved', level: 1 },
      { id: 'kiriko_eliminations_instance', badgeId: 'kiriko_eliminations', level: 1 },
      { id: 'kiriko_critical_hits_instance', badgeId: 'kiriko_critical_hits', level: 1 },
      { id: 'kiriko_debuff_cleansed_instance', badgeId: 'kiriko_debuff_cleansed', level: 1 },
      { id: 'kiriko_swift_escapes_instance', badgeId: 'kiriko_swift_escapes', level: 1 },
      { id: 'kiriko_kitsune_assists_instance', badgeId: 'kiriko_kitsune_assists', level: 1 },
      { id: 'kiriko_time_instance', badgeId: 'kiriko_time_played', level: 1 }, // Corrected badgeId
      { id: 'kiriko_wins_instance', badgeId: 'kiriko_wins', level: 1 },
    ],
  },
  {
    id: 'lifeweaver',
    name: 'Lifeweaver',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/8/86/Icon-Lifeweaver.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'lifeweaver_blossom_heal_instance', badgeId: 'lifeweaver_blossom_heal', level: 1 },
      { id: 'lifeweaver_players_saved_instance', badgeId: 'lifeweaver_players_saved', level: 1 },
      { id: 'lifeweaver_eliminations_instance', badgeId: 'lifeweaver_eliminations', level: 1 },
      { id: 'lifeweaver_grip_saves_instance', badgeId: 'lifeweaver_grip_saves', level: 1 },
      { id: 'lifeweaver_dmg_mitigated_instance', badgeId: 'lifeweaver_dmg_mitigated', level: 1 },
      { id: 'lifeweaver_tree_heal_instance', badgeId: 'lifeweaver_tree_heal', level: 1 },
      { id: 'lifeweaver_time_instance', badgeId: 'lifeweaver_time_played', level: 1 }, // Corrected badgeId
      { id: 'lifeweaver_wins_instance', badgeId: 'lifeweaver_wins', level: 1 },
    ],
  },
  {
    id: 'lucio',
    name: 'Lúcio',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/51/Icon-Lúcio.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'lucio_healing_done_instance', badgeId: 'lucio_healing_done', level: 1 },
      { id: 'lucio_players_saved_instance', badgeId: 'lucio_players_saved', level: 1 },
      { id: 'lucio_eliminations_instance', badgeId: 'lucio_eliminations', level: 1 },
      { id: 'lucio_speed_assists_instance', badgeId: 'lucio_speed_assists', level: 1 },
      { id: 'lucio_environmental_kills_instance', badgeId: 'lucio_environmental_kills', level: 1 },
      { id: 'lucio_barrier_dmg_mit_instance', badgeId: 'lucio_barrier_dmg_mit', level: 1 },
      { id: 'lucio_time_instance', badgeId: 'lucio_time_played', level: 1 }, // Corrected badgeId
      { id: 'lucio_wins_instance', badgeId: 'lucio_wins', level: 1 },
    ],
  },
  {
    id: 'mauga',
    name: 'Mauga',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/3/39/Icon-Mauga.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'mauga_dmg_mitigated_instance', badgeId: 'mauga_dmg_mitigated', level: 1 },
      { id: 'mauga_dmg_dealt_instance', badgeId: 'mauga_dmg_dealt', level: 1 },
      { id: 'mauga_crit_dmg_dealt_instance', badgeId: 'mauga_crit_dmg_dealt', level: 1 },
      { id: 'mauga_enemy_ignitions_instance', badgeId: 'mauga_enemy_ignitions', level: 1 },
      { id: 'mauga_knockback_hits_instance', badgeId: 'mauga_knockback_hits', level: 1 },
      { id: 'mauga_heal_done_instance', badgeId: 'mauga_heal_done', level: 1 },
      { id: 'mauga_cage_kills_instance', badgeId: 'mauga_cage_kills', level: 1 },
      { id: 'mauga_time_instance', badgeId: 'mauga_time_played', level: 1 }, // Corrected badgeId
      { id: 'mauga_wins_instance', badgeId: 'mauga_wins', level: 1 },
    ],
  },
  {
    id: 'mei',
    name: 'Mei',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/9/99/Icon-Mei.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'mei_eliminations_instance', badgeId: 'mei_eliminations', level: 1 },
      { id: 'mei_primary_dmg_instance', badgeId: 'mei_primary_dmg', level: 1 },
      { id: 'mei_icicle_critical_instance', badgeId: 'mei_icicle_critical', level: 1 },
      { id: 'mei_objective_contest_instance', badgeId: 'mei_objective_contest', level: 1 },
      { id: 'mei_self_heal_instance', badgeId: 'mei_self_heal', level: 1 },
      { id: 'mei_enemies_frozen_instance', badgeId: 'mei_enemies_frozen', level: 1 },
      { id: 'mei_time_instance', badgeId: 'mei_time_played', level: 1 }, // Corrected badgeId
      { id: 'mei_wins_instance', badgeId: 'mei_wins', level: 1 },
    ],
  },
  {
    id: 'mercy',
    name: 'Mercy',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/0/03/Icon-Mercy.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'mercy_healing_done_instance', badgeId: 'mercy_healing_done', level: 1 },
      { id: 'mercy_players_saved_instance', badgeId: 'mercy_players_saved', level: 1 },
      { id: 'mercy_dmg_amplified_instance', badgeId: 'mercy_dmg_amplified', level: 1 },
      { id: 'mercy_players_resurrected_instance', badgeId: 'mercy_players_resurrected', level: 1 },
      { id: 'mercy_blaster_kills_instance', badgeId: 'mercy_blaster_kills', level: 1 },
      { id: 'mercy_valkyrie_assists_instance', badgeId: 'mercy_valkyrie_assists', level: 1 },
      { id: 'mercy_time_instance', badgeId: 'mercy_time_played', level: 1 }, // Corrected badgeId
      { id: 'mercy_wins_instance', badgeId: 'mercy_wins', level: 1 },
    ],
  },
  {
    id: 'moira',
    name: 'Moira',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/55/Icon-Moira.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'moira_grasp_heal_instance', badgeId: 'moira_grasp_heal', level: 1 },
      { id: 'moira_orb_heal_instance', badgeId: 'moira_orb_heal', level: 1 },
      { id: 'moira_players_saved_instance', badgeId: 'moira_players_saved', level: 1 },
      { id: 'moira_eliminations_instance', badgeId: 'moira_eliminations', level: 1 },
      { id: 'moira_nonultimate_dmg_instance', badgeId: 'moira_nonultimate_dmg', level: 1 },
      { id: 'moira_coalescence_instance', badgeId: 'moira_coalescence', level: 1 },
      { id: 'moira_time_instance', badgeId: 'moira_time_played', level: 1 }, // Corrected badgeId
      { id: 'moira_wins_instance', badgeId: 'moira_wins', level: 1 },
    ],
  },
  {
    id: 'orisa',
    name: 'Orisa',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/11/Icon-Orisa.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'orisa_dmg_mitigated_instance', badgeId: 'orisa_dmg_mitigated', level: 1 },
      { id: 'orisa_dmg_dealt_instance', badgeId: 'orisa_dmg_dealt', level: 1 },
      { id: 'orisa_critical_dmg_instance', badgeId: 'orisa_critical_dmg', level: 1 },
      { id: 'orisa_javelin_hits_instance', badgeId: 'orisa_javelin_hits', level: 1 },
      { id: 'orisa_javelin_wall_pins_instance', badgeId: 'orisa_javelin_wall_pins', level: 1 },
      { id: 'orisa_terra_kills_instance', badgeId: 'orisa_terra_kills', level: 1 },
      { id: 'orisa_time_instance', badgeId: 'orisa_time_played', level: 1 }, // Corrected badgeId
      { id: 'orisa_wins_instance', badgeId: 'orisa_wins', level: 1 },
    ],
  },
  {
    id: 'pharah',
    name: 'Pharah',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/29/Icon-Pharah.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'pharah_elimination_instance', badgeId: 'pharah_elimination', level: 1 },
      { id: 'pharah_dmg_dealt_instance', badgeId: 'pharah_dmg_dealt', level: 1 },
      { id: 'pharah_weapon_direct_hits_instance', badgeId: 'pharah_weapon_direct_hits', level: 1 },
      { id: 'pharah_concussive_hits_instance', badgeId: 'pharah_concussive_hits', level: 1 },
      { id: 'pharah_environmental_kills_instance', badgeId: 'pharah_environmental_kills', level: 1 },
      { id: 'pharah_barrage_kills_instance', badgeId: 'pharah_barrage_kills', level: 1 },
      { id: 'pharah_aerial_kills_instance', badgeId: 'pharah_aerial_kills', level: 1 },
      { id: 'pharah_time_instance', badgeId: 'pharah_time_played', level: 1 }, // Corrected badgeId
      { id: 'pharah_wins_instance', badgeId: 'pharah_wins', level: 1 },
    ],
  },
  {
    id: 'ramattra',
    name: 'Ramattra',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/6/6f/Icon-Ramattra.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'ramattra_block_dmg_mit_instance', badgeId: 'ramattra_block_dmg_mit', level: 1 },
      { id: 'ramattra_barrier_dmg_mit_instance', badgeId: 'ramattra_barrier_dmg_mit', level: 1 },
      { id: 'ramattra_dmg_dealt_instance', badgeId: 'ramattra_dmg_dealt', level: 1 },
      { id: 'ramattra_weapon_dmg_instance', badgeId: 'ramattra_weapon_dmg', level: 1 },
      { id: 'ramattra_pummel_dmg_instance', badgeId: 'ramattra_pummel_dmg', level: 1 },
      { id: 'ramattra_vortex_kills_instance', badgeId: 'ramattra_vortex_kills', level: 1 },
      { id: 'ramattra_annihilation_kills_instance', badgeId: 'ramattra_annihilation_kills', level: 1 },
      { id: 'ramattra_time_instance', badgeId: 'ramattra_time_played', level: 1 }, // Corrected badgeId
      { id: 'ramattra_wins_instance', badgeId: 'ramattra_wins', level: 1 },
    ],
  },
  {
    id: 'reaper',
    name: 'Reaper',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a9/Icon-Reaper.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'reaper_dmg_dealt_instance', badgeId: 'reaper_dmg_dealt', level: 1 },
      { id: 'reaper_eliminations_instance', badgeId: 'reaper_eliminations', level: 1 },
      { id: 'reaper_solo_kills_instance', badgeId: 'reaper_solo_kills', level: 1 },
      { id: 'reaper_self_heal_instance', badgeId: 'reaper_self_heal', level: 1 },
      { id: 'reaper_teleport_kills_instance', badgeId: 'reaper_teleport_kills', level: 1 },
      { id: 'reaper_blossom_kills_instance', badgeId: 'reaper_blossom_kills', level: 1 },
      { id: 'reaper_time_instance', badgeId: 'reaper_time_played', level: 1 }, // Corrected badgeId
      { id: 'reaper_wins_instance', badgeId: 'reaper_wins', level: 1 },
    ],
  },
  {
    id: 'reinhardt',
    name: 'Reinhardt',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/8/83/Icon-Reinhardt.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'reinhardt_dmg_mitigated_instance', badgeId: 'rein_damage_blocked', level: 1 }, // Corrected badgeId
      { id: 'reinhardt_dmg_dealt_instance', badgeId: 'rein_damage_dealt', level: 1 }, // Needs definition
      { id: 'reinhardt_weapon_kills_instance', badgeId: 'rein_weapon_kills', level: 1 }, // Needs definition
      { id: 'reinhardt_charge_pins_instance', badgeId: 'rein_charge_pins', level: 1 },
      { id: 'reinhardt_fire_strike_hits_instance', badgeId: 'rein_fire_strike_hits', level: 1 }, // Needs definition
      { id: 'reinhardt_earthshatter_stuns_instance', badgeId: 'rein_shatter_stuns', level: 1 }, // Corrected badgeId
      { id: 'reinhardt_earthshatter_kills_instance', badgeId: 'rein_earthshatter_kills', level: 1 }, // Needs definition
      { id: 'reinhardt_time_instance', badgeId: 'rein_time_played', level: 1 }, // Corrected badgeId
      { id: 'reinhardt_wins_instance', badgeId: 'rein_wins', level: 1 },
    ],
  },
  {
    id: 'roadhog',
    name: 'Roadhog',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/1/16/Icon-Roadhog.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'roadhog_dmg_mitigated_instance', badgeId: 'roadhog_dmg_mitigated', level: 1 },
      { id: 'roadhog_dmg_dealt_instance', badgeId: 'roadhog_dmg_dealt', level: 1 },
      { id: 'roadhog_eliminations_instance', badgeId: 'roadhog_eliminations', level: 1 },
      { id: 'roadhog_chain_hooked_instance', badgeId: 'roadhog_chain_hooked', level: 1 },
      { id: 'roadhog_enemies_trapped_instance', badgeId: 'roadhog_enemies_trapped', level: 1 },
      { id: 'roadhog_self_heal_instance', badgeId: 'roadhog_self_heal', level: 1 },
      { id: 'roadhog_whole_hog_kills_instance', badgeId: 'roadhog_whole_hog_kills', level: 1 },
      { id: 'roadhog_time_instance', badgeId: 'roadhog_time_played', level: 1 }, // Corrected badgeId
      { id: 'roadhog_wins_instance', badgeId: 'roadhog_wins', level: 1 },
    ],
  },
  {
    id: 'soldier76',
    name: 'Soldier: 76',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/2b/Icon-Soldier_76.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 's76_damage_dealt_instance', badgeId: 's76_dmg_dealt', level: 1 },
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
    id: 'sigma',
    name: 'Sigma',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/e/e0/Icon-Sigma.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'sigma_dmg_mitigated_instance', badgeId: 'sigma_dmg_mitigated', level: 1 },
      { id: 'sigma_overhealth_created_instance', badgeId: 'sigma_overhealth_created', level: 1 },
      { id: 'sigma_dmg_dealt_instance', badgeId: 'sigma_dmg_dealt', level: 1 },
      { id: 'sigma_weapon_direct_hits_instance', badgeId: 'sigma_weapon_direct_hits', level: 1 },
      { id: 'sigma_accretion_hits_instance', badgeId: 'sigma_accretion_hits', level: 1 },
      { id: 'sigma_flux_kills_instance', badgeId: 'sigma_flux_kills', level: 1 },
      { id: 'sigma_time_instance', badgeId: 'sigma_time_played', level: 1 }, // Corrected badgeId
      { id: 'sigma_wins_instance', badgeId: 'sigma_wins', level: 1 },
    ],
  },
  {
    id: 'sojourn',
    name: 'Sojourn',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/e/e0/Icon-Sojourn.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'sojourn_dmg_dealt_instance', badgeId: 'sojourn_dmg_dealt', level: 1 },
      { id: 'sojourn_weapon_kill_instance', badgeId: 'sojourn_weapon_kill', level: 1 },
      { id: 'sojourn_charged_final_blows_instance', badgeId: 'sojourn_charged_final_blows', level: 1 },
      { id: 'sojourn_slide_kills_instance', badgeId: 'sojourn_slide_kills', level: 1 },
      { id: 'sojourn_disruptor_dmg_instance', badgeId: 'sojourn_disruptor_dmg', level: 1 },
      { id: 'sojourn_overclock_hits_instance', badgeId: 'sojourn_overclock_hits', level: 1 },
      { id: 'sojourn_time_instance', badgeId: 'sojourn_time_played', level: 1 }, // Corrected badgeId
      { id: 'sojourn_wins_instance', badgeId: 'sojourn_wins', level: 1 },
    ],
  },
  {
    id: 'sombra',
    name: 'Sombra',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/70/Icon-Sombra.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'sombra_eliminations_instance', badgeId: 'sombra_eliminations', level: 1 },
      { id: 'sombra_solo_kills_instance', badgeId: 'sombra_solo_kills', level: 1 },
      { id: 'sombra_enemies_hacked_instance', badgeId: 'sombra_enemies_hacked', level: 1 },
      { id: 'sombra_low_h_teleports_instance', badgeId: 'sombra_low_h_teleports', level: 1 },
      { id: 'sombra_heal_pack_heal_instance', badgeId: 'sombra_heal_pack_heal', level: 1 },
      { id: 'sombra_emp_kills_instance', badgeId: 'sombra_emp_kills', level: 1 },
      { id: 'sombra_virus_kills_instance', badgeId: 'sombra_virus_kills', level: 1 },
      { id: 'sombra_time_instance', badgeId: 'sombra_time_played', level: 1 }, // Corrected badgeId
      { id: 'sombra_wins_instance', badgeId: 'sombra_wins', level: 1 },
    ],
  },
  {
    id: 'symmetra',
    name: 'Symmetra',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/0/06/Icon-Symmetra.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'symmetra_dmg_dealt_instance', badgeId: 'symmetra_dmg_dealt', level: 1 },
      { id: 'symmetra_nonhero_dmg_instance', badgeId: 'symmetra_nonhero_dmg', level: 1 },
      { id: 'symmetra_secondary_direct_hits_instance', badgeId: 'symmetra_secondary_direct_hits', level: 1 },
      { id: 'symmetra_turret_kills_instance', badgeId: 'symmetra_turret_kills', level: 1 },
      { id: 'symmetra_teleport_kills_instance', badgeId: 'symmetra_teleport_kills', level: 1 },
      { id: 'symmetra_dmg_mitigated_instance', badgeId: 'symmetra_dmg_mitigated', level: 1 },
      { id: 'symmetra_time_instance', badgeId: 'symmetra_time_played', level: 1 }, // Corrected badgeId
      { id: 'symmetra_wins_instance', badgeId: 'symmetra_wins', level: 1 },
    ],
  },
  {
    id: 'torbjorn',
    name: 'Torbjörn',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/ca/Icon-Torbjörn.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'torbjorn_primary_dmg_instance', badgeId: 'torbjorn_primary_dmg', level: 1 },
      { id: 'torbjorn_secondary_dmg_instance', badgeId: 'torbjorn_secondary_dmg', level: 1 },
      { id: 'torbjorn_hammer_kills_instance', badgeId: 'torbjorn_hammer_kills', level: 1 },
      { id: 'torbjorn_turret_kills_instance', badgeId: 'torbjorn_turret_kills', level: 1 },
      { id: 'torbjorn_dmg_mitigated_instance', badgeId: 'torbjorn_dmg_mitigated', level: 1 },
      { id: 'torbjorn_molten_kills_instance', badgeId: 'torbjorn_molten_kills', level: 1 },
      { id: 'torbjorn_time_instance', badgeId: 'torbjorn_time_played', level: 1 }, // Corrected badgeId
      { id: 'torbjorn_wins_instance', badgeId: 'torbjorn_wins', level: 1 },
    ],
  },
  {
    id: 'tracer',
    name: 'Tracer',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/2/29/Icon-Tracer.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'tracer_eliminations_instance', badgeId: 'tracer_eliminations', level: 1 },
      { id: 'tracer_dmg_dealt_instance', badgeId: 'tracer_dmg_dealt', level: 1 },
      { id: 'tracer_self_heal_instance', badgeId: 'tracer_self_heal', level: 1 },
      { id: 'tracer_heal_pack_heal_instance', badgeId: 'tracer_heal_pack_heal', level: 1 },
      { id: 'tracer_bomb_attached_instance', badgeId: 'tracer_bomb_attached', level: 1 },
      { id: 'tracer_bomb_kills_instance', badgeId: 'tracer_pulse_kills', level: 1 }, // Corrected badgeId
      { id: 'tracer_time_instance', badgeId: 'tracer_time_played', level: 1 }, // Corrected badgeId
      { id: 'tracer_wins_instance', badgeId: 'tracer_wins', level: 1 },
    ],
  },
  {
    id: 'venture',
    name: 'Venture',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a0/Icon-Venture.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'venture_eliminations_instance', badgeId: 'venture_eliminations', level: 1 },
      { id: 'venture_dmg_dealt_instance', badgeId: 'venture_dmg_dealt', level: 1 },
      { id: 'venture_dash_knockbacks_instance', badgeId: 'venture_drill_dash_damage', level: 1 }, // Corrected badgeId
      { id: 'venture_borrow_hits_instance', badgeId: 'venture_burrow_damage', level: 1 }, // Corrected badgeId
      { id: 'venture_dmg_mitigated_instance', badgeId: 'venture_dmg_mitigated', level: 1 },
      { id: 'venture_tectonic_kills_instance', badgeId: 'venture_tectonic_shock_kills', level: 1 }, // Corrected badgeId
      { id: 'venture_time_instance', badgeId: 'venture_time_played', level: 1 },
      { id: 'venture_wins_instance', badgeId: 'venture_wins', level: 1 },
    ],
  },
  {
    id: 'widowmaker',
    name: 'Widowmaker',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/5/54/Icon-Widowmaker.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'widowmaker_scoped_crit_hits_instance', badgeId: 'widowmaker_scoped_crit_hits', level: 1 },
      { id: 'widowmaker_solo_kills_instance', badgeId: 'widowmaker_solo_kills', level: 1 },
      { id: 'widowmaker_unscoped_kills_instance', badgeId: 'widowmaker_unscoped_kills', level: 1 },
      { id: 'widowmaker_venom_applied_instance', badgeId: 'widowmaker_venom_applied', level: 1 },
      { id: 'widowmaker_recon_assists_instance', badgeId: 'widowmaker_recon_assists', level: 1 },
      { id: 'widowmaker_recon_final_blows_instance', badgeId: 'widowmaker_recon_final_blows', level: 1 },
      { id: 'widowmaker_time_instance', badgeId: 'widowmaker_time_played', level: 1 }, // Corrected badgeId
      { id: 'widowmaker_wins_instance', badgeId: 'widowmaker_wins', level: 1 },
    ],
  },
  {
    id: 'winston',
    name: 'Winston',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/f/f8/Icon-Winston.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'winston_dmg_mitigated_instance', badgeId: 'winston_dmg_mitigated', level: 1 },
      { id: 'winston_dmg_dealt_instance', badgeId: 'winston_dmg_dealt', level: 1 },
      { id: 'winston_jump_kills_instance', badgeId: 'winston_jump_kills', level: 1 },
      { id: 'winston_secondary_hits_instance', badgeId: 'winston_secondary_hits', level: 1 },
      { id: 'winston_environmental_kills_instance', badgeId: 'winston_environmental_kills', level: 1 },
      { id: 'winston_primal_kills_instance', badgeId: 'winston_primal_kills', level: 1 },
      { id: 'winston_time_instance', badgeId: 'winston_time_played', level: 1 }, // Corrected badgeId
      { id: 'winston_wins_instance', badgeId: 'winston_wins', level: 1 },
    ],
  },
  {
    id: 'wrecking_ball',
    name: 'Hammond',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/ca/Icon-Wrecking_Ball.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'wrecking_ball_overhealth_created_instance', badgeId: 'wrecking_ball_overhealth_created', level: 1 },
      { id: 'wrecking_ball_dmg_dealt_instance', badgeId: 'wrecking_ball_dmg_dealt', level: 1 },
      { id: 'wrecking_ball_piledriver_kills_instance', badgeId: 'wrecking_ball_piledriver_kills', level: 1 },
      { id: 'wrecking_ball_knockback_hits_instance', badgeId: 'wrecking_ball_knockback_hits', level: 1 },
      { id: 'wrecking_ball_heal_pack_heal_instance', badgeId: 'wrecking_ball_heal_pack_heal', level: 1 },
      { id: 'wrecking_ball_minefield_kills_instance', badgeId: 'wrecking_ball_minefield_kills', level: 1 },
      { id: 'wrecking_ball_time_instance', badgeId: 'wrecking_ball_time_played', level: 1 }, // Corrected badgeId
      { id: 'wrecking_ball_wins_instance', badgeId: 'wrecking_ball_wins', level: 1 },
    ],
  },
  {
    id: 'zarya',
    name: 'Zarya',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/7/75/Icon-Zarya.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'zarya_self_dmg_mitigated_instance', badgeId: 'zarya_self_dmg_mitigated', level: 1 },
      { id: 'zarya_ally_dmg_mitigated_instance', badgeId: 'zarya_ally_dmg_mitigated', level: 1 },
      { id: 'zarya_primary_dmg_instance', badgeId: 'zarya_primary_dmg', level: 1 },
      { id: 'zarya_secondary_dmg_instance', badgeId: 'zarya_secondary_dmg', level: 1 },
      { id: 'zarya_high_energy_kills_instance', badgeId: 'zarya_high_energy_kills', level: 1 },
      { id: 'zarya_graviton_kills_instance', badgeId: 'zarya_graviton_kills', level: 1 },
      { id: 'zarya_time_instance', badgeId: 'zarya_time_played', level: 1 }, // Corrected badgeId
      { id: 'zarya_wins_instance', badgeId: 'zarya_wins', level: 1 },
    ],
  },
  {
    id: 'zenyatta',
    name: 'Zenyatta',
    portraitUrl: 'https://static.wikia.nocookie.net/overwatch_gamepedia/images/f/f7/Icon-Zenyatta.png',
    personalGoalLevel: 500,
    challenges: [
      { id: 'zenyatta_orb_heal_instance', badgeId: 'zenyatta_orb_heal', level: 1 },
      { id: 'zenyatta_players_saved_instance', badgeId: 'zenyatta_players_saved', level: 1 },
      { id: 'zenyatta_eliminations_instance', badgeId: 'zenyatta_eliminations', level: 1 },
      { id: 'zenyatta_critical_hits_instance', badgeId: 'zenyatta_critical_hits', level: 1 },
      { id: 'zenyatta_offensive_assists_instance', badgeId: 'zenyatta_offensive_assists', level: 1 },
      { id: 'zenyatta_volley_kills_instance', badgeId: 'zenyatta_volley_kills', level: 1 },
      { id: 'zenyatta_transcendence_instance', badgeId: 'zenyatta_transcendence', level: 1 },
      { id: 'zenyatta_time_instance', badgeId: 'zenyatta_time_played', level: 1 }, // Corrected badgeId
      { id: 'zenyatta_wins_instance', badgeId: 'zenyatta_wins', level: 1 },
    ],
  },
];


export function hydrateHeroes(storedHeroes: StoredHero[]): Hero[] {
  return storedHeroes.map(sh => {
    const challenges = sh.challenges.map((sc: StoredHeroChallenge) => {
      const badgeDef = getBadgeDefinition(sc.badgeId);
      if (!badgeDef) {
        console.warn(`Badge definition not found for ID: ${sc.badgeId}. Using fallback.`);
        return {
          id: sc.id, // instance id
          badgeId: sc.badgeId,
          title: "Unknown Badge",
          icon: ShieldQuestion, // Fallback icon component
          xpPerLevel: 200, // A default XP, consider importing XP_PER_HERO_TYPE_BADGE_LEVEL
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
      personalGoalLevel: typeof sh.personalGoalLevel === 'number' ? sh.personalGoalLevel : 0,
      challenges,
    };
  });
}

export function dehydrateHeroes(heroes: Hero[]): StoredHero[] {
  return heroes.map(h => {
    const challenges: StoredHeroChallenge[] = h.challenges.map(c => ({
      id: c.id,
      badgeId: c.badgeId,
      level: c.level,
    }));
    return {
      id: h.id,
      name: h.name,
      portraitUrl: h.portraitUrl,
      personalGoalLevel: h.personalGoalLevel || 0,
      challenges,
    };
  });
}

    