import Sword from '@/assets/icons/sword.svg?react';
import LogLabel from '@/components/atoms/gameInfoLabel';
import Fire from '@/assets/icons/fire.svg?react';
import Flag from '@/assets/icons/flag.svg?react';
import { useSocketGame } from '@/providers/game-provider';

function ScenceInfo() {
  const { currentScore, wordDistroyedLogs, highestScore } = useSocketGame();

  return (
    <div className="flex justify-between">
      <div className="space-y-2">
        {wordDistroyedLogs &&
          wordDistroyedLogs.slice(0, 2).map((log, index) => (
            <LogLabel key={`${log.id}${index}${log.user}`} icon={<Sword />} secondary={index === 1}>
              {log.user} GOT THE WORD "{log.word}"
            </LogLabel>
          ))}
      </div>
      <div className="flex flex-col items-end space-y-2">
        <LogLabel yellow icon={<Fire />}>
          top score : {highestScore}
        </LogLabel>
        <LogLabel icon={<Flag />}>current score : {currentScore}</LogLabel>
      </div>
    </div>
  );
}

export default ScenceInfo;
