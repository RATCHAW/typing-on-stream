import LogsList from '@/components/game/logsList';
import { Word as WordComponent } from '@/components/game/word';
import LoadingImg from '@/components/shared/loadingImg';
import { useSocketGame } from '@/hooks/useSocketGame';
import { memo } from 'react';

const Word = memo(WordComponent);

function Game() {
  const { words, loading, gameStatus } = useSocketGame();
  console.log(loading);

  return (
    <div className="h-screen bg-black relative">
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
      {words &&
        words.map((word) => {
          return <Word word={word} key={word.id} />;
        })}
    </div>
  );
}

export default Game;
