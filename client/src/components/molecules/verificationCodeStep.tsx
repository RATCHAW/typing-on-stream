import VerificationCode from '../atoms/verificationCode';
import Button from '../atoms/Button';
import Copy from '@/assets/icons/copy.svg?react';

interface VerificationCodeStepProps {
  verificationCode: string;
  onCopyButtonClick: () => void;
}

function VerificationCodeStep({ verificationCode, onCopyButtonClick }: VerificationCodeStepProps) {
  return (
    <div className="flex items-center space-x-[6px] max-h-[52px]">
      <VerificationCode code={verificationCode} />
      <Button onClick={onCopyButtonClick} icon={<Copy className="w-5 h-5" />}>
        copy
      </Button>
    </div>
  );
}

export default VerificationCodeStep;
