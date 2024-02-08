import TrophyIcon from '@/assets/icons/trophy.svg?react';
import { cn } from '@/lib/utils';
import React from 'react';

interface ParticipantLabelProps {
  children: React.ReactNode;
  score: number;
  colorized?: boolean;
  secondary?: boolean;
  trophy?: boolean;
  className?: string;
}
function ParticipantLabel({ children, score, colorized, secondary, trophy, className }: ParticipantLabelProps) {
  return (
    <div
      className={cn('text-white p-[2px] rounded-lg border-solid bg-border text-[8px]  uppercase', className, {
        colorful: colorized,
        'text-secondary': secondary
      })}
    >
      <div
        className={cn('flex justify-between flex-grow bg-background rounded-lg py-2 px-5 items-center', {
          'py-4': !trophy
        })}
      >
        <div className="flex space-x-[6px] items-center">
          {trophy && <TrophyIcon />}
          <div>{children}</div>
        </div>
        <span>{score}</span>
      </div>
    </div>
  );
}

export default ParticipantLabel;
