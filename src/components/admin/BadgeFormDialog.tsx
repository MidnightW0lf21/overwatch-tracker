
'use client';

import type React from 'react';
import { useEffect } from 'react';
import type { StoredHeroChallenge } from '@/types/overwatch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Removed getIconComponent as icon is now directly on BadgeDefinition
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { badgeDefinitions, getBadgeDefinition, type BadgeDefinition } from '@/lib/badge-definitions';


interface BadgeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (badge: StoredHeroChallenge) => void;
  badge: StoredHeroChallenge | null;
  heroName: string;
  existingBadgeInstanceIds: string[];
}

const badgeInstanceSchema = z.object({
  id: z.string().min(1, "Instance ID is required").regex(/^[a-z0-9_]+$/, "Instance ID can only contain lowercase letters, numbers, and underscores."),
  badgeId: z.string().min(1, "Badge Type is required"),
  level: z.coerce.number().min(1, "Initial Level must be 1 or greater").default(1),
});

type BadgeInstanceFormValues = z.infer<typeof badgeInstanceSchema>;

const BadgeFormDialog: React.FC<BadgeFormDialogProps> = ({ isOpen, onClose, onSubmit, badge, heroName, existingBadgeInstanceIds }) => {
  const { toast } = useToast();
  const { control, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<BadgeInstanceFormValues>({
    resolver: zodResolver(badgeInstanceSchema),
    defaultValues: {
      id: '',
      badgeId: Object.keys(badgeDefinitions)[0] || '',
      level: 1,
    },
  });

  const selectedBadgeId = watch('badgeId');
  const selectedBadgeDefinition = getBadgeDefinition(selectedBadgeId);
  const IconPreview = selectedBadgeDefinition ? selectedBadgeDefinition.icon : null;


  useEffect(() => {
    if (badge) {
      setValue('id', badge.id);
      setValue('badgeId', badge.badgeId);
      setValue('level', badge.level);
    } else {
      reset({
        id: `badge_instance_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        badgeId: Object.keys(badgeDefinitions)[0] || '',
        level: 1,
      });
    }
  }, [badge, isOpen, reset, setValue]);

  const handleFormSubmit = (data: BadgeInstanceFormValues) => {
    if (!badge && existingBadgeInstanceIds.includes(data.id)) {
       toast({
        title: "Error: Duplicate Badge Instance ID",
        description: `A badge instance with ID "${data.id}" already exists for this hero. Please use a unique ID.`,
        variant: "destructive",
      });
      return;
    }

    if (!getBadgeDefinition(data.badgeId)) {
        toast({
            title: "Error: Invalid Badge Type",
            description: `The selected badge type "${data.badgeId}" is not valid.`,
            variant: "destructive",
        });
        return;
    }

    const submittedBadgeData: StoredHeroChallenge = {
      id: data.id,
      badgeId: data.badgeId,
      level: data.level,
    };
    onSubmit(submittedBadgeData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{badge ? 'Edit Badge Instance' : `Add New Badge to ${heroName}`}</DialogTitle>
          <DialogDescription>
            {badge ? `Editing badge instance.` : `Select a badge type and set its initial level for ${heroName}.`}
            Instance ID must be unique for this hero. Initial Level set here is the starting point.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badge-instance-id" className="text-right">Instance ID</Label>
            <Controller
              name="id"
              control={control}
              render={({ field }) => <Input id="badge-instance-id" {...field} className="col-span-3" disabled={!!badge} />}
            />
            {errors.id && <p className="col-span-4 text-destructive text-sm text-right">{errors.id.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badge-type-id" className="text-right">Badge Type</Label>
            <Controller
              name="badgeId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ''} disabled={!!badge}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select a badge type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(badgeDefinitions).map(def => (
                      <SelectItem key={def.id} value={def.id}>{def.title} ({def.id})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {IconPreview && <IconPreview className="h-6 w-6 text-primary" />}
            {errors.badgeId && <p className="col-span-4 text-destructive text-sm text-right">{errors.badgeId.message}</p>}
          </div>

          {selectedBadgeDefinition && (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-1">Details</Label>
                <div className="col-span-3 text-sm text-muted-foreground">
                    <p>Title: {selectedBadgeDefinition.title}</p>
                    <p>XP/Level: {selectedBadgeDefinition.xpPerLevel}</p>
                </div>
            </div>
          )}


           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badge-level" className="text-right">Initial Level</Label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => <Input id="badge-level" type="number" {...field} className="col-span-3" placeholder="Default is 1"/>}
            />
            {errors.level && <p className="col-span-4 text-destructive text-sm text-right">{errors.level.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{badge ? 'Save Changes' : 'Add Badge Instance'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeFormDialog;

    