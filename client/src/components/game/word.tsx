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
      {word.word} {word.toBeDestroyed}
    </animated.div>
  );
}
