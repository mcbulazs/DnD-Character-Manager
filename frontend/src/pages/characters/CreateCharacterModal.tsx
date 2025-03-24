import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImageSizer from "../../components/ImageSizer";
import Modal from "../../components/Modal";
import { useCreateCharacterMutation } from "../../store/api/characterApiSlice";
import type { BackgroundImageProps } from "../../types/backgroundImageProps";

const CreateCharacterModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [image, setImage] = useState<BackgroundImageProps>({
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [createCharacterMutation] = useCreateCharacterMutation();
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (name.trim().length < 1) {
        toast("Name is required", { type: "warning" });
        return;
      }
      if (className.trim().length < 1) {
        toast("Class is required", { type: "warning" });
        return;
      }
      const data = await createCharacterMutation({
        name,
        class: className,
        image,
      }).unwrap();
      navigate(`/characters/${data.ID}`);
      toast("Character created", { type: "success" });
    } catch (error) {
      console.error("Error creating character", error);
      toast("Error creating character", { type: "error" });
    }
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      style={{
        maxWidth: "28rem",
      }}
    >
      <form onSubmit={handleSubmit} className="w-full h-fit">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Class:
          </label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>
        <div className="mb-4">
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
        </div>
        {imageUrl !== "" && (
          <ImageSizer
            imageUrl={imageUrl}
            setOutputImage={setImage}
            className="mb-4"
          />
        )}
        <div className="flex justify-between items-center px-5">
          <span className="text-sm text-gray-500">
            You can change everything later
          </span>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCharacterModal;
