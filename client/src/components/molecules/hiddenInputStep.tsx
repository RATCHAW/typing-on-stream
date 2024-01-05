import HiddenInput from '../atoms/hiddenInput';
import Button from '../atoms/Button';
import Chain from '@/assets/icons/chain.svg?react';
import Copy from '@/assets/icons/copy.svg?react';
import Refresh from '@/assets/icons/refresh.svg?react';
import Done from '@/assets/icons/done.svg?react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface GameSettionLinkProps {
  onCopyButtonClick: () => void;
  onChangeButtonClicked: () => void;
}

function GameSettionLink({ onCopyButtonClick, onChangeButtonClicked }: GameSettionLinkProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  }, [isCopied]);

  const onCopyclicked = () => {
    onCopyButtonClick();
    setIsCopied(true);
  };

  return (
    <div className="flex space-x-[6px]">
      <HiddenInput icon={<Chain />} />
      <Button
        onClick={() => onCopyclicked()}
        icon={isCopied ? <Done className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      >
        copy url
      </Button>
      <Button onClick={() => onChangeButtonClicked()} icon={<Refresh className={cn('w-5 h-5 transition-all')} />}>
        change
      </Button>
    </div>
  );
}

export default GameSettionLink;
