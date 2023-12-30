import { Word as WordComponent } from '@/components/game/word';
import { useSocketGame } from '@/hooks/useSocketGame';
import { memo } from 'react';

const Word = memo(WordComponent);

function Game() {
  const { words } = useSocketGame();

  return (
    <div className="h-screen bg-black">
      {words &&
        words.map((word) => {
          return <Word word={word} key={word.id} />;
        })}
    </div>
  );
}

export default Game;
