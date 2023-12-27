import { animated, useSpring } from '@react-spring/web';
export function getRandomXCoordinate() {
  return Math.floor(Math.random() * (window.innerWidth - 100)) + 100;
}

export function Word({ word }: { word: string }) {
  const [props, api] = useSpring(
    () => ({
      from: { y: 0, x: getRandomXCoordinate() - 100 },
      to: { y: window.innerHeight - 100 },
      config: { duration: 5000 }
    }),
    []
  );

  return (
    <animated.div className="text-white absolute" style={props}>
      {word}
    </animated.div>
  );
}
