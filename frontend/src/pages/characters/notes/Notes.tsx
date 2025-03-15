import DelteIcon from "@mui/icons-material/Delete";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteDialog from "../../../components/DeleteDialog";
import Pager from "../../../components/Pager";
import { useCharacterContext } from "../../../layout/Contexts/CharacterContext";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useModifyNoteMutation,
} from "../../../store/api/characterApiSlice";
import type { Note } from "../../../types/note";
import debounce from "../../../utility/debounce";

const TextEditor = lazy(() => import("../../../components/CKEditor/CKEditor"));

const Notes: React.FC = () => {
  const { categoryId } = useParams();
  const { character, isLoading, error } = useCharacterContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentText, SetCurrentText] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(0);
  const [createNoteMutation] = useCreateNoteMutation();
  const [modifyNoteMutation] = useModifyNoteMutation();
  const [deleteNoteMutation] = useDeleteNoteMutation();
  useEffect(() => {
    if (character && categoryId) {
      setNotes(
        character.noteCategories.filter(
          (category) => category.id === Number.parseInt(categoryId),
        )[0].notes,
      );
    }
  }, [character, categoryId]);
  useEffect(() => {
    setCurrentNoteId(notes[0]?.id);
    SetCurrentText(notes[0]?.note);
  }, [notes]);
  const handleCreateNote = () => {
    if (!categoryId || !character) {
      return;
    }
    createNoteMutation({
      categoryId: Number.parseInt(categoryId),
      characterId: character.ID,
    });
  };
  const handleDeleteNote = () => {
    if (!categoryId || !character) {
      return;
    }
    deleteNoteMutation({
      categoryId: Number.parseInt(categoryId),
      characterId: character.ID,
      noteId: currentNoteId,
    });
  };
  const updateNoteDebounce = useCallback(
    debounce((val: string) => {
      if (!categoryId || !character) {
        return;
      }
      modifyNoteMutation({
        categoryId: Number.parseInt(categoryId),
        characterId: character.ID,
        note: {
          id: currentNoteId,
          note: val,
        },
      });
    }, 300),
    [],
  );
  if (isLoading) {
    return <div>Loading ... </div>;
  }
  if (error || !character || !notes) {
    return <div>Error loading notes</div>;
  }
  return (
    <>
      <div className="w-4/5 h-full">
        <div className="flex items-center flex-col mb-4">
          <Pager
            count={notes?.length}
            onPageChange={(val) => {
              SetCurrentText(notes[val].note);
              setCurrentNoteId(notes[val].id);
            }}
          />
          <button
            className={`bg-green-500 hover:bg-green-700 text-white font-bold shadow-md shadow-green-900
                                w-32 h-8
                                rounded-full p-1 z-10 
                                transition-all duration-300 ease-in-out overflow-hidden`}
            type="button"
            onClick={handleCreateNote}
          >
            Add Note
          </button>
        </div>
        {notes.length !== 0 && (
          <div className="relative">
            <Suspense fallback={<div> Loading editor...</div>}>
              <TextEditor
                value={currentText}
                onChange={(val) => {
                  updateNoteDebounce(val);
                  SetCurrentText(val);
                }}
              />
            </Suspense>
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <DelteIcon />
            </button>
          </div>
        )}
      </div>
      {deleteDialogOpen && (
        <DeleteDialog
          message={"Are you sure you want to delete this page of note"}
          onConfirm={() => {
            handleDeleteNote();
            setDeleteDialogOpen(false);
          }}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      )}
    </>
  );
};

export default Notes;
