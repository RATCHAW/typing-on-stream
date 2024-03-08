import GameContentSection from '@/components/organisms/gameContentSection';
import SideBar from '@/components/organisms/sideBar';
import Loading from '@/assets/icons/loading.svg?react';
import { useSocketGame } from '@/providers/game-provider';

function Game() {
  const { loading } = useSocketGame();
  return (
    <div className="h-screen bg-background">
      {!loading ? (
        <div className="flex bg-background space-x-6 p-5 h-screen">
          <SideBar />
          <GameContentSection />
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen ">
          <Loading />
        </div>
      )}
    </div>
  );
}

export default Game;
