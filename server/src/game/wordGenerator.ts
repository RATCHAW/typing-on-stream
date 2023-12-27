import { generate } from 'random-words';

export interface generateWord {
    minLength?: number;
    maxLength?: number;
}

export const generateWord = ({ minLength, maxLength }: generateWord): string => {
    const options = {
        minLength,
        maxLength,
        exactly: 1,
    };

    const words = generate(options);
    const word = words[0];
    return word;
};
