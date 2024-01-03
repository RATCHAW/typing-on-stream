import ParticipantLabel from './participantLabel';

interface LeaderboardProps {
  icon: JSX.Element;
  title: string;
}

function Leaderboard({ icon, title }: LeaderboardProps) {
  return (
    <div className="flex flex-col bg-background w-80 border-border border-2 rounded-b-lg">
      <div className="flex bg-border text-white px-5 py-3 space-x-2 items-center">
        {icon}
        <h2 className="text-[10px]">{title}</h2>
      </div>

      <div className="m-5 space-y-2">
        <ParticipantLabel colorized trophy />
        <ParticipantLabel trophy />
        <ParticipantLabel secondary trophy />
        <ParticipantLabel secondary />
      </div>
    </div>
  );
}

export default Leaderboard;
