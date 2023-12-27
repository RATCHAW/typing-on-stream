// client\src\hooks\useSocketVerify.ts
import { useEffect, useState } from 'react';
import { socketVerify } from '@/socket';

export function useSocketVerify() {
  const [channelName, setChannelNameName] = useState('');
  const [code, setCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(true);

  useEffect(() => {
    socketVerify.connect();

    socketVerify.on('code', (data: { code: string }) => {
      const { code } = data;
      setCode(code.toString());
      setLoading(false);
      socketVerify.off('broadcaster');
    });

    socketVerify.on('verified', (data: { sessionId: string }) => {
      const { sessionId } = data;
      setSessionId(sessionId);
      setCode('');

      socketVerify.on('sessionChange', (data: { sessionId: string }) => {
        const { sessionId } = data;
        setSessionId(sessionId);
        setLoading(false);
      });
    });

    socketVerify.on('error', (data: { error: string }) => {
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
    if (socketVerify.connected) {
      setLoading(true);
      setShowInput(false);
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
    setChannelNameName,
    code,
    sessionId,
    errorMsg,
    loading,
    showInput,
    sendBroadcasterName,
    changeSessionId
  };
}
