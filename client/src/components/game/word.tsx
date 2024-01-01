import { animated, useSpring } from '@react-spring/web';
import { WordAndDifficulties } from 'types/word';
export function getRandomXCoordinate() {
  return Math.floor(Math.random() * (window.innerWidth - 100)) + 100;
}

export function Word({ word }: { word: WordAndDifficulties }) {
  const [props] = useSpring(() => ({
    from: { y: 0, x: getRandomXCoordinate() - 100 },
    to: { y: window.innerHeight - 100 },
    config: { duration: word.wordTimeout }
  }));

  return (
    <animated.div key={word.id} className="text-white absolute" style={props}>
      <div className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg ">
        {word.word}
        <span className="sr-only">Notifications</span>
        <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 ">
          {word.toBeDestroyed}
        </div>
      </div>
    </animated.div>
  );
}
