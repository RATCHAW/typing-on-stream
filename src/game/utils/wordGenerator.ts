import { generate, count } from 'random-words';

export interface generateWord {
    minLength?: number;
    maxLength?: number;
}

export const generateWord = ({ minLength, maxLength }: generateWord) => {
    const options = {
        minLength,
        maxLength,
    };

    return generate(options);
};
