import Logo from '../atoms/logo';
import ParticipantLabel from '../atoms/participantLabel';
import Leaderboard from '../molecules/leaderboardCard';
import Twitch from '@/assets/icons/twitch.svg?react';
import Chat from '@/assets/icons/chat.svg?react';
import CamBox from '../atoms/camBox';

function SideBar() {
  return (
    <div className="flex flex-col w-fit">
      <div className="flex justify-center mt-7 mb-8">
        <Logo />
      </div>
      <div className="space-y-[14px]">
        <div>
          <CamBox />
        </div>
        <div>
          <Leaderboard icon={<Twitch />} title="streamers leaderboard">
            <ParticipantLabel colorized trophy score={1000}>
              RATCHAW
            </ParticipantLabel>
            <ParticipantLabel trophy score={1000}>
              MAADLOU
            </ParticipantLabel>
            <ParticipantLabel secondary trophy score={1000}>
              MAADLOU
            </ParticipantLabel>
          </Leaderboard>
        </div>
        <div>
          <Leaderboard icon={<Chat />} title="chat leaderboard">
            <ParticipantLabel colorized trophy score={1000}>
              RATCHAW
            </ParticipantLabel>
            <ParticipantLabel trophy score={1000}>
              MAADLOU
            </ParticipantLabel>
            <ParticipantLabel secondary trophy score={1000}>
              MAADLOU
            </ParticipantLabel>
            <ParticipantLabel secondary trophy score={1000}>
              MAADLOU
            </ParticipantLabel>
            <ParticipantLabel secondary trophy score={1000}>
              MAADLOU
            </ParticipantLabel>
          </Leaderboard>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
