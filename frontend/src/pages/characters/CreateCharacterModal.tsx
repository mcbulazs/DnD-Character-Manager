import CloseIcon from "@mui/icons-material/Close";
import { type FormEvent, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import ImageSizer from "../../components/ImageSizer";
import { useCreateCharacterMutation } from "../../store/api/characterApiSlice";
import type { BackgroundImageProps } from "../../types/backgroundImageProps";
import "react-perfect-scrollbar/dist/css/styles.css"; // Import the CSS for PerfectScrollbar

const CreateCharacterModal: React.FC<{
	onClose: () => void;
}> = ({ onClose }) => {
	const [name, setName] = useState("");
	const [className, setClassName] = useState("");
	const [image, setImage] = useState<BackgroundImageProps>({
		backgroundSize: "cover",
		backgroundPosition: "top",
		backgroundImage: "",
	});
	const [imageUrl, setImageUrl] = useState("");
	const [createCharacterMutation] = useCreateCharacterMutation();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		createCharacterMutation({ name, class: className, image });
		onClose();
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-3 rounded-lg shadow-lg w-full max-w-md relative overflow-hidden flex flex-col max-h-[90vh]">
				<button
					className="absolute top-1 right-1 text-gray-500 hover:text-gray-800"
					type="button"
					onClick={onClose}
				>
					<CloseIcon />
				</button>
				<PerfectScrollbar className="h-full p-3 mt-4">
					<form onSubmit={handleSubmit} className="overflow-hidden">
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
				</PerfectScrollbar>
			</div>
		</div>
	);
};

export default CreateCharacterModal;
