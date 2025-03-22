import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CreateButton from "../../components/buttons/CreateButton";
import { useCharactersContext } from "../../layout/Contexts/CharactersContext";
import { useHeaderContext } from "../../layout/Contexts/HeaderContext";
import CharacterListCard from "./CharacterListCard";
import CreateCharacterModal from "./CreateCharacterModal";

const CharacterList: React.FC = () => {
  const { characters, error, isLoading } = useCharactersContext();

  const [modalOpen, setModalOpen] = useState(false);
  const { setTitle } = useHeaderContext();

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
          <CharacterListCard
            key={character.id}
            character={character}
            isOwner={true}
          />
        ))}
      </div>
      {!modalOpen ? (
        <div className="fixed bottom-0 right-0 m-5">
          <CreateButton
            onClick={() => setModalOpen(true)}
            text="Create Character"
          />
        </div>
      ) : (
        <CreateCharacterModal onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};
export default CharacterList;
