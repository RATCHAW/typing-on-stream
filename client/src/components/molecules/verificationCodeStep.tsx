import VerificationCode from '../atoms/verificationCode';
import Button from '../atoms/Button';
import Copy from '@/assets/icons/copy.svg?react';
import Done from '@/assets/icons/done.svg?react';
import { useEffect, useState } from 'react';

interface VerificationCodeStepProps {
  verificationCode: string;
  onCopyButtonClick: () => void;
}

function VerificationCodeStep({ verificationCode, onCopyButtonClick }: VerificationCodeStepProps) {
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
    <div className="flex items-center space-x-[6px] max-h-[52px]">
      <VerificationCode code={verificationCode} />
      <Button
        onClick={() => onCopyclicked()}
        icon={isCopied ? <Done className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      >
        copy
      </Button>
    </div>
  );
}

export default VerificationCodeStep;
