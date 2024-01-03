import { cn } from '@/lib/utils';
interface logLabelProps {
  secondary?: boolean;
  children: React.ReactNode;
  icon: JSX.Element;
}

function logLabel({ secondary, children, icon }: logLabelProps) {
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
      <p>{children}</p>
    </div>
  );
}

export default logLabel;
