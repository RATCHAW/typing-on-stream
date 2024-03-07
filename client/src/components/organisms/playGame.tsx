import { memo } from 'react';
import { Word as WordComponent } from '@/components/atoms/word';

const Word = memo(
  WordComponent,
  (prevProps, nextProps) => prevProps.word.toBeDestroyed === nextProps.word.toBeDestroyed
);

function PlayGame({ words }: { words: any }) {
  return (
    <div>
      {words &&
        words.map((word: any) => {
          return <Word word={word} key={word.id} />;
        })}
    </div>
  );
}

export default PlayGame;
