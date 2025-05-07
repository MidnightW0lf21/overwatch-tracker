
'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { StoredHero, StoredHeroChallenge } from '@/types/overwatch';
import { initialHeroesData, hydrateHeroes, dehydrateHeroes, calculateTotalXP, calculateLevelDetails } from '@/lib/overwatch-utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircleIcon, EditIcon, Trash2Icon, UsersIcon, ShieldCheckIcon, ArrowLeftIcon } from 'lucide-react';
import HeroFormDialog from './HeroFormDialog';
import BadgeFormDialog from './BadgeFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Link from 'next/link';


const LOCAL_STORAGE_KEY = 'overwatchProgressionData_v3';

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
        setAllHeroes(JSON.parse(storedData));
      } catch (error) {
        console.error("Failed to parse hero data from localStorage", error);
        setAllHeroes(initialHeroesData);
      }
    } else {
      setAllHeroes(initialHeroesData);
    }
  }, []);

  useEffect(() => {
    loadHeroes();
  }, [loadHeroes]);

  const saveHeroes = useCallback((updatedHeroes: StoredHero[]) => {
    setAllHeroes(updatedHeroes);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHeroes));
    // If the currently selected hero was deleted, deselect it
    if (selectedHeroId && !updatedHeroes.find(h => h.id === selectedHeroId)) {
        setSelectedHeroId(null);
    }
  }, [selectedHeroId]);

  const handleHeroSelect = (heroId: string) => {
    setSelectedHeroId(heroId);
    setEditingBadge(null); // Clear badge editing state when hero changes
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
    let updatedHeroes;
    if (editingHero) {
      updatedHeroes = allHeroes.map(h => h.id === heroData.id ? heroData : h);
      toast({ title: "Hero Updated", description: `${heroData.name} has been updated.` });
    } else {
      // Check for duplicate ID
      if (allHeroes.some(h => h.id === heroData.id)) {
        toast({ title: "Error", description: `Hero ID "${heroData.id}" already exists. Please use a unique ID.`, variant: "destructive" });
        return;
      }
      updatedHeroes = [...allHeroes, heroData];
      toast({ title: "Hero Added", description: `${heroData.name} has been added.` });
    }
    saveHeroes(updatedHeroes);
    setIsHeroDialogOpen(false);
    setEditingHero(null);
    if (!editingHero) setSelectedHeroId(heroData.id); // Select new hero
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
          // Check for duplicate badge ID within the current hero
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
  
  const selectedHero = allHeroes.find(h => h.id === selectedHeroId);

  return (
    <div className="space-y-6">
       <div className="flex justify-start">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Tracker
          </Link>
        </Button>
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
                <Button onClick={() => handleOpenEditHeroDialog(selectedHero)} variant="outline" size="icon">
                  <EditIcon className="h-4 w-4" />
                  <span className="sr-only">Edit Hero</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
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
            <CardDescription>Manage the badges available for this hero. Badge levels are edited on the main tracker page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleOpenAddBadgeDialog} variant="outline">
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Badge to {selectedHero.name}
            </Button>
            {selectedHero.challenges.length > 0 ? (
              <ul className="space-y-2">
                {selectedHero.challenges.map(badge => (
                  <li key={badge.id} className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-md">
                    <div>
                      <p className="font-semibold">{badge.title} <span className="text-xs text-muted-foreground">(ID: {badge.id})</span></p>
                      <p className="text-sm text-muted-foreground">Icon: {badge.iconName}, XP/Lvl: {badge.xpPerLevel}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleOpenEditBadgeDialog(badge)} variant="outline" size="icon">
                        <EditIcon className="h-4 w-4" />
                         <span className="sr-only">Edit Badge</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
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
