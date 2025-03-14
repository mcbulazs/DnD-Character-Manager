import { Route, Routes, useParams } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { CharacterProvider } from "../layout/Contexts/CharacterContext";
import CharacterList from "../pages/characters/CharacterList";
import CharacterSheet from "../pages/characters/CharacterSheet/CharacterSheet";
import Features from "../pages/characters/features/Features";
import Spells from "../pages/characters/spells/Spells";
import CharacterNavList from "../pages/navigation/CharacterNavList";
import NoteCategories from "../pages/characters/notes/NoteCategories";
import Notes from "../pages/characters/notes/Notes";

const CharactersRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <AuthGuard loggedInRequired={true}>
            <CharacterList />
          </AuthGuard>
        }
      />
      <Route
        path=":characterId"
        element={
          <AuthGuard loggedInRequired={true}>
            <CharacterLayout />
          </AuthGuard>
        }
      >
        <Route index element={<CharacterSheet />} />
        <Route path="features" element={<Features />} />
        <Route path="spells" element={<Spells />} />
        <Route path="notes">
          <Route index element={<NoteCategories />} />
          <Route path=":noteId" element={<Notes />} />
        </Route>
      </Route>
    </Routes>
  );
};

const CharacterLayout = () => {
  const { characterId } = useParams();
  if (!characterId || Number.isNaN(Number.parseInt(characterId))) {
    return <div>Invalid character ID</div>;
  }
  return (
    <CharacterProvider characterId={Number.parseInt(characterId)}>
      <CharacterNavList />
    </CharacterProvider>
  );
};

export default CharactersRoutes;
