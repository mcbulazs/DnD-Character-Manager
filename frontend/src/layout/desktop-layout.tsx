import { Scrollbars } from "react-custom-scrollbars-2";
import { Outlet } from "react-router-dom";
import { useHeaderContext } from "./Contexts/HeaderContext";
import Menu from "./components/Sidebar";

const DesktopLayout = () => {
	const { title } = useHeaderContext();

	return (
		<div className="h-dvh">
			<Scrollbars className="bg-parchment-beige">
				<header className="bg-ancient-gold text-parchment-beige px-4 py-1 h-16 flex items-center justify-between text-3xl">
					<Menu />
					<div className="flex-1 text-center">{title}</div>
				</header>
				<main className="py-10 px-0 sm:px-10 flex justify-center">
					<Outlet />
				</main>
			</Scrollbars>
		</div>
	);
};

export default DesktopLayout;
