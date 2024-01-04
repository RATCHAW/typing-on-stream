import { cn } from '@/lib/utils';
interface logLabelProps {
  secondary?: boolean;
  children: React.ReactNode;
  icon: JSX.Element;
  yellow?: boolean;
}

function GameInfoLabel({ secondary, children, icon, yellow }: logLabelProps) {
  return (
    <div
      className={cn(
        'flex items-center w-fit px-5 py-3 space-x-2 border-[1px] rounded-[300px] border-[#242424] text-white text-[10px] uppercase',
        {
          'text-[#6D6D6D]': secondary,
          'text-[#FAC337]': yellow
        }
      )}
    >
      {icon}
      <p>{children}</p>
    </div>
  );
}

export default GameInfoLabel;
