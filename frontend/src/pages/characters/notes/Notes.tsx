import DelteIcon from "@mui/icons-material/Delete";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { useHeaderContext } from "../../../layout/Contexts/HeaderContext";

const TextEditor = lazy(() => import("../../../components/CKEditor/CKEditor"));

// WARNING: Be aware of the hook nightmare
const Notes: React.FC = () => {
  const { categoryId } = useParams();
  const { characterId } = useParams();
  const { character, isLoading, error } = useCharacterContext();
  const { setTitle } = useHeaderContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const pageNumber = useRef(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createNoteMutation] = useCreateNoteMutation();
  const [modifyNoteMutation] = useModifyNoteMutation();
  const [deleteNoteMutation] = useDeleteNoteMutation();
  const isUserEditing = useRef(false);
  useEffect(() => {
    pageNumber.current = currentPageNumber;
  }, [currentPageNumber]);
  useEffect(() => {
    if (character && categoryId) {
      const category = character.noteCategories.find(
        (category) => category.id === Number.parseInt(categoryId),
      );
      const sortedNotes = category?.notes
        ? [...category.notes].sort((a, b) => a.id - b.id)
        : [];

      setTitle(<h1>{category?.name}</h1>);

      setNotes(sortedNotes);
    }
  }, [character, categoryId, setTitle]);

  useEffect(() => {
    // Reset the user change flag after the initial render
    isUserEditing.current = true;
  }, []);

  const updateNoteDebounce = useCallback(
    debounce((val: string, id: number) => {
      if (!categoryId || !characterId) {
        return;
      }
      modifyNoteMutation({
        categoryId: Number.parseInt(categoryId),
        characterId: Number.parseInt(characterId),
        note: {
          id,
          note: val,
        },
      });
    }, 300),
    [],
  );

  const handleCreateNote = () => {
    if (!categoryId || !characterId) {
      return;
    }
    createNoteMutation({
      categoryId: Number.parseInt(categoryId),
      characterId: Number.parseInt(characterId),
    });
  };
  const handleDeleteNote = () => {
    if (!categoryId || !character) {
      return;
    }
    deleteNoteMutation({
      categoryId: Number.parseInt(categoryId),
      characterId: character.ID,
      noteId: notes[currentPageNumber].id,
    });
  };
  const handleEditorChange = (val: string) => {
    if (!character || !character.isOwner) return;
    // Only update if the change is initiated by the user
    if (isUserEditing.current) {
      updateNoteDebounce(val, notes[pageNumber.current].id);
    }
    setNotes((prev) => {
      return prev.map((note, index) => {
        if (index === pageNumber.current) {
          return { ...note, note: val };
        }
        return note;
      });
    });
  };

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
              isUserEditing.current = false;
              setCurrentPageNumber(val);
              // biome-ignore lint/suspicious/noAssignInExpressions: need it to run next cycle
              setTimeout(() => (isUserEditing.current = true), 1);
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
                value={notes[currentPageNumber].note}
                disabled={!character.isOwner}
                onChange={(val) => {
                  handleEditorChange(val);
                }}
              />
            </Suspense>
            {character.isOwner && (
              <button
                type="button"
                className="absolute top-0 right-0 text-red-500"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <DelteIcon />
              </button>
            )}
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
