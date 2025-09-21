import React, { useState } from 'react';
import { AddPlayerDialog } from './AddPlayerDialog';
import { getFinished, getRoundsPlayed, Player } from './Datastructures';

function NewRow(props: { playerData: Player[], setPlayerData: React.Dispatch<React.SetStateAction<Player[]>>, roundsPlayed: number }) {
  function commitRow() {
    const row = document.querySelector("#newRow") as HTMLTableRowElement;
    const allfieldsset = props.playerData.reduce((prev, curr) => {
      const pointsNode = row.querySelector("[name='newRoundPoints-" + curr.getUUID() + "']") as HTMLInputElement;
      return prev && pointsNode.value !== ""
    }, true);
    if (!allfieldsset) {
      alert("not all fields have been set");
      return;
    }
    props.playerData.forEach((pd) => {
      const pointsNode = row.querySelector("[name='newRoundPoints-" + pd.getUUID() + "']") as HTMLInputElement;
      const phaseDoneNode = row.querySelector("[name='newRoundPhaseDone-" + pd.getUUID() + "']") as HTMLInputElement;
      pd.addRound(parseInt(pointsNode.value), phaseDoneNode.checked);
      pointsNode.value = "";
      phaseDoneNode.checked = false;
    });
    props.setPlayerData([...props.playerData]);
  }

  return (<tr id="newRow">
    {props.playerData.map((pd, index) => {
      return (
        <React.Fragment key={"newRowFragment" + pd.getUUID()}>
          <td style={{ position: "relative" }}>
            {props.playerData.length > 0 && index === (props.roundsPlayed % props.playerData.length) && <>*</>}
            <input type="number" name={"newRoundPoints-" + pd.getUUID()} style={{ width: "5ch", textAlign: "right" }} />
          </td>
          <td style={{ verticalAlign: "middle", textAlign: "center" }}>
            <input type="checkbox" name={'newRoundPhaseDone-' + pd.getUUID()} style={{ verticalAlign: "middle" }} />
          </td>
        </React.Fragment>
      )
    })}
    <td><input type="submit" value="Commit" onClick={commitRow} /></td>
  </tr>)
}

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
