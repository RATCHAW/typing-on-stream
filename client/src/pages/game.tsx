import GameContentSection from '@/components/organisms/gameContentSection';
import SideBar from '@/components/organisms/sideBar';

function Game() {
  return (
    <div className="flex bg-background h-screen space-x-6 p-5">
      <SideBar />
      <GameContentSection />
    </div>
  );
}

export default Game;
