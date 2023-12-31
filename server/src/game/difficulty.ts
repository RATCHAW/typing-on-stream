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
        toBeDestroyed = 2;
        wordTimeout = 5000;
        wordInterval = { min: 1000, max: 1500 };
        wordMaxLength = 5;
        wordMinLength = 3;
        capitalizeWords = false;
        wordShake = false;
    } else if (score < 20) {
        wordDifficulty = 2;
        toBeDestroyed = 2;
        wordTimeout = 4500;
        wordInterval = { min: 2500, max: 3000 };
        wordMaxLength = 6;
        wordMinLength = 4;
        capitalizeWords = false;
        wordShake = true;
    } else {
        wordDifficulty = 3;
        toBeDestroyed = 3;
        wordTimeout = 4000;
        wordInterval = { min: 2000, max: 2500 };
        wordMaxLength = 7;
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
