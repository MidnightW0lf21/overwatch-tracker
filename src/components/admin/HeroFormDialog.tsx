
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import type { StoredHero } from '@/types/overwatch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

interface HeroFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hero: StoredHero) => void;
  hero: StoredHero | null;
  allHeroes: StoredHero[]; // To check for duplicate IDs when adding
}

const heroSchema = z.object({
  id: z.string().min(1, "ID is required").regex(/^[a-z0-9_]+$/, "ID can only contain lowercase letters, numbers, and underscores."),
  name: z.string().min(1, "Name is required"),
  portraitUrl: z.string().url("Must be a valid URL for portrait image"),
  personalGoalXP: z.coerce.number().min(0, "Personal Goal XP must be 0 or greater"),
});

const HeroFormDialog: React.FC<HeroFormDialogProps> = ({ isOpen, onClose, onSubmit, hero, allHeroes }) => {
  const { toast } = useToast();
  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm<StoredHero>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      id: '',
      name: '',
      portraitUrl: '',
      personalGoalXP: 0,
      challenges: [], // challenges are managed separately
    },
  });

  useEffect(() => {
    if (hero) {
      setValue('id', hero.id);
      setValue('name', hero.name);
      setValue('portraitUrl', hero.portraitUrl);
      setValue('personalGoalXP', hero.personalGoalXP);
      // challenges are part of the hero object but not edited here
    } else {
      reset({ id: '', name: '', portraitUrl: '', personalGoalXP: 0, challenges: [] });
    }
  }, [hero, isOpen, reset, setValue]);

  const handleFormSubmit = (data: StoredHero) => {
    if (!hero && allHeroes.some(h => h.id === data.id)) {
      toast({
        title: "Error: Duplicate ID",
        description: `A hero with ID "${data.id}" already exists. Please use a unique ID.`,
        variant: "destructive",
      });
      return;
    }
    // Preserve existing challenges if editing
    const challenges = hero ? hero.challenges : [];
    onSubmit({ ...data, challenges });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{hero ? 'Edit Hero' : 'Add New Hero'}</DialogTitle>
          <DialogDescription>
            {hero ? `Editing ${hero.name}. ` : 'Enter the details for the new hero. '}
            Hero ID must be unique.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">ID</Label>
            <Controller
              name="id"
              control={control}
              render={({ field }) => <Input id="id" {...field} className="col-span-3" disabled={!!hero} />}
            />
            {errors.id && <p className="col-span-4 text-destructive text-sm text-right">{errors.id.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input id="name" {...field} className="col-span-3" />}
            />
            {errors.name && <p className="col-span-4 text-destructive text-sm text-right">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portraitUrl" className="text-right">Portrait URL</Label>
            <Controller
              name="portraitUrl"
              control={control}
              render={({ field }) => <Input id="portraitUrl" {...field} className="col-span-3" />}
            />
            {errors.portraitUrl && <p className="col-span-4 text-destructive text-sm text-right">{errors.portraitUrl.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="personalGoalXP" className="text-right">Personal Goal XP</Label>
            <Controller
              name="personalGoalXP"
              control={control}
              render={({ field }) => <Input id="personalGoalXP" type="number" {...field} className="col-span-3" />}
            />
            {errors.personalGoalXP && <p className="col-span-4 text-destructive text-sm text-right">{errors.personalGoalXP.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{hero ? 'Save Changes' : 'Add Hero'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HeroFormDialog;
