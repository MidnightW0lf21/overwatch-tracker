
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lightbulb, MousePointerClick, Pin, Settings, TrophyIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TutorialDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialDialog: React.FC<TutorialDialogProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Lightbulb className="h-6 w-6" />
            Welcome to the Tracker!
          </DialogTitle>
          <DialogDescription>
            Here’s a quick guide to get you started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 text-sm">
          <div className="flex items-start gap-4">
            <MousePointerClick className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold">Edit Hero Badges</h4>
              <p className="text-muted-foreground">Click on any hero card to open the badge editor. There, you can input the levels for each of that hero's specific sub-badges.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
             <div className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" >
                 <Progress value={50} className="h-2.5 w-full bg-accent/20 [&>div]:bg-accent mt-2" />
             </div>
            <div>
              <h4 className="font-semibold">Track Your Progress</h4>
              <p className="text-muted-foreground">The progress bars at the top show your overall and role-specific levels, calculated from the total XP you've earned from all your badges.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <Pin className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold">Pin Your Favorites</h4>
              <p className="text-muted-foreground">Click the pin icon on a hero card to keep them at the top of the list for quick access. You can pin up to 3 heroes.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <TrophyIcon className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold">View Achievements</h4>
              <p className="text-muted-foreground">Click the trophy icon in the header to see all the achievements you can unlock based on your progression.</p>
            </div>
          </div>

           <div className="flex items-start gap-4">
            <Settings className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold">Manage & Customize</h4>
              <p className="text-muted-foreground">Use the settings icon to go to the management page where you can add custom heroes, manage badges, and import/export your data.</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Got it, let's go!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
