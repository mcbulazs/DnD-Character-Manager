import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { selectIsLoggedIn } from "../../store/utility/authSlice";

const Menu = () => {
	const [open, setOpen] = useState(false);
	const [startX, setStartX] = useState(0);
	const sidebarRef = useRef<HTMLDivElement | null>(null);

	const isLoggedIn = useSelector(selectIsLoggedIn);

	useEffect(() => {
		const handleTouchStart = (e: TouchEvent) => {
			setStartX(e.touches[0].clientX);
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (sidebarRef.current) {
				const currentX = e.touches[0].clientX;
				if (!open && currentX - startX > 150) {
					setOpen(true);
				} else if (open && startX - currentX > 150) {
					setOpen(false);
				}
			}
		};

		window.addEventListener("touchstart", handleTouchStart);
		window.addEventListener("touchmove", handleTouchMove);

		return () => {
			window.removeEventListener("touchstart", handleTouchStart);
			window.removeEventListener("touchmove", handleTouchMove);
		};
	}, [startX, open]);

	useEffect(() => {
		const isMobile = window.matchMedia("(max-width: 767px)").matches;

		if (isMobile) {
			if (open) {
				document.body.style.overflow = "hidden";
			} else {
				document.body.style.overflow = "auto";
			}

			// Clean up overflow style on component unmount or when `open` changes
			return () => {
				document.body.style.overflow = "auto";
			};
		}
	}, [open]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<>
			{/* Menu Button */}
			<button
				className="block fixed text-forest-green top-0 left-0 w-16 h-16"
				onClick={() => setOpen(!open)}
				type="button"
			>
				<MenuIcon fontSize="large" />
			</button>
			{/* Sidebar */}
			<nav
				ref={sidebarRef}
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
					type="button"
				>
					<MenuIcon fontSize="large" />
				</button>
				<NavLink
					to="/"
					onClick={() => setOpen(!open)}
					className="p-4 hover:bg-gray-700 w-full"
				>
					Home
				</NavLink>
				{!isLoggedIn ? (
					<>
						<NavLink
							to="/login"
							onClick={() => setOpen(!open)}
							className="p-4 hover:bg-gray-700 w-full"
						>
							Login
						</NavLink>
						<NavLink
							to="/register"
							onClick={() => setOpen(!open)}
							className="p-4 hover:bg-gray-700 w-full"
						>
							Register
						</NavLink>
					</>
				) : (
					<>
						<NavLink
							to="/logout"
							onClick={() => setOpen(!open)}
							className="p-4 hover:bg-gray-700 w-full"
						>
							Logout
						</NavLink>
						<div className="w-11/12 self-center border-b-2 border-dragon-blood" />
						<NavLink
							to="/characters"
							onClick={() => setOpen(!open)}
							className="p-4 hover:bg-gray-700 w-full"
						>
							Characters
						</NavLink>
					</>
				)}
				<div className="flex-grow w-11/12 self-center border-y-2 border-dragon-blood" />
				<NavLink
					to=""
					onClick={() => setOpen(!open)}
					className="p-4 hover:bg-gray-700 flex items-center gap-1 justify-self-end mt-0 w-full"
				>
					<InfoIcon fontSize="small" />
					About
				</NavLink>
			</nav>
		</>
	);
};

export default Menu;
