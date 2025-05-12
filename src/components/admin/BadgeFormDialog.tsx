
'use client';

import type React from 'react';
import { useEffect } from 'react';
import type { StoredHeroChallenge } from '@/types/overwatch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { iconNameMap, getIconComponent } from '@/lib/icon-utils';
import { XP_PER_HERO_TYPE_BADGE_LEVEL, XP_PER_WIN_TYPE_BADGE_LEVEL, XP_PER_TIME_TYPE_BADGE_LEVEL } from '@/lib/overwatch-utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

interface BadgeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (badge: StoredHeroChallenge) => void;
  badge: StoredHeroChallenge | null; // This is the badge being edited, or null if adding a new one
  heroName: string;
  existingBadgeIds: string[]; 
}

const badgeSchema = z.object({
  id: z.string().min(1, "ID is required").regex(/^[a-z0-9_]+$/, "ID can only contain lowercase letters, numbers, and underscores."),
  title: z.string().min(1, "Title is required"),
  iconName: z.string().min(1, "Lucide Icon is required"),
  xpPerLevel: z.coerce.number().min(1, "XP per Level must be greater than 0"),
  level: z.coerce.number().min(0, "Level must be 0 or greater").default(0), // Keep level, it's for initial level on creation
});

type BadgeFormValues = z.infer<typeof badgeSchema>;

const xpOptions = [
  { label: `Hero Specific (${XP_PER_HERO_TYPE_BADGE_LEVEL} XP)`, value: XP_PER_HERO_TYPE_BADGE_LEVEL },
  { label: `Win Based (${XP_PER_WIN_TYPE_BADGE_LEVEL} XP)`, value: XP_PER_WIN_TYPE_BADGE_LEVEL },
  { label: `Time Based (${XP_PER_TIME_TYPE_BADGE_LEVEL} XP)`, value: XP_PER_TIME_TYPE_BADGE_LEVEL },
];

const BadgeFormDialog: React.FC<BadgeFormDialogProps> = ({ isOpen, onClose, onSubmit, badge, heroName, existingBadgeIds }) => {
  const { toast } = useToast();
  const { control, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<BadgeFormValues>({
    resolver: zodResolver(badgeSchema),
    defaultValues: {
      id: '',
      title: '',
      iconName: Object.keys(iconNameMap)[0] || '',
      xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL,
      level: 0, // Default to 0, it means no levels gained yet. App logic ensures effective level 1 if XP is calculated.
    },
  });

  const selectedLucideIconName = watch('iconName');
  const IconPreview = selectedLucideIconName ? getIconComponent(selectedLucideIconName) : null;

  useEffect(() => {
    if (badge) { // Editing existing badge
      setValue('id', badge.id);
      setValue('title', badge.title);
      setValue('iconName', badge.iconName);
      setValue('xpPerLevel', badge.xpPerLevel);
      setValue('level', badge.level); // Preserve existing level when editing
    } else { // Adding new badge
      reset({
        id: '',
        title: '',
        iconName: Object.keys(iconNameMap)[0] || '',
        xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL,
        level: 0, // New badges start at effective level 0 for XP calculation purposes (no XP gained yet)
                  // The UI for badge editing on the main page will handle incrementing this.
                  // The app page will interpret 0 or 1 as "base level" with no XP contribution.
      });
    }
  }, [badge, isOpen, reset, setValue]);

  const handleFormSubmit = (data: BadgeFormValues) => {
    if (!badge && existingBadgeIds.includes(data.id)) {
       toast({
        title: "Error: Duplicate Badge ID",
        description: `A badge with ID "${data.id}" already exists for this hero. Please use a unique ID.`,
        variant: "destructive",
      });
      return;
    }
    
    const submittedBadgeData: StoredHeroChallenge = {
      id: data.id,
      title: data.title,
      iconName: data.iconName,
      xpPerLevel: data.xpPerLevel,
      level: badge ? badge.level : (data.level || 0), // If editing, preserve existing level. If new, use form value (default 0).
    };
    onSubmit(submittedBadgeData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{badge ? 'Edit Badge' : `Add New Badge to ${heroName}`}</DialogTitle>
          <DialogDescription>
            {badge ? `Editing "${badge.title}".` : `Enter details for the new badge. `}
            Badge ID must be unique for this hero. Initial Level set here is the starting point.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badge-id" className="text-right">ID</Label>
            <Controller
              name="id"
              control={control}
              render={({ field }) => <Input id="badge-id" {...field} className="col-span-3" disabled={!!badge} />}
            />
            {errors.id && <p className="col-span-4 text-destructive text-sm text-right">{errors.id.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badge-title" className="text-right">Title</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => <Input id="badge-title" {...field} className="col-span-3" />}
            />
            {errors.title && <p className="col-span-4 text-destructive text-sm text-right">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badge-iconName" className="text-right">Lucide Icon</Label>
            <Controller
              name="iconName"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select a Lucide icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(iconNameMap).map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {IconPreview && <IconPreview className="h-6 w-6 text-primary" />}
            {errors.iconName && <p className="col-span-4 text-destructive text-sm text-right">{errors.iconName.message}</p>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badge-xpPerLevel" className="text-right">XP/Level Type</Label>
            <Controller
              name="xpPerLevel"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(val) => field.onChange(val === "custom" ? "custom" : parseInt(val))} value={String(field.value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select XP type" />
                  </SelectTrigger>
                  <SelectContent>
                    {xpOptions.map(opt => (
                      <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                    ))}
                     <SelectItem value="custom">Custom XP Value</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
             {errors.xpPerLevel && <p className="col-span-4 text-destructive text-sm text-right">{errors.xpPerLevel.message}</p>}
          </div>
           {watch('xpPerLevel') === "custom" || (!xpOptions.find(opt => opt.value === watch('xpPerLevel')) && watch('xpPerLevel') !== undefined) ? (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom-xp" className="text-right">Custom XP</Label>
                 <Controller
                    name="xpPerLevel" 
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="custom-xp"
                            type="number"
                            className="col-span-3"
                            // value={field.value === "custom" ? "" : field.value} // Handle "custom" string
                            // Ensure that if field.value is 'custom' (string), it's treated as empty or a default number for the input
                            value={typeof field.value === 'number' ? field.value : (xpOptions.find(opt => String(opt.value) === String(field.value))?.value || "")}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                    )}
                />
            </div>
          ) : null}

           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badge-level" className="text-right">Initial Level</Label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => <Input id="badge-level" type="number" {...field} className="col-span-3" disabled={!!badge} placeholder="Default is 0 for new badges"/>}
            />
            {errors.level && <p className="col-span-4 text-destructive text-sm text-right">{errors.level.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{badge ? 'Save Changes' : 'Add Badge'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeFormDialog;
