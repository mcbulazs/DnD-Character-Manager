import { useEffect, useState } from "react";
import { useCharacterContext } from "../../../layout/Contexts/CharacterContext";
import type { NoteCategory } from "../../../types/note";
import NoteCategoryCard from "./NoteCategoryCard";
import NoteCategoryModal from "./NoteCategoryModal";
import CreateButton from "../../../components/buttons/CreateButton";
import { useHeaderContext } from "../../../layout/Contexts/HeaderContext";

const NoteCategories: React.FC = () => {
  const [categories, setCategories] = useState<NoteCategory[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { character, error, isLoading } = useCharacterContext();
  const { setTitle } = useHeaderContext();
  useEffect(() => {
    if (!character) {
      return;
    }
    setTitle(<h1>{character.name}'s Notes</h1>);
    setCategories(character.noteCategories);
  }, [character, setTitle]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !character) {
    return <div>Error loading notes</div>;
  }
  return (
    <>
      <div
        className="w-full h-full 
                grid gap-2 
                grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        {categories?.map((category) => (
          <NoteCategoryCard
            canEdit={character.isOwner}
            key={category.id}
            category={category}
            characterId={character.ID}
          />
        ))}
      </div>
      {character.isOwner &&
        (!modalOpen ? (
          <div className="fixed bottom-0 right-0 m-5">
            <CreateButton
              onClick={() => setModalOpen(true)}
              text="Create Note Category"
            />
          </div>
        ) : (
          <NoteCategoryModal
            onClose={() => setModalOpen(false)}
            characterId={character.ID}
          />
        ))}
    </>
  );
};

export default NoteCategories;
