import DeathLine from '@/components/atoms/deathLine';
import Leaderboard from '@/components/atoms/leaderboardCard';
import LogLabel from '@/components/atoms/gameInfoLabel';
import Word from '@/components/atoms/word';
import Sword from '@/assets/icons/sword.svg?react';
import Twitch from '@/assets/icons/twitch.svg?react';
import VerificationStep from '@/components/atoms/verificationStep';
import catTyping from '/emotes/catTyping.gif';
import CopyButton from '@/components/atoms/copyButton';
import VerificationCode from '@/components/atoms/verificationCode';
import Logo from '@/components/atoms/logo';

function Game() {
  return (
    <div className=" bg-background w-full space-y-3">
      <div className="ml-2 space-y-8 p-12">
        <div>
          <Leaderboard icon={<Twitch />} title="STREAMERS LEADERBOARD" />
        </div>
        <div className="space-y-4">
          <Word />
          <Word theme="second" />
          <Word theme="third" />
        </div>
        <div className="space-y-2">
          <LogLabel icon={<Sword />}>HAMID GOT THE WORD "WORD"</LogLabel>
          <LogLabel icon={<Sword />} secondary>
            HAMID GOT THE WORD "WORD"
          </LogLabel>
        </div>
        <div>
          <VerificationStep emoteSrc={catTyping} stepNumber={1}>
            type the verification code in chat to activate the session
          </VerificationStep>
        </div>
        <div>
          <Logo />
        </div>
        <div>
          <VerificationCode code={'4444'} />
        </div>
        <div>
          <CopyButton />
        </div>
        <div>
          <DeathLine />
        </div>
      </div>
    </div>
  );
}

export default Game;
