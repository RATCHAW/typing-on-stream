import { socketGame } from '@/socket';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WordAndDifficulties, DestroyedWord } from 'types/word';

export function useSocketGame() {
  const [gameStatus, setGameStatus] = useState<string>('stopped');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [loosingWord, setLoosingWord] = useState('');
  const [score, setScore] = useState(0);

  const [words, setWords] = useState<Array<WordAndDifficulties | DestroyedWord>>([]);
  const [wordDistroyedLogs, setWordDistroyedLogs] = useState<Array<{ user: string; word: string; id: string }>>([
    { user: 'test', word: 'test', id: 'test' },
    { user: 'sdfsdf', word: 'sdfdsf', id: 'dfsdfd' }
    // Add more objects as needed
  ]);

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
        setWordDistroyedLogs([]);
        setGameStatus(status);
        word && setLoosingWord(word);
      }
    });

    gameSocket.off('newWord').on('newWord', (wordAndDifficulties: WordAndDifficulties) => {
      setWords((prevWords) => [...prevWords, wordAndDifficulties]);
    });

    gameSocket.off('destroyedWord').on('destroyedWord', (data: DestroyedWord) => {
      const { wordAndDifficulties, newScore } = data;

      // if word is destroyed remove it from the list
      if (wordAndDifficulties.toBeDestroyed === 0) {
        setWords((words) => words.filter((word) => (word as WordAndDifficulties).word !== wordAndDifficulties.word));
      } else {
        setWords((words) =>
          words.map((word) =>
            (word as WordAndDifficulties).word === wordAndDifficulties.word ? wordAndDifficulties : word
          )
        );
      }
      setWordDistroyedLogs((prevLogs) => [
        ...prevLogs,
        { user: data.user, word: data.wordAndDifficulties.word, id: data.wordAndDifficulties.id }
      ]);

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
    wordDistroyedLogs
  };
}
