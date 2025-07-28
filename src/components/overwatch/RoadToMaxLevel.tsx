
'use client';

import React, { useMemo } from 'react';
import type { HeroCalculated } from '@/types/overwatch';
import { calculateXpToReachLevel } from '@/lib/overwatch-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Award, Star, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RoadToMaxLevelProps {
  hero: HeroCalculated;
  maxLevel: number;
}

const RoadToMaxLevel: React.FC<RoadToMaxLevelProps> = ({ hero, maxLevel }) => {
  const { toast } = useToast();

  const handleMilestoneClick = (level: number, xpForLevel: number) => {
    toast({
      title: `Milestone: Level ${level}`,
      description: `Total XP required to reach this level: ${xpForLevel.toLocaleString()}`,
    });
  };
  
  const levelMilestones = useMemo(() => {
    const milestones = [1, 5, 10, 25, 50, 75, 100, 150, 200, 250, 300, 400, maxLevel];
    if (hero.personalGoalLevel > 0 && !milestones.includes(hero.personalGoalLevel)) {
      milestones.push(hero.personalGoalLevel);
    }
    
    const uniqueMilestones = [...new Set(milestones)].sort((a, b) => a - b);
    
    // Ensure the hero's current level is represented if it's between milestones.
    if (!uniqueMilestones.includes(hero.level)){
        // Find where the current level should be inserted to keep the array sorted
        const indexToInsert = uniqueMilestones.findIndex(ms => ms > hero.level);
        if(indexToInsert !== -1){
            // only add if it's not right next to an existing milestone to avoid clutter
            if(uniqueMilestones[indexToInsert] - hero.level > 5 || (indexToInsert > 0 && hero.level - uniqueMilestones[indexToInsert - 1] > 5)){
                 //uniqueMilestones.splice(indexToInsert, 0, hero.level);
            }
        }
    }


    const xpForMax = calculateXpToReachLevel(maxLevel);

    return uniqueMilestones.map(level => {
      const xpForLevel = calculateXpToReachLevel(level);
      const isCompleted = hero.level >= level;
      const isPersonalGoal = level === hero.personalGoalLevel;
      const position = (xpForLevel / xpForMax) * 100;
      
      let Icon = Star;
      if (level === maxLevel) Icon = Award;
      if (isPersonalGoal) Icon = CheckCircle2;

      return {
        level,
        xpForLevel,
        isCompleted,
        isPersonalGoal,
        position,
        Icon,
      };
    });
  }, [hero.level, hero.personalGoalLevel, maxLevel]);

  const heroPosition = useMemo(() => {
    const xpForMax = calculateXpToReachLevel(maxLevel);
    if (xpForMax === 0) return 0;
    return (hero.totalXp / xpForMax) * 100;
  }, [hero.totalXp, maxLevel]);

  return (
    <div className="h-full flex flex-col pt-4 pr-4">
      <div className="relative flex-grow">
        {/* Vertical Line */}
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-border rounded-full" />
        
        {/* Hero's Current Position Indicator */}
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div 
                        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/30 z-10 transition-all duration-500" 
                        style={{ top: `calc(${heroPosition}% - 8px)`}}
                    >
                         <TrendingUp className="absolute -right-5 -top-0.5 h-5 w-5 text-primary"/>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p className="font-bold">Current Level: {hero.level}</p>
                    <p>{hero.totalXp.toLocaleString()} XP</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        {/* Milestone Markers */}
        <div className="absolute w-full h-full">
            {levelMilestones.map(({ level, position, isCompleted, Icon, xpForLevel }) => (
            <TooltipProvider key={level}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            type="button"
                            onClick={() => handleMilestoneClick(level, xpForLevel)}
                            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-0 bg-transparent border-none cursor-pointer" 
                            style={{ top: `${position}%` }}
                            aria-label={`Milestone Level ${level}`}
                        >
                             <div className={cn(
                                 "w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300",
                                 isCompleted ? "bg-accent text-accent-foreground" : "bg-card border-2 border-border"
                             )}>
                                <Icon className={cn("h-4 w-4", isCompleted ? "text-accent-foreground" : "text-muted-foreground")} />
                             </div>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p className="font-bold">Level {level} {level === hero.personalGoalLevel && "(Goal)"}</p>
                        <p>{xpForLevel.toLocaleString()} XP required</p>
                        {hero.totalXp < xpForLevel && <p className="text-xs text-muted-foreground">({(xpForLevel - hero.totalXp).toLocaleString()} XP to go)</p>}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RoadToMaxLevel;
