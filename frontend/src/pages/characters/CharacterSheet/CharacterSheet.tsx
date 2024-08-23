import type React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCharacterByIdQuery } from "../../../store/api/characterApiSlice";

const CharacterSheet: React.FC = () => {
	const { characterId } = useParams();
	if (!characterId || Number.isNaN(Number.parseInt(characterId))) {
		return <div>Invalid character ID</div>;
	}
	const {
		data: character,
		error,
		isLoading,
	} = useGetCharacterByIdQuery(Number.parseInt(characterId));
	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		toast("Error loading character", { type: "error" });
        console.error("Error loading character", error);
		return <div>Error loading character</div>;
	}
	if (!character) {
		return <div>Character not found</div>;
	}
    console.log(character);
	return (
		<div>
			<h1>Character Sheet</h1>
		</div>
	);
};

export default CharacterSheet;
