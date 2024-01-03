//TODO: add logs list to the game page
import { useSocketGame } from '@/hooks/useSocketGame';

function LogsList() {
  const { wordDistroyedLogs } = useSocketGame();
  return (
    <div>
      {wordDistroyedLogs.map((log) => (
        <div key={log.id} className="text-white">
          {log.word} was destroyed by {log.user}
        </div>
      ))}
    </div>
  );
}

export default LogsList;
