// client\src\hooks\useSocketVerify.ts
import { useEffect, useState } from 'react';
import { socketGame } from '@/socket';

type GameStatus = 'running' | 'stopped' | 'gameOver';

export function useSocketVerify() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('stopped');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [loosingWord, setLoosingWord] = useState('');

  useEffect(() => {
    socketGame.connect();

    socketGame.on('success', (data: { created: boolean; message: string }) => {
      const { created, message } = data;
      if (created) {
        setLoading(false);
      } else {
        setErrorMsg(message);
      }
    });

    socketGame.on('gameStatus', (data: { status: string; word: string }) => {
      const { status, word } = data;
      if (status == 'started') {
        setGameStatus('running');
      } else if (status == 'stopped') {
        setGameStatus('stopped');
      } else if (status == 'gameOver') {
        setGameStatus('gameOver');
        setLoosingWord(word);
      }
    });

    //todo
    socketGame.on('newWord', (data: { word: string; difficulties: any }) => {
      //todo
    });

    socketGame.on('destroyedWord', (data: { word: string; score: number }) => {
      //todo
    });

    return () => {
      socketGame.disconnect();
    };
  }, []);

  return {
    //todo
  };
}
