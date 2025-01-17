import redisClient from '@/database/redisClient';

export const LeaderBoardStoring = async (broadcasterUsername: string, score: number) => {
    const existingScore = await redisClient.zScore('leaderboard', broadcasterUsername);
    if (existingScore) {
        existingScore < score && (await redisClient.zAdd('leaderboard', [{ score, value: broadcasterUsername }]));
    } else {
        await redisClient.zAdd('leaderboard', [{ score, value: broadcasterUsername }]);
    }
};

export const leaderBoardRetrieving = async () => {
    const leaderboard = await redisClient.zRangeWithScores('leaderboard', 0, 3, { REV: true });
    return leaderboard;
};

export const broadcasterHighestScore = async (broadcasterUsername: string): Promise<number> => {
    const score = await redisClient.zScore('leaderboard', broadcasterUsername);
    return score ?? 0;
};
