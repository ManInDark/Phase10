import { useState } from 'react';
import { AddPlayerDialog } from './AddPlayerDialog';
import { getFinished, getRoundsPlayed, Player } from './Datastructures';
import { NewRow } from './NewRow';

export default function App() {
  const [playerData, setPlayerData] = useState<Player[]>([]);

  const roundsPlayed: number = getRoundsPlayed(playerData);
  const finished: boolean = getFinished(playerData);

  return (
    <>
      {!(roundsPlayed > 0) && <AddPlayerDialog addPlayer={(p: Player) => { setPlayerData([...playerData, p]); }} />}
      {playerData.length > 0 && (<table>
        <thead>
          <tr>
            {playerData.map(pd => (pd.getTableHeader()))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: roundsPlayed }, (_, i) => (
            <tr key={i}>
              {playerData.map(pd => (pd.getRoundResult(i)))}
              <td></td>
            </tr>
          ))}
          {!finished && <NewRow playerData={playerData} setPlayerData={setPlayerData} roundsPlayed={roundsPlayed} />}
          <tr>
            {playerData.map(pd => (
              pd.getAccumulatedPoints()
            ))}
            <td></td>
          </tr>
        </tbody>
      </table>
      )}
    </>
  )
}
