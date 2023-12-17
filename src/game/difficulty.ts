let wordDifficulty: number;
let wordTimeout: number;
let wordInterval: number[];
let wordMaxLength: number;
let wordMinLength: number;
let wordSize: number;
let capitalizeWords: boolean;
let rotateWords: boolean;
let wordOpacity: number;

function adjustDifficulty(score: number) {
    if (score < 10) {
        wordDifficulty = 1;
        wordTimeout = 5000;
        wordInterval = [3000, 3500];
        wordMaxLength = 3;
        wordMinLength = 5;
        wordSize = 12;
        capitalizeWords = false;
        rotateWords = false;
        wordOpacity = 1;
    } else if (score < 20) {
        wordDifficulty = 2;
        wordTimeout = 4500;
        wordInterval = [2500, 3000];
        wordMaxLength = 4;
        wordMinLength = 6;
        wordSize = 14;
        capitalizeWords = false;
        rotateWords = true;
        wordOpacity = 0.9;
    } else {
        wordDifficulty = 3;
        wordTimeout = 4000;
        wordInterval = [2000, 2500];
        wordMaxLength = 5;
        wordMinLength = 7;
        wordSize = 16;
        capitalizeWords = true;
        rotateWords = true;
        wordOpacity = 0.8;
    }
    return {
        wordDifficulty,
        wordTimeout,
        wordInterval,
        wordMaxLength,
        wordMinLength,
        wordSize,
        capitalizeWords,
        rotateWords,
        wordOpacity,
    };
}

export default adjustDifficulty;
