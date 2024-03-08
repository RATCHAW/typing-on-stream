import { useSocketGame } from '@/providers/game-provider';
import DeathLine from '../atoms/deathLine';
import PlayGame from './playGame';
import ScenceInfo from './scenceInfo';
import WaitingMenu from './waitingMenu';

function GameContentSection() {
  const { words, gameStatus } = useSocketGame();

  return (
    <div className="flex flex-grow px-[30px] border-2 border-border rounded-lg">
      <div>
        <PlayGame words={words} />
        {(gameStatus === 'stopped' || gameStatus === 'over') && (
          <div>
            <div className="absolute left-[43%] bottom-1/2">
              <WaitingMenu />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-end flex-grow space-y-6 mb-6">
        <DeathLine />
        <ScenceInfo />
      </div>
    </div>
  );
}

export default GameContentSection;
