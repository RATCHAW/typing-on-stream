import { useEffect, useState } from 'react';
import { Word } from '@/components/game/word';
import { useSocketGame } from '@/hooks/useSocketGame';

function Game() {
  const { gameStatus, errorMsg, loading, loosingWord } = useSocketGame();
  // const [words, setWords] = useState<string[]>([]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setWords((words) => [...words, randomWord()]);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);
  return (
    // <div className="h-screen bg-black">
    //   {words.map((word, index) => {
    //     return <Word word={word} key={index} />;
    //   })}
    // </div>
    <div>{errorMsg + loading}</div>
  );
}

export default Game;
