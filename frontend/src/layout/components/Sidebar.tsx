import { Info as InfoIcon, Menu as MenuIcon } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { NavLink } from "react-router-dom";
import { useIsAuthenticatedQuery } from "../../store/api/userApiSlice";
import { useUserContext } from "../Contexts/UserContext";
import { useTouchLockContext } from "../Contexts/TouchLockContext";

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [startX, setStartX] = useState(0);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { isLocked, acquireLock, releaseLock } = useTouchLockContext();

  const { data } = useIsAuthenticatedQuery();
  const isLoggedIn = data?.authenticated;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (open && !acquireLock("sidebar")) return;
      setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (sidebarRef.current) {
        const currentX = e.touches[0].clientX;
        if (!open && currentX - startX > 150) {
          if (isLocked("sidebar")) return;
          setOpen(true);
        } else if (open && startX - currentX > 150) {
          setOpen(false);
        }
      }
    };

    const handleTouchEnd = () => {
      releaseLock("sidebar");
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startX, open, isLocked, releaseLock, acquireLock]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }

      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.button !== 0) {
        return;
      }
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

  const FavoriteCharacters: React.FC = () => {
    const { User } = useUserContext();
    const characters = User?.characters;
    return (
      <>
        {characters &&
          characters.length > 0 &&
          characters
            .filter((character) => character.isFavorite)
            .map((character) => (
              <NavLink
                tabIndex={open ? 0 : -1}
                key={character.ID}
                to={`/characters/${character.ID}`}
                onClick={() => setOpen(!open)}
                className="p-4 hover:bg-gray-700 w-full flex gap-3"
              >
                <div
                  className="flex items-center gap-1 h-10 aspect-[3/4] rounded-lg"
                  style={{
                    backgroundImage: character.image?.backgroundImage,
                    backgroundPosition: character.image?.backgroundPosition,
                    backgroundSize: character.image?.backgroundSize,
                  }}
                />
                {character.name}
              </NavLink>
            ))}
      </>
    );
  };

  return (
    <>
      {/* Menu Button */}
      <button
        className="block fixed text-forest-green top-0 left-0 w-16 h-16 z-50"
        onClick={() => setOpen(!open)}
        type="button"
        title="Navigation Button"
        tabIndex={open ? -1 : 0}
      >
        <MenuIcon fontSize="large" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0
				bg-shadow-black text-ancient-gold h-full z-50 
				flex flex-col gap-1
				transition-transform duration-500
				w-full sm:w-80
				text-3xl sm:text-2xl 
				items-center sm:items-start
				min-h-dvh 
				${open ? "translate-x-0" : "-translate-x-full"}`}
        ref={sidebarRef}
      >
        <button
          className="text-forest-green min-h-16 w-16 self-start"
          onClick={() => setOpen(!open)}
          type="button"
          tabIndex={open ? 0 : -1}
        >
          <MenuIcon fontSize="large" />
        </button>

        {/* Scrollable Content Area */}
        <Scrollbars className="w-full" universal>
          <nav className="w-full flex flex-grow flex-col  ">
            <NavLink
              to="/"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(!open)}
              className="p-4 hover:bg-gray-700 w-full"
            >
              Home
            </NavLink>
            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/login"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(!open)}
                  className="p-4 hover:bg-gray-700 w-full"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  tabIndex={open ? 0 : -1}
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
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(!open)}
                  className="p-4 hover:bg-gray-700 w-full"
                >
                  Logout
                </NavLink>
                <div className="w-11/12 self-center border-b-2 border-dragon-blood" />
                <NavLink
                  to="/characters"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(!open)}
                  className="p-4 hover:bg-gray-700 w-full"
                >
                  Characters
                </NavLink>
                <FavoriteCharacters />
                <NavLink
                  to="friends"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(!open)}
                  className="p-4 hover:bg-gray-700 flex items-center gap-1 justify-self-end mt-0 w-full"
                >
                  Friends
                </NavLink>
              </>
            )}
            {/*<div className="w-11/12 self-center border-y-2 border-dragon-blood grow" />*/}
            <NavLink
              to="dicethrow"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(!open)}
              className="p-4 hover:bg-gray-700 flex items-center gap-1 justify-self-end mt-0 w-full"
            >
              Dice Throw
            </NavLink>
            <NavLink
              to=""
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(!open)}
              className="p-4 hover:bg-gray-700 flex items-center gap-1 justify-self-end mt-0 w-full"
            >
              <InfoIcon fontSize="small" />
              About
            </NavLink>
          </nav>
        </Scrollbars>

        {/* Footer or Non-Scrollable Content */}
      </div>
    </>
  );
};

export default Menu;
