import { cn } from '@/lib/utils';

interface InputProps {
  icon: JSX.Element;
  placeholder?: string;
  error?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearchClick: () => void;
}

function Input({ icon, placeholder, error, value, onChange, onKeyDown, onSearchClick }: InputProps) {
  const isValueLengthGTE3 = (value?.length ?? 0) >= 3;
  return (
    <div
      className={cn(
        'border outline -outline-offset-2 outline-border rounded-lg w-[438px]  transition-all duration-100 h-[52px]',
        {
          'outline-[#F41919]': error
        }
      )}
    >
      <div className="flex justify-between items-center mx-6 my-4">
        <div
          className={cn('flex items-center space-x-2 text-[#D1D1D1]', {
            'text-white': isValueLengthGTE3
          })}
        >
          {icon}

          <input
            className={cn('bg-transparent outline-none text-[10px] uppercase placeholder-current w-[300px]', {
              'w-[250px]': isValueLengthGTE3
            })}
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
        </div>
        {isValueLengthGTE3 && (
          <span
            onClick={onSearchClick}
            className="rounded-lg text-[#C3C3C3] cursor-pointer bg-border text-[8px] uppercase py-[4px] px-[14px] tracking-[0.4px]"
          >
            search
          </span>
        )}
      </div>
      {error && <p className="absolute ml-4 mt-1 text-[8px] text-[#F41919]">channel not found</p>}
    </div>
  );
}

export default Input;
