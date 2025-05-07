
import type React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { HeroCalculated } from '@/types/overwatch';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';


interface HeroCardProps {
  hero: HeroCalculated;
  onEditHeroBadges: (hero: HeroCalculated) => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onEditHeroBadges }) => {
  const levelProgressPercentage = hero.xpNeededForNextLevel > 0 ? (hero.xpTowardsNextLevel / hero.xpNeededForNextLevel) * 100 : 0;
  
  // Cast to any is a temporary workaround if rankTitle is not part of HeroCalculated type
  // but exists on the initial data. Ideally, this should be part of the type.
  const rankTitle = (hero as any).rankTitle || "Aspirant Hero"; 

  return (
    <Card 
      className={cn(
        "bg-card text-card-foreground shadow-md rounded-lg overflow-hidden transition-all duration-200 ease-in-out cursor-pointer",
        "hover:shadow-xl hover:bg-card/90",
        // Removed isSelected based styling, card is active when sheet is open for it.
        "ring-1 ring-transparent hover:ring-primary/50" 
      )}
      data-testid={`hero-card-${hero.id}`}
      onClick={() => onEditHeroBadges(hero)}
    >
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Image
              src={hero.portraitUrl}
              alt={`${hero.name} Portrait`}
              width={56} 
              height={56}
              className="rounded-md border-2 border-primary/80"
              data-ai-hint="hero portrait"
            />
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="flex items-baseline space-x-2">
              <h3 className="text-lg font-bold truncate">{hero.name}</h3>
            </div>
            <p className="text-xs text-accent font-semibold uppercase tracking-wide truncate">{rankTitle}</p>
            <div className="mt-1">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-xs text-muted-foreground">
                  {hero.xpTowardsNextLevel.toLocaleString()} / {hero.xpNeededForNextLevel.toLocaleString()} XP
                </span>
                <span className="text-sm font-semibold">LEVEL {hero.level}</span>
              </div>
              <Progress value={levelProgressPercentage} className="h-2 bg-primary/30 [&>div]:bg-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroCard;
