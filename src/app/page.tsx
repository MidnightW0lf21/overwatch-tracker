
'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import HeroCard from '@/components/overwatch/HeroCard';
// BadgeInputFlyout is removed
import HeroChallengeCard from '@/components/overwatch/HeroChallengeCard';
import type { Hero, HeroCalculated, HeroChallenge } from '@/types/overwatch';
import { initialHeroesData, calculateTotalXP, calculateLevelDetails, XP_PER_HERO_TYPE_BADGE_LEVEL, XP_PER_WIN_TYPE_BADGE_LEVEL, XP_PER_TIME_TYPE_BADGE_LEVEL } from '@/lib/overwatch-utils';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCwIcon, InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const LOCAL_STORAGE_KEY = 'overwatchProgressionData_v2'; // New key for new data structure

export default function Home() {
  const [heroes, setHeroes] = useState<HeroCalculated[]>([]);
  const [selectedHero, setSelectedHero] = useState<HeroCalculated | null>(null);
  // isFlyoutOpen state is removed
  const { toast } = useToast();

  const calculateAndSetHeroes = useCallback((heroesData: Hero[]) => {
    const calculatedHeroes = heroesData.map(hero => {
      const totalXp = calculateTotalXP(hero.challenges); // Pass challenges array
      const levelDetails = calculateLevelDetails(totalXp);
      return { ...hero, totalXp, ...levelDetails };
    });
    setHeroes(calculatedHeroes.sort((a, b) => b.totalXp - a.totalXp));
  }, []);
  
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as Hero[]; // Expecting new Hero structure
        calculateAndSetHeroes(parsedData);
      } catch (error) {
        console.error("Failed to parse hero data from localStorage", error);
        calculateAndSetHeroes(initialHeroesData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialHeroesData)); 
      }
    } else {
      calculateAndSetHeroes(initialHeroesData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialHeroesData));
    }
  }, [calculateAndSetHeroes]);

  const handleSelectHero = (hero: HeroCalculated) => {
    const fullHeroData = heroes.find(h => h.id === hero.id);
    setSelectedHero(fullHeroData || hero);
  };
  
  // openEditFlyout handler is removed as flyout is removed

  // handleCloseFlyout handler is removed

  // handleSaveHero (flyout save) is removed
  
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

    setHeroes(updatedHeroesList.sort((a, b) => b.totalXp - a.totalXp));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHeroesList.map(
      // Destructure to save only the base Hero structure, not calculated fields
      ({ totalXp, level, xpTowardsNextLevel, xpNeededForNextLevel, currentLevelBaseXp, nextLevelBaseXp, ...rest }) => rest
    )));
    
    const updatedSelectedHero = updatedHeroesList.find(h => h.id === heroId);
    if (updatedSelectedHero && selectedHero && selectedHero.id === heroId) {
      setSelectedHero(updatedSelectedHero);
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
      calculateAndSetHeroes(initialHeroesData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialHeroesData));
      setSelectedHero(null); 
      toast({
        title: "Data Reset",
        description: "All hero data has been reset to default values.",
        variant: "default",
      });
    }
  };
  
  const selectedHeroRank = selectedHero ? (initialHeroesData.find(h => h.id === selectedHero.id) as any)?.rankTitle : "";
  const personalGoalProgress = selectedHero ? (selectedHero.totalXp / selectedHero.personalGoalXP) * 100 : 0;


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
               <p className="mt-3 text-xs">Click on a hero to see their badges. Edit badge levels directly in the right panel.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>
      
      <div className="flex justify-end mb-4">
        <Button onClick={handleResetData} variant="destructive" size="sm">
          <RefreshCwIcon className="mr-2 h-4 w-4" /> Reset All Data
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Hero List */}
        <div className="w-full lg:w-2/5 xl:w-1/3">
          <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
            {heroes.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">Loading hero data...</p>
              </div>
            ) : (
              heroes.map(hero => (
                <HeroCard 
                  key={hero.id} 
                  hero={hero} 
                  onSelectHero={handleSelectHero}
                  // onEditHero is removed
                  isSelected={selectedHero?.id === hero.id} 
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Selected Hero Badges */}
        <div className="w-full lg:w-3/5 xl:w-2/3">
          {selectedHero ? (
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-1 text-primary">{selectedHero.name}</h2>
              {selectedHeroRank && <p className="text-sm text-accent font-semibold uppercase tracking-wider mb-1">{selectedHeroRank}</p>}
              <p className="text-lg text-muted-foreground">Hero Level: {selectedHero.level}</p>
              <div className="text-xs text-muted-foreground mb-2">
                ({selectedHero.xpTowardsNextLevel.toLocaleString()} / {selectedHero.xpNeededForNextLevel.toLocaleString()} XP to next hero level)
              </div>

              <div className="mb-6">
                <h3 className="text-md font-semibold text-foreground/90 mb-1">Personal Goal Progress</h3>
                <Progress value={personalGoalProgress > 100 ? 100 : personalGoalProgress} className="h-3 bg-accent/20 [&>div]:bg-accent" />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {selectedHero.totalXp.toLocaleString()} / {selectedHero.personalGoalXP.toLocaleString()} XP ({Math.min(100, personalGoalProgress).toFixed(1)}%)
                </p>
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 text-foreground/90 border-b border-border pb-2">Hero Badges</h3>
              {selectedHero.challenges && selectedHero.challenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-26rem)] overflow-y-auto pr-2">
                  {selectedHero.challenges.map(challenge => (
                    <HeroChallengeCard 
                        key={challenge.id} 
                        challenge={challenge} 
                        heroId={selectedHero.id}
                        onLevelChange={handleBadgeLevelChange} 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 bg-background/50 rounded-md">
                  <p className="text-muted-foreground">No badges tracked for {selectedHero.name}.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] bg-card p-8 rounded-lg shadow-lg">
              <p className="text-xl text-center text-muted-foreground">Select a hero from the list to view their badges and progress.</p>
            </div>
          )}
        </div>
      </div>

      {/* BadgeInputFlyout is removed */}
      <Toaster />
    </div>
  );
}
