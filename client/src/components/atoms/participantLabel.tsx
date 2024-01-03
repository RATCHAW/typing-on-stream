import TrophyIcon from '@/assets/icons/trophy.svg?react';
import { cn } from '@/lib/utils';

interface ParticipantLabelProps {
  colorized?: boolean;
  secondary?: boolean;
  trophy?: boolean;
}
function ParticipantLabel({ colorized, secondary, trophy }: ParticipantLabelProps) {
  return (
    <div
      className={cn('text-white p-[2px] rounded-lg border-solid bg-border text-[8px]  uppercase', {
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
          <div>streamer1</div>
        </div>
        <span>100</span>
      </div>
    </div>
  );
}

export default ParticipantLabel;
