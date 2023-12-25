import FourDigitCode from '@/components/atoms/form/fourDigitCode';
import Input from '@/components/atoms/form/input';
import Instructions from '@/components/atoms/form/instructions';
import LoadingImg from '@/components/atoms/form/loadingImg';
import { socketVerify } from '@/socket';
import { useEffect, useState } from 'react';

function Verify() {
  const [brodacasterName, setBroadcasterName] = useState('');
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
    });
    socketVerify.on('verified', (data) => {
      const { sessionId } = data;
      console.log(sessionId);
      setSessionId(sessionId);
      setCode('');
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
    setLoading(true);
    setShowInput(false);
    socketVerify.emit('broadcaster', { broadcaster: brodacasterName });
  }

  return (
    <div className="flex justify-center items-center bg-black h-screen">
      <div>
        {sessionId && <Instructions />}
        {showInput && (
          <Input
            inputValue={brodacasterName}
            setInputValue={setBroadcasterName}
            onSubmit={sendBroadcasterName}
            errorMsg={errorMsg}
          />
        )}
        {loading && <LoadingImg />}
      </div>
      {code && <FourDigitCode code={code} />}
    </div>
  );
}

export default Verify;
