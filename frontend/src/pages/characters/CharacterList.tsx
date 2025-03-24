import type React from "react";
import { useEffect, useState } from "react";
import CreateButton from "../../components/buttons/CreateButton";
import { useHeaderContext } from "../../layout/Contexts/HeaderContext";
import CharacterListCard from "./CharacterListCard";
import CreateCharacterModal from "./CreateCharacterModal";
import { useUserContext } from "../../layout/Contexts/UserContext";

const CharacterList: React.FC = () => {
  const { User } = useUserContext();

  const [modalOpen, setModalOpen] = useState(false);
  const { setTitle } = useHeaderContext();

  useEffect(() => {
    setTitle(<h1>Characters</h1>);
  }, [setTitle]);

  return (
    <>
      <div className="flex w-full lg:w-4/5 flex-wrap justify-evenly gap-4">
        {User?.characters?.map((character) => (
          <CharacterListCard
            key={character.ID}
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
