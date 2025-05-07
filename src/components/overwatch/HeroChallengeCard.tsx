
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { HeroChallenge } from '@/types/overwatch';
import { cn } from '@/lib/utils';

interface HeroChallengeCardProps {
  challenge: HeroChallenge;
  heroId: string; // Needed to identify which hero this badge belongs to
  onLevelChange: (heroId: string, challengeId: string, newLevel: number) => void;
}

const HeroChallengeCard: React.FC<HeroChallengeCardProps> = ({ challenge, heroId, onLevelChange }) => {
  const IconComponent = challenge.icon;
  const [currentLevel, setCurrentLevel] = useState(challenge.level);

  useEffect(() => {
    setCurrentLevel(challenge.level);
  }, [challenge.level]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(e.target.value, 10);
    if (!isNaN(newLevel) && newLevel >= 0) {
      setCurrentLevel(newLevel);
    } else if (e.target.value === '') {
      setCurrentLevel(0); // Treat empty input as 0 for immediate visual feedback
    }
  };

  const handleInputBlur = () => {
    // Ensure a valid number, default to 0 if invalid or empty on blur
    const finalLevel = isNaN(currentLevel) || currentLevel < 0 ? 0 : currentLevel;
    if (finalLevel !== challenge.level) { // Only call if value actually changed
        onLevelChange(heroId, challenge.id, finalLevel);
    }
    setCurrentLevel(finalLevel); // Ensure UI reflects the potentially coerced value
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
       // Optionally blur the input to remove focus
      (e.target as HTMLInputElement).blur();
    }
  };


  return (
    <Card className="bg-card text-card-foreground shadow-md rounded-lg overflow-hidden flex flex-col h-full">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center space-x-3">
          <IconComponent className="h-7 w-7 text-primary flex-shrink-0" strokeWidth={1.5} />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold uppercase tracking-wider truncate" title={challenge.title}>
              {challenge.title}
            </h3>
            <p className="text-xs text-muted-foreground">XP/Lvl: {challenge.xpPerLevel.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-1 flex-grow flex flex-col justify-end">
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
            min="0"
            className="h-9 text-sm bg-input w-full"
            placeholder="0"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroChallengeCard;
