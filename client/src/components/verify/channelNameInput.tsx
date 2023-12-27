import { cn } from '@/lib/utils';
import { ChangeEvent, useState } from 'react';

interface InputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errorMsg?: string;
}

const ImgSrc = 'images/rat-write2.gif';

function Input({ inputValue, setInputValue, onSubmit, errorMsg }: InputProps) {
  const [showImg, setShowImg] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setShowImg(true);
  };

  const handleInputBlur = () => {
    setShowImg(false);
  };

  return (
    <div className="flex flex-col items-center font-mono ">
      <p className="text-white text-2xl w-[500px] text-center mb-32">
        Welcome! Begin the verification by entering your Twitch channel name, Than Press 'Enter' to move on to the next
        step.
      </p>
      <div className="flex flex-col items-center transition-all duration-500 ease-in-out">
        <img
          src={ImgSrc}
          className={cn('absolute rounded-lg transition-all duration-500 ease-in-out z-10', {
            '-translate-y-32': showImg
          })}
        />
        <form className="z-20 flex flex-col items-center" onSubmit={onSubmit}>
          <input
            className={cn(
              'w-[600px] h-64 rounded-2xl text-center text  transition-all duration-500 ease-in-out  outline-none border-4 border-purple-700 text-6xl',
              { 'border-red-600': errorMsg, 'text-5xl': inputValue.length > 12 }
            )}
            spellCheck="false"
            value={inputValue || ''}
            placeholder="YourChannelName"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
          {errorMsg && <p className="text-red-600 mt-4"> {errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}

export default Input;
