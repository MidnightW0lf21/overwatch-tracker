import type React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DualProgressBarProps {
  value1: number;
  max1: number;
  label1?: string;
  value2: number;
  max2: number;
  label2?: string;
  className?: string;
}

const DualProgressBar: React.FC<DualProgressBarProps> = ({
  value1,
  max1,
  label1,
  value2,
  max2,
  label2,
  className,
}) => {
  const percentage1 = max1 > 0 ? (value1 / max1) * 100 : 0;
  const percentage2 = max2 > 0 ? (value2 / max2) * 100 : 0;

  return (
    <div className={cn("space-y-2 w-full", className)}>
      <div>
        {label1 && (
          <div className="text-xs text-foreground/80 mb-1 flex justify-between">
            <span>{label1}</span>
            <span>{value1.toLocaleString()} / {max1.toLocaleString()} XP</span>
          </div>
        )}
        <Progress value={percentage1} className="h-3 bg-primary/20 [&>div]:bg-primary" aria-label={label1 || 'Progress 1'} />
      </div>
      <div>
        {label2 && (
          <div className="text-xs text-foreground/80 mb-1 flex justify-between">
            <span>{label2}</span>
            <span>{value2.toLocaleString()} / {max2.toLocaleString()} XP</span>
          </div>
        )}
        <Progress value={percentage2} className="h-3 bg-accent/20 [&>div]:bg-accent" aria-label={label2 || 'Progress 2'} />
      </div>
    </div>
  );
};

export default DualProgressBar;
