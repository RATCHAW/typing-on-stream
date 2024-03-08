let wordDifficulty: number;
let wordTimeout: number; // time you have to type the word
let wordInterval: { min: number; max: number }; // time between words
let toBeDestroyed: number; // how many times should the word be typed to be destroyed
let wordMaxLength: number;
let wordMinLength: number;
let capitalizeWords: boolean; // capitalize some characters in the word
let wordShake: boolean; // make the word start shaking

function adjustDifficulty(score: number) {
    if (score < 10) {
        wordDifficulty = 1;
        toBeDestroyed = 1;
        wordTimeout = 7000;
        wordInterval = { min: 1500, max: 2000 };
        wordMaxLength = 5;
        wordMinLength = 3;
        capitalizeWords = false;
        wordShake = false;
    } else if (score < 20) {
        wordDifficulty = 2;
        toBeDestroyed = 2;
        wordTimeout = 7000;
        wordInterval = { min: 1500, max: 2000 };
        wordMaxLength = 6;
        wordMinLength = 3;
        capitalizeWords = false;
        wordShake = true;
    } else if (score < 30) {
        wordDifficulty = 3;
        toBeDestroyed = 3;
        wordTimeout = 6500;
        wordInterval = { min: 1400, max: 1800 };
        wordMaxLength = 7;
        wordMinLength = 4;
        capitalizeWords = false;
        wordShake = true;
    } else if (score < 40) {
        wordDifficulty = 4;
        toBeDestroyed = 4;
        wordTimeout = 6000;
        wordInterval = { min: 1350, max: 1700 };
        wordMaxLength = 8;
        wordMinLength = 4;
        capitalizeWords = true;
        wordShake = true;
    } else {
        wordDifficulty = 5;
        toBeDestroyed = 5;
        wordTimeout = 5500;
        wordInterval = { min: 1300, max: 1600 };
        wordMaxLength = 9;
        wordMinLength = 5;
        capitalizeWords = true;
        wordShake = true;
    }
    return {
        wordDifficulty,
        toBeDestroyed,
        wordTimeout,
        wordInterval,
        wordMaxLength,
        wordMinLength,
        capitalizeWords,
        wordShake,
    };
}

export default adjustDifficulty;
