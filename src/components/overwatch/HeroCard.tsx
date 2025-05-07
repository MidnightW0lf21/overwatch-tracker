
import type React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
// Button and Edit3Icon removed
import type { HeroCalculated } from '@/types/overwatch';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';


interface HeroCardProps {
  hero: HeroCalculated;
  onSelectHero: (hero: HeroCalculated) => void;
  // onEditHero prop removed
  isSelected: boolean;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onSelectHero, isSelected }) => {
  const levelProgressPercentage = hero.xpNeededForNextLevel > 0 ? (hero.xpTowardsNextLevel / hero.xpNeededForNextLevel) * 100 : 0;
  
  const rankTitle = (hero as any).rankTitle || "Aspirant Hero"; 

  return (
    <Card 
      className={cn(
        "bg-card text-card-foreground shadow-md rounded-lg overflow-hidden transition-all duration-200 ease-in-out cursor-pointer",
        "hover:shadow-xl hover:bg-card/90",
        isSelected ? "ring-2 ring-primary shadow-lg" : "ring-1 ring-transparent"
      )}
      data-testid={`hero-card-${hero.id}`}
      onClick={() => onSelectHero(hero)} // Moved onClick to the Card itself
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
          
          <div className="flex-grow min-w-0"> {/* min-w-0 for truncation */}
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
          {/* Edit Button removed */}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroCard;
