
import type React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { HeroCalculated } from '@/types/overwatch';
import { Progress } from '@/components/ui/progress';
import { Edit3Icon } from 'lucide-react';
import { cn } from '@/lib/utils';


interface HeroCardProps {
  hero: HeroCalculated;
  onSelectHero: (hero: HeroCalculated) => void;
  onEditHero: (hero: HeroCalculated) => void;
  isSelected: boolean;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onSelectHero, onEditHero, isSelected }) => {
  const levelProgressPercentage = hero.xpNeededForNextLevel > 0 ? (hero.xpTowardsNextLevel / hero.xpNeededForNextLevel) * 100 : 0;
  
  // Find the rank/title if available in initialHeroesData (example, not fully implemented in types)
  const rankTitle = (hero as any).rankTitle || "Aspirant Hero"; // Placeholder

  return (
    <Card 
      className={cn(
        "bg-card text-card-foreground shadow-md rounded-lg overflow-hidden transition-all duration-200 ease-in-out",
        "hover:shadow-xl hover:bg-card/90",
        isSelected ? "ring-2 ring-primary shadow-lg" : "ring-1 ring-transparent"
      )}
      data-testid={`hero-card-${hero.id}`}
    >
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div onClick={() => onSelectHero(hero)} className="cursor-pointer flex-shrink-0">
            <Image
              src={hero.portraitUrl}
              alt={`${hero.name} Portrait`}
              width={56} // Slightly smaller for compact list
              height={56}
              className="rounded-md border-2 border-primary/80"
              data-ai-hint="hero portrait"
            />
          </div>
          
          <div onClick={() => onSelectHero(hero)} className="flex-grow cursor-pointer min-w-0"> {/* min-w-0 for truncation */}
            <div className="flex items-baseline space-x-2">
              <h3 className="text-lg font-bold truncate">{hero.name}</h3>
              {/* Placeholder for hero-specific icon next to name if needed */}
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

          <Button 
            variant="ghost" 
            size="icon" 
            className="flex-shrink-0 text-muted-foreground hover:text-primary h-8 w-8"
            onClick={(e) => {
              e.stopPropagation(); // Prevent onSelectHero from firing
              onEditHero(hero);
            }}
            aria-label={`Edit ${hero.name} progression`}
          >
            <Edit3Icon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroCard;
