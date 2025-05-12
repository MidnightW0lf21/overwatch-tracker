
'use client';

import type React from 'react';
import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import type { StoredHero, StoredHeroChallenge } from '@/types/overwatch';
import { initialHeroesData } from '@/lib/overwatch-utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircleIcon, EditIcon, Trash2Icon, UsersIcon, ShieldCheckIcon, ArrowLeftIcon, ArrowUpIcon, ArrowDownIcon, DownloadIcon, UploadIcon } from 'lucide-react';
import HeroFormDialog from './HeroFormDialog';
import BadgeFormDialog from './BadgeFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Link from 'next/link';


const LOCAL_STORAGE_KEY = 'overwatchProgressionData_v3';

// Define the structure for the exported/imported JSON data
interface ExportData {
  version: string; // To handle future data structure changes
  heroes: StoredHero[];
}
const EXPORT_DATA_VERSION = "1.0.0";


export default function ManageBadgesPageClient() {
  const [allHeroes, setAllHeroes] = useState<StoredHero[]>([]);
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<StoredHero | null>(null);
  const [isBadgeDialogOpen, setIsBadgeDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<StoredHeroChallenge | null>(null);
  const { toast } = useToast();

  const loadHeroes = useCallback(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData: StoredHero[] | ExportData = JSON.parse(storedData);
        let heroesToLoad: StoredHero[];

        if ('version' in parsedData && 'heroes' in parsedData) { // Check if it's new ExportData format
          heroesToLoad = parsedData.heroes;
        } else { // Assume old StoredHero[] format
          heroesToLoad = parsedData as StoredHero[];
        }
        
        const sanitizedData = heroesToLoad.map(hero => ({
          ...hero,
          portraitUrl: hero.portraitUrl?.trimStart() || '',
          personalGoalLevel: typeof hero.personalGoalLevel === 'number' ? hero.personalGoalLevel : 0,
          challenges: hero.challenges.map(challenge => ({
            ...challenge,
            level: challenge.level ?? 1 
          }))
        }));
        setAllHeroes(sanitizedData);
      } catch (error) {
        console.error("Failed to parse hero data from localStorage", error);
        setAllHeroes(initialHeroesData.map(hero => ({
            ...hero,
            portraitUrl: hero.portraitUrl?.trimStart() || '',
            personalGoalLevel: typeof hero.personalGoalLevel === 'number' ? hero.personalGoalLevel : 0,
            challenges: hero.challenges.map(challenge => ({...challenge, level: challenge.level ?? 1}))
        })));
      }
    } else {
       setAllHeroes(initialHeroesData.map(hero => ({
            ...hero,
            portraitUrl: hero.portraitUrl?.trimStart() || '',
            personalGoalLevel: typeof hero.personalGoalLevel === 'number' ? hero.personalGoalLevel : 0,
            challenges: hero.challenges.map(challenge => ({...challenge, level: challenge.level ?? 1}))
        })));
    }
  }, []);

  useEffect(() => {
    loadHeroes();
  }, [loadHeroes]);

  const saveHeroes = useCallback((updatedHeroes: StoredHero[]) => {
    const heroesToSave = updatedHeroes.map(hero => ({
      ...hero,
      portraitUrl: hero.portraitUrl?.trimStart() || '',
      personalGoalLevel: typeof hero.personalGoalLevel === 'number' && hero.personalGoalLevel >= 0 ? hero.personalGoalLevel : 0,
    }));
    
    const exportPayload: ExportData = {
      version: EXPORT_DATA_VERSION,
      heroes: heroesToSave
    };

    setAllHeroes(heroesToSave);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exportPayload)); // Save as ExportData
    if (selectedHeroId && !heroesToSave.find(h => h.id === selectedHeroId)) {
        setSelectedHeroId(null);
    }
  }, [selectedHeroId]);

  const handleHeroSelect = (heroId: string) => {
    setSelectedHeroId(heroId);
    setEditingBadge(null); 
  };

  const handleOpenAddHeroDialog = () => {
    setEditingHero(null);
    setIsHeroDialogOpen(true);
  };

  const handleOpenEditHeroDialog = (hero: StoredHero) => {
    setEditingHero(hero);
    setIsHeroDialogOpen(true);
  };

  const handleDeleteHero = (heroIdToDelete: string) => {
    const updatedHeroes = allHeroes.filter(hero => hero.id !== heroIdToDelete);
    saveHeroes(updatedHeroes);
    if (selectedHeroId === heroIdToDelete) {
      setSelectedHeroId(null);
    }
    toast({ title: "Hero Deleted", description: "The hero has been removed." });
  };
  
  const handleHeroFormSubmit = (heroData: StoredHero) => {
    const finalSubmittedHeroData: StoredHero = {
        ...heroData,
        portraitUrl: heroData.portraitUrl?.trimStart() || '',
        personalGoalLevel: typeof heroData.personalGoalLevel === 'number' 
                            ? heroData.personalGoalLevel 
                            : 0,
    };

    let newListOfHeroes;
    if (editingHero) {
      newListOfHeroes = allHeroes.map(h => {
        if (h.id === finalSubmittedHeroData.id) {
          return finalSubmittedHeroData; 
        }
        return {
            ...h,
            portraitUrl: h.portraitUrl?.trimStart() || '',
            personalGoalLevel: typeof h.personalGoalLevel === 'number' ? h.personalGoalLevel : 0,
        };
      });
      toast({ title: "Hero Updated", description: `${finalSubmittedHeroData.name} has been updated.` });
    } else {
      if (allHeroes.some(h => h.id === finalSubmittedHeroData.id)) {
        toast({ title: "Error", description: `Hero ID "${finalSubmittedHeroData.id}" already exists. Please use a unique ID.`, variant: "destructive" });
        return;
      }
      const cleanedExistingHeroes = allHeroes.map(h => ({
          ...h,
          portraitUrl: h.portraitUrl?.trimStart() || '',
          personalGoalLevel: typeof h.personalGoalLevel === 'number' ? h.personalGoalLevel : 0,
      }));
      newListOfHeroes = [...cleanedExistingHeroes, finalSubmittedHeroData];
      toast({ title: "Hero Added", description: `${finalSubmittedHeroData.name} has been added.` });
    }
    
    saveHeroes(newListOfHeroes);
    setIsHeroDialogOpen(false);
    setEditingHero(null);
    if (!editingHero || selectedHeroId !== finalSubmittedHeroData.id) {
        setSelectedHeroId(finalSubmittedHeroData.id);
    }
  };

  const handleOpenAddBadgeDialog = () => {
    if (!selectedHeroId) return;
    setEditingBadge(null);
    setIsBadgeDialogOpen(true);
  };

  const handleOpenEditBadgeDialog = (badge: StoredHeroChallenge) => {
    setEditingBadge(badge);
    setIsBadgeDialogOpen(true);
  };

  const handleDeleteBadge = (badgeIdToDelete: string) => {
    if (!selectedHeroId) return;
    const updatedHeroes = allHeroes.map(hero => {
      if (hero.id === selectedHeroId) {
        return {
          ...hero,
          challenges: hero.challenges.filter(badge => badge.id !== badgeIdToDelete),
        };
      }
      return hero;
    });
    saveHeroes(updatedHeroes);
    toast({ title: "Badge Deleted", description: "The badge has been removed from the hero." });
  };

  const handleBadgeFormSubmit = (badgeData: StoredHeroChallenge) => {
    if (!selectedHeroId) return;
    const updatedHeroes = allHeroes.map(hero => {
      if (hero.id === selectedHeroId) {
        let updatedChallenges;
        if (editingBadge) {
          updatedChallenges = hero.challenges.map(b => b.id === badgeData.id ? badgeData : b);
          toast({ title: "Badge Updated", description: `Badge "${badgeData.title}" has been updated.` });
        } else {
          if (hero.challenges.some(b => b.id === badgeData.id)) {
             toast({ title: "Error", description: `Badge ID "${badgeData.id}" already exists for this hero. Please use a unique ID.`, variant: "destructive" });
             return;
          }
          updatedChallenges = [...hero.challenges, badgeData];
          toast({ title: "Badge Added", description: `Badge "${badgeData.title}" has been added to ${hero.name}.` });
        }
        return { ...hero, challenges: updatedChallenges };
      }
      return hero;
    });
    saveHeroes(updatedHeroes);
    setIsBadgeDialogOpen(false);
    setEditingBadge(null);
  };

  const handleMoveBadge = (badgeId: string, direction: 'up' | 'down') => {
    if (!selectedHeroId) return;

    const updatedHeroes = allHeroes.map(hero => {
      if (hero.id === selectedHeroId) {
        const challenges = [...hero.challenges];
        const badgeIndex = challenges.findIndex(b => b.id === badgeId);

        if (badgeIndex === -1) return hero; 

        if (direction === 'up' && badgeIndex > 0) {
          [challenges[badgeIndex], challenges[badgeIndex - 1]] = [challenges[badgeIndex - 1], challenges[badgeIndex]];
        } else if (direction === 'down' && badgeIndex < challenges.length - 1) {
          [challenges[badgeIndex], challenges[badgeIndex + 1]] = [challenges[badgeIndex + 1], challenges[badgeIndex]];
        } else {
          return hero; 
        }
        toast({ title: "Badge Reordered", description: `Badge "${challenges[direction === 'up' ? badgeIndex -1 : badgeIndex + 1].title}" has been moved.`})
        return { ...hero, challenges };
      }
      return hero;
    });
    saveHeroes(updatedHeroes);
  };

  const handleExportData = () => {
    const dataToExport: ExportData = {
      version: EXPORT_DATA_VERSION,
      heroes: allHeroes,
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "overwatch_progression_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Data Exported", description: "Your hero progression data has been downloaded." });
  };

  const handleImportData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({ title: "Import Cancelled", description: "No file selected.", variant: "default" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        const importedData: ExportData | StoredHero[] = JSON.parse(jsonString);
        
        let heroesToImport: StoredHero[];

        if (typeof importedData === 'object' && importedData !== null && 'version' in importedData && 'heroes' in importedData) {
            // New format with version
            if (importedData.version !== EXPORT_DATA_VERSION) {
                toast({ title: "Import Error", description: `Unsupported data version. Expected ${EXPORT_DATA_VERSION}, got ${importedData.version}.`, variant: "destructive" });
                return;
            }
            heroesToImport = (importedData as ExportData).heroes;
        } else if (Array.isArray(importedData)) {
            // Old format (array of StoredHero)
            heroesToImport = importedData as StoredHero[];
        } else {
            toast({ title: "Import Error", description: "Invalid file format.", variant: "destructive" });
            return;
        }

        // Basic validation for heroesToImport (can be expanded)
        if (!Array.isArray(heroesToImport) || !heroesToImport.every(h => h.id && h.name && Array.isArray(h.challenges))) {
            toast({ title: "Import Error", description: "Imported data is not in the expected StoredHero[] format.", variant: "destructive" });
            return;
        }
        
        // Sanitize imported data just like in loadHeroes
        const sanitizedImportedHeroes = heroesToImport.map(hero => ({
          ...hero,
          portraitUrl: hero.portraitUrl?.trimStart() || '',
          personalGoalLevel: typeof hero.personalGoalLevel === 'number' ? hero.personalGoalLevel : 0,
          challenges: hero.challenges.map(challenge => ({
            ...challenge, // ensure all props of StoredHeroChallenge are present
            id: challenge.id || `badge_${Math.random().toString(36).substr(2, 9)}`, // Ensure ID
            title: challenge.title || "Untitled Badge",
            iconName: challenge.iconName || "ShieldQuestion",
            xpPerLevel: typeof challenge.xpPerLevel === 'number' ? challenge.xpPerLevel : XP_PER_HERO_TYPE_BADGE_LEVEL,
            level: challenge.level ?? 1,
          }))
        }));

        saveHeroes(sanitizedImportedHeroes);
        setSelectedHeroId(null); // Reset selection
        toast({ title: "Data Imported", description: "Hero progression data has been successfully imported." });
      } catch (error) {
        console.error("Error importing data:", error);
        toast({ title: "Import Error", description: "Failed to parse or process the JSON file. Make sure it's a valid export.", variant: "destructive" });
      } finally {
        // Reset file input to allow importing the same file again if needed
        if (event.target) {
            event.target.value = '';
        }
      }
    };
    reader.onerror = () => {
        toast({ title: "Import Error", description: "Failed to read the file.", variant: "destructive" });
         if (event.target) {
            event.target.value = '';
        }
    };
    reader.readAsText(file);
  };
  
  const selectedHero = allHeroes.find(h => h.id === selectedHeroId);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Tracker
          </Link>
        </Button>
        <div className="flex gap-2">
            <Button onClick={handleExportData} variant="outline">
                <DownloadIcon className="mr-2 h-4 w-4" /> Export Data
            </Button>
            <Button variant="outline" asChild>
                <label htmlFor="import-file-input" className="cursor-pointer">
                    <UploadIcon className="mr-2 h-4 w-4" /> Import Data
                    <Input 
                        id="import-file-input" 
                        type="file" 
                        accept=".json" 
                        className="hidden"
                        onChange={handleImportData}
                    />
                </label>
            </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UsersIcon /> Heroes</CardTitle>
          <CardDescription>Select a hero to manage their badges or add a new hero.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select onValueChange={handleHeroSelect} value={selectedHeroId || undefined}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a hero" />
              </SelectTrigger>
              <SelectContent>
                {allHeroes.map(hero => (
                  <SelectItem key={hero.id} value={hero.id}>{hero.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleOpenAddHeroDialog} variant="outline">
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Hero
            </Button>
            {selectedHero && (
              <>
                <Button onClick={() => handleOpenEditHeroDialog(selectedHero)} variant="outline" size="icon" aria-label="Edit Hero">
                  <EditIcon className="h-4 w-4" />
                  <span className="sr-only">Edit Hero</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" aria-label="Delete Hero">
                      <Trash2Icon className="h-4 w-4" />
                      <span className="sr-only">Delete Hero</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the hero &quot;{selectedHero.name}&quot; and all their badge data. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteHero(selectedHero.id)}>Delete Hero</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedHero && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheckIcon /> Badges for {selectedHero.name}</CardTitle>
            <CardDescription>Manage the badges available for this hero. Badge levels are edited on the main tracker page. You can reorder badges using the arrow buttons.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleOpenAddBadgeDialog} variant="outline">
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Badge to {selectedHero.name}
            </Button>
            {selectedHero.challenges.length > 0 ? (
              <ul className="space-y-2">
                {selectedHero.challenges.map((badge, index) => (
                  <li key={badge.id} className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-md">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleMoveBadge(badge.id, 'up')}
                                disabled={index === 0}
                                aria-label="Move badge up"
                                className="h-6 w-6"
                            >
                                <ArrowUpIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleMoveBadge(badge.id, 'down')}
                                disabled={index === selectedHero.challenges.length - 1}
                                aria-label="Move badge down"
                                className="h-6 w-6"
                            >
                                <ArrowDownIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                        <p className="font-semibold">{badge.title} <span className="text-xs text-muted-foreground">(ID: {badge.id})</span></p>
                        <p className="text-sm text-muted-foreground">Icon: {badge.iconName}, XP/Lvl: {badge.xpPerLevel}, Initial Lvl: {badge.level}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleOpenEditBadgeDialog(badge)} variant="outline" size="icon" aria-label="Edit Badge">
                        <EditIcon className="h-4 w-4" />
                         <span className="sr-only">Edit Badge</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" aria-label="Delete Badge">
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Delete Badge</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the badge &quot;{badge.title}&quot; from {selectedHero.name}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteBadge(badge.id)}>Delete Badge</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No badges configured for {selectedHero.name}.</p>
            )}
          </CardContent>
        </Card>
      )}

      <HeroFormDialog
        isOpen={isHeroDialogOpen}
        onClose={() => { setIsHeroDialogOpen(false); setEditingHero(null);}}
        onSubmit={handleHeroFormSubmit}
        hero={editingHero}
        allHeroes={allHeroes}
      />

      <BadgeFormDialog
        isOpen={isBadgeDialogOpen}
        onClose={() => { setIsBadgeDialogOpen(false); setEditingBadge(null);}}
        onSubmit={handleBadgeFormSubmit}
        badge={editingBadge}
        heroName={selectedHero?.name || ''}
        existingBadgeIds={selectedHero?.challenges.map(b => b.id) || []}
      />
    </div>
  );
}
