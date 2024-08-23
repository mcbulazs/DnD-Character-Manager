import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DesktopLayout from "./layout/Desktop-layout";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AuthGuard from "./components/AuthGuard";
import Register from "./pages/auth/Register";
import CharacterList from "./pages/characters/CharacterList";
import CharacterSheet from "./pages/characters/CharacterSheet/CharacterSheet";

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<DesktopLayout />}>
					<Route
						path="register"
						element={
							<AuthGuard loggedInRequired={false}>
								<Register />
							</AuthGuard>
						}
					/>
					<Route
						path="login"
						element={
							<AuthGuard loggedInRequired={false}>
								<Login />
							</AuthGuard>
						}
					/>

					<Route
						path="logout"
						element={
							<AuthGuard loggedInRequired={true}>
								<Logout />
							</AuthGuard>
						}
					/>
					<Route
						path="characters"
						element={
							<AuthGuard loggedInRequired={true}>
								<CharacterList />
							</AuthGuard>
						}
					/>
					<Route
						path="characters/:characterId"
						element={
							<AuthGuard loggedInRequired={true}>
								<CharacterSheet />
							</AuthGuard>
						}
					/>

					<Route path="*" element={<div>404 Not Found</div>} />
				</Route>
			</Routes>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</BrowserRouter>
	);
}

export default App;
