import React from 'react';
import Input from '../atoms/input';
import Twitch from '@/assets/icons/twitch.svg?react';

interface EnterChannelNameStepProps {
  error: boolean;
  channelName: string;
  setChannelName: (value: string) => void;
  onSearchButtonClick: () => void;
  OnKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

function EnterChannelNameStep({
  error,
  channelName,
  setChannelName,
  onSearchButtonClick,
  OnKeyDown
}: EnterChannelNameStepProps) {
  return (
    <div>
      <Input
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        placeholder="enter your twitch channel name"
        icon={<Twitch className="w-5 h-5" />}
        onSearchClick={onSearchButtonClick}
        onKeyDown={(e) => OnKeyDown(e)}
        error={error}
      />
    </div>
  );
}

export default EnterChannelNameStep;
