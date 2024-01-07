import { useSocketGame } from '@/hooks/useSocketGame';
import DeathLine from '../atoms/deathLine';
import PlayGame from './playGame';
import ScenceInfo from './scenceInfo';
import WaitingMenu from './waitingMenu';

function GameContentSection() {
  const { words, loading, gameStatus } = useSocketGame();

  return (
    <div className="flex flex-grow px-[30px] border-2 border-border rounded-lg">
      <div>
        <PlayGame words={words} />
      </div>
      <div className="flex flex-col justify-end flex-grow space-y-6 mb-6">
        <DeathLine />
        <ScenceInfo />
      </div>
    </div>
  );
}

export default GameContentSection;
