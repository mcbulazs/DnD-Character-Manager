import { lazy, Suspense, useEffect, useState } from "react";
import Pager from "../../../components/Pager";
import { useCharacterContext } from "../../../layout/Contexts/CharacterContext";
import { useParams } from "react-router-dom";
import type { Note } from "../../../types/note";

const TextEditor = lazy(() => import("../../../components/CKEditor/CKEditor"));

const Notes: React.FC = () => {
  const { categoryId } = useParams();
  const { character, isLoading, error } = useCharacterContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentText, SetCurrentText] = useState<string>("");
  const [currentNoteId, setCurrentNoteId] = useState(0);
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
  if (isLoading) {
    return <div>Loading ... </div>;
  }
  if (error || !character || !notes) {
    return <div>Error loading notes</div>;
  }
  return (
    <div className="w-full h-full">
      <Suspense fallback={<div>Loading editor...</div>}>
        <TextEditor
          value={currentText}
          onChange={(val) => SetCurrentText(val)}
        />
      </Suspense>
      {/*pager*/}
      <div className="flex justify-center">
        <Pager
          count={notes?.length}
          onPageChange={(val) => {
            SetCurrentText(notes[val].note);
            setCurrentNoteId(notes[val].id);
          }}
        />
      </div>
    </div>
  );
};

export default Notes;
