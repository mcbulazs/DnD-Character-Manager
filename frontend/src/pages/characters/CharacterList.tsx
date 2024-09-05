import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useHeader } from "../../layout/components/HeaderProvider";
import { useGetCharactersQuery } from "../../store/api/characterApiSlice";
import CharacterListCard from "./CharacterListCard";
import CreateCharacterButton from "./CreateCharacterButton";
import CreateCharacterModal from "./CreateCharacterModal";

const CharacterList: React.FC = () => {
	const { data: characters, error, isLoading } = useGetCharactersQuery();

	const [modalOpen, setModalOpen] = useState(false);
	const { setTitle } = useHeader();

	useEffect(() => {
		setTitle(<h1>Characters</h1>);
	}, [setTitle]);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		toast("Error loading characters", { type: "error" });
		console.error("Error loading characters", error);
		return <div>Error loading characters</div>;
	}

	return (
		<>
			<div className="flex w-full lg:w-4/5 flex-wrap justify-evenly gap-4">
				{characters?.map((character) => (
					<CharacterListCard key={character.id} character={character} />
				))}
			</div>
			{!modalOpen ? (
				<CreateCharacterButton setOpen={setModalOpen} />
			) : (
				<CreateCharacterModal onClose={() => setModalOpen(false)} />
			)}
		</>
	);
};
export default CharacterList;
