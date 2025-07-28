
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Hero } from '@/types/overwatch';
import { getBadgeDefinition } from '@/lib/badge-definitions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeroConstellationProps {
  hero: Hero;
}

// Define a more abstract, visually appealing shape for Soldier: 76's constellation
const s76ConstellationLayout: Record<string, { top: string; left: string }> = {
  s76_wins: { top: '85%', left: '75%' },
  s76_time_played: { top: '65%', left: '88%' },
  s76_biotic_healing: { top: '50%', left: '65%' },
  s76_visor_kills: { top: '25%', left: '70%' },
  s76_helix_final_blows: { top: '45%', left: '40%' },
  s76_helix_direct: { top: '68%', left: '25%' },
  s76_critical_hits: { top: '40%', left: '15%' },
  s76_dmg_dealt: { top: '20%', left: '30%' },
};

// Define the explicit order for drawing connecting lines
const s76ConnectionOrder: string[] = [
  's76_dmg_dealt',
  's76_critical_hits',
  's76_helix_final_blows',
  's76_visor_kills',
  's76_biotic_healing',
  's76_time_played',
  's76_wins',
  's76_helix_direct',
  's76_critical_hits',
];


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
  
  const badgeIdToPositionMap = new Map<string, { top: string; left: string }>();
  hero.challenges.forEach((challenge, index) => {
    const badgeDef = getBadgeDefinition(challenge.badgeId);
    if (badgeDef) {
       const layoutKey = badgeDef.id;
       const position = s76ConstellationLayout[layoutKey] || { top: `${10 + (index * 5)}%`, left: `${10 + (index * 5)}%` };
       badgeIdToPositionMap.set(layoutKey, position);
    }
  });
  
  const lineSegments = s76ConnectionOrder.slice(0, -1).map((currentId, index) => {
    const nextId = s76ConnectionOrder[index + 1];
    const startPos = badgeIdToPositionMap.get(currentId);
    const endPos = badgeIdToPositionMap.get(nextId);
    
    if (startPos && endPos) {
      return { x1: startPos.left, y1: startPos.top, x2: endPos.left, y2: endPos.top, key: `line-${currentId}-${nextId}-${index}` };
    }
    return null;
  }).filter(Boolean);


  return (
    <div className="w-full h-full bg-background rounded-lg p-4 relative overflow-hidden">
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
          {lineSegments.map((seg) =>
              seg && (
              <line
                  key={seg.key}
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  stroke="url(#lineGradient)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
              />
              )
          )}
        </svg>

        {hero.challenges.map((challenge, index) => {
          const { size, opacity, pulse, aura } = getStarSizeAndBrightness(challenge.level);
          const badgeDef = getBadgeDefinition(challenge.badgeId);
          if (!badgeDef) return null;

          const position = badgeIdToPositionMap.get(badgeDef.id);
          if (!position) return null;
          
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
                  <p className="font-bold">{badgeDef.title}</p>
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
