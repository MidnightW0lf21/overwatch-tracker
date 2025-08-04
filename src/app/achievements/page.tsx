
'use client';

import type { Metadata } from 'next';
import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { HeroCalculated, LevelDetails, StoredHero, StoredHeroChallenge } from '@/types/overwatch';
import { achievementsList, calculateTotalTimePlayedMinutes } from '@/lib/achievement-utils';
import { calculateLevelDetails, calculateTotalXP, hydrateHeroes, initialHeroesData } from '@/lib/overwatch-utils';
import { getBadgeDefinition } from '@/lib/badge-definitions';

// No static metadata here as it's a client component primarily
// export const metadata: Metadata = { ... }; 

const LOCAL_STORAGE_KEY = 'overwatchProgressionData_v3';

interface ExportData {
  version: string;
  heroes: StoredHero[];
}


export default function AchievementsPage() {
  const [heroes, setHeroes] = useState<HeroCalculated[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      let storedHeroesData: StoredHero[];

      if (storedDataString) {
        try {
          const parsedJson: ExportData | StoredHero[] = JSON.parse(storedDataString);
           if (typeof parsedJson === 'object' && parsedJson !== null && 'version' in parsedJson && 'heroes' in parsedJson && Array.isArray((parsedJson as ExportData).heroes)) {
             storedHeroesData = (parsedJson as ExportData).heroes;
           } else if (Array.isArray(parsedJson)) {
            storedHeroesData = parsedJson as StoredHero[]; // Legacy format
          } else {
            throw new Error("Invalid data structure");
          }
        } catch (error) {
          console.error("Failed to parse hero data from localStorage, using defaults:", error);
          storedHeroesData = initialHeroesData;
        }
      } else {
        storedHeroesData = initialHeroesData;
      }
      
      const hydrated = hydrateHeroes(storedHeroesData);
      const calculated = hydrated.map(hero => {
        const challengesForXPCalc = hero.challenges.map(hc => {
          const def = getBadgeDefinition(hc.badgeId);
          return {
            level: hc.level,
            xpPerLevel: def ? def.xpPerLevel : 0,
          };
        });
        const totalXp = calculateTotalXP(challengesForXPCalc);
        const levelDetails = calculateLevelDetails(totalXp);
        return { ...hero, totalXp, ...levelDetails };
      });
      setHeroes(calculated);
    } catch (e) {
      console.error("Error loading hero data for achievements:", e);
       const defaultHydrated = hydrateHeroes(initialHeroesData);
       const defaultCalculated = defaultHydrated.map(hero => {
         const challengesForXPCalc = hero.challenges.map(hc => {
           const def = getBadgeDefinition(hc.badgeId);
           return {
             level: hc.level,
             xpPerLevel: def ? def.xpPerLevel : 0,
           };
         });
         const totalXp = calculateTotalXP(challengesForXPCalc);
         const levelDetails = calculateLevelDetails(totalXp);
         return { ...hero, totalXp, ...levelDetails };
       });
      setHeroes(defaultCalculated);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const globalLevelDetails: LevelDetails | undefined = useMemo(() => {
    if (isLoading || heroes.length === 0) return undefined;
    const totalGlobalXp = heroes.reduce((sum, hero) => sum + hero.totalXp, 0);
    const details = calculateLevelDetails(totalGlobalXp);
    return { ...details, totalXp: totalGlobalXp };
  }, [heroes, isLoading]);

  const totalTimePlayedMinutes = useMemo(() => {
    if (isLoading || heroes.length === 0) return 0;
    return calculateTotalTimePlayedMinutes(heroes);
  }, [heroes, isLoading]);


  const categorizedAchievements = useMemo(() => {
    const categories: Record<string, typeof achievementsList> = {};
    achievementsList.forEach(ach => {
      if (!categories[ach.category]) {
        categories[ach.category] = [];
      }
      categories[ach.category].push(ach);
    });
    return categories;
  }, []);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading achievements...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Achievements</h1>
          <p className="text-md text-muted-foreground mt-1">
            Track your milestones and accomplishments in Overwatch.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Tracker
          </Link>
        </Button>
      </header>

      <ScrollArea className="h-[calc(100vh-12rem)]"> {/* Adjust height as needed */}
        <div className="space-y-8">
          {Object.entries(categorizedAchievements).map(([category, achievements]) => (
            <section key={category}>
              <h2 className="text-2xl font-semibold text-primary mb-4 border-b border-border pb-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((ach) => {
                  const isUnlocked = ach.isUnlocked(heroes, globalLevelDetails, totalTimePlayedMinutes);
                  return (
                    <Card key={ach.id} className={`transition-all duration-300 ${isUnlocked ? 'bg-card border-primary shadow-lg' : 'bg-card/60 border-muted text-muted-foreground/80'}`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ach.icon className={`h-6 w-6 ${isUnlocked ? 'text-primary' : 'text-muted-foreground/50'}`} />
                          {ach.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{ach.description}</p>
                        {ach.xpReward && <p className="text-xs mt-2 text-primary/80">Reward: {ach.xpReward.toLocaleString()} XP</p>}
                         <p className={`mt-2 text-xs font-semibold ${isUnlocked ? 'text-green-400' : 'text-red-400'}`}>
                          {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
