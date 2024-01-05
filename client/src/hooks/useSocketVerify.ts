// client\src\hooks\useSocketVerify.ts
import { useEffect, useState } from 'react';
import { socketVerify } from '@/socket';

export default function useSocketVerify() {
  const [channelName, setChannelName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    socketVerify.connect();

    socketVerify.on('code', (data: { code: string }) => {
      const { code } = data;
      setVerificationCode(code.toString());
      setLoading(false);
      setActiveStep(2);
      socketVerify.off('broadcaster');
    });

    socketVerify.on('verified', (data: { sessionId: string }) => {
      const { sessionId } = data;
      setSessionId(sessionId);
      setActiveStep(3);

      socketVerify.on('sessionChange', (data: { sessionId: string }) => {
        const { sessionId } = data;
        setSessionId(sessionId);
        setLoading(false);
      });
    });

    socketVerify.on('error', () => {
      setError(true);
      setLoading(false);
    });

    return () => {
      socketVerify.disconnect();
    };
  }, []);
  function sendBroadcasterName() {
    if (channelName.length < 3 || channelName.length > 25) {
      setError(true);
      return;
    }
    if (socketVerify.connected) {
      setLoading(true);
      socketVerify.emit('broadcaster', { broadcaster: channelName });
    } else {
      socketVerify.connect();
    }
  }
  function changeSessionId() {
    if (socketVerify.connected) {
      setSessionId('');
      setLoading(true);
      socketVerify.emit('sessionChange', { change: true });
    } else {
      socketVerify.connect();
    }
  }

  return {
    channelName,
    setChannelName,
    verificationCode,
    sessionId,
    error,
    loading,
    sendBroadcasterName,
    changeSessionId,
    activeStep
  };
}
