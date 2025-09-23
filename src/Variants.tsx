export const GameVariants = {
    Phase10: "Phase10",
    Standard: "Standard"
} as const;

export type GameVariants = (typeof GameVariants)[keyof typeof GameVariants];

export default function VariantSelector(props: { setVariant: React.Dispatch<React.SetStateAction<GameVariants>> }) {
    return <select name="selectVariant" className="button" onChange={event => { props.setVariant(event.currentTarget.value as GameVariants) }}>
        <option value="Phase10">Phase 10</option>
        <option value="Standard">Standard</option>
    </select>
}