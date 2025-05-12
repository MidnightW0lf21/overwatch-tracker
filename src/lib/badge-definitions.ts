
import type React from 'react';
import {
  Shell, Crosshair, Skull, Shapes, HeartPulse, Eye, Clock, Trophy, Zap,
  ShieldQuestion, Sword, Swords, Target, Shield, Medal, Gauge, Timer, Bomb,
  Brain, Wand2, Activity, UserCheck
} from 'lucide-react';

// XP constants are defined in overwatch-utils.ts and imported where needed.
// This file focuses on badge properties.

export interface BadgeDefinition {
  id: string; // This is the BadgeType ID, e.g., "s76_damage_dealt"
  title: string;
  icon: React.ElementType; // Lucide Icon Component
  xpPerLevel: number;
}

// For badge definitions, we use direct XP values.
// These values should correspond to XP_PER_HERO_TYPE_BADGE_LEVEL, etc. from overwatch-utils.ts
const XP_HERO = 200;
const XP_WIN = 1200;
const XP_TIME = 5600;


export const badgeDefinitions: Record<string, BadgeDefinition> = {
  // Soldier: 76
  s76_damage_dealt: { id: 's76_damage_dealt', title: 'Damage Dealt', icon: Shell, xpPerLevel: XP_HERO },
  s76_critical_hits: { id: 's76_critical_hits', title: 'Critical Hits', icon: Crosshair, xpPerLevel: XP_HERO },
  s76_helix_direct: { id: 's76_helix_direct', title: 'Helix Rocket Direct Hits', icon: Skull, xpPerLevel: XP_HERO },
  s76_helix_final_blows: { id: 's76_helix_final_blows', title: 'Helix Rocket Final Blows', icon: Shapes, xpPerLevel: XP_HERO },
  s76_biotic_healing: { id: 's76_biotic_healing', title: 'Biotic Field Healing', icon: Activity, xpPerLevel: XP_HERO },
  s76_visor_kills: { id: 's76_visor_kills', title: 'Tactical Visor Kills', icon: Eye, xpPerLevel: XP_HERO },
  s76_time_played: { id: 's76_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_TIME },
  s76_wins: { id: 's76_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_WIN },

  // Tracer
  tracer_pulse_kills: { id: 'tracer_pulse_kills', title: 'Pulse Bomb Kills', icon: Bomb, xpPerLevel: XP_HERO },
  tracer_recall_healed: { id: 'tracer_recall_healed', title: 'Health Recalled', icon: HeartPulse, xpPerLevel: XP_HERO },
  tracer_time_played: { id: 'tracer_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_TIME },
  tracer_wins: { id: 'tracer_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_WIN },

  // Mercy
  mercy_healing_done: { id: 'mercy_healing_done', title: 'Healing Done', icon: HeartPulse, xpPerLevel: XP_HERO },
  mercy_rez: { id: 'mercy_rez', title: 'Resurrections', icon: UserCheck, xpPerLevel: XP_HERO },
  mercy_wins: { id: 'mercy_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_WIN },
  mercy_time_played: { id: 'mercy_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_TIME },

  // Reinhardt
  rein_shatter_stuns: { id: 'rein_shatter_stuns', title: 'Earthshatter Stuns', icon: ShieldQuestion, xpPerLevel: XP_HERO },
  rein_charge_pins: { id: 'rein_charge_pins', title: 'Charge Pins', icon: Target, xpPerLevel: XP_HERO },
  rein_damage_blocked: { id: 'rein_damage_blocked', title: 'Damage Blocked', icon: Shield, xpPerLevel: XP_HERO },
  rein_wins: { id: 'rein_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_WIN },
  rein_time_played: { id: 'rein_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_TIME },

  // Ana
  ana_sleep_darts: { id: 'ana_sleep_darts', title: 'Sleep Darts Hit', icon: Timer, xpPerLevel: XP_HERO },
  ana_biotic_grenade_assists: { id: 'ana_biotic_grenade_assists', title: 'Biotic Grenade Assists', icon: HeartPulse, xpPerLevel: XP_HERO },
  ana_nano_boosts: { id: 'ana_nano_boosts', title: 'Nano Boosts Applied', icon: Zap, xpPerLevel: XP_HERO },
  ana_wins: { id: 'ana_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_WIN },
  ana_time_played: { id: 'ana_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_TIME },

  // Genji
  genji_blade_kills: { id: 'genji_blade_kills', title: 'Dragonblade Kills', icon: Swords, xpPerLevel: XP_HERO },
  genji_deflect_damage: { id: 'genji_deflect_damage', title: 'Damage Deflected', icon: ShieldQuestion, xpPerLevel: XP_HERO },
  genji_wins: { id: 'genji_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_WIN },
  genji_time_played: { id: 'genji_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_TIME },
  
  // Venture
  venture_burrow_damage: { id: 'venture_burrow_damage', title: 'Burrow Damage', icon: Activity, xpPerLevel: XP_HERO },
  venture_drill_dash_damage: { id: 'venture_drill_dash_damage', title: 'Drill Dash Damage', icon: Zap, xpPerLevel: XP_HERO },
  venture_tectonic_shock_kills: { id: 'venture_tectonic_shock_kills', title: 'Tectonic Shock Kills', icon: Bomb, xpPerLevel: XP_HERO },
  venture_wins: { id: 'venture_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_WIN },
  venture_time_played: { id: 'venture_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_TIME },
};

export function getBadgeDefinition(badgeId: string): BadgeDefinition | undefined {
  return badgeDefinitions[badgeId];
}
