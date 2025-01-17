import { cn } from '@/lib/utils';

interface VerificationStepProps {
  emoteSrc: string;
  children: React.ReactNode;

  active?: boolean;
  lowOpacity?: boolean;
}

function VerificationStep({ emoteSrc, children, active, lowOpacity }: VerificationStepProps) {
  return (
    <div className="flex flex-col items-center space-y-12">
      <div
        className={cn('text-white p-[2px] rounded-2xl border-solid bg-border text-[8px] uppercase w-80', {
          colorful: active,
          'opacity-50': lowOpacity
        })}
      >
        <div className="flex flex-col flex-grow justify-center rounded-2xl items-center space-y-4 bg-background px-8 py-12">
          <img src={emoteSrc} className="w-[58px] h-[58px]" alt="catTypingEmote" />
          <p className="text-[10px] text-center">{children}</p>
        </div>
      </div>
    </div>
  );
}

export default VerificationStep;
