export interface WordAndDifficulties {
  id: string;
  word: string;
  wordShake: boolean;
  toBeDestroyed: number;
  wordTimeout: number;
}

export interface DestroyedWord {
  wordAndDifficulties: WordAndDifficulties;
  newScore: number;
  user: string;
}
