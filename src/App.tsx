import React, { useRef, useState } from 'react'

class Round {
  points: number;
  phaseDone: boolean;
  constructor(points: Round["points"], phaseDone: Round["phaseDone"]) {
    this.points = points;
    this.phaseDone = phaseDone;
  }
}

class Player {
  private name: string;
  private rounds: Round[];
  private uuid: string;
  constructor(name: string) {
    this.name = name;
    this.rounds = [];
    this.uuid = crypto.randomUUID();
  }
  getName() { return this.name; }
  getUUID() { return this.uuid; }
  addRound(points: Round["points"], phaseDone: Round["phaseDone"]) { this.rounds.push(new Round(points, phaseDone)); }
  getRounds() { return this.rounds; }
  getRoundResult(i: number) {
    const round: Round = this.rounds[i];
    return (
      <React.Fragment key={`RR-${i}-${this.getUUID()}`}>
        <td>{round.points}</td>
        <td><input type="checkbox" checked={round.phaseDone} readOnly={true} /></td>
      </React.Fragment>
    )
  }
  getPhase() { return 1 + this.rounds.filter(r => r.phaseDone).length }
  getPhaseDisplay() { return Math.min(10, this.getPhase()); }
  getAccumulatedPoints() { return this.rounds.reduce((prev, curr) => prev + curr.points, 0) }
}

function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");

  const roundsPlayed: number = playerData.reduce((prev: number, curr: Player) => { return Math.min(prev, curr.getRounds().length) }, playerData.length * 25);
  const finished: boolean = playerData.reduce((prev: number, curr: Player) => { return Math.max(prev, curr.getPhase()) }, 0) > 10;

  function addUser() {
    if (newPlayerName !== "") {
      setPlayerData([...playerData, new Player(newPlayerName)]);
      dialogRef.current?.close()
      setNewPlayerName("");
    }
  }

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
      <dialog ref={dialogRef} className='newPlayerDialog'>
        <form action={addUser}>
          <h4>Add Player</h4>
          <div>
            <label htmlFor="newPlayerName">Name:</label>
            <input name="newPlayerName" type="text" value={newPlayerName} onChange={e => setNewPlayerName(e.currentTarget.value)} />
          </div>
          <div>
            <input type="submit" value="Add" />
          </div>
        </form>
      </dialog>
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
