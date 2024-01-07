import { cn } from '@/lib/utils';
import { WordAndDifficulties } from '@/types/word';
import { animated, useSpring } from '@react-spring/web';

export function getRandomXCoordinate() {
  const offScreenWidth = 520;
  return Math.floor(Math.random() * (window.innerWidth - offScreenWidth));
}

function getRandomTheme() {
  const themes = ['first', 'second', 'third'];
  const randomIndex = Math.floor(Math.random() * themes.length);
  return themes[randomIndex];
}

interface WordProps {
  theme?: string;
  word: WordAndDifficulties;
}

export function Word({ word }: WordProps) {
  const theme = getRandomTheme();

  const [props] = useSpring(() => ({
    from: { y: 0, x: getRandomXCoordinate() },
    to: { y: window.innerHeight - 230 },
    config: { duration: word.wordTimeout }
  }));

  return (
    <animated.div key={word.id} className="text-white absolute" style={props}>
      <div className="relative">
        <div
          className={cn('text-white space-x-[4.5px] text-[16px]', {
            'text-[#FAC337]': theme === 'second',
            'text-[#7FF361]': theme === 'third'
          })}
        >
          <span>{word.word}</span>
          <span
            className={cn('border-3 border-[1.5px] rounded-md px-[9px] py-[6px]', {
              'border-[#FAC337]': theme === 'second',
              'border-[#7FF361]': theme === 'third'
            })}
          >
            {word.toBeDestroyed}
          </span>
        </div>
      </div>
    </animated.div>
  );
}
