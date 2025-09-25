import { useContext } from "react";
import { Phase10Round, Player, Round, VariantContext } from "./Datastructures";
import type { GameVariants } from "./Variants";

export function DownloadState(props: { playerData: Player[] }) {
    const variant = useContext(VariantContext);
    const data = { variant, data: props.playerData };

    return <>
        <button className="button" onClick={() => {
            const blob = new Blob([JSON.stringify(data, null, 4)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `gamedata_${new Date().toISOString()}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }}>Export</button>
    </>
}

type UploadStructure = GameVariants extends infer Variants extends string
    ? { [K in Variants]: { variant: K, data: { name: string, rounds: K extends "Phase10" ? Phase10Round[] : Round[], uuid: string }[] } }[Variants]
    : never;

export function UploadState(props: { onUpload: (data: Player[]) => void }) {
    return <>
        <input
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            id={"uploadFile"}
            onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                    file.text().then((rawData) => {
                        const jsonData = JSON.parse(rawData) as UploadStructure;
                        const newPlayerData = [];
                        for (const playerIndex in jsonData.data) {
                            const p = new Player(jsonData.data[playerIndex].name);
                            for (const roundIndex in jsonData.data[playerIndex].rounds) {
                                switch (jsonData.variant) {
                                    case "Phase10":
                                        p.addRound(new Phase10Round(jsonData.data[playerIndex].rounds[roundIndex].points, jsonData.data[playerIndex].rounds[roundIndex].phaseDone));
                                        break;
                                    case "Standard":
                                        p.addRound(new Round(jsonData.data[playerIndex].rounds[roundIndex].points));
                                        break;
                                }
                            }
                            newPlayerData.push(p);
                        }
                        props.onUpload(newPlayerData);
                    })
                } catch {
                    alert("Error importing data");
                }
            }}
        />
        <label className="button" htmlFor="uploadFile">Import</label>
    </>;
}