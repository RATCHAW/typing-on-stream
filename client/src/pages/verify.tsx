import Logo from '@/components/atoms/logo';
import { useSocketVerify } from '@/providers/verification-provider';
import Loading from '@/assets/icons/loading.svg?react';
import FooterTag from '@/components/atoms/footerTags';
import StepsCards from '@/components/molecules/stepsCards';
import GameSettionLink from '@/components/molecules/hiddenInputStep';
import VerificationCodeStep from '@/components/molecules/verificationCodeStep';
import EnterChannelNameStep from '@/components/molecules/enterChannelNameStep';
import Instructions from '@/components/organisms/instructions';

function Verify() {
  const {
    channelName,
    setChannelName,
    verificationCode,
    sessionId,
    sendBroadcasterName,
    loading,
    error,
    activeStep,
    changeSessionId
  } = useSocketVerify();

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
            <EnterChannelNameStep
              channelName={channelName}
              onSearchButtonClick={sendBroadcasterName}
              setChannelName={setChannelName}
              error={error}
              OnKeyDown={handleOnKeyDown}
            />
          )) ||
          (activeStep === 2 && (
            <VerificationCodeStep verificationCode={verificationCode} onCopyButtonClick={() => handleCopy('code')} />
          )) ||
          (activeStep === 3 && (
            <GameSettionLink
              onCopyButtonClick={() => handleCopy('url')}
              onChangeButtonClicked={() => changeSessionId()}
            />
          ))
        )}
      </div>
      <div className="mb-12">
        <Instructions />
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
