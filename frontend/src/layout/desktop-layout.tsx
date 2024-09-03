import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { selectHeaderText } from "../store/utility/headerSlice";
import Menu from "./components/Sidebar";
import "react-perfect-scrollbar/dist/css/styles.css"; // Import the CSS for PerfectScrollbar

const DesktopLayout = () => {
	const headerText = useSelector(selectHeaderText);

	return (
		<PerfectScrollbar className="bg-parchment-beige h-dvh">
			<header className="bg-ancient-gold text-parchment-beige px-4 py-1 min-h-16 flex items-center justify-between text-3xl">
				<Menu />
				<div className="flex-1 text-center">{headerText}</div>
			</header>
			<main className="py-10 h-full px-0 sm:px-10 flex justify-center">
				<Outlet />
			</main>
		</PerfectScrollbar>
	);
};

export default DesktopLayout;
