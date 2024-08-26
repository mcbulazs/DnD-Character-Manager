import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { selectHeaderText } from "../store/utility/headerSlice";
import Menu from "./components/Sidebar";
import "react-perfect-scrollbar/dist/css/styles.css"; // Import the CSS for PerfectScrollbar

const DesktopLayout = () => {
	const headerText = useSelector(selectHeaderText);

	return (
		<div className="flex flex-col h-screen overflow-hidden">
			<header className="bg-ancient-gold text-parchment-beige px-4 py-1 min-h-16 flex items-center justify-between text-3xl">
				<Menu />
				<div className="flex-1 text-center">{headerText}</div>
			</header>
			<PerfectScrollbar className="flex-1 bg-parchment-beige">
				<main className="py-10 px-0 sm:px-10 flex justify-center">
					<Outlet />
				</main>
			</PerfectScrollbar>
			<footer className="bg-ancient-gold text-parchment-beige p-4 min-h-16">
				Footer
			</footer>
		</div>
	);
};

export default DesktopLayout;
