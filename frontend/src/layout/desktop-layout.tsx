import { Outlet } from "react-router-dom";
import Menu from "./components/Sidebar";

const DesktopLayout = () => {
	return (
		<div className="flex flex-col h-screen">
			<header className="bg-ancient-gold text-parchment-beige px-4 py-1 h-16">
				<Menu />
			</header>
			<main className="flex-1 bg-parchment-beige">
				<Outlet />
			</main>
			<footer className="bg-ancient-gold text-parchment-beige p-4">Footer</footer>
		</div>
	);
};

export default DesktopLayout;
