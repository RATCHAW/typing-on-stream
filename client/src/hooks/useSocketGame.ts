import { socketGame } from '@/socket';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type GameStatus = 'running' | 'stopped' | 'gameOver';

export function useSocketGame() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('stopped');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loosingWord, setLoosingWord] = useState('');

  const { sessionId } = useParams();
  const gameSocket = socketGame(sessionId!);

  useEffect(() => {
    gameSocket.connect();
    console.log('gameSocket connected');
    gameSocket.on('session', (data: { created: boolean; message: string }) => {
      const { created, message } = data;
      if (created) {
        setLoading(false);
        console.log(message);
      } else {
        setErrorMsg(message);
      }
    });

    gameSocket.on('gameStatus', (data: { status: string; word: string }) => {
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
    gameSocket.on('newWord', (data: { word: string; difficulties: any }) => {
      //todo
    });

    gameSocket.on('destroyedWord', (data: { word: string; score: number }) => {
      //todo
    });

    return () => {
      gameSocket.disconnect();
    };
  }, []);

  return {
    gameStatus,
    errorMsg,
    loading,
    loosingWord
  };
}
