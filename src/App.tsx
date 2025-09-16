import React, { useRef, useState } from 'react'
import { getFinished, getRoundsPlayed, Player } from './Datastructures';
import AddPlayerDialog from './AddPlayerDialog';

function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [playerData, setPlayerData] = useState<Player[]>([]);

  const roundsPlayed: number = getRoundsPlayed(playerData);
  const finished: boolean = getFinished(playerData);

  function commitRow() {
    const row = document.querySelector("#newRow") as HTMLTableRowElement;
    const allfieldsset = playerData.reduce((prev, curr) => {
      const pointsNode = row.querySelector("[name='newRoundPoints-" + curr.getUUID() + "']") as HTMLInputElement;
      return prev && pointsNode.value !== ""
    }, true);
    if (!allfieldsset) {
      alert("not all fields have been set");
      return;
    }
    playerData.forEach((pd) => {
      const pointsNode = row.querySelector("[name='newRoundPoints-" + pd.getUUID() + "']") as HTMLInputElement;
      const phaseDoneNode = row.querySelector("[name='newRoundPhaseDone-" + pd.getUUID() + "']") as HTMLInputElement;
      pd.addRound(parseInt(pointsNode.value), phaseDoneNode.checked);
      pointsNode.value = "";
      phaseDoneNode.checked = false;
    });
    setPlayerData([...playerData]);
  }

  return (
    <>
      <AddPlayerDialog dialogRef={dialogRef} addPlayer={(p: Player) => { setPlayerData([...playerData, p]); }} />
      <div style={{ marginBottom: "1em" }}>
        <button onClick={() => { dialogRef.current?.showModal() }}>New Player</button>
      </div>
      {playerData.length > 0 && (<table>
        <thead>
          <tr>
            {playerData.map(pd => (
              <React.Fragment key={pd.getUUID()}>
                <th>{pd.getName()}</th>
                <th>{pd.getPhaseDisplay()}</th>
              </React.Fragment>
            ))}
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
          {!finished &&
            (<tr id="newRow">
              {playerData.map((pd, index) => (
                <React.Fragment key={"newRowFragment" + pd.getUUID()}>
                  <td style={{ position: "relative" }}>
                    {playerData.length > 0 && index === (roundsPlayed % playerData.length) && <>*</>}
                    <input
                      type="number"
                      name={"newRoundPoints-" + pd.getUUID()}
                      style={{ width: "5ch", textAlign: "right" }}
                    />
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      name={'newRoundPhaseDone-' + pd.getUUID()}
                      style={{ verticalAlign: "middle" }}
                    />
                  </td>
                </React.Fragment>
              ))}
              <td><input type="submit" value="Commit" onClick={commitRow} /></td>
            </tr>)
          }
          <tr>
            {playerData.map(pd => (
              <td key={"accumulatedPoints" + pd.getUUID()} colSpan={2}>{pd.getAccumulatedPoints()}</td>
            ))}
            <td></td>
          </tr>
        </tbody>
      </table>
      )}
    </>
  )
}

export default App
