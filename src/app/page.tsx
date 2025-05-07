'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import HeroCard from '@/components/overwatch/HeroCard';
import BadgeInputFlyout from '@/components/overwatch/BadgeInputFlyout';
import type { Hero, HeroCalculated } from '@/types/overwatch';
import { initialHeroesData, calculateTotalXP, calculateLevelDetails } from '@/lib/overwatch-utils';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';

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
    setHeroes(calculatedHeroes);
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
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialHeroesData));
      }
    } else {
      calculateAndSetHeroes(initialHeroesData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialHeroesData));
    }
  }, [calculateAndSetHeroes]);

  const handleSelectHero = (hero: HeroCalculated) => {
    setSelectedHero(hero);
    setIsFlyoutOpen(true);
  };

  const handleCloseFlyout = () => {
    setIsFlyoutOpen(false);
    setSelectedHero(null);
  };

  const handleSaveHero = (updatedHero: HeroCalculated) => {
    const updatedHeroes = heroes.map(h => (h.id === updatedHero.id ? updatedHero : h));
    setHeroes(updatedHeroes);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHeroes.map(({totalXp, level, xpTowardsNextLevel, xpNeededForNextLevel, currentLevelBaseXp, nextLevelBaseXp, ...rest}) => rest))); // Save raw Hero data
    toast({
      title: "Hero Updated",
      description: `${updatedHero.name}'s progression has been saved.`,
      variant: "default",
    });
  };

  const handleResetData = () => {
    if(window.confirm("Are you sure you want to reset all hero data to default? This cannot be undone.")) {
      calculateAndSetHeroes(initialHeroesData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialHeroesData));
      toast({
        title: "Data Reset",
        description: "All hero data has been reset to default values.",
        variant: "default",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">Overwatch Progression Tracker</h1>
        <p className="text-lg text-muted-foreground mt-2">Track your sub-badges and hero levels.</p>
      </header>
      
      <div className="flex justify-end mb-6">
        <Button onClick={handleResetData} variant="destructive" size="sm">
          <RefreshCwIcon className="mr-2 h-4 w-4" /> Reset All Data
        </Button>
      </div>

      {heroes.length === 0 ? (
         <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">Loading hero data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {heroes.map(hero => (
            <HeroCard key={hero.id} hero={hero} onSelectHero={handleSelectHero} />
          ))}
        </div>
      )}

      {selectedHero && (
        <BadgeInputFlyout
          hero={selectedHero}
          isOpen={isFlyoutOpen}
          onClose={handleCloseFlyout}
          onSave={handleSaveHero}
        />
      )}
      <Toaster />
    </div>
  );
}
