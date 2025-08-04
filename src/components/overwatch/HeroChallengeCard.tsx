
'use client';

import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { HeroChallenge } from '@/types/overwatch';
import { getBadgeDefinition } from '@/lib/badge-definitions';
import { ShieldQuestion } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface HeroChallengeCardProps {
  challenge: HeroChallenge;
  heroId: string; 
  onLevelChange: (heroId: string, challengeId: string, newLevel: number) => void;
}

const badgeTiers = [
  { level: 1, name: 'Bronze', colorClasses: 'border-yellow-700/50 bg-yellow-900/10 text-yellow-200/90' },
  { level: 625, name: 'Silver', colorClasses: 'border-slate-400/50 bg-slate-500/10 text-slate-200' },
  { level: 1250, name: 'Gold', colorClasses: 'border-amber-400/60 bg-amber-500/10 text-amber-200' },
  { level: 1875, name: 'Purple', colorClasses: 'border-purple-400/60 bg-purple-500/10 text-purple-200' },
  { level: 2500, name: 'Master', colorClasses: 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200 shadow-lg shadow-fuchsia-500/30' },
];

const getTierInfo = (level: number) => {
  let currentTier = badgeTiers[0];
  for (let i = badgeTiers.length - 1; i >= 0; i--) {
    if (level >= badgeTiers[i].level) {
      currentTier = badgeTiers[i];
      break;
    }
  }
  
  const nextTierIndex = badgeTiers.findIndex(t => t.level > currentTier.level);
  const nextTier = nextTierIndex !== -1 ? badgeTiers[nextTierIndex] : null;

  return { currentTier, nextTier };
};

const HeroChallengeCard: React.FC<HeroChallengeCardProps> = ({ challenge, heroId, onLevelChange }) => {
  const [currentLevel, setCurrentLevel] = useState(String(challenge.level));
  
  const badgeDefinition = getBadgeDefinition(challenge.badgeId);

  useEffect(() => {
    setCurrentLevel(String(challenge.level));
  }, [challenge.level]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLevel(e.target.value);
  };

  const processLevelChange = () => {
    let newLevelNum = parseInt(currentLevel, 10);
    if (isNaN(newLevelNum) || newLevelNum < 1) {
      newLevelNum = 1; 
    }
    
    if (newLevelNum !== challenge.level) {
      onLevelChange(heroId, challenge.id, newLevelNum);
    }
    setCurrentLevel(String(newLevelNum)); 
  };

  const handleInputBlur = () => {
    processLevelChange();
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processLevelChange();
      (e.target as HTMLInputElement).blur(); 
    }
  };

  const IconComponent = badgeDefinition ? badgeDefinition.icon : ShieldQuestion;
  const displayTitle = badgeDefinition ? badgeDefinition.title : challenge.title || "Unknown Badge";
  const displayXpPerLevel = badgeDefinition ? badgeDefinition.xpPerLevel : challenge.xpPerLevel || 0;
    
  const { currentTier, nextTier } = getTierInfo(challenge.level);

  const progressPercentage = useMemo(() => {
    if (!nextTier) return 100; // Max tier
    const tierStartLevel = currentTier.level;
    const nextTierStartLevel = nextTier.level;
    const progressInTier = challenge.level - tierStartLevel;
    const tierLevelSpan = nextTierStartLevel - tierStartLevel;
    if (tierLevelSpan <= 0) return 100;
    return (progressInTier / tierLevelSpan) * 100;
  }, [challenge.level, currentTier, nextTier]);

  return (
    <Card className={cn("text-card-foreground shadow-md rounded-lg overflow-hidden flex flex-col h-full transition-all duration-300 border-2", currentTier.colorClasses)}>
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center space-x-3">
          <IconComponent className="h-7 w-7 text-primary flex-shrink-0" strokeWidth={1.5} />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold uppercase tracking-wider truncate" title={displayTitle}>
              {displayTitle}
            </h3>
            <p className="text-xs text-muted-foreground">XP/Lvl: {displayXpPerLevel.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-1 flex-grow flex flex-col justify-end">
         <div className="w-full mb-2">
          <Progress value={progressPercentage} className="h-1.5 bg-primary/10" />
           <div className="flex justify-between text-xs mt-1">
             <span className="font-bold">{currentTier.name}</span>
             {nextTier ? <span>Lvl {nextTier.level}</span> : <span className="font-bold">Max Tier</span>}
           </div>
         </div>
        <div className="mt-1">
          <Label htmlFor={`${heroId}-${challenge.id}-level`} className="text-xs text-muted-foreground mb-1 block">
            Badge Level
          </Label>
          <Input
            id={`${heroId}-${challenge.id}-level`}
            type="number"
            value={currentLevel}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            min="1"
            className="h-9 text-sm bg-input w-full"
            placeholder="1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroChallengeCard;
    
