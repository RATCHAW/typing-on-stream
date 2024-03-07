export type WordTheme = 'first' | 'second' | 'third';

export interface WordAndDifficulties {
  id: string;
  word: string;
  wordShake: boolean;
  toBeDestroyed: number;
  wordTimeout: number;
  theme: WordTheme;
}

export interface DestroyedWord {
  wordAndDifficulties: WordAndDifficulties;
  newScore: number;
  user: string;
}
