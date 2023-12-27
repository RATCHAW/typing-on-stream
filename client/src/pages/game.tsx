import { useEffect, useState } from 'react';
import { socketGame } from '@/socket';
import { Word } from '@/components/game/word';

function randomWord() {
  // generate random words wtih random characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function Game() {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWords((words) => [...words, randomWord()]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-screen bg-black">
      {words.map((word, index) => {
        return <Word word={word} key={index} />;
      })}
    </div>
  );
}

export default Game;
