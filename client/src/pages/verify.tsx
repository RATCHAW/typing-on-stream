import Logo from '@/components/atoms/logo';
import VerificationStep from '@/components/atoms/verificationStep';
import catTyping from '/emotes/catTyping.gif';
import peepoBlush from '/emotes/peepoBlush.gif';
import peepoCongrats from '/emotes/peepoCongrats.gif';
import VerificationCode from '@/components/atoms/verificationCode';
import CopyButton from '@/components/atoms/copyButton';
import Input from '@/components/atoms/input';
import Twitch from '@/assets/icons/twitch.svg?react';
import Chain from '@/assets/icons/chain.svg?react';
import { useState } from 'react';
import HiddenInput from '@/components/atoms/hiddenInput';

function Verify() {
  const [channelName, setChannelName] = useState('');

  return (
    <div className="flex flex-col justify-center items-center bg-background h-screen uppercase text-white">
      <div className="mb-6">
        <Logo />
      </div>
      <div className="mb-[18px]">
        <HiddenInput icon={<Chain />} />
        <div className="flex  items-center space-x-[6px] max-h-[52px]">
          <VerificationCode code={'1234'} />
          <CopyButton />
        </div>

        <Input
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="enter your twitch channel name"
          icon={<Twitch className="w-5 h-5" />}
        />
      </div>
      <div className="mb-12">
        <p className="text-[8px] text-center leading-4">
          for a better experience see <span className="text-[#FAC337] underline">the guide</span> <br /> on how to setup
          the game in obs
        </p>
      </div>
      <div className="flex space-x-8">
        <VerificationStep emoteSrc={catTyping} stepNumber={1} active>
          enter your channel‘s name on twitch to get a verification code
        </VerificationStep>
        <VerificationStep emoteSrc={peepoBlush} stepNumber={2} lowOpacity>
          type the verification code in chat to activate the session
        </VerificationStep>
        <VerificationStep emoteSrc={peepoCongrats} stepNumber={3} lowOpacity>
          congrats you can play our game with your chat now
        </VerificationStep>
      </div>
    </div>
  );
}

export default Verify;
