import GameLive from '@/components/organisms/gameLive';
import SideBar from '@/components/organisms/sideBar';

function Game() {
  return (
    <div className="flex bg-background h-screen space-x-8 p-8">
      <SideBar />
      <GameLive />
    </div>
  );
}

export default Game;
