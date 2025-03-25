import { Route, Routes, Outlet, useParams } from "react-router-dom";
import DesktopLayout from "../layout/DesktopLayout";
import DiceThrowing from "../pages/dicethrowing/dicethrowing";
import AuthGuard from "../components/AuthGuard";
import Friends from "../pages/friendlist/Friends";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Logout from "../pages/auth/Logout";
import { CharacterProvider } from "../layout/Contexts/CharacterContext";
import CharacterNavList from "../pages/navigation/CharacterNavList";
import CharacterList from "../pages/characters/CharacterList";
import CharacterSheet from "../pages/characters/CharacterSheet/CharacterSheet";
import Features from "../pages/characters/features/Features";
import Spells from "../pages/characters/spells/Spells";
import NoteCategories from "../pages/characters/notes/NoteCategories";
import Notes from "../pages/characters/notes/Notes";
import UserProvider from "../layout/Contexts/UserContext";
import { TouchLockProvider } from "../layout/Contexts/TouchLockContext";

const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <UserProvider>
            <TouchLockProvider>
              <DesktopLayout />
            </TouchLockProvider>
          </UserProvider>
        }
      >
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route element={<AuthRequired />}>
          <Route path="logout" element={<Logout />} />
          <Route path="characters/*">
            <Route index element={<CharacterList />} />
            <Route path=":characterId" element={<CharacterRequired />}>
              <Route index element={<CharacterSheet />} />
              <Route path="features" element={<Features />} />
              <Route path="spells" element={<Spells />} />
              <Route path="notes">
                <Route index element={<NoteCategories />} />
                <Route path=":categoryId" element={<Notes />} />
              </Route>
            </Route>
          </Route>
          <Route path="friends" element={<Friends />} />
        </Route>
        <Route path="dicethrow" element={<DiceThrowing />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
};

const AuthRequired = () => {
  return (
    <AuthGuard loggedInRequired={true}>
      <Outlet />
    </AuthGuard>
  );
};
const CharacterRequired = () => {
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

export default Router;
