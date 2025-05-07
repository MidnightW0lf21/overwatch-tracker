
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { HeroCalculated } from '@/types/overwatch';
import HeroChallengeCard from './HeroChallengeCard';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { XP_PER_TIME_TYPE_BADGE_LEVEL, calculateXpToReachLevel } from '@/lib/overwatch-utils';
import { ClockIcon } from 'lucide-react';

interface HeroBadgeEditorSheetProps {
  isOpen: boolean;
  hero: HeroCalculated | null;
  onBadgeLevelChange: (heroId: string, challengeId: string, newLevel: number) => void;
  onClose: () => void;
}

const HERO_MAX_LEVEL = 500; // Defined max level for a hero

const HeroBadgeEditorSheet: React.FC<HeroBadgeEditorSheetProps> = ({
  isOpen,
  hero,
  onBadgeLevelChange,
  onClose,
}) => {
  const [estimatedTimeToMax, setEstimatedTimeToMax] = useState<string | null>(null);

  useEffect(() => {
    if (hero) {
      if (hero.level >= HERO_MAX_LEVEL) {
        setEstimatedTimeToMax("Max level reached!");
      } else {
        const timeBadge = hero.challenges.find(
          (c) => c.xpPerLevel === XP_PER_TIME_TYPE_BADGE_LEVEL
        );

        if (timeBadge) {
          const xpForMaxLevel = calculateXpToReachLevel(HERO_MAX_LEVEL + 1); // XP to complete level HERO_MAX_LEVEL
          const xpRemaining = Math.max(0, xpForMaxLevel - hero.totalXp);

          if (xpRemaining > 0 && XP_PER_TIME_TYPE_BADGE_LEVEL > 0) {
            const timeBadgeLevelsNeeded = xpRemaining / XP_PER_TIME_TYPE_BADGE_LEVEL;
            const totalMinutesNeeded = timeBadgeLevelsNeeded * 20; // 20 minutes per time badge level

            if (totalMinutesNeeded < 1 && totalMinutesNeeded > 0) {
              setEstimatedTimeToMax("~1 min");
            } else {
              const roundedTotalMinutes = Math.round(totalMinutesNeeded);
              if (roundedTotalMinutes === 0) {
                setEstimatedTimeToMax(totalMinutesNeeded > 0 ? "~1 min" : null); // Should be null if truly 0
              } else {
                const days = Math.floor(roundedTotalMinutes / (60 * 24));
                const remainingMinutesAfterDaysCalc = roundedTotalMinutes % (60 * 24);
                const hours = Math.floor(remainingMinutesAfterDaysCalc / 60);
                const minutes = remainingMinutesAfterDaysCalc % 60;

                let timeStringParts: string[] = [];
                if (days > 0) timeStringParts.push(`${days}d`);
                if (hours > 0) timeStringParts.push(`${hours}h`);
                if (minutes > 0) timeStringParts.push(`${minutes}m`);
                
                setEstimatedTimeToMax(timeStringParts.length > 0 ? timeStringParts.join(' ') : (roundedTotalMinutes > 0 ? "~1 min" : null) );
              }
            }
          } else { // xpRemaining is 0 or XP_PER_TIME_TYPE_BADGE_LEVEL is 0
             // If xpRemaining is 0, it means hero has enough XP for max level, should be caught by hero.level >= HERO_MAX_LEVEL
            setEstimatedTimeToMax(null); 
          }
        } else {
          setEstimatedTimeToMax("No time-based badge found to estimate.");
        }
      }
    } else {
      setEstimatedTimeToMax(null);
    }
  }, [hero]);

  if (!hero) {
    return null;
  }

  const rankTitle = `Level ${hero.level} Hero`; 
  const personalGoalProgress = hero.personalGoalXP > 0 ? Math.min(100, (hero.totalXp / hero.personalGoalXP) * 100) : 0;


  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col" side="right">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center space-x-4">
            {hero.portraitUrl && (
              <Image
                src={hero.portraitUrl}
                alt={`${hero.name} Portrait`}
                width={64}
                height={64}
                className="rounded-md border-2 border-primary"
                data-ai-hint="hero portrait"
              />
            )}
            <div>
              <SheetTitle className="text-2xl text-primary">{hero.name}</SheetTitle>
              <p className="text-sm text-accent font-semibold uppercase tracking-wider -mt-1">{rankTitle}</p>
              <SheetDescription>
                Level: {hero.level} ({hero.xpTowardsNextLevel.toLocaleString()} / {hero.xpNeededForNextLevel.toLocaleString()} XP to next)
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 py-4">
          <h3 className="text-md font-semibold text-foreground/90 mb-1">Personal Goal Progress</h3>
          <Progress value={personalGoalProgress} className="h-3 bg-accent/20 [&>div]:bg-accent" />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {hero.totalXp.toLocaleString()} / {hero.personalGoalXP.toLocaleString()} XP ({personalGoalProgress.toFixed(1)}%)
          </p>
        </div>

        {estimatedTimeToMax && (
          <div className="px-6 py-3 border-t border-border">
            <h3 className="text-md font-semibold text-foreground/90 mb-1 flex items-center">
              <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              Est. Time to Max Level ({HERO_MAX_LEVEL})
            </h3>
            <p className="text-sm text-muted-foreground ml-6">
              {estimatedTimeToMax}
            </p>
            {hero.level < HERO_MAX_LEVEL && hero.challenges.some(c => c.xpPerLevel === XP_PER_TIME_TYPE_BADGE_LEVEL) && !estimatedTimeToMax?.includes("No time-based badge") && !estimatedTimeToMax?.includes("Max level reached!") && (
                 <p className="text-xs text-muted-foreground/70 ml-6 mt-0.5">(Assuming a time badge level is earned every 20 mins of play)</p>
            )}
          </div>
        )}

        <h3 className="text-xl font-semibold mb-3 text-foreground/90 px-6 border-t border-border pt-4">
          Hero Badges
        </h3>
        <ScrollArea className="flex-grow px-6 pb-2">
          {hero.challenges && hero.challenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hero.challenges.map(challenge => (
                <HeroChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  heroId={hero.id}
                  onLevelChange={onBadgeLevelChange}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 bg-card/50 rounded-md p-4 text-center">
              <p className="text-muted-foreground">No badges tracked for {hero.name}.</p>
              <p className="text-xs mt-1 text-muted-foreground">You can add badges in the Manage Heroes & Badges page.</p>
            </div>
          )}
        </ScrollArea>
        <SheetFooter className="px-6 py-4 border-t border-border">
          <Button onClick={onClose} variant="outline">Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default HeroBadgeEditorSheet;
