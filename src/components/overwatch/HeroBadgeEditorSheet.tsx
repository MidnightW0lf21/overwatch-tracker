
'use client';

import type React from 'react';
import type { HeroCalculated, StoredHero } from '@/types/overwatch';
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
  initialHeroesData: StoredHero[]; // To get static data like rankTitle
}

const HeroBadgeEditorSheet: React.FC<HeroBadgeEditorSheetProps> = ({
  isOpen,
  hero,
  onBadgeLevelChange,
  onClose,
  initialHeroesData,
}) => {
  if (!hero) {
    return null;
  }

  const heroStaticData = initialHeroesData.find(h => h.id === hero.id);
  const rankTitle = (heroStaticData as any)?.rankTitle || "Aspirant Hero";
  const personalGoalProgress = hero.personalGoalXP > 0 ? (hero.totalXp / hero.personalGoalXP) * 100 : 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col" side="right">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-2xl text-primary">{hero.name}</SheetTitle>
          {rankTitle && <p className="text-sm text-accent font-semibold uppercase tracking-wider -mt-1">{rankTitle}</p>}
          <SheetDescription>
            Level: {hero.level} ({hero.xpTowardsNextLevel.toLocaleString()} / {hero.xpNeededForNextLevel.toLocaleString()} XP to next)
          </SheetDescription>
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
            <div className="flex items-center justify-center h-32 bg-background/50 rounded-md">
              <p className="text-muted-foreground">No badges tracked for {hero.name}.</p>
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
