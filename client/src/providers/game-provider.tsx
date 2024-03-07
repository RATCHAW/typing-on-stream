// SocketGameContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketGame } from '@/socket';
import { DestroyedWord, WordAndDifficulties, WordTheme } from '@/types/word';

interface GameProviderState {
  gameStatus: string;
  errorMsg: string;
  loading: boolean;
  loosingWord: string;
  currentScore: number;
  words: Array<WordAndDifficulties | DestroyedWord>;
  wordDistroyedLogs: Array<{ user: string; word: string; id: string }>;
  chatLeaderboard: Array<{ user: string; score: number }>;
  broadcastersLeaderboard: Array<{ value: string; score: number }>;
  highestScore: number;
}

const initialState: GameProviderState = {
  gameStatus: 'stopped',
  errorMsg: '',
  loading: true,
  loosingWord: '',
  currentScore: 0,
  words: [],
  wordDistroyedLogs: [],
  chatLeaderboard: [],
  broadcastersLeaderboard: [],
  highestScore: 0
};

const SocketGameContext = createContext<GameProviderState>(initialState);

export const SocketGameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameStatus, setGameStatus] = useState<string>('stopped');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [loosingWord, setLoosingWord] = useState('');
  const [currentScore, setCurrentScore] = useState(0);
  const [words, setWords] = useState<Array<WordAndDifficulties | DestroyedWord>>([]);
  const [wordDistroyedLogs, setWordDistroyedLogs] = useState<Array<{ user: any; word: string; id: string }>>([]);
  const [chatLeaderboard, setChatLeaderboard] = useState<Array<{ user: string; score: number }>>([]);
  const [broadcastersLeaderboard, setBroadcastersLeaderboard] = useState<Array<{ value: string; score: number }>>([]);
  const [highestScore, setHighestScore] = useState(0);

  const gameSocket = socketGame;

  useEffect(() => {
    gameSocket.connect();

    gameSocket
      .off('leaderboard')
      .on('leaderboard', (leaderboard: Array<{ value: string; score: number }>, highestScore: number) => {
        setBroadcastersLeaderboard(leaderboard);
        if (highestScore) {
          setHighestScore(highestScore);
        }
      });

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
        setCurrentScore(0);
        word && setLoosingWord(word);
      }
    });

    gameSocket.off('newWord').on('newWord', (wordAndDifficulties: WordAndDifficulties) => {
      function getRandomTheme() {
        const themes = ['first', 'second', 'third'];
        const randomIndex = Math.floor(Math.random() * themes.length);
        return themes[randomIndex] as WordTheme;
      }
      console.log(wordAndDifficulties, 'newWord');
      setWords((prevWords) => [...prevWords, { ...wordAndDifficulties, theme: getRandomTheme() }]);
    });

    gameSocket.off('destroyedWord').on('destroyedWord', (data: DestroyedWord) => {
      const { wordAndDifficulties, newScore } = data;

      setChatLeaderboard((prevLeaderboard) => {
        const userIndex = prevLeaderboard.findIndex((entry) => entry.user === data.user);
        if (userIndex !== -1) {
          prevLeaderboard[userIndex].score++;
        } else {
          prevLeaderboard.push({ user: data.user, score: 1 });
        }
        return prevLeaderboard;
      });

      // if word is destroyed remove it from the list
      if (wordAndDifficulties.toBeDestroyed === 0) {
        setWords((words) => words.filter((word) => (word as WordAndDifficulties).word !== wordAndDifficulties.word));
      } else {
        setWords((words) =>
          words.map((word) =>
            (word as WordAndDifficulties).word === wordAndDifficulties.word
              ? { ...word, toBeDestroyed: wordAndDifficulties.toBeDestroyed } // Replace 'newValue' with the updated value
              : word
          )
        );
      }
      setWordDistroyedLogs((prevLogs) => {
        return [
          {
            user: data.user,
            word: wordAndDifficulties.word,
            id: wordAndDifficulties.id
          },
          ...prevLogs
        ];
      });

      setCurrentScore(newScore);
      if (newScore > highestScore) {
        setHighestScore(newScore);
      }
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
        wordDistroyedLogs,
        chatLeaderboard,
        broadcastersLeaderboard,
        highestScore
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
