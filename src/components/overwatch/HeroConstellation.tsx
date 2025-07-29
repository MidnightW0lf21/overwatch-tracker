
'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Hero } from '@/types/overwatch';
import { getBadgeDefinition } from '@/lib/badge-definitions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeroConstellationProps {
  hero: Hero;
}

const s76ConstellationLayout: Record<string, { top: string; left: string }> = {
  s76_dmg_dealt: { top: '20%', left: '30%' },
  s76_critical_hits: { top: '40%', left: '15%' },
  s76_helix_direct: { top: '68%', left: '25%' },
  s76_helix_final_blows: { top: '45%', left: '40%' },
  s76_biotic_healing: { top: '50%', left: '65%' },
  s76_visor_kills: { top: '25%', left: '70%' },
};

const s76ConnectionOrder: string[] = [
  's76_dmg_dealt',
  's76_critical_hits',
  's76_helix_direct',
  's76_helix_final_blows',
  's76_biotic_healing',
  's76_visor_kills',
  's76_dmg_dealt' // Optional: connect back to start
];


const getStarSizeAndBrightness = (level: number, minLevel: number, maxLevel: number) => {
  const minSize = 8;
  const maxSize = 24;

  if (maxLevel === minLevel || level <= minLevel) return { size: minSize, opacity: 0.7, pulse: false, aura: false };
  if (level >= maxLevel) return { size: maxSize, opacity: 1, pulse: level > 100, aura: level > 250 };


  const levelRange = maxLevel - minLevel;
  const sizeRange = maxSize - minSize;
  const levelFraction = (level - minLevel) / levelRange;
  const size = minSize + (levelFraction * sizeRange);
  const opacity = 0.7 + (levelFraction * 0.3);

  return { size, opacity, pulse: level > 100, aura: level > 250 };
};


const HeroConstellation: React.FC<HeroConstellationProps> = ({ hero }) => {
  if (hero.id !== 's76') {
    return (
      <div className="flex items-center justify-center h-full bg-card/50 rounded-lg">
        <p className="text-muted-foreground">Constellation not available for this hero.</p>
      </div>
    );
  }
  
  const filteredChallenges = useMemo(() => hero.challenges.filter(c => {
    const badgeDef = getBadgeDefinition(c.badgeId);
    if (!badgeDef) return false;
    const isExcluded = badgeDef.id === 's76_wins' || badgeDef.id === 's76_time_played';
    return !isExcluded;
  }), [hero.challenges]);

  const { minLevel, maxLevel } = useMemo(() => {
    if (filteredChallenges.length === 0) return { minLevel: 1, maxLevel: 1 };
    const levels = filteredChallenges.map(c => c.level);
    const min = Math.min(...levels);
    const max = Math.max(...levels);
    return { minLevel: min > 0 ? min : 1, maxLevel: max > min ? max : min + 1 };
  }, [filteredChallenges]);

  const badgeIdToPositionMap = useMemo(() => {
      const map = new Map<string, { top: string; left: string }>();
      filteredChallenges.forEach((challenge) => {
          const badgeDef = getBadgeDefinition(challenge.badgeId);
          if (badgeDef) {
              const layoutKey = badgeDef.id;
              const position = s76ConstellationLayout[layoutKey];
              if (position) {
                  map.set(layoutKey, position);
              }
          }
      });
      return map;
  }, [filteredChallenges]);
  
  const lineSegments = useMemo(() => {
    const segments = [];
    const validConnectionOrder = s76ConnectionOrder.filter(id => badgeIdToPositionMap.has(id));

    for (let i = 0; i < validConnectionOrder.length - 1; i++) {
        const currentId = validConnectionOrder[i];
        const nextId = validConnectionOrder[i+1];
        const startPos = badgeIdToPositionMap.get(currentId);
        const endPos = badgeIdToPositionMap.get(nextId);

        if (startPos && endPos) {
            segments.push({
                path: `M ${startPos.left} ${startPos.top} L ${endPos.left} ${endPos.top}`,
                key: `line-${currentId}-${nextId}`,
            });
        }
    }
    return segments;
  }, [badgeIdToPositionMap]);

  return (
    <div className="w-full h-full bg-background rounded-lg p-4 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0 opacity-50"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 120, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
      />
      
      <div className="relative w-full h-full z-10">
        <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1, overflow: 'visible' }}>
            {lineSegments.map((seg) => (
                <path
                    key={seg.key}
                    d={seg.path}
                    stroke="hsl(var(--primary) / 0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                />
            ))}
        </svg>

        {filteredChallenges.map((challenge) => {
          const { size, opacity, pulse, aura } = getStarSizeAndBrightness(challenge.level, minLevel, maxLevel);
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
