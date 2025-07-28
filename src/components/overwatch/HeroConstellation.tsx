
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Hero, HeroChallenge } from '@/types/overwatch';
import { getBadgeDefinition } from '@/lib/badge-definitions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeroConstellationProps {
  hero: Hero;
}

// Define the shape for Soldier: 76's constellation (approximating a rifle)
const s76ConstellationLayout: Record<string, { top: string; left: string }> = {
  s76_dmg_dealt: { top: '50%', left: '10%' }, // Barrel End
  s76_critical_hits: { top: '50%', left: '30%' },
  s76_helix_direct: { top: '45%', left: '50%' }, // Main Body
  s76_helix_final_blows: { top: '55%', left: '50%' },
  s76_biotic_healing: { top: '60%', left: '70%' }, // Stock
  s76_visor_kills: { top: '40%', left: '45%' }, // Scope
  s76_time_played: { top: '65%', left: '85%' },
  s76_wins: { top: '55%', left: '90%' },
  // Fallback for any other badges
  default_1: { top: '20%', left: '20%' },
  default_2: { top: '80%', left: '80%' },
};

const getStarSizeAndBrightness = (level: number) => {
  if (level >= 251) return { size: 20, opacity: 1, pulse: true, aura: true };
  if (level >= 101) return { size: 16, opacity: 0.95, pulse: true, aura: false };
  if (level >= 26) return { size: 12, opacity: 0.85, pulse: false, aura: false };
  return { size: 8, opacity: 0.7, pulse: false, aura: false };
};

const HeroConstellation: React.FC<HeroConstellationProps> = ({ hero }) => {
  if (hero.id !== 's76') {
    return (
      <div className="flex items-center justify-center h-full bg-card/50 rounded-lg">
        <p className="text-muted-foreground">Constellation not available for this hero.</p>
      </div>
    );
  }

  const badgePositions = hero.challenges.map((challenge, index) => {
      const badgeDef = getBadgeDefinition(challenge.badgeId);
      const layoutKey = badgeDef?.id || `default_${index + 1}`;
      return s76ConstellationLayout[layoutKey] || s76ConstellationLayout[`default_${(index % 2) + 1}`];
  });


  return (
    <div className="w-full h-full bg-background rounded-lg p-4 relative overflow-hidden">
      {/* Subtle animated background */}
      <motion.div
        className="absolute inset-0 z-0 opacity-50"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 120, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
      />
      
      <div className="relative w-full h-full z-10">
        <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
          <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
              <stop offset="50%" stopColor="hsl(var(--primary) / 0.5)" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
              </linearGradient>
          </defs>
          {badgePositions.map((pos, i) =>
              i < badgePositions.length - 1 && (
              <line
                  key={`line-${i}`}
                  x1={pos.left}
                  y1={pos.top}
                  x2={badgePositions[i + 1].left}
                  y2={badgePositions[i + 1].top}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
              />
              )
          )}
        </svg>

        {hero.challenges.map((challenge, index) => {
          const { size, opacity, pulse, aura } = getStarSizeAndBrightness(challenge.level);
          const badgeDef = getBadgeDefinition(challenge.badgeId);
          const position = badgePositions[index];
          
          return (
            <TooltipProvider key={challenge.id} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="absolute rounded-full bg-primary"
                    style={{
                      top: position.top,
                      left: position.left,
                      width: size,
                      height: size,
                      opacity: opacity,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                      boxShadow: aura ? `0 0 15px 5px hsl(var(--primary) / 0.5)`: 'none',
                    }}
                    animate={pulse ? { scale: [1, 1.2, 1], opacity: [opacity, 1, opacity] } : {}}
                    transition={pulse ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{badgeDef?.title || 'Unknown Badge'}</p>
                  <p>Level: {challenge.level}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};

export default HeroConstellation;

    