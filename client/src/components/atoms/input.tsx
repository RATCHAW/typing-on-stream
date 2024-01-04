import { cn } from '@/lib/utils';

interface InputProps {
  icon: JSX.Element;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({ icon, placeholder, value, onChange }: InputProps) {
  const isValueLengthGTE3 = (value?.length ?? 0) >= 3;
  return (
    <div className="border outline -outline-offset-2 outline-border  rounded-lg w-[438px]  transition-all duration-100 h-[52px]">
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
          />
        </div>
        {isValueLengthGTE3 && (
          <span className="rounded-lg text-[#C3C3C3] bg-border text-[8px] uppercase py-[4px] px-[14px] tracking-[0.4px]">
            search
          </span>
        )}
      </div>
    </div>
  );
}

export default Input;
