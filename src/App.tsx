import React, { useRef, useState } from 'react';
import { AddPlayerDialog } from './AddPlayerDialog';
import { getFinished, getRoundsPlayed, Player } from './Datastructures';

function NewRowSinglePlayer(props: { player: Player, shuffleIndicator: boolean, index: number, commitCallbacks: React.RefObject<(() => (() => void) | null)[]> }) {
  const pointsNodeRef = useRef<HTMLInputElement>(null);
  const phaseDoneNodeRef = useRef<HTMLInputElement>(null);

  props.commitCallbacks.current[props.index] = () => {
    const pointsNode = pointsNodeRef.current as HTMLInputElement;
    const phaseDoneNode = phaseDoneNodeRef.current as HTMLInputElement;

    return pointsNode.value !== "" ? () => {
      props.player.addRound(parseInt(pointsNode.value), phaseDoneNode.checked);
      pointsNode.value = "";
      phaseDoneNode.checked = false;
    } : null
  }

  return (
    <React.Fragment key={"newRowFragment" + props.player.getUUID()}>
      <td style={{ position: "relative" }}>
        {props.shuffleIndicator && <>*</>}
        <input type="number" name={"newRoundPoints-" + props.player.getUUID()} ref={pointsNodeRef} style={{ width: "5ch", textAlign: "right" }} />
      </td>
      <td style={{ verticalAlign: "middle", textAlign: "center" }}>
        <input type="checkbox" name={'newRoundPhaseDone-' + props.player.getUUID()} ref={phaseDoneNodeRef} style={{ verticalAlign: "middle" }} />
      </td>
    </React.Fragment>
  )
}

function NewRow(props: { playerData: Player[], setPlayerData: React.Dispatch<React.SetStateAction<Player[]>>, roundsPlayed: number }) {
  const commitCallbacks = useRef<(() => (() => void | null))[]>([]);
  function commitRow() {
    const returnedCallbacks: (() => void | null)[] = [];
    commitCallbacks.current.forEach(callback => returnedCallbacks.push(callback()));
    if (returnedCallbacks.some(callback => callback === null)) {
      alert("not all fields have been set");
      return;
    }
    returnedCallbacks.forEach(callback => callback());
    props.setPlayerData([...props.playerData]);
  }

  return (<tr id="newRow">
    {props.playerData.map((pd, index) => {
      return (
        <NewRowSinglePlayer
          key={pd.getUUID()}
          player={pd}
          shuffleIndicator={props.playerData.length > 0 && index === (props.roundsPlayed % props.playerData.length)}
          index={index}
          commitCallbacks={commitCallbacks}
        />
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
