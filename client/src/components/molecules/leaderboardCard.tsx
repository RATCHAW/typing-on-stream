interface LeaderboardProps {
  icon: JSX.Element;
  title: string;
  children: JSX.Element[] | JSX.Element;
  className?: string;
}

function Leaderboard({ icon, title, children, className }: LeaderboardProps) {
  return (
    <div className={`bg-background w-72 border-border border-2 rounded-b-lg uppercase ${className}`}>
      <div className="flex bg-border text-white px-5 py-3 space-x-2 items-center">
        {icon}
        <h2 className="text-[10px]">{title}</h2>
      </div>

      <div className="my-5  mx-3 space-y-2">{children}</div>
    </div>
  );
}

export default Leaderboard;
