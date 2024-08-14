import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from '@mui/icons-material/Info';
import { NavLink } from "react-router-dom";
import Divider from '@mui/material/Divider';

const Menu = () => {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* menu button */}
			<button
				className="block fixed text-forest-green top-0 left-0 w-16 h-16"
				onClick={() => setOpen(!open)}
			>
				<MenuIcon fontSize="large" />
			</button>
			{/* sidebar */}
			<nav
				className={`fixed left-0 top-0
					bg-shadow-black text-ancient-gold h-full z-50 
					flex flex-col gap-1
                    transition-transform duration-500
					w-full sm:w-64
					text-3xl sm:text-2xl 
					items-center sm:items-start
                    ${open ? "translate-x-0" : "-translate-x-full"}`}
			>
					<button
						className="text-forest-green h-16 w-16 self-start"
						onClick={() => setOpen(!open)}
					>
						<MenuIcon fontSize="large" />
					</button>
					<NavLink
						to=""
						onClick={() => setOpen(!open)}
						className="p-4 hover:bg-gray-700 w-full"
					>
						Home
					</NavLink>
					<div className="flex-grow w-11/12 self-center border-y-2 border-dragon-blood"></div>
					<NavLink
						to=""
						onClick={() => setOpen(!open)}
						className="p-4 hover:bg-gray-700 flex items-center gap-1 justify-self-end mt-0 w-full"
					>
						<InfoIcon fontSize="small" />
						About
					</NavLink>
			</nav>
			{/* overlay */}
			{open && (
				<div
					className="fixed inset-0 bg-black opacity-20"
					onClick={() => setOpen(!open)}
				></div>
			)}
		</>
	);
};

export default Menu;
