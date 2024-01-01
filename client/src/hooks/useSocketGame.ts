import { socketGame } from '@/socket';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WordAndDifficulties } from 'types/word';

export function useSocketGame() {
  const [gameStatus, setGameStatus] = useState<string>('stopped');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [loosingWord, setLoosingWord] = useState('');
  const [score, setScore] = useState(0);

  const [words, setWords] = useState<WordAndDifficulties[]>([]);
  const [wordDistroyeLogs, setWordDistroyeLogs] = useState<any[]>([]);
  const { sessionId } = useParams();
  const gameSocket = socketGame(sessionId!);

  useEffect(() => {
    gameSocket.connect();
    gameSocket.off('session').on('session', (data: { created: boolean; message: string }) => {
      const { created, message } = data;
      if (created) {
        setLoading(false);
      } else {
        setErrorMsg(message);
      }
    });

    gameSocket.off('gameStatus').on('gameStatus', (data: { status: string; word?: string }) => {
      const { status, word } = data;
      if (status === 'over' || status === 'stopped' || status === 'started') {
        setWords([]);
        setGameStatus(status);
        word && setLoosingWord(word);
      }
    });

    gameSocket.off('newWord').on('newWord', (wordAndDifficulties: WordAndDifficulties) => {
      setWords((prevWords) => [...prevWords, wordAndDifficulties]);
    });

    gameSocket
      .off('destroyedWord')
      .on('destroyedWord', (data: { wordAndDifficulties: WordAndDifficulties; newScore: number; user: string }) => {
        const { wordAndDifficulties, newScore } = data;

        // if word is destroyed remove it from the list
        if (wordAndDifficulties.toBeDestroyed === 0) {
          setWords((words) => words.filter((word) => word.word !== wordAndDifficulties.word));
        } else {
          setWords((words) =>
            words.map((word) => (word.word === wordAndDifficulties.word ? wordAndDifficulties : word))
          );
        }
        setWordDistroyeLogs((prevLogs) => [...prevLogs, { word: wordAndDifficulties.word, user: data.user }]);
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
    words,
    wordDistroyeLogs
  };
}
