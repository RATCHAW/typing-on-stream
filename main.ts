import gameLobby from '@/game/gameLobby';

try {
    const game = new gameLobby();
    game.join('RATCHAW');
    game.join('hichamMallouli');
} catch (error) {
    console.error(error);
}
