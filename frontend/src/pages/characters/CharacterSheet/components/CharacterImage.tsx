import type React from "react";
import { useState } from "react";
import type { BackgroundImageProps } from "../../../../types/backgroundImageProps";
import CharacterImageModal from "./CharacterImageModal";

const CharacterImage: React.FC<{
	image: BackgroundImageProps;
	characterID: number;
}> = ({ image, characterID }) => {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<div className="w-full aspect-[3/4] place-self-end">
			<div
				className="bg-center bg-cover w-full aspect-[3/4] border-4 border-black rounded-xl cursor-pointer"
				style={{
					backgroundImage: image.backgroundImage,
					backgroundPosition: image.backgroundPosition,
					backgroundSize: image.backgroundSize,
				}}
				onMouseDown={() => {
					setModalOpen(true);
				}}
			/>
			{modalOpen && (
				<CharacterImageModal
					image={image}
					characterID={characterID}
					onClose={() => {
                        setModalOpen(false);
					}}
				/>
			)}
		</div>
	);
};

export default CharacterImage;
