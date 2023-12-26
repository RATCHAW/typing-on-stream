import FourDigitCode from '@/components/atoms/form/fourDigitCode';
import ChannelNameInput from '@/components/atoms/form/channelNameInput';
import Instructions from '@/components/atoms/form/instructions';
import LoadingImg from '@/components/atoms/form/loadingImg';
import { socketVerify } from '@/socket';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function Verify() {
  const [channelName, setChannelNameName] = useState('');
  const [code, setCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(true);

  useEffect(() => {
    socketVerify.connect();

    socketVerify.on('code', (data) => {
      const { code } = data;
      console.log(code);
      setCode(code.toString());
      setLoading(false);
      socketVerify.off('broadcaster');
    });

    socketVerify.on('verified', (data) => {
      const { sessionId } = data;
      console.log(sessionId);
      setSessionId(sessionId);
      setCode('');
      socketVerify.on('sessionChange', (data) => {
        const { sessionId } = data;
        console.log(sessionId);

        setSessionId(sessionId);
        setLoading(false);
      });
    });

    socketVerify.on('error', (data) => {
      const { error } = data;
      setErrorMsg(error);
      setShowInput(true);
      setLoading(false);
    });

    return () => {
      socketVerify.disconnect();
    };
  }, []);

  function sendBroadcasterName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (channelName.length < 3 || channelName.length > 25) {
      setErrorMsg('Broadcaster name must be between 3 and 25 characters');
      return;
    }
    setLoading(true);
    setShowInput(false);
    socketVerify.emit('broadcaster', { broadcaster: channelName });
  }

  function changeSessionId() {
    setSessionId('');
    setLoading(true);
    socketVerify.emit('sessionChange', { change: true });
  }

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
      {loading && <LoadingImg />}
      {code && <FourDigitCode code={code} />}
      <ToastContainer position="bottom-left" theme="colored" />
    </div>
  );
}

export default Verify;
