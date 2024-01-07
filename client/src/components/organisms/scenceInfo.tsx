import Sword from '@/assets/icons/sword.svg?react';
import LogLabel from '@/components/atoms/gameInfoLabel';
import Fire from '@/assets/icons/fire.svg?react';
import Flag from '@/assets/icons/flag.svg?react';
import { useSocketGame } from '@/providers/game-provider';

function ScenceInfo() {
  const { currentScore } = useSocketGame();

  return (
    <div className="flex justify-between">
      <div className="space-y-2">
        <LogLabel icon={<Sword />}>HAMID GOT THE WORD "WORD"</LogLabel>
        <LogLabel icon={<Sword />} secondary>
          HAMID GOT THE WORD "WORD"
        </LogLabel>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <LogLabel yellow icon={<Fire />}>
          top score : 3000
        </LogLabel>
        <LogLabel icon={<Flag />}>current score : {currentScore}</LogLabel>
      </div>
    </div>
  );
}

export default ScenceInfo;
