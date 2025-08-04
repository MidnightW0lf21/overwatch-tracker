
import type { Role } from '@/types/overwatch';

const heroRoles: Record<string, Role> = {
  // Tanks
  dva: 'Tank',
  doomfist: 'Tank',
  junker_queen: 'Tank',
  mauga: 'Tank',
  orisa: 'Tank',
  ramattra: 'Tank',
  reinhardt: 'Tank',
  roadhog: 'Tank',
  sigma: 'Tank',
  winston: 'Tank',
  wrecking_ball: 'Tank',
  zarya: 'Tank',
  hazard: 'Tank', // Assuming Hazard is a tank based on badge names

  // Damage
  ashe: 'Damage',
  bastion: 'Damage',
  cassidy: 'Damage',
  echo: 'Damage',
  genji: 'Damage',
  hanzo: 'Damage',
  junkrat: 'Damage',
  mei: 'Damage',
  pharah: 'Damage',
  reaper: 'Damage',
  sojourn: 'Damage',
  s76: 'Damage',
  sombra: 'Damage',
  symmetra: 'Damage',
  torbjorn: 'Damage',
  tracer: 'Damage',
  widowmaker: 'Damage',
  freja: 'Damage', // Assuming Freja is damage based on badge names
  venture: 'Damage',

  // Support
  ana: 'Support',
  baptiste: 'Support',
  brigitte: 'Support',
  illari: 'Support',
  kiriko: 'Support',
  lifeweaver: 'Support',
  lucio: 'Support',
  mercy: 'Support',
  moira: 'Support',
  zenyatta: 'Support',
  juno: 'Support', // Assuming Juno is support based on badge names
};

export function getHeroRole(heroId: string): Role | undefined {
  return heroRoles[heroId];
}
