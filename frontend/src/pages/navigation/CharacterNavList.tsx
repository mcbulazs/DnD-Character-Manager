import {
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from "@mui/icons-material";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2";
import Trackers from "../characters/trackers/Trackers";

// FIX: dont active the menu when closing this
const CharacterNavList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [startX, setStartX] = useState(0);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (sidebarRef.current) {
        const currentX = e.touches[0].clientX;
        if (!isOpen && currentX - startX > 150) {
          setIsOpen(true);
        } else if (isOpen && startX - currentX > 150) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [startX, isOpen]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }

      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className={`
        fixed right-2 top-24 z-[51]
        aspect-square bg-white
        flex items-center justify-center 
        transition-transform duration-500
        ${isOpen ? "-translate-x-80" : "translate-x-0"}
        rounded-full  p-1 pl-3`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
      </button>
      <div
        className={`
            min-h-dwh h-full
            fixed right-0 top-0 
            bg-shadow-black 
            flex flex-col items-center
            w-full sm:w-80
            transition-transform duration-500
            ${isOpen ? "-translate-x-0" : "translate-x-full"}
            z-50`}
        ref={sidebarRef}
      >
        <Scrollbars className="w-full h-full pb-16 relative" universal>
          <nav className="w-full">
            <ul className="w-full h-full text-2xl text-ancient-gold p-6">
              <li>
                <NavLink to={""}>Basic Info</NavLink>
              </li>
              <li>
                <NavLink to={"features"}>Features</NavLink>
              </li>
              <li className="min-h-dwh h-full">
                <NavLink to={"spells"}>Spells</NavLink>
              </li>
              <li>
                <NavLink to={"notes"}>Notes</NavLink>
              </li>
            </ul>
          </nav>
          <Trackers />
        </Scrollbars>
      </div>

      {/* Main content */}
      <Outlet />
    </>
  );
};

export default CharacterNavList;
