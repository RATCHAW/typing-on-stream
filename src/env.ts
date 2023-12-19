import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

const env = cleanEnv(process.env, {
    MONGO_URL: str(),

    REDIS_URL: str({
        default: 'redis://localhost:6379',
    }),
    NODE_ENV: str({
        default: 'development',
        choices: ['development', 'production'],
    }),
});

export default env;
