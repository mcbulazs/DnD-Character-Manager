import { on } from "events";
import Modal from "../../../components/Modal";
import {
  useCreateNoteCategoryMutation,
  useModifyNoteCategoryMutation,
} from "../../../store/api/characterApiSlice";
import type { NoteCategory } from "../../../types/note";
import { useState } from "react";

const NoteCategoryModal: React.FC<{
  characterId: number;
  noteCategory?: NoteCategory;
  onClose: () => void;
}> = ({ characterId, noteCategory, onClose }) => {
  const [name, setName] = useState(noteCategory?.name ?? "");
  const [desc, setDesc] = useState(noteCategory?.description ?? "");
  const [createNoteCategoryMutation] = useCreateNoteCategoryMutation();
  const [modifyNoteCategoryMutation] = useModifyNoteCategoryMutation();
  const updateNoteCategory = () => {
    if (noteCategory) {
      const category = {
        id: noteCategory.id,
        name,
        description: desc,
        notes: [],
      };
      modifyNoteCategoryMutation({ noteCategory: category, characterId });
    }
    onClose();
  };
  const createNoteCategory = () => {
    const noteCategory = {
      name,
      description: desc,
    };
    createNoteCategoryMutation({ noteCategory, characterId });
    onClose();
  };
  return (
    <Modal onClose={onClose} className="max-w-3/5 lg:w-3/5 fixed top-0 left-0">
      <div className="h-full pt-4 ">
        <label className="block text-sm font-medium text-gray-700">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        <label className="block text-sm font-medium text-gray-700">
          Description:
        </label>
        <textarea
          value={desc}
          className="w-full h-96 resize-none rounded-md p-2"
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="w-full flex justify-end">
          <button
            type="button"
            className="p-2 bg-green-500 text-white rounded-lg mt-4 w-2/5 "
            onClick={noteCategory ? updateNoteCategory : createNoteCategory}
          >
            {noteCategory ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NoteCategoryModal;
