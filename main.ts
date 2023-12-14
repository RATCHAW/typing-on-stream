import GameManager from '@/game/gamewithchat';

try {
    const game = new GameManager();
    game.join('RATCHAW');
    game.join('hichamMallouli');
    game.listen();
} catch (error) {
    console.error(error);
}
