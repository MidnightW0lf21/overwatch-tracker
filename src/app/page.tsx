
'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import HeroCard from '@/components/overwatch/HeroCard';
import HeroBadgeEditorSheet from '@/components/overwatch/HeroBadgeEditorSheet';
import type { HeroCalculated, StoredHero, StoredHeroChallenge, Hero } from '@/types/overwatch';
import {
  initialHeroesData,
  calculateTotalXP,
  calculateLevelDetails,
  hydrateHeroes,
  dehydrateHeroes,
  calculateXpToReachLevel
} from '@/lib/overwatch-utils';
import { getBadgeDefinition, XP_PER_HERO_TYPE_BADGE_LEVEL, XP_PER_TIME_TYPE_BADGE_LEVEL, XP_PER_WIN_TYPE_BADGE_LEVEL } from '@/lib/badge-definitions';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { InfoIcon, SettingsIcon, StarIcon, ClockIcon } from 'lucide-react';
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
interface ExportData {
  version: string;
  heroes: StoredHero[];
}

export default function Home() {
  const [heroes, setHeroes] = useState<HeroCalculated[]>([]);
  const [editingHero, setEditingHero] = useState<HeroCalculated | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const calculateAndSetHeroes = useCallback((storedHeroesData: StoredHero[]) => {
    const hydratedHeroesData = hydrateHeroes(storedHeroesData);
    const calculatedHeroes = hydratedHeroesData.map(hero => {
      const challengesForXPCalc = hero.challenges.map(hc => {
        const def = getBadgeDefinition(hc.badgeId);
        return {
          id: hc.id,
          badgeId: hc.badgeId,
          level: hc.level,
          xpPerLevel: def ? def.xpPerLevel : 0,
        };
      });
      const totalXp = calculateTotalXP(challengesForXPCalc);
      const levelDetails = calculateLevelDetails(totalXp);
      return { ...hero, totalXp, ...levelDetails };
    });
    setHeroes(calculatedHeroes.sort((a, b) => b.totalXp - a.totalXp));
  }, []);

  useEffect(() => {
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      const masterDefaults: StoredHero[] = initialHeroesData;

      if (storedDataString) {
        try {
          let parsedJson: ExportData | StoredHero[];
          try {
            parsedJson = JSON.parse(storedDataString);
          } catch (error) {
            console.error("Failed to parse localStorage data initially, resetting to default:", error);
             const defaultStoredHeroes = masterDefaults.map(hero => ({
              ...hero,
              portraitUrl: hero.portraitUrl?.trimStart() || '',
              personalGoalLevel: hero.personalGoalLevel ?? 0,
              challenges: hero.challenges.map(challenge => ({ ...challenge, level: challenge.level ?? 1}))
            }));
            calculateAndSetHeroes(defaultStoredHeroes);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ version: "1.0.0", heroes: defaultStoredHeroes } as ExportData));
            return;
          }

          let sanitizedHeroes: StoredHero[];

          if (typeof parsedJson === 'object' && parsedJson !== null && 'version' in parsedJson && 'heroes' in parsedJson && Array.isArray((parsedJson as ExportData).heroes)) {
            sanitizedHeroes = (parsedJson as ExportData).heroes.map(hero => ({
              ...hero,
              portraitUrl: hero.portraitUrl?.trimStart() || '',
              personalGoalLevel: hero.personalGoalLevel ?? 0,
              challenges: hero.challenges.map(challenge => ({ ...challenge, level: challenge.level ?? 1 }))
            }));
          } else if (Array.isArray(parsedJson)) {
            sanitizedHeroes = (parsedJson as StoredHero[]).map(hero => ({
              ...hero,
              portraitUrl: hero.portraitUrl?.trimStart() || '',
              personalGoalLevel: hero.personalGoalLevel ?? 0,
              challenges: hero.challenges.map(challenge => ({ ...challenge, level: challenge.level ?? 1 }))
            }));
          } else {
            console.warn("Invalid data structure in localStorage, resetting to default.");
            throw new Error("Invalid data structure");
          }


          const synchronizedHeroes = masterDefaults.map(defaultHero => {
            const storedHero = sanitizedHeroes.find(h => h.id === defaultHero.id);

            if (storedHero) {
              let finalChallengeList: StoredHeroChallenge[] = [];
              const processedStoredChallengeIds = new Set<string>();

              for (const defaultChallenge of defaultHero.challenges) {
                const storedChallengeMatch = storedHero.challenges.find(sc => sc.id === defaultChallenge.id || sc.badgeId === defaultChallenge.badgeId);

                if (storedChallengeMatch) {
                  finalChallengeList.push({
                    id: storedChallengeMatch.id,
                    badgeId: defaultChallenge.badgeId,
                    level: Math.max(1, storedChallengeMatch.level || 1),
                  });
                  processedStoredChallengeIds.add(storedChallengeMatch.id);
                } else {
                  finalChallengeList.push({
                    id: defaultChallenge.id,
                    badgeId: defaultChallenge.badgeId,
                    level: 1,
                  });
                }
              }

              for (const storedChallenge of storedHero.challenges) {
                if (!processedStoredChallengeIds.has(storedChallenge.id)) {
                    const storedBadgeDef = getBadgeDefinition(storedChallenge.badgeId);
                    if(storedBadgeDef){
                        finalChallengeList.push({
                            id: storedChallenge.id,
                            badgeId: storedChallenge.badgeId,
                            level: Math.max(1, storedChallenge.level || 1),
                        });
                    }
                }
              }

              return {
                id: defaultHero.id,
                name: storedHero.name || defaultHero.name,
                portraitUrl: storedHero.portraitUrl?.trimStart() || defaultHero.portraitUrl.trimStart(),
                personalGoalLevel: storedHero.personalGoalLevel,
                challenges: finalChallengeList,
              };
            } else {
              return {
                ...defaultHero,
                portraitUrl: defaultHero.portraitUrl?.trimStart() || '',
                personalGoalLevel: defaultHero.personalGoalLevel || 0,
                challenges: defaultHero.challenges.map(c => ({ ...c, level: Math.max(1, c.level || 1) })),
              };
            }
          });

          const customUserHeroes = sanitizedHeroes.filter(
            sh => !masterDefaults.some(dh => dh.id === sh.id)
          ).map(hero => ({
            ...hero,
            portraitUrl: hero.portraitUrl?.trimStart() || '',
            personalGoalLevel: typeof hero.personalGoalLevel === 'number' ? hero.personalGoalLevel : 0,
            challenges: hero.challenges.map(challenge => ({
              ...challenge,
              level: Math.max(1, challenge.level || 1)
            }))
          }));

          const finalHeroesToLoad = [...synchronizedHeroes, ...customUserHeroes];

          calculateAndSetHeroes(finalHeroesToLoad);
          const exportPayload: ExportData = { version: "1.0.0", heroes: finalHeroesToLoad };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exportPayload));

        } catch (error) {
          console.error("Failed to parse/synchronize hero data from localStorage, resetting to default:", error);
          const defaultStoredHeroes = masterDefaults.map(hero => ({
            ...hero,
            portraitUrl: hero.portraitUrl?.trimStart() || '',
            personalGoalLevel: hero.personalGoalLevel ?? 0,
            challenges: hero.challenges.map(challenge => ({ ...challenge, level: challenge.level ?? 1}))
          }));
          calculateAndSetHeroes(defaultStoredHeroes);
          const exportPayload: ExportData = { version: "1.0.0", heroes: defaultStoredHeroes };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exportPayload));
        }
      } else {
        const defaultStoredHeroes = masterDefaults.map(hero => ({
            ...hero,
            portraitUrl: hero.portraitUrl?.trimStart() || '',
            personalGoalLevel: hero.personalGoalLevel ?? 0,
            challenges: hero.challenges.map(challenge => ({ ...challenge, level: challenge.level ?? 1}))
          }));
        calculateAndSetHeroes(defaultStoredHeroes);
        const exportPayload: ExportData = { version: "1.0.0", heroes: defaultStoredHeroes };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exportPayload));
      }
    } catch (e) {
      console.error('Error during initial data load:', e);
      const defaultStoredHeroes = initialHeroesData.map(hero => ({
            ...hero,
            portraitUrl: hero.portraitUrl?.trimStart() || '',
            personalGoalLevel: hero.personalGoalLevel ?? 0,
            challenges: hero.challenges.map(challenge => ({ ...challenge, level: challenge.level ?? 1}))
          }));
      calculateAndSetHeroes(defaultStoredHeroes);
      const exportPayload: ExportData = { version: "1.0.0", heroes: defaultStoredHeroes };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exportPayload));
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
    const finalNewLevel = Math.max(1, newLevel);

    const updatedHeroesList = heroes.map(h => {
      if (h.id === heroId) {
        const updatedChallenges = h.challenges.map(c =>
          c.id === challengeId ? { ...c, level: finalNewLevel } : c
        );

        const challengesForXPCalc = updatedChallenges.map(uc => {
          const badgeDef = getBadgeDefinition(uc.badgeId);
          return {
            level: uc.level,
            xpPerLevel: badgeDef ? badgeDef.xpPerLevel : 0,
          };
        });

        const totalXp = calculateTotalXP(challengesForXPCalc);
        const levelDetails = calculateLevelDetails(totalXp);
        return { ...h, challenges: updatedChallenges, totalXp, ...levelDetails };
      }
      return h;
    });

    const dehydratedHeroesForStorage = dehydrateHeroes(updatedHeroesList);

    const sortedHeroes = updatedHeroesList.sort((a, b) => b.totalXp - a.totalXp);
    setHeroes(sortedHeroes);

    const exportPayload: ExportData = { version: "1.0.0", heroes: dehydratedHeroesForStorage };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exportPayload));

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

  const globalMaxXpOverall = useMemo(() => {
    if (heroes.length === 0) return 0;
    const xpForOneHeroMaxLevel = calculateXpToReachLevel(GLOBAL_MAX_LEVEL + 1);
    return xpForOneHeroMaxLevel * heroes.length;
  }, [heroes.length]);

  const globalLevelDetails = useMemo(() => {
    return calculateLevelDetails(currentGlobalXp);
  }, [currentGlobalXp]);

  const globalProgressPercentage = useMemo(() => {
    if (globalMaxXpOverall === 0) return 0;
    return Math.min((currentGlobalXp / globalMaxXpOverall) * 100, 100);
  }, [currentGlobalXp, globalMaxXpOverall]);

  const totalEstimatedTimeToMaxAllHeroesInMinutes = useMemo(() => {
    let totalMinutes = 0;
    heroes.forEach(hero => {
        if (hero.level >= GLOBAL_MAX_LEVEL) {
            return;
        }
        const timeBadgeChallenge = hero.challenges.find(c => {
            const badgeDef = getBadgeDefinition(c.badgeId);
            return badgeDef?.xpPerLevel === XP_PER_TIME_TYPE_BADGE_LEVEL;
        });

        if (!timeBadgeChallenge) {
            return;
        }
        const timeBadgeDef = getBadgeDefinition(timeBadgeChallenge.badgeId);
        if (!timeBadgeDef) return;


        const xpForMaxLevel = calculateXpToReachLevel(GLOBAL_MAX_LEVEL + 1);
        const xpRemaining = Math.max(0, xpForMaxLevel - hero.totalXp);

        if (xpRemaining > 0 && XP_PER_TIME_TYPE_BADGE_LEVEL > 0) {
            const timeBadgeLevelsNeeded = xpRemaining / XP_PER_TIME_TYPE_BADGE_LEVEL;
            totalMinutes += timeBadgeLevelsNeeded * 20;
        }
    });
    return totalMinutes;
  }, [heroes]);

  const formatTotalTimeToMaxAllHeroes = useCallback((totalMinutesInput: number): string => {
    if (totalMinutesInput < 0) totalMinutesInput = 0;

    if (totalMinutesInput < 1 && totalMinutesInput > 0) return "~1 min";
    if (Math.round(totalMinutesInput) === 0) return "0m";

    const totalMinutes = Math.round(totalMinutesInput);

    const minutesInHour = 60;
    const hoursInDay = 24;
    const daysInYear = 365;

    const years = Math.floor(totalMinutes / (minutesInHour * hoursInDay * daysInYear));
    let remainingMinutes = totalMinutes % (minutesInHour * hoursInDay * daysInYear);

    const days = Math.floor(remainingMinutes / (minutesInHour * hoursInDay));
    remainingMinutes %= (minutesInHour * hoursInDay);

    const hours = Math.floor(remainingMinutes / minutesInHour);
    remainingMinutes %= minutesInHour;

    const finalMinutes = remainingMinutes;

    let parts: string[] = [];
    if (years > 0) parts.push(`${years}y`);
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (finalMinutes > 0 || parts.length === 0) parts.push(`${finalMinutes}m`);

    return parts.join(' ');
  }, []);

  const formattedTotalTimeToMaxAllHeroes = useMemo(() => {
    if (heroes.length === 0) return "Loading...";
    if (heroes.every(h => h.level >= GLOBAL_MAX_LEVEL)) {
        return "All heroes maxed!";
    }
    if (totalEstimatedTimeToMaxAllHeroesInMinutes === 0) {
        let relevantHeroNeedsTime = false;
        for (const hero of heroes) {
            if (hero.level < GLOBAL_MAX_LEVEL) {
                const timeBadgeChallenge = hero.challenges.find(c => {
                    const badgeDef = getBadgeDefinition(c.badgeId);
                    return badgeDef?.xpPerLevel === XP_PER_TIME_TYPE_BADGE_LEVEL;
                });
                if (timeBadgeChallenge) {
                    const timeBadgeDef = getBadgeDefinition(timeBadgeChallenge.badgeId);
                    if (!timeBadgeDef) continue;
                    const xpForMaxLevel = calculateXpToReachLevel(GLOBAL_MAX_LEVEL + 1);
                    const xpRemaining = Math.max(0, xpForMaxLevel - hero.totalXp);
                    if (xpRemaining > 0 && timeBadgeDef.xpPerLevel > 0) {
                        relevantHeroNeedsTime = true;
                        break;
                    }
                }
            }
        }
        if (!relevantHeroNeedsTime) {
            return "N/A (No time tracking for unmaxed heroes)";
        }
    }
    return formatTotalTimeToMaxAllHeroes(totalEstimatedTimeToMaxAllHeroesInMinutes);
  }, [totalEstimatedTimeToMaxAllHeroesInMinutes, heroes, formatTotalTimeToMaxAllHeroes]);

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
            Overall Progression (All Heroes Max Level {GLOBAL_MAX_LEVEL})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="mb-1 flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">
              Global Level: <strong className="text-foreground">{globalLevelDetails.level}</strong>
            </span>
            <span className="text-xs text-muted-foreground">
              {currentGlobalXp.toLocaleString()} / {globalMaxXpOverall.toLocaleString()} XP
            </span>
          </div>
          <Progress value={globalProgressPercentage} className="h-3 w-full bg-accent/20 [&>div]:bg-accent" />
           <p className="text-xs text-muted-foreground mt-1 text-right">
            {globalProgressPercentage.toFixed(4)}% towards all heroes maxed
          </p>
          <div className="mt-3 border-t border-border pt-3">
            <h4 className="text-sm font-semibold text-foreground/90 mb-1 flex items-center">
              <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              Est. Total Time to Max All Heroes
            </h4>
            <p className="text-sm text-muted-foreground ml-6">
              {formattedTotalTimeToMaxAllHeroes}
            </p>
            { !formattedTotalTimeToMaxAllHeroes.includes("All heroes maxed!") && !formattedTotalTimeToMaxAllHeroes.includes("Loading...") && !formattedTotalTimeToMaxAllHeroes.includes("N/A") && (
                 <p className="text-xs text-muted-foreground/70 ml-6 mt-0.5">(Assuming a time badge level is earned every 20 mins of play per hero)</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-10 gap-4">
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
