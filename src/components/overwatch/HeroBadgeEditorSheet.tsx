
'use client';

import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { HeroCalculated } from '@/types/overwatch';
import HeroChallengeCard from './HeroChallengeCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { calculateXpToReachLevel } from '@/lib/overwatch-utils';
import { getBadgeDefinition, XP_PER_HERO_TYPE_BADGE_LEVEL, XP_PER_TIME_TYPE_BADGE_LEVEL } from '@/lib/badge-definitions';
import { ClockIcon, StarIcon, TargetIcon } from 'lucide-react';
import RoadToMaxLevel from './RoadToMaxLevel';


interface HeroDetailDialogProps {
  isOpen: boolean;
  hero: HeroCalculated | null;
  onBadgeLevelChange: (heroId: string, challengeId: string, newLevel: number) => void;
  onClose: () => void;
}

const HERO_MAX_LEVEL = 500;

const HeroDetailDialog: React.FC<HeroDetailDialogProps> = ({
  isOpen,
  hero,
  onBadgeLevelChange,
  onClose,
}) => {
  const [estimatedTimeToMax, setEstimatedTimeToMax] = useState<string | null>(null);
  const [badgesNeededForGoal, setBadgesNeededForGoal] = useState<number | null>(null);
  const [xpForPersonalGoalLevel, setXpForPersonalGoalLevel] = useState<number>(0);

  useEffect(() => {
    if (hero) {
      if (hero.level >= HERO_MAX_LEVEL) {
        setEstimatedTimeToMax("Max level reached!");
      } else {
        const timeBadge = hero.challenges.find(
          (c) => {
            const badgeDef = getBadgeDefinition(c.badgeId);
            return badgeDef?.xpPerLevel === XP_PER_TIME_TYPE_BADGE_LEVEL;
          }
        );

        if (timeBadge) {
          const xpForMaxLevel = calculateXpToReachLevel(HERO_MAX_LEVEL + 1);
          const xpRemaining = Math.max(0, xpForMaxLevel - hero.totalXp);

          if (xpRemaining > 0 && XP_PER_TIME_TYPE_BADGE_LEVEL > 0) {
            const timeBadgeLevelsNeeded = xpRemaining / XP_PER_TIME_TYPE_BADGE_LEVEL;
            const totalMinutesNeeded = timeBadgeLevelsNeeded * 20;

            if (totalMinutesNeeded < 1 && totalMinutesNeeded > 0) {
              setEstimatedTimeToMax("~1 min");
            } else {
              const roundedTotalMinutes = Math.round(totalMinutesNeeded);
              if (roundedTotalMinutes === 0) {
                setEstimatedTimeToMax(totalMinutesNeeded > 0 ? "~1 min" : null);
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
          } else {
            setEstimatedTimeToMax(null);
          }
        } else {
          setEstimatedTimeToMax("No time-based badge found to estimate.");
        }
      }

      if (hero.personalGoalLevel > 0) {
        const xpToReachGoal = calculateXpToReachLevel(hero.personalGoalLevel);
        setXpForPersonalGoalLevel(xpToReachGoal);

        if (hero.totalXp < xpToReachGoal) {
          const xpRemainingForPersonalGoal = xpToReachGoal - hero.totalXp;
          if (XP_PER_HERO_TYPE_BADGE_LEVEL > 0) {
            const needed = Math.ceil(xpRemainingForPersonalGoal / XP_PER_HERO_TYPE_BADGE_LEVEL);
            setBadgesNeededForGoal(needed);
          } else {
            setBadgesNeededForGoal(null);
          }
        } else {
          setBadgesNeededForGoal(0);
        }
      } else {
        setBadgesNeededForGoal(null);
        setXpForPersonalGoalLevel(0);
      }

    } else {
      setEstimatedTimeToMax(null);
      setBadgesNeededForGoal(null);
      setXpForPersonalGoalLevel(0);
    }
  }, [hero]);

  if (!hero) {
    return null;
  }

  const rankTitle = `Level ${hero.level} Hero`;
  const personalGoalProgress = hero.personalGoalLevel > 0 && xpForPersonalGoalLevel > 0
    ? Math.min(100, (hero.totalXp / xpForPersonalGoalLevel) * 100)
    : (hero.personalGoalLevel === 0 ? 0 : (hero.totalXp > 0 ? 100 : 0) );


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center space-x-4">
            {hero.portraitUrl && (
              <Image
                src={hero.portraitUrl.trimStart()}
                alt={`${hero.name} Portrait`}
                width={80}
                height={80}
                className="rounded-lg border-2 border-primary shadow-lg"
                data-ai-hint="hero portrait"
              />
            )}
            <div>
              <DialogTitle className="text-3xl text-primary">{hero.name}</DialogTitle>
              <p className="text-lg text-accent font-semibold uppercase tracking-wider -mt-1">{rankTitle}</p>
              <DialogDescription className="text-base">
                {hero.xpTowardsNextLevel.toLocaleString()} / {hero.xpNeededForNextLevel.toLocaleString()} XP to next level
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 px-6 py-4 min-h-0">
          {/* Left Column for stats and badges */}
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
            <div className="flex-shrink-0">
              <h3 className="text-lg font-semibold text-foreground/90 mb-1 flex items-center">
                <TargetIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                Personal Goal: Level {hero.personalGoalLevel > 0 ? hero.personalGoalLevel : 'N/A'}
              </h3>
              <Progress value={personalGoalProgress} className="h-3 bg-accent/20 [&>div]:bg-accent" />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground mt-1">
                  {hero.personalGoalLevel === 0 && (<>No personal goal set.</>)}
                  {hero.personalGoalLevel > 0 && badgesNeededForGoal !== null && badgesNeededForGoal > 0 && (<>{badgesNeededForGoal.toLocaleString()} more badge level-ups to reach goal!</>)}
                  {hero.personalGoalLevel > 0 && badgesNeededForGoal === 0 && (<>Goal level {hero.personalGoalLevel} reached!</>)}
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {hero.personalGoalLevel > 0
                    ? `${hero.totalXp.toLocaleString()} / ${xpForPersonalGoalLevel.toLocaleString()} XP (${personalGoalProgress.toFixed(1)}%)`
                    : `${hero.totalXp.toLocaleString()} XP`}
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-border pt-4">
                <h3 className="text-lg font-semibold text-foreground/90 mb-2 flex items-center">
                    <StarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    Hero Badges
                </h3>
            </div>
            
            <ScrollArea className="flex-grow pr-4 -mr-4">
              {hero.challenges && hero.challenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                <div className="flex flex-col items-center justify-center h-full bg-card/50 rounded-md p-4 text-center">
                  <p className="text-muted-foreground">No badges tracked for {hero.name}.</p>
                  <p className="text-xs mt-1 text-muted-foreground">You can add badges in the Manage Heroes & Badges page.</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Right Column for Road to Max Level */}
          <div className="lg:col-span-1 lg:border-l lg:border-border lg:pl-4 flex flex-col">
              <h3 className="text-lg font-semibold text-foreground/90 mb-3 flex items-center flex-shrink-0">
                  <ClockIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                  Road to Max Level
              </h3>
              <RoadToMaxLevel hero={hero} maxLevel={HERO_MAX_LEVEL} />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border mt-auto">
          <Button onClick={onClose} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HeroDetailDialog;
