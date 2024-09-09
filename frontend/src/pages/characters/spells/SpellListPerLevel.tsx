import Accordion from "../../../components/Accordion";
import type { Spell } from "../../../types/spell";
import type { Tracker } from "../../../types/tracker";
import SpellCard from "./SpellCard";

const AccordionHeader: React.FC<{
	trackers: Tracker[];
	level: number;
	name: string;
}> = ({ trackers, level, name }) => {
	const tracker = trackers.filter(
		(tracker) => tracker.type === `SpellSlot_${level}`,
	)[0];
	return (
		<div>
			{name} | {tracker.currentValue} / {tracker.maxValue}
		</div>
	);
};

const SpellListPerLevel: React.FC<{
	spells: Spell[];
	trackers: Tracker[];
	level: number;
	characterId: number;
}> = ({ spells: _spells, trackers, level, characterId }) => {
	//const levels = Array.from(new Set(spells.map((spell) => spell.level)));
	const spells = _spells.filter((spell) => spell.level === level);
	return (
		<Accordion
			head={
				<AccordionHeader
					trackers={trackers}
					level={level}
					name={`Spell level ${level}`}
				/>
			}
		>
			<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-2 p-2">
				{spells.map((spell) => (
					<SpellCard key={spell.id} spell={spell} characterId={characterId} />
				))}
			</div>
		</Accordion>
	);
};

export default SpellListPerLevel;
