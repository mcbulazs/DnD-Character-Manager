import { Route, Routes } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import CharacterList from "../pages/characters/CharacterList";
import CharacterSheet from "../pages/characters/CharacterSheet/CharacterSheet";
import Features from "../pages/characters/features/Features";
import CharacterNavList from "../pages/navigation/CharacterNavList";

const CharacterRoutes = () => {
	return (
		<Routes>
			<Route
				path=""
				element={
					<AuthGuard loggedInRequired={true}>
						<CharacterList />
					</AuthGuard>
				}
			/>
			<Route path=":characterId" element={<CharacterNavList />}>
				<Route
					path=""
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
			</Route>
		</Routes>
	);
};

export default CharacterRoutes;
