import React, { useContext, useRef } from "react";
import { VariantContext, type Player } from "./Datastructures";

function NewRowElements(props: { player: Player, shuffleIndicator: boolean, index: number, commitCallbacks: React.RefObject<(() => (() => void) | null)[]> }) {
    const ref0 = useRef<HTMLInputElement>(null);
    const ref1 = useRef<HTMLInputElement>(null);
    const variant = useContext(VariantContext);

    switch (variant) {
        case "Phase10": {
            props.commitCallbacks.current[props.index] = () => {
                const pointsNode = ref0.current as HTMLInputElement;
                const phaseDoneNode = ref1.current as HTMLInputElement;

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
                        <input type="number" ref={ref0} style={{ width: "5ch", textAlign: "right" }} />
                    </td>
                    <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                        <input type="checkbox" ref={ref1} style={{ verticalAlign: "middle" }} />
                    </td>
                </React.Fragment>
            )
        }
    }
}

export function NewRow(props: { playerData: Player[], setPlayerData: React.Dispatch<React.SetStateAction<Player[]>>, roundsPlayed: number }) {
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
                <NewRowElements
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
