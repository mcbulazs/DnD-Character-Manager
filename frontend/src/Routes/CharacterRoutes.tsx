import { Route, Routes, useParams } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import { CharacterProvider } from "../layout/Contexts/CharacterContext";
import CharacterList from "../pages/characters/CharacterList";
import CharacterSheet from "../pages/characters/CharacterSheet/CharacterSheet";
import Features from "../pages/characters/features/Features";
import Spells from "../pages/characters/spells/Spells";
import CharacterNavList from "../pages/navigation/CharacterNavList";
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
        <Route
          index
          element={
            <AuthGuard loggedInRequired={true}>
              <CharacterSheet />
            </AuthGuard>
          }
        />
        <Route
          path="features"
          element={
            <AuthGuard loggedInRequired={true}>
              <Features />
            </AuthGuard>
          }
        />
        <Route
          path="spells"
          element={
            <AuthGuard loggedInRequired={true}>
              <Spells />
            </AuthGuard>
          }
        />
        <Route
          path="notes"
          element={
            <AuthGuard loggedInRequired={true}>
              <Notes />
            </AuthGuard>
          }
        />
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
