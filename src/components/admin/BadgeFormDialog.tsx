
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import type { StoredHeroChallenge } from '@/types/overwatch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { iconNameMap, getIconComponent } from '@/lib/icon-utils';
import { XP_PER_HERO_TYPE_BADGE_LEVEL, XP_PER_WIN_TYPE_BADGE_LEVEL, XP_PER_TIME_TYPE_BADGE_LEVEL } from '@/lib/overwatch-utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const CUSTOM_SVG_ICON_NAME = '_customSvg';

interface BadgeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (badge: StoredHeroChallenge) => void;
  badge: StoredHeroChallenge | null;
  heroName: string;
  existingBadgeIds: string[]; 
}

const badgeSchema = z.object({
  id: z.string().min(1, "ID is required").regex(/^[a-z0-9_]+$/, "ID can only contain lowercase letters, numbers, and underscores."),
  title: z.string().min(1, "Title is required"),
  iconSelectionType: z.enum(['lucide', 'custom_svg'], { required_error: "Icon type selection is required" }),
  iconName: z.string().optional(), // Lucide icon name
  customIconSvg: z.string().optional(), // Custom SVG string
  xpPerLevel: z.coerce.number().min(1, "XP per Level must be greater than 0"),
  level: z.coerce.number().min(0, "Level must be 0 or greater").default(0),
}).superRefine((data, ctx) => {
  if (data.iconSelectionType === 'lucide' && !data.iconName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Lucide Icon is required when 'Lucide Icon' type is selected.",
      path: ['iconName'],
    });
  }
  if (data.iconSelectionType === 'custom_svg' && (!data.customIconSvg || data.customIconSvg.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Custom SVG code is required when 'Custom SVG' type is selected.",
      path: ['customIconSvg'],
    });
  }
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
      iconSelectionType: 'lucide',
      iconName: Object.keys(iconNameMap)[0] || '',
      customIconSvg: '',
      xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL,
      level: 0,
    },
  });

  const selectedIconType = watch('iconSelectionType');
  const selectedLucideIconName = watch('iconName');
  const customSvgCode = watch('customIconSvg');

  let IconPreview: React.ElementType | null = null;
  let customSvgPreview: string | null = null;

  if (selectedIconType === 'lucide' && selectedLucideIconName) {
    IconPreview = getIconComponent(selectedLucideIconName);
  } else if (selectedIconType === 'custom_svg' && customSvgCode) {
    customSvgPreview = customSvgCode;
  }
  

  useEffect(() => {
    if (badge) {
      setValue('id', badge.id);
      setValue('title', badge.title);
      if (badge.iconName === CUSTOM_SVG_ICON_NAME && badge.customIconSvg) {
        setValue('iconSelectionType', 'custom_svg');
        setValue('customIconSvg', badge.customIconSvg);
        setValue('iconName', Object.keys(iconNameMap)[0] || ''); // Default Lucide in case user switches
      } else {
        setValue('iconSelectionType', 'lucide');
        setValue('iconName', badge.iconName);
        setValue('customIconSvg', '');
      }
      setValue('xpPerLevel', badge.xpPerLevel);
      setValue('level', badge.level);
    } else {
      reset({
        id: '',
        title: '',
        iconSelectionType: 'lucide',
        iconName: Object.keys(iconNameMap)[0] || '',
        customIconSvg: '',
        xpPerLevel: XP_PER_HERO_TYPE_BADGE_LEVEL,
        level: 0,
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
      iconName: data.iconSelectionType === 'custom_svg' ? CUSTOM_SVG_ICON_NAME : (data.iconName || 'ShieldQuestion'),
      customIconSvg: data.iconSelectionType === 'custom_svg' ? data.customIconSvg : undefined,
      xpPerLevel: data.xpPerLevel,
      level: badge ? badge.level : (data.level || 0), // Preserve existing level if editing, else use form value or 0
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
            Badge ID must be unique for this hero.
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
            <Label htmlFor="badge-iconType" className="text-right">Icon Type</Label>
            <Controller
                name="iconSelectionType"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select icon type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="lucide">Lucide Icon</SelectItem>
                            <SelectItem value="custom_svg">Custom SVG</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.iconSelectionType && <p className="col-span-4 text-destructive text-sm text-right">{errors.iconSelectionType.message}</p>}
          </div>

          {selectedIconType === 'lucide' && (
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
          )}

          {selectedIconType === 'custom_svg' && (
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="badge-customIconSvg">Custom SVG Code</Label>
              <Controller
                name="customIconSvg"
                control={control}
                render={({ field }) => <Textarea id="badge-customIconSvg" {...field} rows={3} placeholder="<svg>...</svg>" />}
              />
              {customSvgPreview && (
                <div className="p-2 border rounded-md bg-muted">
                  <Label className="text-xs">Preview:</Label>
                  <div className="h-8 w-8 text-primary" dangerouslySetInnerHTML={{ __html: customSvgPreview }} />
                </div>
              )}
              {errors.customIconSvg && <p className="text-destructive text-sm">{errors.customIconSvg.message}</p>}
            </div>
          )}

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
                            value={field.value === "custom" ? "" : field.value} // Handle "custom" string
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
