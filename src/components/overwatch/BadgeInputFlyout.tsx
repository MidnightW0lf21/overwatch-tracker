'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import type { HeroCalculated } from '@/types/overwatch';
import { calculateTotalXP, calculateLevelDetails } from '@/lib/overwatch-utils';

interface BadgeInputFlyoutProps {
  hero: HeroCalculated | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedHero: HeroCalculated) => void;
}

const BadgeInputFlyout: React.FC<BadgeInputFlyoutProps> = ({ hero, isOpen, onClose, onSave }) => {
  const [heroSubBadges, setHeroSubBadges] = useState(0);
  const [winSubBadges, setWinSubBadges] = useState(0);
  const [timePlayedSubBadges, setTimePlayedSubBadges] = useState(0);
  const [personalGoalXP, setPersonalGoalXP] = useState(0);

  useEffect(() => {
    if (hero) {
      setHeroSubBadges(hero.heroSubBadges);
      setWinSubBadges(hero.winSubBadges);
      setTimePlayedSubBadges(hero.timePlayedSubBadges);
      setPersonalGoalXP(hero.personalGoalXP);
    }
  }, [hero]);

  if (!hero) return null;

  const handleSave = () => {
    const updatedBadgeData = {
      heroSubBadges,
      winSubBadges,
      timePlayedSubBadges,
    };
    const totalXp = calculateTotalXP(updatedBadgeData);
    const levelDetails = calculateLevelDetails(totalXp);
    
    onSave({
      ...hero,
      ...updatedBadgeData,
      personalGoalXP,
      totalXp,
      ...levelDetails,
    });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-card text-card-foreground border-l-primary">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Update Badges for {hero.name}</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Enter the number of sub-badges earned and your personal XP goal.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="heroSubBadges" className="text-right col-span-1">
              Hero Badges
            </Label>
            <Input
              id="heroSubBadges"
              type="number"
              value={heroSubBadges}
              onChange={(e) => setHeroSubBadges(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="col-span-2 bg-input"
              min="0"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="winSubBadges" className="text-right col-span-1">
              Win Badges
            </Label>
            <Input
              id="winSubBadges"
              type="number"
              value={winSubBadges}
              onChange={(e) => setWinSubBadges(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="col-span-2 bg-input"
              min="0"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="timePlayedSubBadges" className="text-right col-span-1">
              Time Badges
            </Label>
            <Input
              id="timePlayedSubBadges"
              type="number"
              value={timePlayedSubBadges}
              onChange={(e) => setTimePlayedSubBadges(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="col-span-2 bg-input"
              min="0"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="personalGoalXP" className="text-right col-span-1">
              Personal Goal XP
            </Label>
            <Input
              id="personalGoalXP"
              type="number"
              value={personalGoalXP}
              onChange={(e) => setPersonalGoalXP(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="col-span-2 bg-input"
              min="0"
              step="1000"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </SheetClose>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BadgeInputFlyout;
