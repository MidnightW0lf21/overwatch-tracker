
import type React from 'react';
import {
  Shell, Crosshair, Skull, Shapes, HeartPulse, Eye, Clock, Trophy, Zap,
  ShieldQuestion, Sword, Swords, Target, Shield, Medal, Gauge, Timer, Bomb,
  Brain, Wand2, Activity, UserCheck
} from 'lucide-react';

export const XP_PER_HERO_TYPE_BADGE_LEVEL = 200;
export const XP_PER_WIN_TYPE_BADGE_LEVEL = 1200;
export const XP_PER_TIME_TYPE_BADGE_LEVEL = 5600;


export type BadgeDefinition = {
  id: string;
  title: string;
  xpPerLevel: number;
  icon: React.ElementType;
};

export const badgeDefinitions: Record<string, BadgeDefinition> = {
  // Soldier: 76
  s76_dmg_dealt: { id: 's76_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_critical_hits: { id: 's76_critical_hits', title: 'Critical Hits', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_helix_direct: { id: 's76_helix_direct', title: 'Helix Rocket Direct Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_helix_final_blows: { id: 's76_helix_final_blows', title: 'Helix Rocket Final Blows', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_biotic_healing: { id: 's76_biotic_healing', title: 'Biotic Field Healing', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_visor_kills: { id: 's76_visor_kills', title: 'Tactical Visor Kills', icon: Eye, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_time_played: { id: 's76_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  s76_wins: { id: 's76_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Tracer
  tracer_eliminations: { id: 'tracer_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  tracer_dmg_dealt: { id: 'tracer_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  tracer_self_heal: { id: 'tracer_self_heal', title: 'Self Healing (Recall)', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  tracer_heal_pack_heal: { id: 'tracer_heal_pack_heal', title: 'Health Pack Healing', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  tracer_bomb_attached: { id: 'tracer_bomb_attached', title: 'Pulse Bomb Attached', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  tracer_pulse_kills: { id: 'tracer_pulse_kills', title: 'Pulse Bomb Kills', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  tracer_recall_healed: { id: 'tracer_recall_healed', title: 'Health Recalled', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  tracer_time_played: { id: 'tracer_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  tracer_wins: { id: 'tracer_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Mercy
  mercy_healing_done: { id: 'mercy_healing_done', title: 'Healing Done', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mercy_players_saved: { id: 'mercy_players_saved', title: 'Players Saved', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mercy_dmg_amplified: { id: 'mercy_dmg_amplified', title: 'Damage Amplified', icon: Sword, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mercy_players_resurrected: { id: 'mercy_players_resurrected', title: 'Players Resurrected', icon: UserCheck, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mercy_blaster_kills: { id: 'mercy_blaster_kills', title: 'Blaster Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mercy_valkyrie_assists: { id: 'mercy_valkyrie_assists', title: 'Valkyrie Assists', icon: Swords, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mercy_rez: { id: 'mercy_rez', title: 'Resurrections', icon: UserCheck, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mercy_wins: { id: 'mercy_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
  mercy_time_played: { id: 'mercy_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },

  // Reinhardt
  rein_damage_blocked: { id: 'rein_damage_blocked', title: 'Damage Blocked', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  rein_damage_dealt: {id: 'rein_damage_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  rein_weapon_kills: {id: 'rein_weapon_kills', title: 'Weapon Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  rein_fire_strike_hits: {id: 'rein_fire_strike_hits', title: 'Fire Strike Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  rein_earthshatter_kills: {id: 'rein_earthshatter_kills', title: 'Earthshatter Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  rein_shatter_stuns: { id: 'rein_shatter_stuns', title: 'Earthshatter Stuns', icon: Shapes, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  rein_charge_pins: { id: 'rein_charge_pins', title: 'Charge Pins', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  rein_wins: { id: 'rein_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
  rein_time_played: { id: 'rein_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },

  // Ana
  ana_healing_done: { id: 'ana_healing_done', title: 'Healing Done', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ana_players_saved: { id: 'ana_players_saved', title: 'Players Saved', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ana_eliminations: { id: 'ana_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ana_enemies_slept: { id: 'ana_enemies_slept', title: 'Enemies Slept', icon: Timer, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ana_ally_applied: { id: 'ana_ally_applied', title: 'Ally Grenades Applied', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL }, 
  ana_enemy_applied: { id: 'ana_enemy_applied', title: 'Enemy Grenades Applied', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL }, 
  ana_nano_assists: { id: 'ana_nano_assists', title: 'Nano Boost Assists', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ana_sleep_darts: { id: 'ana_sleep_darts', title: 'Sleep Darts Hit', icon: Timer, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ana_biotic_grenade_assists: { id: 'ana_biotic_grenade_assists', title: 'Biotic Grenade Assists', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ana_nano_boosts: { id: 'ana_nano_boosts', title: 'Nano Boosts Applied', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ana_wins: { id: 'ana_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
  ana_time_played: { id: 'ana_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },

  // Genji
  genji_primary_dmg: { id: 'genji_primary_dmg', title: 'Primary Fire Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  genji_secondary_dmg: { id: 'genji_secondary_dmg', title: 'Secondary Fire Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  genji_dmg_reflected: { id: 'genji_dmg_reflected', title: 'Damage Reflected', icon: Sword, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  genji_strike_resets: { id: 'genji_strike_resets', title: 'Swift Strike Resets', icon: Swords, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  genji_solo_kills: { id: 'genji_solo_kills', title: 'Solo Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  genji_blade_kills: { id: 'genji_blade_kills', title: 'Dragonblade Kills', icon: Swords, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  genji_wins: { id: 'genji_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
  genji_time_played: { id: 'genji_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  
  // Venture
  venture_eliminations: {id: 'venture_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL},
  venture_dmg_dealt: {id: 'venture_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL},
  venture_dmg_mitigated: {id: 'venture_dmg_mitigated', title: 'Damage Mitigated', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL},
  venture_burrow_damage: { id: 'venture_burrow_damage', title: 'Burrow Damage', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  venture_drill_dash_damage: { id: 'venture_drill_dash_damage', title: 'Drill Dash Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  venture_tectonic_shock_kills: { id: 'venture_tectonic_shock_kills', title: 'Tectonic Shock Kills', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  venture_wins: { id: 'venture_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
  venture_time_played: { id: 'venture_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },

  // Ashe
  ashe_eliminations: { id: 'ashe_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ashe_unscoped_hits: { id: 'ashe_unscoped_hits', title: 'Unscoped Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ashe_scoped_hits: { id: 'ashe_scoped_hits', title: 'Scoped Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ashe_critical_hits: { id: 'ashe_critical_hits', title: 'Critical Hits', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ashe_dyno_damage: { id: 'ashe_dyno_damage', title: 'Dynamite Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ashe_bob_kills: { id: 'ashe_bob_kills', title: 'B.O.B. Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ashe_time_played: { id: 'ashe_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  ashe_wins: { id: 'ashe_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Baptiste
  baptiste_heal_done: { id: 'baptiste_heal_done', title: 'Healing Done', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  baptiste_players_saved: { id: 'baptiste_players_saved', title: 'Players Saved', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  baptiste_dmg_dealt: { id: 'baptiste_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  baptiste_elimination: { id: 'baptiste_elimination', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  baptiste_dmg_amplified: { id: 'baptiste_dmg_amplified', title: 'Damage Amplified', icon: Sword, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  baptiste_heal_amplified: { id: 'baptiste_heal_amplified', title: 'Healing Amplified', icon: Sword, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  baptiste_immortality_save: { id: 'baptiste_immortality_save', title: 'Immortality Field Saves', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  baptiste_time_played: { id: 'baptiste_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  baptiste_wins: { id: 'baptiste_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Bastion
  bastion_dmg_dealt: { id: 'bastion_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  bastion_nonhero_dmg: { id: 'bastion_nonhero_dmg', title: 'Non-Hero Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  bastion_recon_critical: { id: 'bastion_recon_critical', title: 'Recon Critical Hits', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  bastion_assault_kills: { id: 'bastion_assault_kills', title: 'Assault Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  bastion_grenade_direct: { id: 'bastion_grenade_direct', title: 'Grenade Direct Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  bastion_artillery_kills: { id: 'bastion_artillery_kills', title: 'Artillery Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  bastion_time_played: { id: 'bastion_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  bastion_wins: { id: 'bastion_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Brigitte
  brigitte_healing_done: { id: 'brigitte_healing_done', title: 'Healing Done', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  brigitte_players_saved: { id: 'brigitte_players_saved', title: 'Players Saved', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  brigitte_weapon_dmg: { id: 'brigitte_weapon_dmg', title: 'Weapon Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  brigitte_whipshot_hits: { id: 'brigitte_whipshot_hits', title: 'Whipshot Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  brigitte_shield_hits: { id: 'brigitte_shield_hits', title: 'Shield Bash Hits', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  brigitte_rally_assists: { id: 'brigitte_rally_assists', title: 'Rally Assists', icon: Swords, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  brigitte_time_played: { id: 'brigitte_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  brigitte_wins: { id: 'brigitte_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Cassidy
  cassidy_dmg_dealt: { id: 'cassidy_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  cassidy_weapon_kills: { id: 'cassidy_weapon_kills', title: 'Weapon Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  cassidy_hammer_kills: { id: 'cassidy_hammer_kills', title: 'Fan the Hammer Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  cassidy_critical_hits: { id: 'cassidy_critical_hits', title: 'Critical Hits', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  cassidy_maggrenade_kills: { id: 'cassidy_maggrenade_kills', title: 'Magnetic Grenade Kills', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  cassidy_deadeye_kills: { id: 'cassidy_deadeye_kills', title: 'Deadeye Kills', icon: Eye, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  cassidy_time_played: { id: 'cassidy_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  cassidy_wins: { id: 'cassidy_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // D.Va
  dva_dmg_mitigated: { id: 'dva_dmg_mitigated', title: 'Damage Mitigated', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  dva_dmg_dealt: { id: 'dva_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  dva_gun_dmg: { id: 'dva_gun_dmg', title: 'Light Gun Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  dva_missile_kills: { id: 'dva_missile_kills', title: 'Micro Missile Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  dva_solo_kills: { id: 'dva_solo_kills', title: 'Solo Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  dva_destruct_kills: { id: 'dva_destruct_kills', title: 'Self-Destruct Kills', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  dva_time_played: { id: 'dva_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  dva_wins: { id: 'dva_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Doomfist
  doomfist_overhealth_created: { id: 'doomfist_overhealth_created', title: 'Overhealth Created', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  doomfist_dmg_dealt: { id: 'doomfist_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  doomfist_slam_kills: { id: 'doomfist_slam_kills', title: 'Seismic Slam Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  doomfist_punch_empowered: { id: 'doomfist_punch_empowered', title: 'Empowered Punch', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  doomfist_wall_stuns: { id: 'doomfist_wall_stuns', title: 'Wall Stuns', icon: Shapes, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  doomfist_meteor_kills: { id: 'doomfist_meteor_kills', title: 'Meteor Strike Kills', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  doomfist_time_played: { id: 'doomfist_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  doomfist_wins: { id: 'doomfist_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Echo
  echo_dmg_dealt: { id: 'echo_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  echo_weapon_kills: { id: 'echo_weapon_kills', title: 'Weapon Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  echo_beam_blows: { id: 'echo_beam_blows', title: 'Focusing Beam Final Blows', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  echo_bomb_dmg: { id: 'echo_bomb_dmg', title: 'Sticky Bomb Damage', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  echo_duplicate_kills: { id: 'echo_duplicate_kills', title: 'Duplicate Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  echo_duplicate_ults: { id: 'echo_duplicate_ults', title: 'Duplicate Ultimates Used', icon: Wand2, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  echo_time_played: { id: 'echo_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  echo_wins: { id: 'echo_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Freja
  freja_eliminations: { id: 'freja_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  freja_dmg_dealt: { id: 'freja_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  freja_final_blows: { id: 'freja_final_blows', title: 'Final Blows', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  freja_aim_kills: { id: 'freja_aim_kills', title: 'Take Aim Kills', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  freja_bola_sticks: { id: 'freja_bola_sticks', title: 'Bola Shot Sticks', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  freja_time_played: { id: 'freja_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  freja_wins: { id: 'freja_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Hazard
  hazard_dmg_mitigated: { id: 'hazard_dmg_mitigated', title: 'Damage Mitigated', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  hazard_spike_guard: { id: 'hazard_spike_guard', title: 'Spike Guard', icon: ShieldQuestion, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  hazard_leap_kills: { id: 'hazard_leap_kills', title: 'Violent Leap Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  hazard_wall_assists: { id: 'hazard_wall_assists', title: 'Jagged Wall Assists', icon: Swords, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  hazard_downpour_roots: { id: 'hazard_downpour_roots', title: 'Downpour Roots', icon: Shapes, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  hazard_time_played: { id: 'hazard_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  hazard_wins: { id: 'hazard_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Illari
  illari_secondary_heal: { id: 'illari_secondary_heal', title: 'Secondary Fire Healing', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  illari_pylon_heal: { id: 'illari_pylon_heal', title: 'Pylon Healing', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  illari_players_saved: { id: 'illari_players_saved', title: 'Players Saved', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  illari_eliminations: { id: 'illari_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  illari_knockback_kills: { id: 'illari_knockback_kills', title: 'Outburst Knockback Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  illari_sunstruck_detonations: { id: 'illari_sunstruck_detonations', title: 'Sunstruck Detonations', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  illari_time_played: { id: 'illari_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  illari_wins: { id: 'illari_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Junker Queen
  junker_queen_dmg_mitigated: { id: 'junker_queen_dmg_mitigated', title: 'Damage Mitigated', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junker_queen_dmg_dealt: { id: 'junker_queen_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junker_queen_wound_dmg: { id: 'junker_queen_wound_dmg', title: 'Wound Damage', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junker_queen_blade_kills: { id: 'junker_queen_blade_kills', title: 'Jagged Blade Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junker_queen_carnage_kills: { id: 'junker_queen_carnage_kills', title: 'Carnage Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junker_queen_rampage_kills: { id: 'junker_queen_rampage_kills', title: 'Rampage Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junker_queen_time_played: { id: 'junker_queen_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  junker_queen_wins: { id: 'junker_queen_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Junkrat
  junkrat_dmg_dealt: { id: 'junkrat_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junkrat_nonhero_dmg: { id: 'junkrat_nonhero_dmg', title: 'Non-Hero Damage', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junkrat_weapon_direct: { id: 'junkrat_weapon_direct', title: 'Weapon Direct Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junkrat_mine_kills: { id: 'junkrat_mine_kills', title: 'Concussion Mine Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junkrat_enemies_trapped: { id: 'junkrat_enemies_trapped', title: 'Enemies Trapped', icon: Shapes, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junkrat_tire_kills: { id: 'junkrat_tire_kills', title: 'Rip-Tire Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  junkrat_time_played: { id: 'junkrat_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  junkrat_wins: { id: 'junkrat_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Juno
  juno_heal_done: { id: 'juno_heal_done', title: 'Healing Done', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  juno_players_saved: { id: 'juno_players_saved', title: 'Players Saved', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  juno_eliminations: { id: 'juno_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  juno_ring_assists: { id: 'juno_ring_assists', title: 'Hyper Ring Assists', icon: Swords, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  juno_dmg_amplified: { id: 'juno_dmg_amplified', title: 'Damage Amplified', icon: Sword, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  juno_orbital_assists: { id: 'juno_orbital_assists', title: 'Orbital Ray Assists', icon: Swords, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  juno_time_played: { id: 'juno_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  juno_wins: { id: 'juno_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Kiriko
  kiriko_healing_done: { id: 'kiriko_healing_done', title: 'Healing Done', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  kiriko_players_saved: { id: 'kiriko_players_saved', title: 'Players Saved', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  kiriko_eliminations: { id: 'kiriko_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  kiriko_critical_hits: { id: 'kiriko_critical_hits', title: 'Critical Hits', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  kiriko_debuff_cleansed: { id: 'kiriko_debuff_cleansed', title: 'Debuffs Cleansed', icon: Wand2, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  kiriko_swift_escapes: { id: 'kiriko_swift_escapes', title: 'Swift Step Escapes', icon: Eye, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  kiriko_kitsune_assists: { id: 'kiriko_kitsune_assists', title: 'Kitsune Rush Assists', icon: Swords, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  kiriko_time_played: { id: 'kiriko_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  kiriko_wins: { id: 'kiriko_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Lifeweaver
  lifeweaver_blossom_heal: { id: 'lifeweaver_blossom_heal', title: 'Healing Blossom', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lifeweaver_players_saved: { id: 'lifeweaver_players_saved', title: 'Players Saved', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lifeweaver_eliminations: { id: 'lifeweaver_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lifeweaver_grip_saves: { id: 'lifeweaver_grip_saves', title: 'Life Grip Saves', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lifeweaver_dmg_mitigated: { id: 'lifeweaver_dmg_mitigated', title: 'Damage Mitigated (Petal Platform)', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lifeweaver_tree_heal: { id: 'lifeweaver_tree_heal', title: 'Tree of Life Healing', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lifeweaver_time_played: { id: 'lifeweaver_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  lifeweaver_wins: { id: 'lifeweaver_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Lúcio
  lucio_healing_done: { id: 'lucio_healing_done', title: 'Healing Done', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lucio_players_saved: { id: 'lucio_players_saved', title: 'Players Saved', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lucio_eliminations: { id: 'lucio_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lucio_speed_assists: { id: 'lucio_speed_assists', title: 'Speed Boost Assists', icon: Swords, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lucio_environmental_kills: { id: 'lucio_environmental_kills', title: 'Environmental Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lucio_barrier_dmg_mit: { id: 'lucio_barrier_dmg_mit', title: 'Sound Barrier Damage Mitigated', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  lucio_time_played: { id: 'lucio_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  lucio_wins: { id: 'lucio_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Mauga
  mauga_dmg_mitigated: { id: 'mauga_dmg_mitigated', title: 'Damage Mitigated (Overdrive)', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mauga_dmg_dealt: { id: 'mauga_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mauga_crit_dmg_dealt: { id: 'mauga_crit_dmg_dealt', title: 'Critical Damage Dealt', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mauga_enemy_ignitions: { id: 'mauga_enemy_ignitions', title: 'Enemy Ignitions', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mauga_knockback_hits: { id: 'mauga_knockback_hits', title: 'Overrun Knockback Hits', icon: Shapes, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mauga_heal_done: { id: 'mauga_heal_done', title: 'Healing Done (Berserker)', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mauga_cage_kills: { id: 'mauga_cage_kills', title: 'Cage Fight Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mauga_time_played: { id: 'mauga_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  mauga_wins: { id: 'mauga_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Mei
  mei_eliminations: { id: 'mei_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mei_primary_dmg: { id: 'mei_primary_dmg', title: 'Primary Fire Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mei_icicle_critical: { id: 'mei_icicle_critical', title: 'Icicle Critical Hits', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mei_objective_contest: { id: 'mei_objective_contest', title: 'Objective Contest Time', icon: Timer, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mei_self_heal: { id: 'mei_self_heal', title: 'Self Healing (Cryo-Freeze)', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mei_enemies_frozen: { id: 'mei_enemies_frozen', title: 'Enemies Frozen (Blizzard)', icon: Shapes, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mei_time_played: { id: 'mei_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  mei_wins: { id: 'mei_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Moira
  moira_grasp_heal: { id: 'moira_grasp_heal', title: 'Biotic Grasp Healing', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  moira_orb_heal: { id: 'moira_orb_heal', title: 'Biotic Orb Healing', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  moira_players_saved: { id: 'moira_players_saved', title: 'Players Saved', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  moira_eliminations: { id: 'moira_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  moira_nonultimate_dmg: { id: 'moira_nonultimate_dmg', title: 'Non-Ultimate Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  moira_coalescence: { id: 'moira_coalescence', title: 'Coalescence (Healing/Damage)', icon: Wand2, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  moira_time_played: { id: 'moira_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  moira_wins: { id: 'moira_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Orisa
  orisa_dmg_mitigated: { id: 'orisa_dmg_mitigated', title: 'Damage Mitigated (Fortify/Javelin Spin)', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  orisa_dmg_dealt: { id: 'orisa_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  orisa_critical_dmg: { id: 'orisa_critical_dmg', title: 'Critical Damage (Weapon)', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  orisa_javelin_hits: { id: 'orisa_javelin_hits', title: 'Energy Javelin Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  orisa_javelin_wall_pins: { id: 'orisa_javelin_wall_pins', title: 'Energy Javelin Wall Pins', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  orisa_terra_kills: { id: 'orisa_terra_kills', title: 'Terra Surge Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  orisa_time_played: { id: 'orisa_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  orisa_wins: { id: 'orisa_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Pharah
  pharah_elimination: { id: 'pharah_elimination', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  pharah_dmg_dealt: { id: 'pharah_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  pharah_weapon_direct_hits: { id: 'pharah_weapon_direct_hits', title: 'Weapon Direct Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  pharah_concussive_hits: { id: 'pharah_concussive_hits', title: 'Concussive Blast Hits', icon: Shapes, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  pharah_environmental_kills: { id: 'pharah_environmental_kills', title: 'Environmental Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  pharah_barrage_kills: { id: 'pharah_barrage_kills', title: 'Barrage Kills', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  pharah_aerial_kills: { id: 'pharah_aerial_kills', title: 'Aerial Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  pharah_time_played: { id: 'pharah_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  pharah_wins: { id: 'pharah_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Ramattra
  ramattra_block_dmg_mit: { id: 'ramattra_block_dmg_mit', title: 'Block Damage Mitigated', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ramattra_barrier_dmg_mit: { id: 'ramattra_barrier_dmg_mit', title: 'Barrier Damage Mitigated', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ramattra_dmg_dealt: { id: 'ramattra_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ramattra_weapon_dmg: { id: 'ramattra_weapon_dmg', title: 'Weapon Damage (Omnic Form)', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ramattra_pummel_dmg: { id: 'ramattra_pummel_dmg', title: 'Pummel Damage (Nemesis Form)', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ramattra_vortex_kills: { id: 'ramattra_vortex_kills', title: 'Ravenous Vortex Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ramattra_annihilation_kills: { id: 'ramattra_annihilation_kills', title: 'Annihilation Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ramattra_time_played: { id: 'ramattra_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  ramattra_wins: { id: 'ramattra_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Reaper
  reaper_dmg_dealt: { id: 'reaper_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  reaper_eliminations: { id: 'reaper_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  reaper_solo_kills: { id: 'reaper_solo_kills', title: 'Solo Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  reaper_self_heal: { id: 'reaper_self_heal', title: 'Self Healing (The Reaping)', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  reaper_teleport_kills: { id: 'reaper_teleport_kills', title: 'Shadow Step Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  reaper_blossom_kills: { id: 'reaper_blossom_kills', title: 'Death Blossom Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  reaper_time_played: { id: 'reaper_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  reaper_wins: { id: 'reaper_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Roadhog
  roadhog_dmg_mitigated: { id: 'roadhog_dmg_mitigated', title: 'Damage Mitigated (Take a Breather)', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  roadhog_dmg_dealt: { id: 'roadhog_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  roadhog_eliminations: { id: 'roadhog_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  roadhog_chain_hooked: { id: 'roadhog_chain_hooked', title: 'Enemies Chain Hooked', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  roadhog_enemies_trapped: { id: 'roadhog_enemies_trapped', title: 'Enemies Trapped (Pig Pen)', icon: Shapes, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  roadhog_self_heal: { id: 'roadhog_self_heal', title: 'Self Healing (Take a Breather)', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  roadhog_whole_hog_kills: { id: 'roadhog_whole_hog_kills', title: 'Whole Hog Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  roadhog_time_played: { id: 'roadhog_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  roadhog_wins: { id: 'roadhog_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Sigma
  sigma_dmg_mitigated: { id: 'sigma_dmg_mitigated', title: 'Damage Mitigated (Barrier/Grasp)', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sigma_overhealth_created: { id: 'sigma_overhealth_created', title: 'Overhealth Created (Kinetic Grasp)', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sigma_dmg_dealt: { id: 'sigma_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sigma_weapon_direct_hits: { id: 'sigma_weapon_direct_hits', title: 'Weapon Direct Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sigma_accretion_hits: { id: 'sigma_accretion_hits', title: 'Accretion Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sigma_flux_kills: { id: 'sigma_flux_kills', title: 'Gravitic Flux Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sigma_time_played: { id: 'sigma_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  sigma_wins: { id: 'sigma_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Sojourn
  sojourn_dmg_dealt: { id: 'sojourn_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sojourn_weapon_kill: { id: 'sojourn_weapon_kill', title: 'Weapon Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sojourn_charged_final_blows: { id: 'sojourn_charged_final_blows', title: 'Charged Shot Final Blows', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sojourn_slide_kills: { id: 'sojourn_slide_kills', title: 'Power Slide Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sojourn_disruptor_dmg: { id: 'sojourn_disruptor_dmg', title: 'Disruptor Shot Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sojourn_overclock_hits: { id: 'sojourn_overclock_hits', title: 'Overclock Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sojourn_time_played: { id: 'sojourn_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  sojourn_wins: { id: 'sojourn_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Sombra
  sombra_eliminations: { id: 'sombra_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sombra_solo_kills: { id: 'sombra_solo_kills', title: 'Solo Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sombra_enemies_hacked: { id: 'sombra_enemies_hacked', title: 'Enemies Hacked', icon: Brain, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sombra_low_h_teleports: { id: 'sombra_low_h_teleports', title: 'Low Health Teleports', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sombra_heal_pack_heal: { id: 'sombra_heal_pack_heal', title: 'Health Pack Healing', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sombra_emp_kills: { id: 'sombra_emp_kills', title: 'EMP Kills', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sombra_virus_kills: { id: 'sombra_virus_kills', title: 'Virus Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  sombra_time_played: { id: 'sombra_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  sombra_wins: { id: 'sombra_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Symmetra
  symmetra_dmg_dealt: { id: 'symmetra_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  symmetra_nonhero_dmg: { id: 'symmetra_nonhero_dmg', title: 'Non-Hero Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  symmetra_secondary_direct_hits: { id: 'symmetra_secondary_direct_hits', title: 'Secondary Fire Direct Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  symmetra_turret_kills: { id: 'symmetra_turret_kills', title: 'Sentry Turret Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  symmetra_teleport_kills: { id: 'symmetra_teleport_kills', title: 'Teleporter Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  symmetra_dmg_mitigated: { id: 'symmetra_dmg_mitigated', title: 'Damage Mitigated (Photon Barrier)', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  symmetra_time_played: { id: 'symmetra_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  symmetra_wins: { id: 'symmetra_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Torbjörn
  torbjorn_primary_dmg: { id: 'torbjorn_primary_dmg', title: 'Primary Fire Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  torbjorn_secondary_dmg: { id: 'torbjorn_secondary_dmg', title: 'Secondary Fire Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  torbjorn_hammer_kills: { id: 'torbjorn_hammer_kills', title: 'Forge Hammer Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  torbjorn_turret_kills: { id: 'torbjorn_turret_kills', title: 'Turret Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  torbjorn_dmg_mitigated: { id: 'torbjorn_dmg_mitigated', title: 'Damage Mitigated (Overload)', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  torbjorn_molten_kills: { id: 'torbjorn_molten_kills', title: 'Molten Core Kills', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  torbjorn_time_played: { id: 'torbjorn_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  torbjorn_wins: { id: 'torbjorn_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Widowmaker
  widowmaker_scoped_crit_hits: { id: 'widowmaker_scoped_crit_hits', title: 'Scoped Critical Hits', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  widowmaker_solo_kills: { id: 'widowmaker_solo_kills', title: 'Solo Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  widowmaker_unscoped_kills: { id: 'widowmaker_unscoped_kills', title: 'Unscoped Weapon Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  widowmaker_venom_applied: { id: 'widowmaker_venom_applied', title: 'Venom Mines Applied', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  widowmaker_recon_assists: { id: 'widowmaker_recon_assists', title: 'Recon Assists', icon: Eye, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  widowmaker_recon_final_blows: { id: 'widowmaker_recon_final_blows', title: 'Recon Final Blows', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  widowmaker_time_played: { id: 'widowmaker_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  widowmaker_wins: { id: 'widowmaker_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Winston
  winston_dmg_mitigated: { id: 'winston_dmg_mitigated', title: 'Damage Mitigated (Barrier)', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  winston_dmg_dealt: { id: 'winston_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  winston_jump_kills: { id: 'winston_jump_kills', title: 'Jump Pack Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  winston_secondary_hits: { id: 'winston_secondary_hits', title: 'Secondary Fire Hits', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  winston_environmental_kills: { id: 'winston_environmental_kills', title: 'Environmental Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  winston_primal_kills: { id: 'winston_primal_kills', title: 'Primal Rage Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  winston_time_played: { id: 'winston_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  winston_wins: { id: 'winston_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Wrecking Ball (Hammond)
  wrecking_ball_overhealth_created: { id: 'wrecking_ball_overhealth_created', title: 'Overhealth Created (Adaptive Shield)', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  wrecking_ball_dmg_dealt: { id: 'wrecking_ball_dmg_dealt', title: 'Damage Dealt', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  wrecking_ball_piledriver_kills: { id: 'wrecking_ball_piledriver_kills', title: 'Piledriver Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  wrecking_ball_knockback_hits: { id: 'wrecking_ball_knockback_hits', title: 'Knockback Hits', icon: Shapes, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  wrecking_ball_heal_pack_heal: { id: 'wrecking_ball_heal_pack_heal', title: 'Health Pack Healing', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  wrecking_ball_minefield_kills: { id: 'wrecking_ball_minefield_kills', title: 'Minefield Kills', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  wrecking_ball_time_played: { id: 'wrecking_ball_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  wrecking_ball_wins: { id: 'wrecking_ball_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Zarya
  zarya_self_dmg_mitigated: { id: 'zarya_self_dmg_mitigated', title: 'Self Damage Mitigated', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zarya_ally_dmg_mitigated: { id: 'zarya_ally_dmg_mitigated', title: 'Ally Damage Mitigated', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zarya_primary_dmg: { id: 'zarya_primary_dmg', title: 'Primary Fire Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zarya_secondary_dmg: { id: 'zarya_secondary_dmg', title: 'Secondary Fire Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zarya_high_energy_kills: { id: 'zarya_high_energy_kills', title: 'High Energy Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zarya_graviton_kills: { id: 'zarya_graviton_kills', title: 'Graviton Surge Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zarya_time_played: { id: 'zarya_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  zarya_wins: { id: 'zarya_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Zenyatta
  zenyatta_orb_heal: { id: 'zenyatta_orb_heal', title: 'Harmony Orb Healing', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zenyatta_players_saved: { id: 'zenyatta_players_saved', title: 'Players Saved', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zenyatta_eliminations: { id: 'zenyatta_eliminations', title: 'Eliminations', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zenyatta_critical_hits: { id: 'zenyatta_critical_hits', title: 'Critical Hits', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zenyatta_offensive_assists: { id: 'zenyatta_offensive_assists', title: 'Offensive Assists (Discord Orb)', icon: Swords, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zenyatta_volley_kills: { id: 'zenyatta_volley_kills', title: 'Charged Volley Kills', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zenyatta_transcendence: { id: 'zenyatta_transcendence', title: 'Transcendence Healing', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  zenyatta_time_played: { id: 'zenyatta_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  zenyatta_wins: { id: 'zenyatta_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

};

export function getBadgeDefinition(badgeId: string): BadgeDefinition | undefined {
  return badgeDefinitions[badgeId];
}
