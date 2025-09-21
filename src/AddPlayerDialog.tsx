import { useRef, useState } from "react";
import { Player } from "./Datastructures";

export function AddPlayerDialog(props: { addPlayer: (p: Player) => void }) {
    const [newPlayerName, setNewPlayerName] = useState<string>("");
    const dialogRef = useRef<HTMLDialogElement>(null)

    function addPlayer() {
        if (newPlayerName !== "") {
            props.addPlayer(new Player(newPlayerName));
            dialogRef.current?.close();
            setNewPlayerName("");
        }
    }

    return (
        <>
            <dialog ref={dialogRef} className='newPlayerDialog'>
                <form action={addPlayer}>
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
            <button className="button" onClick={() => { dialogRef.current?.showModal() }}>New Player</button>
        </>
    )
}