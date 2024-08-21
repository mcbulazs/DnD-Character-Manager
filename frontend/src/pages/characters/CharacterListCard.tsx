import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CharacterListCardProps {
    img?: string;
    name?: string;
    class?: string;
    subClass?: string;
    id?: number;
    isFavorite?: boolean;
}

const CharacterListCard: React.FC<CharacterListCardProps> = ({
    img = "/assets/human.png",
    name = "Unknown Name",
    class: characterClass = "Unknown Class",
    subClass = "Unknown Subclass",
    id = 0,
    isFavorite = false,
}) => {
    const navigate = useNavigate();
    const [favorite, setFavorite] = useState(isFavorite);
    const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 767px)").matches);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.matchMedia("(max-width: 767px)").matches);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorite(!favorite);
    };

    return (
        <div
            className="group flex flex-col justify-center items-center
            w-5/12 sm:w-5/12 md:w-1/4 xl:w-1/6
            h-fit p-0 bg-white rounded-lg shadow-md relative select-none
            cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => navigate(`/characters/${id}`)}
        >
            <img className="w-full aspect-[3/4] rounded-t-lg" src={img} alt={name} />
            <div className="w-full flex flex-col items-center justify-center p-2 gap-2">
                <h2 className="text-lg font-semibold text-center">{name}</h2>
                <span className="text-sm font-semibold text-center">
                    {subClass} {characterClass}
                </span>
            </div>
            <div className={`absolute right-0 top-0 m-2 z-2 ${isMobile ? '' : 'group-hover:block hidden'}`}>
                {favorite ? (
                    <svg
                        className="w-10 h-10 text-yellow-500 transition-transform duration-300 ease-in-out"
                        fill="currentColor"
                        stroke="black"
                        strokeWidth="1.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        onClick={handleFavorite}
                    >
                        <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z" />
                    </svg>
                ) : (
                    <svg
                        className={`w-10 h-10 ${isMobile ? 'text-black' : 'text-black opacity-0 group-hover:opacity-100'} transition-opacity duration-300 ease-in-out transform scale-95 ${!isMobile ? 'group-hover:scale-105' : ''}`}
                        fill="none"
                        stroke="black"
                        strokeWidth="1.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        onClick={handleFavorite}
                    >
                        <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z" />
                    </svg>
                )}
            </div>
        </div>
    );
};

export default CharacterListCard;
