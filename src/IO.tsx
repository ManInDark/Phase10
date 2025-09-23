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
                        const jsonData = JSON.parse(rawData) as { variant: GameVariants, data: { name: string, rounds: Round[], uuid: string }[] };
                        const data = jsonData.data;
                        const newPlayerData = [];
                        for (const pd of data) {
                            const p = new Player(pd.name);
                            for (const r of pd.rounds) {
                                switch (jsonData.variant) {
                                    case "Phase10":
                                        p.addRound(new Phase10Round(r.points, (r as Phase10Round).phaseDone));
                                        break;
                                    case "Standard":
                                        p.addRound(new Round(r.points));
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