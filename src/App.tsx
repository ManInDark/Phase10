import { useState } from 'react';
import { AddPlayerDialog } from './AddPlayerDialog';
import { getFinished, getRoundsPlayed, Player, VariantContext } from './Datastructures';
import { DownloadState, UploadState } from './IO';
import { NewRow } from './NewRow';
import VariantSelector, { GameVariants } from './Variants';

export default function App() {
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [variant, setVariant] = useState<GameVariants>("Phase10");

  const roundsPlayed: number = getRoundsPlayed(playerData);
  const finished: boolean = getFinished(playerData);

  return (
    <VariantContext value={variant}>
      <div style={{ marginBottom: "1em" }}>
        {!(roundsPlayed > 0) && <VariantSelector setVariant={setVariant} />}
        {!(roundsPlayed > 0) && <AddPlayerDialog addPlayer={(p: Player) => { setPlayerData([...playerData, p]); }} />}
        {!(roundsPlayed > 0) && <UploadState onUpload={setPlayerData} />}
        {roundsPlayed > 0 && <DownloadState playerData={playerData} />}
      </div>
      {playerData.length > 0 && (<table>
        <thead>
          <tr>
            {playerData.map(pd => (pd.getTableHeader(variant)))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: roundsPlayed }, (_, i) => (
            <tr key={i}>
              {playerData.map(pd => (pd.getRoundResult(variant, i)))}
              <td></td>
            </tr>
          ))}
          {!finished && <NewRow playerData={playerData} setPlayerData={setPlayerData} roundsPlayed={roundsPlayed} />}
          <tr>
            {playerData.map(pd => (
              pd.getAccumulatedPoints(variant)
            ))}
            <td></td>
          </tr>
        </tbody>
      </table>
      )}
    </VariantContext>
  )
}
