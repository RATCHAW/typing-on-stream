import DeathLine from '@/components/atoms/deathLine';
import Leaderboard from '@/components/atoms/leaderboardCard';
import LogLabel from '@/components/atoms/gameInfoLabel';
import Word from '@/components/atoms/word';
import Sword from '@/assets/icons/sword.svg?react';
import Twitch from '@/assets/icons/twitch.svg?react';

function Game() {
  return (
    <div className=" bg-background w-full h-screen space-y-3">
      <div className="ml-2 space-y-4">
        <div>
          <Leaderboard icon={<Twitch />} title="STREAMERS LEADERBOARD" />
        </div>
        <div className="space-y-4">
          <Word />
          <Word theme="second" />
          <Word theme="third" />
        </div>
        <div className="space-y-2">
          <LogLabel icon={<Sword />} text={`HAMID GOT THE WORD "WORD"`} />
          <LogLabel icon={<Sword />} text={`HAMID GOT THE WORD "WORD"`} secondary />
        </div>
        <div>
          <DeathLine />
        </div>
      </div>
    </div>
  );
}

export default Game;
