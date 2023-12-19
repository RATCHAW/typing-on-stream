import redisClient from '@/database/redisClient';

function sechaduledTask() {
    const livesessions = redisClient.HGETALL('gameSessions');
}
