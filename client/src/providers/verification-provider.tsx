// SocketGameContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketGame, socketVerify } from '@/socket';
import { DestroyedWord, WordAndDifficulties } from '@/types/word';
import { useParams } from 'react-router-dom';

interface verifiyProviderState {
  channelName: string;
  verificationCode: string;
  loading: boolean;
  error: boolean;
  activeStep: number;
  sessionId: string;
  setChannelName: React.Dispatch<React.SetStateAction<string>>;
  sendBroadcasterName: () => void;
  changeSessionId: () => void;
}

const initialState: verifiyProviderState = {
  channelName: '',
  verificationCode: '',
  loading: false,
  error: false,
  activeStep: 1,
  sessionId: '',
  setChannelName: () => {},
  sendBroadcasterName: () => {},
  changeSessionId: () => {}
};

const SocketVerifyContext = createContext<verifiyProviderState>(initialState);

export const SocketVerifyProvider = ({ children }: { children: React.ReactNode }) => {
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

  return (
    <SocketVerifyContext.Provider
      value={{
        channelName,
        setChannelName,
        verificationCode,
        loading,
        error,
        activeStep,
        sessionId,
        sendBroadcasterName,
        changeSessionId
      }}
    >
      {children}
    </SocketVerifyContext.Provider>
  );
};

export const useSocketVerify = () => {
  const context = useContext(SocketVerifyContext);
  if (context === undefined) {
    throw new Error('useSocketVerify must be used within a SocketVerifyProvider');
  }
  return context;
};
