import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import type React from "react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
const CharacterNavList: React.FC = () => {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<>
			<nav
				className={`fixed right-0 top-24 pr-4 z-50 flex items-start mr-1 gap-3 transition-all duration-500 ${isOpen ? "translate-x-3/4" : "translate-x-0"}`}
			>
				<button
					type="button"
					className="
                    aspect-square bg-white
                    flex items-center justify-center 
                    rounded-full  p-1 pl-3"
					onClick={() => setIsOpen(!isOpen)}
				>
					{!isOpen ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
				</button>
				<ul className="flex flex-col gap-4 text-xl font-bold  text-forest-green bg-white p-2 rounded-xl">
					<li>
						<NavLink to={""}>
							<div className="w-24 ">Basic Info</div>
						</NavLink>
					</li>
					<li>
						<NavLink to={"features"}>
							<div className="w-24 ">Features</div>
						</NavLink>
					</li>
				</ul>
			</nav>

			{/* Main content */}
			<Outlet />
		</>
	);
};

export default CharacterNavList;
