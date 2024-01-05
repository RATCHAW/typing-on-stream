import Logo from '@/components/atoms/logo';
import VerificationStep from '@/components/atoms/verificationStep';
import catTyping from '/emotes/catTyping.gif';
import peepoBlush from '/emotes/peepoBlush.gif';
import peepoCongrats from '/emotes/peepoCongrats.gif';
import VerificationCode from '@/components/atoms/verificationCode';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/input';
import Twitch from '@/assets/icons/twitch.svg?react';
import Chain from '@/assets/icons/chain.svg?react';
import HiddenInput from '@/components/atoms/hiddenInput';
import Copy from '@/assets/icons/copy.svg?react';
import Refresh from '@/assets/icons/refresh.svg?react';
import useSocketVerify from '@/hooks/useSocketVerify';
import Loading from '@/assets/icons/loading.svg?react';
import ratTyping from '/emotes/ratTyping.gif';
import peepoFigma from '/emotes/peepoFigma.png';
import { cn } from '@/lib/utils';

function Verify() {
  const { channelName, setChannelName, verificationCode, sessionId, sendBroadcasterName, loading, error } =
    useSocketVerify();

  const handleCopy = (contentType: string) => {
    if (contentType === 'url') {
      const copyUrl = `${window.location.origin}/game/${sessionId}`;
      navigator.clipboard.writeText(copyUrl);
    } else if (contentType === 'code') {
      navigator.clipboard.writeText(verificationCode);
    }
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendBroadcasterName();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-background h-screen uppercase text-white">
      <div className="mb-6">
        <Logo />
      </div>
      <div className="mb-[18px]">
        {loading ? (
          <div>
            <Loading className="animate-spin w-6 h-6" />
          </div>
        ) : !verificationCode ? (
          <div>
            <Input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="enter your twitch channel name"
              icon={<Twitch className="w-5 h-5" />}
              onSearchClick={sendBroadcasterName}
              onKeyDown={(e) => handleOnKeyDown(e)}
              error={error}
            />
          </div>
        ) : sessionId ? (
          <div className="flex space-x-[6px]">
            <HiddenInput icon={<Chain />} />
            <Button onClick={() => handleCopy('url')} icon={<Copy className="w-5 h-5" />}>
              copy url
            </Button>
            <Button icon={<Refresh className={cn('w-5 h-5 transition-all')} />}>change</Button>
          </div>
        ) : (
          <div className="flex  items-center space-x-[6px] max-h-[52px]">
            <VerificationCode code={verificationCode} />
            <Button onClick={() => handleCopy('code')} icon={<Copy className="w-5 h-5" />}>
              copy
            </Button>
          </div>
        )}
      </div>
      <div className="mb-12">
        <p className="text-[8px] text-center leading-4 text-[#767676]">
          for a better experience see <span className="text-[#FAC337] underline cursor-pointer">the guide</span> <br />
          on how to setup the game in obs
        </p>
      </div>
      <div className="flex space-x-8 mb-12">
        <VerificationStep emoteSrc={catTyping} active>
          enter your channel‘s <br /> name on twitch to get <br /> a verification code
        </VerificationStep>
        <VerificationStep emoteSrc={peepoBlush} lowOpacity>
          type the verification code in chat to <br /> activate the session
        </VerificationStep>
        <VerificationStep emoteSrc={peepoCongrats} lowOpacity>
          congrats you can play <br /> our game with your <br /> chat now
        </VerificationStep>
      </div>
      <div>
        <p className="flex items-center  text-[#767676] text-[8px]">
          made with love by <img className="w-[29px] h-[29px] mx-2" src={ratTyping} alt="" />
          <span className="text-[#FAC337]">ratchaw&nbsp; </span>&
          <img className="w-[29px] h-[29px] mx-2" src={peepoFigma} alt="" />
          <span className="text-[#FAC337]">ekb9816</span>
        </p>
      </div>
    </div>
  );
}

export default Verify;
