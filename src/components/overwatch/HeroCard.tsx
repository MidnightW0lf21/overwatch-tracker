
import type React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { HeroCalculated } from '@/types/overwatch';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { getHeroRole } from '@/lib/hero-roles';


interface HeroCardProps {
  hero: HeroCalculated;
  onEditHeroBadges: (hero: HeroCalculated) => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onEditHeroBadges }) => {
  const levelProgressPercentage = hero.xpNeededForNextLevel > 0 ? (hero.xpTowardsNextLevel / hero.xpNeededForNextLevel) * 100 : 0;
  
  const displayTitle = `Level ${hero.level}`;
  
  const role = getHeroRole(hero.id);

  const roleColorClasses = {
    Tank: 'from-blue-500/50',
    Damage: 'from-red-500/50',
    Support: 'from-green-500/50',
  };
  
  const roleBorderColorClasses = {
    Tank: 'hover:ring-blue-500',
    Damage: 'hover:ring-red-500',
    Support: 'hover:ring-green-500',
  };

  const fadeClass = role ? roleColorClasses[role] : 'from-transparent';
  const ringClass = role ? roleBorderColorClasses[role] : 'hover:ring-primary';


  return (
    <Card 
      className={cn(
        "bg-card text-card-foreground shadow-md rounded-lg overflow-hidden transition-all duration-200 ease-in-out cursor-pointer",
        "hover:shadow-2xl hover:scale-[1.02] hover:bg-card/80",
        "ring-1 ring-transparent hover:ring-2 flex flex-col relative",
        ringClass
      )}
      data-testid={`hero-card-${hero.id}`}
      onClick={() => onEditHeroBadges(hero)}
    >
      <div className={cn("absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b to-transparent pointer-events-none z-0", fadeClass)} />
      <CardContent className="p-4 flex flex-col items-center text-center space-y-3 flex-grow z-10">
        {/* Image Container: Make it responsive, similar to progress bar container */}
        <div className="w-full max-w-[90%] aspect-square relative">
          <Image
            src={hero.portraitUrl}
            alt={`${hero.name} Portrait`}
            fill={true} // Use fill to make image responsive within parent
            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, (max-width: 1280px) 18vw, 150px" // Provide sizes for optimization
            className="rounded-lg border-2 border-primary/80 shadow-md object-cover" // object-cover to fill and crop
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

