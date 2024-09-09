import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Accordion from "../../../components/Accordion";
import { useCharacterContext } from "../../../layout/Contexts/CharacterContext";
import { useHeaderContext } from "../../../layout/Contexts/HeaderContext";

const Spells: React.FC<{ characterId?: number }> = ({
	characterId: _characterId = undefined,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	let characterId: number;
	if (_characterId) {
		characterId = _characterId;
	} else {
		const { characterId: paramCharacterId } = useParams();
		if (!paramCharacterId || Number.isNaN(Number.parseInt(paramCharacterId))) {
			return <div>Invalid character ID</div>;
		}
		characterId = Number.parseInt(paramCharacterId);
	}

	const { character, error, isLoading } = useCharacterContext();
	const { setTitle } = useHeaderContext();

	useEffect(() => {
		setTitle(
			<h1 className="text-3xl font-bold">{character?.name}'s spells</h1>,
		);
	}, [setTitle, character]);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		console.error("Error loading spells", error);
		toast("Error loading spells", { type: "error" });
		return <div>Error loading spells</div>;
	}
	if (!character) {
		return <div>No character found</div>;
	}
	const spells = character.spells;

	return (
		<div className="w-full flex">
			<Accordion head={<div>csa</div>}>
				<div className="h-96 bg-white">asd</div>
			</Accordion>
			<Accordion head={<div>csa</div>}>
			<div className="h-96 bg-white">asd</div>
			</Accordion>
		</div>
	);
};

export default Spells;
