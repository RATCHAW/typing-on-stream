import Logo from '@/components/atoms/logo';
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
import { cn } from '@/lib/utils';
import FooterTag from '@/components/atoms/footerTags';
import StepsCards from '@/components/molecules/stepsCards';

function Verify() {
  const { channelName, setChannelName, verificationCode, sessionId, sendBroadcasterName, loading, error, activeStep } =
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
            <Loading className="animate-spin w-[52px] h-[52px]" />
          </div>
        ) : (
          (activeStep === 1 && (
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
          )) ||
          (activeStep === 2 && (
            <div className="flex items-center space-x-[6px] max-h-[52px]">
              <VerificationCode code={verificationCode} />
              <Button onClick={() => handleCopy('code')} icon={<Copy className="w-5 h-5" />}>
                copy
              </Button>
            </div>
          )) ||
          (activeStep === 3 && (
            <div className="flex space-x-[6px]">
              <HiddenInput icon={<Chain />} />
              <Button onClick={() => handleCopy('url')} icon={<Copy className="w-5 h-5" />}>
                copy url
              </Button>
              <Button icon={<Refresh className={cn('w-5 h-5 transition-all')} />}>change</Button>
            </div>
          ))
        )}
      </div>
      <div className="mb-12">
        <p className="text-[8px] text-center leading-4 text-[#767676]">
          for a better experience see <span className="text-[#FAC337] underline cursor-pointer">the guide</span> <br />
          on how to setup the game in obs
        </p>
      </div>
      <div>
        <StepsCards activeStep={activeStep} />
      </div>
      <div>
        <FooterTag />
      </div>
    </div>
  );
}

export default Verify;
