import ParticipantLabel from '../atoms/participantLabel';

interface LeaderboardProps {
  icon: JSX.Element;
  title: string;
  children: JSX.Element[];
}

function Leaderboard({ icon, title, children }: LeaderboardProps) {
  return (
    <div className="flex flex-col bg-background w-80 border-border border-2 rounded-b-lg uppercase">
      <div className="flex bg-border text-white px-5 py-3 space-x-2 items-center">
        {icon}
        <h2 className="text-[10px]">{title}</h2>
      </div>

      <div className="m-5 space-y-2">{children}</div>
    </div>
  );
}

export default Leaderboard;
