import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DesktopLayout from '../layout/Desktop-layout';
import AuthRoutes from './AuthRoutes';
import CharactersRoutes from './CharacterRoutes';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DesktopLayout />}>
          <Route path="/*" element={<AuthRoutes />} />
          <Route path="characters/*" element={<CharactersRoutes />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
