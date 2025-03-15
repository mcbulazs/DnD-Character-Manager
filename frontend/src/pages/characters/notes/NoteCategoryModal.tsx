import { useState } from "react";
import Modal from "../../../components/Modal";
import {
  useCreateNoteCategoryMutation,
  useDeleteNoteCategoryMutation,
  useModifyNoteCategoryMutation,
} from "../../../store/api/characterApiSlice";
import type { NoteCategory } from "../../../types/note";
import DeleteDialog from "../../../components/DeleteDialog";

const NoteCategoryModal: React.FC<{
  characterId: number;
  noteCategory?: NoteCategory;
  onClose: () => void;
}> = ({ characterId, noteCategory, onClose }) => {
  const [name, setName] = useState(noteCategory?.name ?? "");
  const [desc, setDesc] = useState(noteCategory?.description ?? "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createNoteCategoryMutation] = useCreateNoteCategoryMutation();
  const [modifyNoteCategoryMutation] = useModifyNoteCategoryMutation();
  const [deleteNoteCategoryMutation] = useDeleteNoteCategoryMutation();
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
  const deleteNoteCategory = () => {
    if (noteCategory) {
      deleteNoteCategoryMutation({ id: noteCategory.id, characterId });
    }
    onClose();
  };

  return (
    <>
      <Modal
        onClose={onClose}
        className="max-w-3/5 lg:w-3/5 fixed top-0 left-0"
      >
        <div className="h-full pt-4 ">
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
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
          <div className="w-full flex justify-between">
            {noteCategory && (
              <button
                type="button"
                className="p-2 bg-red-500 text-white rounded-lg mt-4 w-2/5 "
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </button>
            )}
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
      {deleteDialogOpen && (
        <DeleteDialog
          onCancel={() => setDeleteDialogOpen(false)}
          onConfirm={deleteNoteCategory}
          message={`Are you sure you want to delete category: ${noteCategory?.name} has ${noteCategory?.notes.length} pages of note?`}
        />
      )}
    </>
  );
};

export default NoteCategoryModal;
