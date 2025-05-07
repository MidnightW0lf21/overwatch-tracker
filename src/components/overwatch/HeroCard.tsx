
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
  
  const displayTitle = `Level ${hero.level}`; 

  return (
    <Card 
      className={cn(
        "bg-card text-card-foreground shadow-md rounded-lg overflow-hidden transition-all duration-200 ease-in-out cursor-pointer",
        "hover:shadow-xl hover:bg-card/90",
        "ring-1 ring-transparent hover:ring-primary/50 flex flex-col" // Added flex flex-col to allow content to define height
      )}
      data-testid={`hero-card-${hero.id}`}
      onClick={() => onEditHeroBadges(hero)}
    >
      <CardContent className="p-4 flex flex-col items-center text-center space-y-3 flex-grow">
        {/* Image */}
        <div className="flex-shrink-0">
          <Image
            src={hero.portraitUrl}
            alt={`${hero.name} Portrait`}
            width={80} // Increased image size
            height={80}
            className="rounded-lg border-2 border-primary/80 shadow-md" // Enhanced image styling
            data-ai-hint="hero portrait"
          />
        </div>
        
        {/* Text Info Container */}
        <div className="w-full space-y-1">
          <h3 className="text-xl font-bold truncate">{hero.name}</h3>
          <p className="text-sm text-accent font-semibold uppercase tracking-wider">{displayTitle}</p>
        </div>
        
        {/* Progress Container - pushed to the bottom if space allows */}
        <div className="w-full max-w-[90%] mt-auto pt-2"> 
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-muted-foreground">
              {hero.xpTowardsNextLevel.toLocaleString()}/{hero.xpNeededForNextLevel.toLocaleString()} XP
            </span>
            <span className="text-xs text-muted-foreground">{levelProgressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={levelProgressPercentage} className="h-2.5 bg-primary/30 [&>div]:bg-primary" />
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroCard;

