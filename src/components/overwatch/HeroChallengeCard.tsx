
'use client';

import type React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { HeroChallenge } from '@/types/overwatch';
import { cn } from '@/lib/utils';

interface HeroChallengeCardProps {
  challenge: HeroChallenge;
}

const HeroChallengeCard: React.FC<HeroChallengeCardProps> = ({ challenge }) => {
  const progressPercentage = challenge.targetValue > 0 ? (challenge.currentValue / challenge.targetValue) * 100 : 0;
  const IconComponent = challenge.icon;

  return (
    <Card className="bg-card text-card-foreground shadow-md rounded-lg overflow-hidden flex flex-col h-full">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-3">
          <IconComponent className="h-8 w-8 text-primary" strokeWidth={1.5} />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">LEVEL {challenge.level}</p>
            <h3 className="text-sm font-semibold uppercase tracking-wider">{challenge.title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow flex flex-col justify-end">
        <div className="text-xs text-foreground/80 mb-1 flex justify-between">
          <span>
            {challenge.currentValue.toLocaleString()} / {challenge.targetValue.toLocaleString()} {challenge.unit || ''}
          </span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2 bg-secondary/30 [&>div]:bg-secondary" // Use secondary for blue progress
          aria-label={`${challenge.title} progress`} 
        />
      </CardContent>
    </Card>
  );
};

export default HeroChallengeCard;
