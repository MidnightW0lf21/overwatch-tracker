
'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import HeroCard from '@/components/overwatch/HeroCard';
import HeroBadgeEditorSheet from '@/components/overwatch/HeroBadgeEditorSheet';
import type { Hero, HeroCalculated, StoredHero } from '@/types/overwatch';
import { 
  initialHeroesData, 
  calculateTotalXP, 
  calculateLevelDetails, 
  XP_PER_HERO_TYPE_BADGE_LEVEL, 
  XP_PER_WIN_TYPE_BADGE_LEVEL, 
  XP_PER_TIME_TYPE_BADGE_LEVEL,
  hydrateHeroes,
  dehydrateHeroes
} from '@/lib/overwatch-utils';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon, InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const LOCAL_STORAGE_KEY = 'overwatchProgressionData_v3';

export default function Home() {
  const [heroes, setHeroes] = useState<HeroCalculated[]>([]);
  const [editingHero, setEditingHero] = useState<HeroCalculated | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const calculateAndSetHeroes = useCallback((heroesData: Hero[]) => {
    const calculatedHeroes = heroesData.map(hero => {
      const totalXp = calculateTotalXP(hero.challenges);
      const levelDetails = calculateLevelDetails(totalXp);
      return { ...hero, totalXp, ...levelDetails };
    });
    setHeroes(calculatedHeroes.sort((a, b) => b.totalXp - a.totalXp));
  }, []);
  
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    const hydratedInitialData = hydrateHeroes(initialHeroesData);

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as StoredHero[];
        const hydratedRuntimeData = hydrateHeroes(parsedData);
        calculateAndSetHeroes(hydratedRuntimeData);
      } catch (error) {
        console.error("Failed to parse hero data from localStorage", error);
        calculateAndSetHeroes(hydratedInitialData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dehydrateHeroes(initialHeroesData)));
      }
    } else {
      calculateAndSetHeroes(hydratedInitialData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dehydrateHeroes(initialHeroesData)));
    }
  }, [calculateAndSetHeroes]);

  const handleEditHeroBadges = (hero: HeroCalculated) => {
    const fullHeroData = heroes.find(h => h.id === hero.id);
    setEditingHero(fullHeroData || hero);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    // Optional: setEditingHero(null) if you want to clear it immediately,
    // but Sheet's onOpenChange will handle it via isOpen.
  };
  
  const handleBadgeLevelChange = (heroId: string, challengeId: string, newLevel: number) => {
    const updatedHeroesList = heroes.map(h => {
      if (h.id === heroId) {
        const updatedChallenges = h.challenges.map(c => 
          c.id === challengeId ? { ...c, level: newLevel } : c
        );
        const totalXp = calculateTotalXP(updatedChallenges);
        const levelDetails = calculateLevelDetails(totalXp);
        return { ...h, challenges: updatedChallenges, totalXp, ...levelDetails };
      }
      return h;
    });

    const dehydratedHeroesForStorage = dehydrateHeroes(updatedHeroesList.map(
      ({ totalXp, level, xpTowardsNextLevel, xpNeededForNextLevel, currentLevelBaseXp, nextLevelBaseXp, ...rest }) => rest
    ));
    
    const sortedHeroes = updatedHeroesList.sort((a, b) => b.totalXp - a.totalXp);
    setHeroes(sortedHeroes);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dehydratedHeroesForStorage));
    
    const updatedHeroInstance = sortedHeroes.find(h => h.id === heroId);
    if (updatedHeroInstance && editingHero && editingHero.id === heroId) {
      setEditingHero(updatedHeroInstance); // Keep the sheet's hero data in sync
    }

    const changedHero = updatedHeroesList.find(h=>h.id === heroId);
    const changedChallenge = changedHero?.challenges.find(c=>c.id === challengeId);

    toast({
      title: "Badge Updated",
      description: `${changedHero?.name}'s "${changedChallenge?.title}" badge level set to ${newLevel}.`,
      variant: "default",
    });
  };


  const handleResetData = () => {
    if(window.confirm("Are you sure you want to reset all hero data to default? This cannot be undone.")) {
      const hydratedInitialData = hydrateHeroes(initialHeroesData);
      calculateAndSetHeroes(hydratedInitialData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dehydrateHeroes(initialHeroesData)));
      setEditingHero(null); 
      setIsSheetOpen(false);
      toast({
        title: "Data Reset",
        description: "All hero data has been reset to default values.",
        variant: "default",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <header className="mb-6 text-center relative">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">Overwatch Progression Tracker</h1>
        <p className="text-lg text-muted-foreground mt-2">Track your hero badges, levels, and personal goals.</p>
         <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute top-0 right-0 text-muted-foreground hover:text-foreground">
                <InfoIcon className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-popover text-popover-foreground p-3 rounded-md shadow-lg text-sm" side="bottom" align="end">
              <p className="font-semibold mb-1">How XP is Calculated:</p>
              <p className="text-xs mb-2">XP is earned by leveling up individual hero badges. Each badge has an XP per level value:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Hero-specific Badges: {XP_PER_HERO_TYPE_BADGE_LEVEL} XP per level</li>
                <li>Win Badges: {XP_PER_WIN_TYPE_BADGE_LEVEL} XP per level</li>
                <li>Time Played Badges: {XP_PER_TIME_TYPE_BADGE_LEVEL} XP per level</li>
              </ul>
              <p className="mt-2 font-semibold mb-1">Hero Level Progression:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Levels 1-19: 5,000 XP per hero level</li>
                <li>Levels 20+: 60,000 XP per hero level</li>
              </ul>
               <p className="mt-3 text-xs">Click on a hero to edit their badges and see progress.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>
      
      <div className="flex justify-end mb-4">
        <Button onClick={handleResetData} variant="destructive" size="sm">
          <RefreshCwIcon className="mr-2 h-4 w-4" /> Reset All Data
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {heroes.length === 0 ? (
          <div className="text-center py-10 col-span-full">
            <p className="text-xl text-muted-foreground">Loading hero data...</p>
          </div>
        ) : (
          heroes.map(hero => (
            <HeroCard 
              key={hero.id} 
              hero={hero} 
              onEditHeroBadges={handleEditHeroBadges}
            />
          ))
        )}
      </div>
      
      {editingHero && (
        <HeroBadgeEditorSheet
          isOpen={isSheetOpen}
          hero={editingHero}
          onBadgeLevelChange={handleBadgeLevelChange}
          onClose={handleSheetClose}
          // Pass initialHeroesData to find rankTitle if needed
          initialHeroesData={initialHeroesData}
        />
      )}
      <Toaster />
    </div>
  );
}
