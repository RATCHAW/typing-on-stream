import HiddenInput from '../atoms/hiddenInput';
import Button from '../atoms/Button';
import Chain from '@/assets/icons/chain.svg?react';
import Copy from '@/assets/icons/copy.svg?react';
import Refresh from '@/assets/icons/refresh.svg?react';
import { cn } from '@/lib/utils';

function GameSettionLink({ onCopyButtonClick }: { onCopyButtonClick: () => void }) {
  return (
    <div className="flex space-x-[6px]">
      <HiddenInput icon={<Chain />} />
      <Button onClick={() => onCopyButtonClick} icon={<Copy className="w-5 h-5" />}>
        copy url
      </Button>
      <Button icon={<Refresh className={cn('w-5 h-5 transition-all')} />}>change</Button>
    </div>
  );
}

export default GameSettionLink;
