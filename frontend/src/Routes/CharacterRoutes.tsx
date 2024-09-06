import { Route, Routes, useParams } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import CharacterList from "../pages/characters/CharacterList";
import { CharacterProvider } from "../pages/characters/CharacterProvider";
import CharacterSheet from "../pages/characters/CharacterSheet/CharacterSheet";
import Features from "../pages/characters/features/Features";
import CharacterNavList from "../pages/navigation/CharacterNavList";

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
			<Route path=":characterId" element={<CharacterLayout />}>
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
