import { useNavigate } from "react-router";
import type { NoteCategory } from "../../../types/note";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import NoteCategoryModal from "./NoteCategoryModal";

const NoteCategoryCard: React.FC<{
  characterId: number;
  category: NoteCategory;
  canEdit: boolean;
}> = ({ characterId, category: _category, canEdit }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState<NoteCategory>(_category);
  useEffect(() => {
    setCategory(_category);
  }, [_category]);
  return (
    <>
      <div className="relative">
        <div
          className={`w-full h-64 relative 
                flex flex-col 
                bg-light-parchment-beige   
                rounded-xl border-4 border-black
                cursor-pointer
                `}
          onMouseUp={() => {
            navigate(`/characters/${characterId}/notes/${category.id}`);
          }}
        >
          <h2 className="text-center text-xl font-bold border-b-4 border-dragon-blood">
            {category.name}
          </h2>
          <div className="pb-10 w-full h-full px-1">
            <div className="w-full h-full line-clamp-[9]">
              <p>{category.description}</p>
            </div>
          </div>
        </div>
        {canEdit && (
          <button
            type="button"
            className="absolute top-0 right-0 text-orange-500"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <EditIcon fontSize="large" />
          </button>
        )}
      </div>
      {modalOpen && (
        <NoteCategoryModal
          characterId={characterId}
          noteCategory={category}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default NoteCategoryCard;
