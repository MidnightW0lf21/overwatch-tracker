
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { HeroChallenge } from '@/types/overwatch';
import { getBadgeDefinition } from '@/lib/badge-definitions';
import { ShieldQuestion } from 'lucide-react';


interface HeroChallengeCardProps {
  challenge: HeroChallenge;
  heroId: string; 
  onLevelChange: (heroId: string, challengeId: string, newLevel: number) => void;
}

const HeroChallengeCard: React.FC<HeroChallengeCardProps> = ({ challenge, heroId, onLevelChange }) => {
  const [currentLevel, setCurrentLevel] = useState(String(challenge.level));
  const badgeDefinition = getBadgeDefinition(challenge.badgeId); // Fetches the full definition

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
  
  // Use icon from badgeDefinition if available, otherwise fallback
  const IconComponent = badgeDefinition ? badgeDefinition.icon : ShieldQuestion;
    
  return (
    <Card className="bg-card text-card-foreground shadow-md rounded-lg overflow-hidden flex flex-col h-full">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center space-x-3">
          {IconComponent && (
            <IconComponent className="h-7 w-7 text-primary flex-shrink-0" strokeWidth={1.5} />
          )}
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
            Badge Level (Min 1)
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
