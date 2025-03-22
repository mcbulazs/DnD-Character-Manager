import type React from "react";
import { useState } from "react";
import type { BackgroundImageProps } from "../../../../types/backgroundImageProps";
import CharacterImageModal from "./CharacterImageModal";

const CharacterImage: React.FC<{
  image: BackgroundImageProps;
  characterID: number;
  disabled?: boolean;
}> = ({ image, characterID, disabled = false }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    if (e.button !== 0 || disabled) {
      return;
    }
    setModalOpen(true);
  };

  return (
    <div className="w-full aspect-[3/4] place-self-end">
      <div
        className={`bg-center bg-cover w-full aspect-[3/4] border-4 border-black rounded-xl ${disabled ? "" : "cursor-pointer"}`}
        style={{
          backgroundImage: image.backgroundImage,
          backgroundPosition: image.backgroundPosition,
          backgroundSize: image.backgroundSize,
        }}
        onMouseDown={handleClick}
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
