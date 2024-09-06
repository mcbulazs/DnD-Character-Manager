import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DesktopLayout from "./layout/Desktop-layout";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Router from "./Routes/Router";
import AuthGuard from "./components/AuthGuard";
import HeaderProvider from "./layout/components/HeaderProvider";
import Register from "./pages/auth/Register";
import CharacterList from "./pages/characters/CharacterList";
import CharacterSheet from "./pages/characters/CharacterSheet/CharacterSheet";
import Features from "./pages/characters/features/Features";
import CharacterNavList from "./pages/navigation/CharacterNavList";

function App() {
	return (
		<HeaderProvider>
			<Router />
		</HeaderProvider>
	);
}

export default App;
