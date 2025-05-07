
'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import HeroCard from '@/components/overwatch/HeroCard';
import BadgeInputFlyout from '@/components/overwatch/BadgeInputFlyout';
import HeroChallengeCard from '@/components/overwatch/HeroChallengeCard';
import type { Hero, HeroCalculated } from '@/types/overwatch';
import { initialHeroesData, calculateTotalXP, calculateLevelDetails } from '@/lib/overwatch-utils';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon, InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const LOCAL_STORAGE_KEY = 'overwatchProgressionData';

export default function Home() {
  const [heroes, setHeroes] = useState<HeroCalculated[]>([]);
  const [selectedHero, setSelectedHero] = useState<HeroCalculated | null>(null);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const { toast } = useToast();

  const calculateAndSetHeroes = useCallback((heroesData: Hero[]) => {
    const calculatedHeroes = heroesData.map(hero => {
      const totalXp = calculateTotalXP(hero);
      const levelDetails = calculateLevelDetails(totalXp);
      return { ...hero, totalXp, ...levelDetails };
    });
    setHeroes(calculatedHeroes.sort((a, b) => b.totalXp - a.totalXp)); // Sort by totalXP descending
  }, []);
  
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as Hero[];
        calculateAndSetHeroes(parsedData);
      } catch (error) {
        console.error("Failed to parse hero data from localStorage", error);
        calculateAndSetHeroes(initialHeroesData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialHeroesData.map(({challenges, ...rest}) => rest))); // Store without challenges
      }
    } else {
      calculateAndSetHeroes(initialHeroesData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialHeroesData.map(({challenges, ...rest}) => rest))); // Store without challenges
    }
  }, [calculateAndSetHeroes]);

  const handleSelectHero = (hero: HeroCalculated) => {
    // Find the hero from the state `heroes` to ensure we have the challenges data
    const fullHeroData = heroes.find(h => h.id === hero.id);
    setSelectedHero(fullHeroData || hero); // Fallback to hero if not found (should always be found)
    // setIsFlyoutOpen(true); // Commented out as per previous logic, but user might want this back for editing overall progression
  };
  
  const openEditFlyout = (hero: HeroCalculated) => {
    setSelectedHero(hero); // Ensure the correct hero is set for the flyout
    setIsFlyoutOpen(true);
  };


  const handleCloseFlyout = () => {
    setIsFlyoutOpen(false);
    // Keep selectedHero for the right panel, don't nullify it here unless specifically intended
  };

  const handleSaveHero = (updatedHeroFromFlyout: Hero) => { // Flyout sends Hero, not HeroCalculated
    const totalXp = calculateTotalXP(updatedHeroFromFlyout);
    const levelDetails = calculateLevelDetails(totalXp);
    const fullyUpdatedHero: HeroCalculated = { 
        ...updatedHeroFromFlyout, 
        totalXp, 
        ...levelDetails,
        challenges: heroes.find(h => h.id === updatedHeroFromFlyout.id)?.challenges || [] // Preserve challenges
    };

    const updatedHeroesList = heroes.map(h => (h.id === fullyUpdatedHero.id ? fullyUpdatedHero : h));
    
    setHeroes(updatedHeroesList.sort((a, b) => b.totalXp - a.totalXp));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHeroesList.map(({totalXp, level, xpTowardsNextLevel, xpNeededForNextLevel, currentLevelBaseXp, nextLevelBaseXp, challenges, ...rest}) => rest)));
    
    // If the saved hero is the currently selected hero for the right panel, update it too
    if (selectedHero && selectedHero.id === fullyUpdatedHero.id) {
        setSelectedHero(fullyUpdatedHero);
    }

    toast({
      title: "Hero Updated",
      description: `${fullyUpdatedHero.name}'s progression has been saved.`,
      variant: "default",
    });
    setIsFlyoutOpen(false); // Close flyout on save
  };

  const handleResetData = () => {
    if(window.confirm("Are you sure you want to reset all hero data to default? This cannot be undone.")) {
      calculateAndSetHeroes(initialHeroesData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialHeroesData.map(({challenges, ...rest}) => rest)));
      setSelectedHero(null); // Clear selected hero on reset
      toast({
        title: "Data Reset",
        description: "All hero data has been reset to default values.",
        variant: "default",
      });
    }
  };
  
  // Find the rank/title for the selected hero if available
  const selectedHeroRank = selectedHero ? (initialHeroesData.find(h => h.id === selectedHero.id) as any)?.rankTitle : "";


  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <header className="mb-6 text-center relative">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">Overwatch Progression Tracker</h1>
        <p className="text-lg text-muted-foreground mt-2">Track your sub-badges, hero levels, and specific challenges.</p>
         <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute top-0 right-0 text-muted-foreground hover:text-foreground">
                <InfoIcon className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-popover text-popover-foreground p-3 rounded-md shadow-lg text-sm" side="bottom" align="end">
              <p className="font-semibold mb-1">How XP is Calculated:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Hero Sub-Badges: 200 XP each</li>
                <li>Win Sub-Badges: 1200 XP each</li>
                <li>Time Played Sub-Badges: 5600 XP each</li>
              </ul>
              <p className="mt-2 font-semibold mb-1">Level Progression:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Levels 1-19: 5,000 XP per level</li>
                <li>Levels 20+: 60,000 XP per level</li>
              </ul>
               <p className="mt-3 text-xs">Click on a hero to see their challenges. Click the edit icon on a hero card to update their sub-badge progression.</p>
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
          <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2"> {/* Added max-height and overflow */}
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
                  onEditHero={openEditFlyout} // Pass the new handler for editing
                  isSelected={selectedHero?.id === hero.id} 
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Selected Hero Challenges */}
        <div className="w-full lg:w-3/5 xl:w-2/3">
          {selectedHero ? (
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-1 text-primary">{selectedHero.name}</h2>
              {selectedHeroRank && <p className="text-sm text-accent font-semibold uppercase tracking-wider mb-4">{selectedHeroRank}</p>}
              <p className="text-lg text-muted-foreground mb-6">Hero Level: {selectedHero.level} ({selectedHero.xpTowardsNextLevel.toLocaleString()} / {selectedHero.xpNeededForNextLevel.toLocaleString()} XP to next)</p>
              
              <h3 className="text-2xl font-semibold mb-4 text-foreground/90 border-b border-border pb-2">Challenges</h3>
              {selectedHero.challenges && selectedHero.challenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
                  {selectedHero.challenges.map(challenge => (
                    <HeroChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 bg-background/50 rounded-md">
                  <p className="text-muted-foreground">No specific challenges tracked for {selectedHero.name}.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] bg-card p-8 rounded-lg shadow-lg">
              <p className="text-xl text-center text-muted-foreground">Select a hero from the list to view their details and challenges.</p>
            </div>
          )}
        </div>
      </div>

      {selectedHero && isFlyoutOpen && ( // Ensure selectedHero is available for the flyout
        <BadgeInputFlyout
          hero={selectedHero} // Pass the currently selected hero for editing
          isOpen={isFlyoutOpen}
          onClose={handleCloseFlyout}
          onSave={handleSaveHero}
        />
      )}
      <Toaster />
    </div>
  );
}
