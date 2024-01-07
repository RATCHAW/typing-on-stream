// SocketGameContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketGame } from '@/socket';
import { DestroyedWord, WordAndDifficulties } from '@/types/word';
import { useParams } from 'react-router-dom';

interface GameProviderState {
  gameStatus: string;
  errorMsg: string;
  loading: boolean;
  loosingWord: string;
  currentScore: number;
  words: Array<WordAndDifficulties | DestroyedWord>;
  wordDistroyedLogs: Array<{ user: string; word: string; id: string }>;
}

const initialState: GameProviderState = {
  gameStatus: 'stopped',
  errorMsg: '',
  loading: true,
  loosingWord: '',
  currentScore: 0,
  words: [],
  wordDistroyedLogs: []
};

const SocketGameContext = createContext<GameProviderState>(initialState);

export const SocketGameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameStatus, setGameStatus] = useState<string>('stopped');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [loosingWord, setLoosingWord] = useState('');
  const [currentScore, setCurrentScore] = useState(0);

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

      setCurrentScore(newScore);
    });

    return () => {
      gameSocket.disconnect();
    };
  }, []);

  return (
    <SocketGameContext.Provider
      value={{
        gameStatus,
        errorMsg,
        loading,
        loosingWord,
        currentScore,
        words,
        wordDistroyedLogs
      }}
    >
      {children}
    </SocketGameContext.Provider>
  );
};

export const useSocketGame = () => {
  const context = useContext(SocketGameContext);
  if (context === undefined) {
    throw new Error('useSocketGame must be used within a SocketGameProvider');
  }
  return context;
};
