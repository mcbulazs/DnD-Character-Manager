import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CreateButton from "../../../components/buttons/CreateButton";
import { useCharacterContext } from "../../../layout/Contexts/CharacterContext";
import { useHeaderContext } from "../../../layout/Contexts/HeaderContext";
import CreateSpellModal from "./CreateSpellModal";
import SpellListPerLevel from "./SpellListPerLevel";

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
  const trackers = character.trackers;

  // TODO: DONT REPEAT YOURSELF
  return (
    <>
      <div className="w-full sm:w-11/12 grid gap-2">
        <SpellListPerLevel
          spells={spells}
          trackers={trackers}
          level={0}
          characterId={characterId}
        />
        <SpellListPerLevel
          spells={spells}
          trackers={trackers}
          level={1}
          characterId={characterId}
        />
        <SpellListPerLevel
          spells={spells}
          trackers={trackers}
          level={2}
          characterId={characterId}
        />
        <SpellListPerLevel
          spells={spells}
          trackers={trackers}
          level={3}
          characterId={characterId}
        />
        <SpellListPerLevel
          spells={spells}
          trackers={trackers}
          level={4}
          characterId={characterId}
        />
        <SpellListPerLevel
          spells={spells}
          trackers={trackers}
          level={5}
          characterId={characterId}
        />
        <SpellListPerLevel
          spells={spells}
          trackers={trackers}
          level={6}
          characterId={characterId}
        />
        <SpellListPerLevel
          spells={spells}
          trackers={trackers}
          level={7}
          characterId={characterId}
        />
        <SpellListPerLevel
          spells={spells}
          trackers={trackers}
          level={8}
          characterId={characterId}
        />
        <SpellListPerLevel
          spells={spells}
          trackers={trackers}
          level={9}
          characterId={characterId}
        />
      </div>
      {isModalOpen ? (
        <CreateSpellModal
          onClose={() => setIsModalOpen(false)}
          characterId={characterId}
        />
      ) : (
        <div className="fixed bottom-0 right-0 m-5">
          <CreateButton
            text="Add feature"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      )}
    </>
  );
};

export default Spells;
