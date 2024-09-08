import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CharactersProvider } from "../layout/Contexts/CharactersContext";
import DesktopLayout from "../layout/Desktop-layout";
import AuthRoutes from "./AuthRoutes";
import CharactersRoutes from "./CharacterRoutes";

const Router = () => {
	return (
		<Routes>
			<Route path="/" element={<CharactersLayout />}>
				<Route path="/*" element={<AuthRoutes />} />
				<Route path="characters/*" element={<CharactersRoutes />} />
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
