import { useState } from "react";
import { Player } from "./Datastructures";

export default function AddPlayerDialog(props: { dialogRef: React.RefObject<HTMLDialogElement | null>, addPlayer: (p: Player) => void }) {
    const [newPlayerName, setNewPlayerName] = useState<string>("");

    function addPlayer() {
        if (newPlayerName !== "") {
            props.addPlayer(new Player(newPlayerName));
            props.dialogRef.current?.close();
            setNewPlayerName("");
        }
    }

    return (
        <dialog ref={props.dialogRef} className='newPlayerDialog'>
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
    )
}