
'use client';

import React, { useMemo } from 'react';
import type { HeroCalculated } from '@/types/overwatch';
import { calculateXpToReachLevel } from '@/lib/overwatch-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Award, Star, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { XP_PER_WIN_TYPE_BADGE_LEVEL, XP_PER_TIME_TYPE_BADGE_LEVEL } from '@/lib/badge-definitions';


interface RoadToMaxLevelProps {
  hero: HeroCalculated;
  maxLevel: number;
}

const RoadToMaxLevel: React.FC<RoadToMaxLevelProps> = ({ hero, maxLevel }) => {
  const { toast } = useToast();

  const handleMilestoneClick = (level: number, xpForLevel: number) => {
    const xpToGo = xpForLevel - hero.totalXp;

    let description = `Total XP required: ${xpForLevel.toLocaleString()}.`;

    if (xpToGo > 0) {
      const winsNeeded = Math.ceil(xpToGo / XP_PER_WIN_TYPE_BADGE_LEVEL);
      const timeBadgesNeeded = Math.ceil(xpToGo / XP_PER_TIME_TYPE_BADGE_LEVEL);
      
      description += ` You need ${xpToGo.toLocaleString()} more XP. That's about ${winsNeeded} 'Win' badge levels or ${timeBadgesNeeded} 'Time Played' badge levels.`;
    }


    toast({
      title: `Milestone: Level ${level}`,
      description: description,
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
                        className="absolute w-full left-0 z-10 transition-all duration-500 group" 
                        style={{ top: `calc(${heroPosition}% - 2px)`}}
                    >
                         <div className="w-full h-1 bg-primary group-hover:bg-primary/80" />
                         <TrendingUp className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-primary -mr-2"/>
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
            {levelMilestones.map(({ level, position, isCompleted, Icon, xpForLevel }) => {
                const xpToGo = xpForLevel - hero.totalXp;
                const winsNeeded = xpToGo > 0 ? Math.ceil(xpToGo / XP_PER_WIN_TYPE_BADGE_LEVEL) : 0;
                const timeBadgesNeeded = xpToGo > 0 ? Math.ceil(xpToGo / XP_PER_TIME_TYPE_BADGE_LEVEL) : 0;
                return (
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
                                {xpToGo > 0 && (
                                    <>
                                        <p className="text-xs text-muted-foreground">({xpToGo.toLocaleString()} XP to go)</p>
                                        <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                                            <p>~{winsNeeded} 'Win' Badges</p>
                                            <p>~{timeBadgesNeeded} 'Time' Badges</p>
                                        </div>
                                    </>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default RoadToMaxLevel;
