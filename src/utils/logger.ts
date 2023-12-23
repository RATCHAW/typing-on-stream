import env from '@/env';
import winston from 'winston';

const logger = winston.createLogger();

if (env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    );
}
export default logger;
