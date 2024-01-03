import LogsList from '@/components/game/molecules/wordsLogs';
import { Word as WordComponent } from '@/components/game/atoms/word';
import LoadingImg from '@/components/shared/loadingImg';
import { useSocketGame } from '@/hooks/useSocketGame';
import { memo } from 'react';
import LiveGame from '@/components/game/organisms/liveGame';

const Word = memo(WordComponent);

function Game() {
  const { words, loading, gameStatus } = useSocketGame();
  console.log(loading);

  return (
    <div className="h-screen bg-black">
      {gameStatus === 'stopped' && !loading && (
        <div className="flex items-center justify-center h-screen text-white text-2xl font-mono">
          Waiting for game to start
        </div>
      )}
      {gameStatus === 'over' && (
        <div className="flex items-center justify-center h-screen text-red-600 text-2xl font-mono">Game Over</div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-screen">
          <LoadingImg />
        </div>
      )}
      {gameStatus === 'started' && <LiveGame words={words} />}
    </div>
  );
}

export default Game;
