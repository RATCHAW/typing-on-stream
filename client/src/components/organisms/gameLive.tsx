import DeathLine from '../atoms/deathLine';
import ScenceInfo from './scenceInfo';
import WaitingMenu from './waitingMenu';

function GameLive() {
  return (
    <div className="flex flex-col w-full px-[30px] border-2 border-border rounded-lg">
      <div className="flex justify-center grow">
        <WaitingMenu />
      </div>
      <div className="mt-8">
        <DeathLine />
      </div>
      <div className="my-8 flex-en">
        <ScenceInfo />
      </div>
    </div>
  );
}

export default GameLive;
