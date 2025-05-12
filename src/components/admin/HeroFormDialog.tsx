
'use client';

import type React from 'react';
import { useEffect } from 'react';
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
  personalGoalLevel: z.coerce.number().min(0, "Personal Goal Level must be 0 or greater").max(500, "Personal Goal Level cannot exceed 500"),
});

type HeroFormData = Omit<StoredHero, 'challenges'>; // Form data doesn't include challenges directly

const HeroFormDialog: React.FC<HeroFormDialogProps> = ({ isOpen, onClose, onSubmit, hero, allHeroes }) => {
  const { toast } = useToast();
  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      id: '',
      name: '',
      portraitUrl: '',
      personalGoalLevel: 0,
    },
  });

  useEffect(() => {
    if (hero) {
      setValue('id', hero.id);
      setValue('name', hero.name);
      setValue('portraitUrl', hero.portraitUrl);
      setValue('personalGoalLevel', hero.personalGoalLevel);
    } else {
      reset({ id: '', name: '', portraitUrl: '', personalGoalLevel: 0 });
    }
  }, [hero, isOpen, reset, setValue]);

  const handleFormSubmit = (data: HeroFormData) => {
    if (!hero && allHeroes.some(h => h.id === data.id)) {
      toast({
        title: "Error: Duplicate ID",
        description: `A hero with ID "${data.id}" already exists. Please use a unique ID.`,
        variant: "destructive",
      });
      return;
    }
    // Preserve existing challenges if editing, otherwise it's an empty array for a new hero
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
            Hero ID must be unique. Personal Goal Level: 0 for no goal, max 500.
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
            <Label htmlFor="personalGoalLevel" className="text-right">Goal Level</Label>
            <Controller
              name="personalGoalLevel"
              control={control}
              render={({ field }) => <Input id="personalGoalLevel" type="number" {...field} className="col-span-3" />}
            />
            {errors.personalGoalLevel && <p className="col-span-4 text-destructive text-sm text-right">{errors.personalGoalLevel.message}</p>}
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
