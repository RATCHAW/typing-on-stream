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

    gameSocket.off('newWord').on('newWord', (wordAndDifficulties: WordAndDifficulties) => {
      console.log(wordAndDifficulties);
      setWords((prevWords) => [...prevWords, wordAndDifficulties]);
    });

    gameSocket
      .off('destroyedWord')
      .on('destroyedWord', (data: { wordAndDifficulties: WordAndDifficulties; newScore: number }) => {
        const { wordAndDifficulties, newScore } = data;
        console.log(wordAndDifficulties);
        if (wordAndDifficulties.toBeDestroyed === 0) {
          setWords((words) => words.filter((word) => word.word !== wordAndDifficulties.word));
        } else {
          // update the word with the new toBeDestoryed value
          setWords((words) =>
            words.map((word) => (word.word === wordAndDifficulties.word ? wordAndDifficulties : word))
          );
        }
        setScore(newScore);
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
