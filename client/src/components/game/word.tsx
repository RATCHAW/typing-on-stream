import { animated, useSpring, useSpringRef } from '@react-spring/web';
import { useEffect } from 'react';
import { WordAndDifficulties } from 'types/word';
export function getRandomXCoordinate() {
  return Math.floor(Math.random() * (window.innerWidth - 100)) + 100;
}

export function Word({ word }: { word: WordAndDifficulties }) {
  const [props] = useSpring(() => ({
    from: { y: 0, x: getRandomXCoordinate() - 100 },
    to: { y: window.innerHeight - 100 },
    config: { duration: 5000 }
  }));

  return (
    <animated.div key={word.id} className="text-white absolute" style={props}>
      {word.word}
    </animated.div>
  );
}
