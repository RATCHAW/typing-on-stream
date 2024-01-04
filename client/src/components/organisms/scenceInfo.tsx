import Sword from '@/assets/icons/sword.svg?react';
import LogLabel from '@/components/atoms/gameInfoLabel';
import Fire from '@/assets/icons/fire.svg?react';
import Flag from '@/assets/icons/flag.svg?react';

function ScenceInfo() {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <LogLabel icon={<Sword />}>HAMID GOT THE WORD "WORD"</LogLabel>
        <LogLabel yellow icon={<Fire />}>
          top score : 3000
        </LogLabel>
      </div>
      <div className="flex justify-between">
        <LogLabel icon={<Sword />} secondary>
          HAMID GOT THE WORD "WORD"
        </LogLabel>
        <LogLabel icon={<Flag />}>current score : 3000</LogLabel>
      </div>
    </div>
  );
}

export default ScenceInfo;
