import { Player } from "./Datastructures";

export function DownloadState(props: { playerData: Player[] }) {
    return <>
        <button className="button" onClick={() => {
            const blob = new Blob([JSON.stringify(props.playerData, null, 4)], { type: "application/json" });
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
                        const data = JSON.parse(rawData) as { name: string, rounds: { points: number, phaseDone: boolean }[], uuid: string }[];
                        const newPlayerData = [];
                        for (const pd of data) {
                            const p = new Player(pd.name);
                            for (const r of pd.rounds) {
                                p.addRound(r.points, r.phaseDone);
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