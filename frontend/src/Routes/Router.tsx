import { Route, Routes } from "react-router-dom";
import { CharactersProvider } from "../layout/Contexts/CharactersContext";
import DesktopLayout from "../layout/DesktopLayout";
import AuthRoutes from "./AuthRoutes";
import CharactersRoutes from "./CharacterRoutes";
import DiceThrowing from "../pages/dicethrowing/dicethrowing";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<CharactersLayout />}>
        <Route path="/*" element={<AuthRoutes />} />
        <Route path="characters/*" element={<CharactersRoutes />} />
        <Route path="dicethrow" element={<DiceThrowing />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
};

const CharactersLayout = () => {
  return (
    <CharactersProvider>
      <DesktopLayout />
    </CharactersProvider>
  );
};

export default Router;
