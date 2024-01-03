import FourDigitCode from '@/components/verify/fourDigitCode';
import ChannelNameInput from '@/components/verify/channelNameInput';
import Instructions from '@/components/verify/instructions';
// import LoadingImg from '@/components/atoms/loadingImg';
import { useSocketVerify } from '@/hooks/useSocketVerify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Verify() {
  const {
    channelName,
    setChannelNameName,
    code,
    sessionId,
    errorMsg,
    loading,
    showInput,
    sendBroadcasterName,
    changeSessionId
  } = useSocketVerify();

  return (
    <div className="flex justify-center items-center bg-black h-screen">
      {sessionId && <Instructions sessionId={sessionId} changeSessionId={changeSessionId} />}
      {showInput && (
        <ChannelNameInput
          inputValue={channelName}
          setInputValue={setChannelNameName}
          onSubmit={sendBroadcasterName}
          errorMsg={errorMsg}
        />
      )}
      {/* {loading && <LoadingImg />} */}
      {code && <FourDigitCode code={code} />}
      <ToastContainer position="bottom-left" theme="colored" />
    </div>
  );
}

export default Verify;
