//TODO: add logs list to the game page
import { useSocketGame } from '@/hooks/useSocketGame';

function LogsList() {
  const { wordDistroyeLogs } = useSocketGame();
  return (
    <div>
      <ul>
        {/* {wordDistroyeLogs.map((word) => {
          return <li key={word.id}>{word.word}</li>;
        })} */}
        <li>test1</li>
        <li>test2</li>
        <li>test3</li>
      </ul>
    </div>
  );
}

export default LogsList;
