import { cn } from '@/lib/utils';

interface WordProps {
  theme?: string;
}

function Word({ theme }: WordProps) {
  return (
    <div
      className={cn('text-white space-x-[4.5px] text-[16px]', {
        'text-[#FAC337]': theme === 'second',
        'text-[#7FF361]': theme === 'third'
      })}
    >
      <span>word</span>
      <span
        className={cn('border-3 border-[1.5px] rounded-md px-[9px] py-[6px]', {
          'border-[#FAC337]': theme === 'second',
          'border-[#7FF361]': theme === 'third'
        })}
      >
        1
      </span>
    </div>
  );
}

export default Word;
