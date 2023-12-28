import { socketGame } from '@/socket';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WordAndDifficulties } from 'types/word';

type GameStatus = 'running' | 'stopped' | 'gameOver';

export function useSocketGame() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('stopped');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loosingWord, setLoosingWord] = useState('');
  const [score, setScore] = useState(0);

  const [words, setWords] = useState<WordAndDifficulties[]>([]);

  const { sessionId } = useParams();
  const gameSocket = socketGame(sessionId!);

  useEffect(() => {
    gameSocket.connect();
    gameSocket.off('session').on('session', (data: { created: boolean; message: string }) => {
      const { created, message } = data;
      if (created) {
        setLoading(false);
        console.log(message);
      } else {
        setErrorMsg(message);
      }
    });

    gameSocket.off('gameStatus').on('gameStatus', (data: { status: string; word: string }) => {
      const { status, word } = data;
      if (status == 'Game started') {
        setGameStatus('running');
        console.log('Game started');
      } else if (status == 'Game stopped') {
        setGameStatus('stopped');
      } else if (status == 'Game over') {
        setGameStatus('gameOver');
        setLoosingWord(word);
      }
    });

    gameSocket.off('newWord').on('newWord', (data: { wordAndDifficulties: WordAndDifficulties }) => {
      const { wordAndDifficulties } = data;
      setWords((prevWords) => [...prevWords, wordAndDifficulties]);
    });

    gameSocket.off('destroyedWord').on('destroyedWord', (data: { destroyedWord: string; newScore: number }) => {
      const { destroyedWord, newScore } = data;

      setScore(newScore);
      setWords((words) => words.filter((word) => word.word !== destroyedWord));
    });

    return () => {
      gameSocket.disconnect();
    };
  }, []);

  return {
    gameStatus,
    errorMsg,
    loading,
    loosingWord,
    score,
    words
  };
}
