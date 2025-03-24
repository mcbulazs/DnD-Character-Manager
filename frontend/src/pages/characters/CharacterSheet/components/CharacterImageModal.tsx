import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import ImageSizer from "../../../../components/ImageSizer";
import Modal from "../../../../components/Modal";
import { useModifyCharacterImageMutation } from "../../../../store/api/characterApiSlice";
import type { BackgroundImageProps } from "../../../../types/backgroundImageProps";

const CharacterImageModal: React.FC<{
  image: BackgroundImageProps;
  characterID: number;
  onClose: () => void;
}> = ({ image: _image, characterID, onClose }) => {
  //cutoff url()
  const [imageUrl, setImageUrl] = useState<string>(
    _image.backgroundImage.length > 5
      ? _image.backgroundImage.slice(4, -1)
      : "",
  );
  const [image, setImage] = useState<BackgroundImageProps>(_image);
  const [modifyCharacterBackgroundImageMutation] =
    useModifyCharacterImageMutation();

  const modifyBackgroundImage = () => {
    try {
      modifyCharacterBackgroundImageMutation({
        image,
        characterID,
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Error updating background image", error);
      toast("Error updating background image", { type: "error" });
    }
  };

  return (
    <Modal
      onClose={onClose}
      className="border-4 border-black "
      style={{
        maxWidth: "28rem",
      }}
    >
      <div className="h-full">
        <label className="block text-sm font-medium text-gray-700">
          Image URL:
        </label>
        <span className="text-xs text-gray-500">
          Might have to wait a few seconds for the image to load
        </span>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        {imageUrl !== "" && (
          <ImageSizer
            imageUrl={imageUrl}
            setOutputImage={setImage}
            className="my-4"
            backgroundPosition={
              _image.backgroundImage === ""
                ? undefined
                : _image.backgroundPosition
            }
            backgroundSize={
              _image.backgroundImage === "" ? undefined : _image.backgroundSize
            }
          />
        )}
        <button
          type="button"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={modifyBackgroundImage}
        >
          Save Image
        </button>
      </div>
    </Modal>
  );
};

export default CharacterImageModal;
