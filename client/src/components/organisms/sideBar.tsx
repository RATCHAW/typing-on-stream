import Logo from '../atoms/logo';
import ParticipantLabel from '../atoms/participantLabel';
import Leaderboard from '../molecules/leaderboardCard';
import Twitch from '@/assets/icons/twitch.svg?react';
import Chat from '@/assets/icons/chat.svg?react';
import { useSocketGame } from '@/providers/game-provider';
import CamBox from '../atoms/camBox';

function SideBar() {
  const { chatLeaderboard, broadcastersLeaderboard } = useSocketGame();

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex justify-center mt-7 mb-8">
        <Logo className="text-[20px]" />
      </div>
      <div className="space-y-[14px]">
        <div>
          <CamBox />
        </div>

        <Leaderboard icon={<Twitch />} title="streamers leaderboard">
          <>
            {broadcastersLeaderboard.map((participant, index) => (
              <ParticipantLabel
                key={index}
                trophy
                colorized={index === 0}
                secondary={1 < index}
                score={participant.score}
              >
                {participant.value}
              </ParticipantLabel>
            ))}

            {[...Array(3 - broadcastersLeaderboard?.length)].map((_, index) => (
              <ParticipantLabel key={index} trophy score={0}>
                Streamer
              </ParticipantLabel>
            ))}
          </>
        </Leaderboard>

        <Leaderboard icon={<Chat />} title="chat leaderboard" className="flex flex-col">
          <div className="space-y-2">
            {chatLeaderboard.slice(0, 5).map((participant, index) => (
              <ParticipantLabel
                key={index}
                trophy
                colorized={index === 0}
                secondary={1 < index}
                score={participant.score}
              >
                {participant.user}
              </ParticipantLabel>
            ))}
            {[...Array(5 - chatLeaderboard?.length)].map((_, index) => (
              <ParticipantLabel key={index} trophy score={0}>
                Chatter
              </ParticipantLabel>
            ))}
          </div>
        </Leaderboard>
      </div>
    </div>
  );
}

export default SideBar;
