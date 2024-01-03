import { memo } from 'react';
import { Word as WordComponent } from '@/components/game/atoms/word';
import LogsList from '../molecules/wordsLogs';

const Word = memo(WordComponent);
function LiveGame({ words }: { words: any }) {
  return (
    <div className="flex">
      <div className="bg-purple-700 w-[200px] h-screen z-10">
        <LogsList />
      </div>
      <div>
        <div>
          {words &&
            words.map((word: any) => {
              return <Word word={word} key={word.id} />;
            })}
        </div>
        <div className="h-2 bg-red-600 absolute bottom-[88px] left-0 right-0 z-0"></div>
      </div>
    </div>
  );
}

export default LiveGame;
