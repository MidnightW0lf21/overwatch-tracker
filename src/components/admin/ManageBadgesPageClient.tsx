
'use client';

import type React from 'react';
import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import type { StoredHero, StoredHeroChallenge, HeroChallenge as RuntimeHeroChallenge } from '@/types/overwatch'; // Use RuntimeHeroChallenge for display
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
import { getBadgeDefinition } from '@/lib/badge-definitions';


const LOCAL_STORAGE_KEY = 'overwatchProgressionData_v3';

interface ExportData {
  version: string; 
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
    const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedDataString) {
      try {
        const parsedData: StoredHero[] = JSON.parse(storedDataString);
        const sanitizedData = parsedData.map(hero => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { personalGoalXP, ...restOfHero } = hero as any; // personalGoalXP is legacy
          return {
            ...restOfHero,
            personalGoalLevel: typeof hero.personalGoalLevel === 'number' ? hero.personalGoalLevel : 0,
            challenges: hero.challenges.map(challenge => ({
              ...challenge, // Spread existing challenge properties
              level: challenge.level ?? 1 
            }))
          } as StoredHero;
        });
        setAllHeroes(sanitizedData);
      } catch (error) {
        console.error("Failed to parse hero data from localStorage", error);
        setAllHeroes(initialHeroesData.map(hero => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { personalGoalXP, ...restOfHero } = hero as any;
            return {
                ...restOfHero,
                personalGoalLevel: typeof hero.personalGoalLevel === 'number' ? hero.personalGoalLevel : 0,
                challenges: hero.challenges.map(challenge => ({...challenge, level: challenge.level ?? 1}))
            } as StoredHero;
        }));
      }
    } else {
       setAllHeroes(initialHeroesData.map(hero => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { personalGoalXP, ...restOfHero } = hero as any;
            return {
                ...restOfHero,
                personalGoalLevel: typeof hero.personalGoalLevel === 'number' ? hero.personalGoalLevel : 0,
                challenges: hero.challenges.map(challenge => ({...challenge, level: challenge.level ?? 1}))
            } as StoredHero;
        }));
    }
  }, []);

  useEffect(() => {
    loadHeroes();
  }, [loadHeroes]);

  const saveHeroes = useCallback((updatedHeroes: StoredHero[]) => {
    const heroesToSave = updatedHeroes.map(hero => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { personalGoalXP, ...restOfHero } = hero as any; // Ensure legacy field is removed
      const pgLevel = (restOfHero as StoredHero).personalGoalLevel;
      return {
        ...restOfHero,
        personalGoalLevel: typeof pgLevel === 'number' && pgLevel >= 0 ? pgLevel : 0,
      } as StoredHero;
    });
    
    setAllHeroes(heroesToSave);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ version: EXPORT_DATA_VERSION, heroes: heroesToSave }));
    
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
  
  const handleHeroFormSubmit = (heroDataFromForm: StoredHero) => {
    const finalSubmittedHeroData: StoredHero = {
        ...heroDataFromForm,
        personalGoalLevel: typeof heroDataFromForm.personalGoalLevel === 'number' 
                            ? heroDataFromForm.personalGoalLevel 
                            : 0,
        challenges: heroDataFromForm.challenges.map(c => ({ 
            id: c.id,
            badgeId: c.badgeId,
            level: c.level
        }))
    };

    let newListOfHeroes: StoredHero[];
    if (editingHero) { 
      newListOfHeroes = allHeroes.map(h => {
        if (h.id === finalSubmittedHeroData.id) {
          return finalSubmittedHeroData; 
        }
        const { ...restOfH } = h as any;
        return {
            ...restOfH,
            personalGoalLevel: typeof (restOfH as StoredHero).personalGoalLevel === 'number' ? (restOfH as StoredHero).personalGoalLevel : 0,
        } as StoredHero;
      });
      toast({ title: "Hero Updated", description: `${finalSubmittedHeroData.name} has been updated.` });
    } else {
      if (allHeroes.some(h => h.id === finalSubmittedHeroData.id)) {
        toast({ title: "Error", description: `Hero ID "${finalSubmittedHeroData.id}" already exists. Please use a unique ID.`, variant: "destructive" });
        return;
      }
      const cleanedExistingHeroes = allHeroes.map(h => {
          const { ...restOfH } = h as any;
          return {
            ...restOfH,
            personalGoalLevel: typeof (restOfH as StoredHero).personalGoalLevel === 'number' ? (restOfH as StoredHero).personalGoalLevel : 0,
          } as StoredHero;
      });
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

  const handleDeleteBadge = (badgeInstanceIdToDelete: string) => {
    if (!selectedHeroId) return;
    const updatedHeroes = allHeroes.map(hero => {
      if (hero.id === selectedHeroId) {
        return {
          ...hero,
          challenges: hero.challenges.filter(badge => badge.id !== badgeInstanceIdToDelete),
        };
      }
      return hero;
    });
    saveHeroes(updatedHeroes);
    toast({ title: "Badge Instance Deleted", description: "The badge instance has been removed from the hero." });
  };

  const handleBadgeFormSubmit = (badgeData: StoredHeroChallenge) => { 
    if (!selectedHeroId) return;
    const updatedHeroes = allHeroes.map(hero => {
      if (hero.id === selectedHeroId) {
        let updatedChallenges;
        const badgeDef = getBadgeDefinition(badgeData.badgeId);
        const badgeTitle = badgeDef?.title || badgeData.badgeId;

        if (editingBadge) { 
          updatedChallenges = hero.challenges.map(b => b.id === badgeData.id ? badgeData : b);
          toast({ title: "Badge Updated", description: `Badge "${badgeTitle}" has been updated.` });
        } else {
          if (hero.challenges.some(b => b.id === badgeData.id)) {
             toast({ title: "Error", description: `Badge ID "${badgeData.id}" already exists for this hero. Please use a unique ID.`, variant: "destructive" });
             return hero; 
          }
          updatedChallenges = [...hero.challenges, badgeData];
          toast({ title: "Badge Instance Added", description: `Badge "${badgeTitle}" has been added to ${hero.name}.` });
        }
        return { ...hero, challenges: updatedChallenges };
      }
      return hero;
    });
    
    if (updatedHeroes.find(h => h.id === selectedHeroId)?.challenges.some(b => b.id === badgeData.id) || editingBadge) {
        saveHeroes(updatedHeroes);
    }
    setIsBadgeDialogOpen(false);
    setEditingBadge(null);
  };

  const handleMoveBadge = (badgeInstanceId: string, direction: 'up' | 'down') => {
    if (!selectedHeroId) return;

    const updatedHeroes = allHeroes.map(hero => {
      if (hero.id === selectedHeroId) {
        const challenges = [...hero.challenges];
        const badgeIndex = challenges.findIndex(b => b.id === badgeInstanceId);

        if (badgeIndex === -1) return hero; 

        let targetIndex = -1;
        if (direction === 'up' && badgeIndex > 0) {
          targetIndex = badgeIndex -1;
          [challenges[badgeIndex], challenges[badgeIndex - 1]] = [challenges[badgeIndex - 1], challenges[badgeIndex]];
        } else if (direction === 'down' && badgeIndex < challenges.length - 1) {
          targetIndex = badgeIndex + 1;
          [challenges[badgeIndex], challenges[badgeIndex + 1]] = [challenges[badgeIndex + 1], challenges[badgeIndex]];
        } else {
          return hero; 
        }
        const movedBadgeDef = getBadgeDefinition(challenges[targetIndex].badgeId);
        toast({ title: "Badge Reordered", description: `Badge "${movedBadgeDef?.title || challenges[targetIndex].badgeId}" has been moved.`})
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
        const importedJson: ExportData | StoredHero[] = JSON.parse(jsonString);
        
        let heroesToImport: StoredHero[];

        if (typeof importedJson === 'object' && importedJson !== null && 'version' in importedJson && 'heroes' in importedJson && Array.isArray((importedJson as ExportData).heroes)) {
            if ((importedJson as ExportData).version !== EXPORT_DATA_VERSION) {
                
                toast({ title: "Import Warning", description: `Data is from a different version (imported: ${(importedJson as ExportData).version}, current: ${EXPORT_DATA_VERSION}). Proceeding with import.`, variant: "default" });
            }
            heroesToImport = (importedJson as ExportData).heroes;
        } else if (Array.isArray(importedJson)) {
            heroesToImport = importedJson as StoredHero[];
             toast({ title: "Import Warning", description: `Imported data is in a legacy format. Proceeding with import.`, variant: "default" });
        } else {
            toast({ title: "Import Error", description: "Invalid file format.", variant: "destructive" });
            return;
        }
        
        if (!Array.isArray(heroesToImport) || !heroesToImport.every(h => h.id && h.name && Array.isArray(h.challenges) && h.challenges.every(c => c.id && c.badgeId && typeof c.level === 'number'))) {
            toast({ title: "Import Error", description: "Imported data is not in the expected StoredHero[] format or has missing fields.", variant: "destructive" });
            return;
        }
        
        const sanitizedImportedHeroes = heroesToImport.map(hero => ({
          id: hero.id,
          name: hero.name,
          portraitUrl: hero.portraitUrl?.trimStart() || '',
          personalGoalLevel: typeof hero.personalGoalLevel === 'number' ? hero.personalGoalLevel : 0,
          challenges: hero.challenges.map(challenge => {
            const badgeDef = getBadgeDefinition(challenge.badgeId);
            if (!badgeDef) {
                console.warn(`Import: Badge definition not found for badgeId "${challenge.badgeId}" on hero "${hero.name}". Skipping this badge instance.`);
                return null; 
            }
            return {
                id: challenge.id, 
                badgeId: challenge.badgeId,
                level: Math.max(1, challenge.level ?? 1),
            };
          }).filter(Boolean) as StoredHeroChallenge[] 
        }));

        saveHeroes(sanitizedImportedHeroes);
        setSelectedHeroId(null); 
        toast({ title: "Data Imported", description: "Hero progression data has been successfully imported." });
      } catch (error) {
        console.error("Error importing data:", error);
        toast({ title: "Import Error", description: "Failed to parse or process the JSON file. Make sure it's a valid export.", variant: "destructive" });
      } finally {
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
                <label htmlFor="import-file-input" className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
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
            <CardDescription>Manage the badge instances for this hero. You can reorder badges using the arrow buttons.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleOpenAddBadgeDialog} variant="outline">
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Badge Instance to {selectedHero.name}
            </Button>
            {selectedHero.challenges.length > 0 ? (
              <ul className="space-y-2">
                {selectedHero.challenges.map((badgeInstance, index) => {
                  const badgeDef = getBadgeDefinition(badgeInstance.badgeId);
                  return (
                  <li key={badgeInstance.id} className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-md">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleMoveBadge(badgeInstance.id, 'up')}
                                disabled={index === 0}
                                aria-label="Move badge up"
                                className="h-6 w-6"
                            >
                                <ArrowUpIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleMoveBadge(badgeInstance.id, 'down')}
                                disabled={index === selectedHero.challenges.length - 1}
                                aria-label="Move badge down"
                                className="h-6 w-6"
                            >
                                <ArrowDownIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                        <p className="font-semibold">{badgeDef?.title || 'Unknown Badge'} <span className="text-xs text-muted-foreground">(Instance ID: {badgeInstance.id})</span></p>
                        <p className="text-sm text-muted-foreground">Type ID: {badgeInstance.badgeId}, XP/Lvl: {badgeDef?.xpPerLevel || 'N/A'}, Initial Lvl: {badgeInstance.level}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleOpenEditBadgeDialog(badgeInstance)} variant="outline" size="icon" aria-label="Edit Badge Instance">
                        <EditIcon className="h-4 w-4" />
                         <span className="sr-only">Edit Badge Instance</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" aria-label="Delete Badge Instance">
                            <Trash2Icon className="h-4 w-4" />
                            <span className="sr-only">Delete Badge Instance</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the badge instance &quot;{badgeDef?.title || badgeInstance.id}&quot; from {selectedHero.name}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteBadge(badgeInstance.id)}>Delete Badge Instance</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </li>
                )})}
              </ul>
            ) : (
              <p className="text-muted-foreground">No badge instances configured for {selectedHero.name}.</p>
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
        existingBadgeInstanceIds={selectedHero?.challenges.map(b => b.id) || []}
      />
    </div>
  );
}

