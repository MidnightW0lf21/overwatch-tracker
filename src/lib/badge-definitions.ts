
import type React from 'react';
import {
  Shell, Crosshair, Skull, Shapes, HeartPulse, Eye, Clock, Trophy, Zap,
  ShieldQuestion, Sword, Swords, Target, Shield, Medal, Gauge, Timer, Bomb,
  Brain, Wand2, Activity, UserCheck
} from 'lucide-react';
import { XP_PER_HERO_TYPE_BADGE_LEVEL, XP_PER_WIN_TYPE_BADGE_LEVEL, XP_PER_TIME_TYPE_BADGE_LEVEL } from './overwatch-utils';


export interface BadgeDefinition {
  id: string; 
  title: string;
  icon: React.ElementType; 
  xpPerLevel: number;
}

export const badgeDefinitions: Record<string, BadgeDefinition> = {
  // Soldier: 76
  s76_damage_dealt: { id: 's76_damage_dealt', title: 'Damage Dealt', icon: Shell, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_critical_hits: { id: 's76_critical_hits', title: 'Critical Hits', icon: Crosshair, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_helix_direct: { id: 's76_helix_direct', title: 'Helix Rocket Direct Hits', icon: Skull, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_helix_final_blows: { id: 's76_helix_final_blows', title: 'Helix Rocket Final Blows', icon: Shapes, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_biotic_healing: { id: 's76_biotic_healing', title: 'Biotic Field Healing', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_visor_kills: { id: 's76_visor_kills', title: 'Tactical Visor Kills', icon: Eye, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  s76_time_played: { id: 's76_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  s76_wins: { id: 's76_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Tracer
  tracer_pulse_kills: { id: 'tracer_pulse_kills', title: 'Pulse Bomb Kills', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  tracer_recall_healed: { id: 'tracer_recall_healed', title: 'Health Recalled', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  tracer_time_played: { id: 'tracer_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  tracer_wins: { id: 'tracer_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },

  // Mercy
  mercy_healing_done: { id: 'mercy_healing_done', title: 'Healing Done', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mercy_rez: { id: 'mercy_rez', title: 'Resurrections', icon: UserCheck, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  mercy_wins: { id: 'mercy_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
  mercy_time_played: { id: 'mercy_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },

  // Reinhardt
  rein_shatter_stuns: { id: 'rein_shatter_stuns', title: 'Earthshatter Stuns', icon: ShieldQuestion, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  rein_charge_pins: { id: 'rein_charge_pins', title: 'Charge Pins', icon: Target, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  rein_damage_blocked: { id: 'rein_damage_blocked', title: 'Damage Blocked', icon: Shield, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  rein_wins: { id: 'rein_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
  rein_time_played: { id: 'rein_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },

  // Ana
  ana_sleep_darts: { id: 'ana_sleep_darts', title: 'Sleep Darts Hit', icon: Timer, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ana_biotic_grenade_assists: { id: 'ana_biotic_grenade_assists', title: 'Biotic Grenade Assists', icon: HeartPulse, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ana_nano_boosts: { id: 'ana_nano_boosts', title: 'Nano Boosts Applied', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  ana_wins: { id: 'ana_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
  ana_time_played: { id: 'ana_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },

  // Genji
  genji_blade_kills: { id: 'genji_blade_kills', title: 'Dragonblade Kills', icon: Swords, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  genji_deflect_damage: { id: 'genji_deflect_damage', title: 'Damage Deflected', icon: ShieldQuestion, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  genji_wins: { id: 'genji_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
  genji_time_played: { id: 'genji_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
  
  // Venture
  venture_burrow_damage: { id: 'venture_burrow_damage', title: 'Burrow Damage', icon: Activity, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  venture_drill_dash_damage: { id: 'venture_drill_dash_damage', title: 'Drill Dash Damage', icon: Zap, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  venture_tectonic_shock_kills: { id: 'venture_tectonic_shock_kills', title: 'Tectonic Shock Kills', icon: Bomb, xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL },
  venture_wins: { id: 'venture_wins', title: 'Wins', icon: Trophy, xpPerLevel: XP_PER_WIN_TYPE_BADGE_LEVEL },
  venture_time_played: { id: 'venture_time_played', title: 'Time Played', icon: Clock, xpPerLevel: XP_PER_TIME_TYPE_BADGE_LEVEL },
};

export function getBadgeDefinition(badgeId: string): BadgeDefinition | undefined {
  return badgeDefinitions[badgeId];
}
