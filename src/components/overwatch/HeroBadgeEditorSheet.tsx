
'use client';

import type React from 'react';
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

interface HeroBadgeEditorSheetProps {
  isOpen: boolean;
  hero: HeroCalculated | null;
  onBadgeLevelChange: (heroId: string, challengeId: string, newLevel: number) => void;
  onClose: () => void;
}

const HeroBadgeEditorSheet: React.FC<HeroBadgeEditorSheetProps> = ({
  isOpen,
  hero,
  onBadgeLevelChange,
  onClose,
}) => {
  if (!hero) {
    return null;
  }

  // Rank title can be simplified or derived differently if needed, 
  // for now, using a generic title based on level.
  const rankTitle = `Level ${hero.level} Hero`; 
  const personalGoalProgress = hero.personalGoalXP > 0 ? (hero.totalXp / hero.personalGoalXP) * 100 : 0;

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
          <Progress value={personalGoalProgress > 100 ? 100 : personalGoalProgress} className="h-3 bg-accent/20 [&>div]:bg-accent" />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {hero.totalXp.toLocaleString()} / {hero.personalGoalXP.toLocaleString()} XP ({Math.min(100, personalGoalProgress).toFixed(1)}%)
          </p>
        </div>

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
