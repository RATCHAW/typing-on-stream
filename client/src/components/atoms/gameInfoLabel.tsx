import { cn } from '@/lib/utils';
interface logLabelProps {
  secondary?: boolean;
  text: string;
  icon: JSX.Element;
}

function logLabel({ secondary, text, icon }: logLabelProps) {
  return (
    <div
      className={cn(
        'flex items-center w-fit px-5 py-3 space-x-2 border-[1px] rounded-[300px] border-[#242424] text-white text-[10px]',
        {
          'text-[#6D6D6D]': secondary
        }
      )}
    >
      {icon}
      <p>{text}</p>
    </div>
  );
}

export default logLabel;
