import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

const env = cleanEnv(process.env, {
    REDIS_URL: str({
        default: 'redis://localhost:6379',
    }),
});

export default env;
