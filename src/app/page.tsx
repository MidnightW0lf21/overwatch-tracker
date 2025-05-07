
'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import HeroCard from '@/components/overwatch/HeroCard';
import HeroBadgeEditorSheet from '@/components/overwatch/HeroBadgeEditorSheet';
import type { Hero, HeroCalculated, StoredHero, StoredHeroChallenge } from '@/types/overwatch';
import { 
  initialHeroesData, 
  calculateTotalXP, 
  calculateLevelDetails, 
  XP_PER_HERO_TYPE_BADGE_LEVEL, 
  XP_PER_WIN_TYPE_BADGE_LEVEL, 
  XP_PER_TIME_TYPE_BADGE_LEVEL,
  hydrateHeroes,
  dehydrateHeroes,
  calculateXpToReachLevel
} from '@/lib/overwatch-utils';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { InfoIcon, SettingsIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


const LOCAL_STORAGE_KEY = 'overwatchProgressionData_v3';
const GLOBAL_MAX_LEVEL = 500;

export default function Home() {
  const [heroes, setHeroes] = useState<HeroCalculated[]>([]);
  const [editingHero, setEditingHero] = useState<HeroCalculated | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const calculateAndSetHeroes = useCallback((heroesData: StoredHero[]) => {
    const hydratedHeroesData = hydrateHeroes(heroesData);
    const calculatedHeroes = hydratedHeroesData.map(hero => {
      const totalXp = calculateTotalXP(hero.challenges as StoredHeroChallenge[]); 
      const levelDetails = calculateLevelDetails(totalXp);
      return { ...hero, totalXp, ...levelDetails };
    });
    setHeroes(calculatedHeroes.sort((a, b) => b.totalXp - a.totalXp));
  }, []);
  
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as StoredHero[];
          // Ensure all initial badges are at least level 1
          const sanitizedData = parsedData.map(hero => ({
            ...hero,
            challenges: hero.challenges.map(challenge => ({
              ...challenge,
              level: Math.max(1, challenge.level || 1) 
            }))
          }));
          calculateAndSetHeroes(sanitizedData); 
        } catch (error) {
          console.error("Failed to parse hero data from localStorage", error);
          const defaultData = initialHeroesData.map(h => ({...h, challenges: h.challenges.map(c => ({...c, level: Math.max(1, c.level || 1)})) } as StoredHero));
          calculateAndSetHeroes(defaultData); 
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dehydrateHeroes(hydrateHeroes(defaultData))));
        }
      } else {
        const defaultData = initialHeroesData.map(h => ({...h, challenges: h.challenges.map(c => ({...c, level: Math.max(1, c.level || 1)})) } as StoredHero));
        calculateAndSetHeroes(defaultData); 
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dehydrateHeroes(hydrateHeroes(defaultData))));
      }
    } catch (e) {
      console.error('Error during initial data load:', e);
      const defaultData = initialHeroesData.map(h => ({...h, challenges: h.challenges.map(c => ({...c, level: Math.max(1, c.level || 1)})) } as StoredHero));
      calculateAndSetHeroes(defaultData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dehydrateHeroes(hydrateHeroes(defaultData))));
    }
  }, [calculateAndSetHeroes]);


  const handleEditHeroBadges = (hero: HeroCalculated) => {
    const fullHeroData = heroes.find(h => h.id === hero.id);
    setEditingHero(fullHeroData || hero);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
  };
  
  const handleBadgeLevelChange = (heroId: string, challengeId: string, newLevel: number) => {
    const finalNewLevel = Math.max(1, newLevel); // Ensure level is at least 1

    const updatedHeroesList = heroes.map(h => {
      if (h.id === heroId) {
        const updatedChallenges = h.challenges.map(c => 
          c.id === challengeId ? { ...c, level: finalNewLevel } : c
        );
        const storedChallengesForXPCalc = updatedChallenges.map(c => ({
          id: c.id,
          title: c.title,
          iconName: dehydrateHeroes([h] as Hero[])[0].challenges.find(sc => sc.id === c.id)?.iconName || 'ShieldQuestion', 
          level: c.level,
          xpPerLevel: c.xpPerLevel,
        }));

        const totalXp = calculateTotalXP(storedChallengesForXPCalc);
        const levelDetails = calculateLevelDetails(totalXp);
        return { ...h, challenges: updatedChallenges, totalXp, ...levelDetails };
      }
      return h;
    });
    
    const dehydratedHeroesForStorage = dehydrateHeroes(updatedHeroesList);
    
    const sortedHeroes = updatedHeroesList.sort((a, b) => b.totalXp - a.totalXp);
    setHeroes(sortedHeroes);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dehydratedHeroesForStorage));
    
    const updatedHeroInstance = sortedHeroes.find(h => h.id === heroId);
    if (updatedHeroInstance && editingHero && editingHero.id === heroId) {
      setEditingHero(updatedHeroInstance); 
    }

    const changedHero = updatedHeroesList.find(h=>h.id === heroId);
    const changedChallenge = changedHero?.challenges.find(c=>c.id === challengeId);

    toast({
      title: "Badge Updated",
      description: `${changedHero?.name}'s "${changedChallenge?.title}" badge level set to ${finalNewLevel}.`,
      variant: "default",
    });
  };

  const currentGlobalXp = useMemo(() => {
    return heroes.reduce((sum, hero) => sum + hero.totalXp, 0);
  }, [heroes]);

  const globalMaxXpForLevel500 = useMemo(() => {
    return calculateXpToReachLevel(GLOBAL_MAX_LEVEL + 1);
  }, []);

  const globalLevelDetails = useMemo(() => {
    return calculateLevelDetails(currentGlobalXp);
  }, [currentGlobalXp]);

  const globalProgressPercentage = useMemo(() => {
    if (globalMaxXpForLevel500 === 0) return 0;
    return Math.min((currentGlobalXp / globalMaxXpForLevel500) * 100, 100);
  }, [currentGlobalXp, globalMaxXpForLevel500]);
  
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <header className="mb-6 text-center relative">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">Overwatch Progression Tracker</h1>
        <p className="text-lg text-muted-foreground mt-2">Track your hero badges, levels, and personal goals.</p>
        <div className="absolute top-0 right-0 flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
                  <Link href="/admin/manage-badges">
                    <SettingsIcon className="h-6 w-6" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-popover text-popover-foreground p-3 rounded-md shadow-lg text-sm" side="bottom" align="end">
                <p>Manage Heroes & Badges</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <InfoIcon className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-popover text-popover-foreground p-3 rounded-md shadow-lg text-sm" side="bottom" align="end">
                <p className="font-semibold mb-1">How XP is Calculated:</p>
                <p className="text-xs mb-2">XP is earned by leveling up individual hero badges. Badge level 1 is the base and grants no XP. XP is awarded for levels 2 and above (i.e., level N grants (N-1) * XP_PER_LEVEL).</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Hero-specific Badges: {XP_PER_HERO_TYPE_BADGE_LEVEL} XP per level above 1</li>
                  <li>Win Badges: {XP_PER_WIN_TYPE_BADGE_LEVEL} XP per level above 1</li>
                  <li>Time Played Badges: {XP_PER_TIME_TYPE_BADGE_LEVEL} XP per level above 1</li>
                </ul>
                <p className="mt-2 font-semibold mb-1">Hero Level Progression:</p>
                 <p className="text-xs mb-2">Hero levels are based on total XP earned, following the Overwatch 2 progression system. XP requirements per level vary.</p>
                <p className="mt-3 text-xs">Click on a hero to edit their badges and see progress. Badges must be level 2 or higher to contribute XP.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
      
      <Card className="mb-6 shadow-lg">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <StarIcon className="h-5 w-5" />
            Overall Progression (Max Level {GLOBAL_MAX_LEVEL})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="mb-1 flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">
              Global Level: <strong className="text-foreground">{globalLevelDetails.level}</strong>
            </span>
            <span className="text-xs text-muted-foreground">
              {currentGlobalXp.toLocaleString()} / {globalMaxXpForLevel500.toLocaleString()} XP
            </span>
          </div>
          <Progress value={globalProgressPercentage} className="h-3 w-full bg-accent/20 [&>div]:bg-accent" />
           <p className="text-xs text-muted-foreground mt-1 text-right">
            {globalProgressPercentage.toFixed(1)}% towards max level
          </p>
        </CardContent>
      </Card>

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
        />
      )}
      <Toaster />
    </div>
  );
}
