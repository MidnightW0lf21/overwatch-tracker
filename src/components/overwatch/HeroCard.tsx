import type React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { HeroCalculated } from '@/types/overwatch';
import DualProgressBar from './DualProgressBar';

interface HeroCardProps {
  hero: HeroCalculated;
  onSelectHero: (hero: HeroCalculated) => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onSelectHero }) => {
  const levelProgressPercentage = hero.xpNeededForNextLevel > 0 ? (hero.xpTowardsNextLevel / hero.xpNeededForNextLevel) * 100 : 0;
  const goalProgressPercentage = hero.personalGoalXP > 0 ? (hero.totalXp / hero.personalGoalXP) * 100 : 0;

  return (
    <Card 
      className="bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={() => onSelectHero(hero)}
      data-testid={`hero-card-${hero.id}`}
    >
      <CardHeader className="p-4 flex flex-row items-center space-x-4">
        <Image
          src={hero.portraitUrl}
          alt={`${hero.name} Portrait`}
          width={64}
          height={64}
          className="rounded-md border-2 border-primary"
          data-ai-hint="hero portrait"
        />
        <div className="flex-1">
          <CardTitle className="text-xl font-bold">{hero.name}</CardTitle>
          <p className="text-sm text-muted-foreground">Level {hero.level}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <DualProgressBar
          value1={hero.xpTowardsNextLevel}
          max1={hero.xpNeededForNextLevel}
          label1="Next Level"
          value2={hero.totalXp}
          max2={hero.personalGoalXP}
          label2="Personal Goal"
        />
         <p className="text-xs text-muted-foreground mt-2 text-right">
            Total XP: {hero.totalXp.toLocaleString()}
          </p>
      </CardContent>
    </Card>
  );
};

export default HeroCard;
