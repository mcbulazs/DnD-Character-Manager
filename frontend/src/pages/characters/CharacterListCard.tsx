import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetCharacterFavoriteMutation } from "../../store/api/characterApiSlice";
import type CharacterCard from "../../types/characterCard";

const CharacterListCard: React.FC<{ character: CharacterCard }> = ({
	character,
}) => {
	const navigate = useNavigate();
	const [favorite, setFavorite] = useState(character.is_favorite);
	const [isMobile, setIsMobile] = useState(
		window.matchMedia("(max-width: 767px)").matches,
	);
	const [setCharacterFavorite] = useSetCharacterFavoriteMutation();

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.matchMedia("(max-width: 767px)").matches);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleFavorite = async (_e: React.MouseEvent) => {
		await setCharacterFavorite({ id: character.ID });
		setFavorite(!favorite);
	};

	const handleCardClick = (e: React.MouseEvent) => {
		// If the target is not the favorite icon, navigate to the character's page
		if ((e.target as HTMLElement).closest(".favorite-icon") === null) {
			navigate(`/characters/${character.ID}`);
		}
	};

	return (
		<div
			className="group flex flex-col justify-center items-center
            w-5/12 sm:w-5/12 md:w-1/4 lg:w-1/6
            h-fit p-0 bg-white rounded-lg shadow-md relative select-none
            cursor-pointer hover:shadow-lg transition-shadow duration-300"
			onMouseDown={handleCardClick}
		>
			<div
				className="w-full aspect-[3/4] rounded-t-lg"
				style={{
					backgroundImage: character.image?.background_image,
					backgroundSize: character.image?.background_size,
					backgroundPosition: character.image?.background_position,
				}}
			/>
			<div className="w-full flex flex-col items-center justify-center p-2 gap-2">
				<h2 className="text-lg font-semibold text-center">{character.name}</h2>
				<span className="text-sm font-semibold text-center">
					{character.class}
				</span>
			</div>
			<div className="absolute right-0 top-0 m-2 z-2 favorite-icon">
				{favorite ? (
					<svg
						className="w-10 h-10 text-yellow-500 transition-transform duration-300 ease-in-out"
						fill="currentColor"
						stroke="black"
						strokeWidth="1.5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						onMouseDown={handleFavorite}
					>
						<title>Favorite</title>
						<path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z" />
					</svg>
				) : (
					<svg
						className={`w-10 h-10 ${isMobile ? "text-black" : "text-black opacity-0 group-hover:opacity-100"} transition-opacity duration-300 ease-in-out transform scale-95 ${!isMobile ? "group-hover:scale-105" : ""}`}
						fill="none"
						stroke="black"
						strokeWidth="1.5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						onMouseDown={handleFavorite}
					>
						<title>Favorite</title>
						<path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z" />
					</svg>
				)}
			</div>
		</div>
	);
};

export default CharacterListCard;
