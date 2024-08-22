import CloseIcon from "@mui/icons-material/Close";
import { type FormEvent, useState } from "react";
import Draggable from "react-draggable";
import ImageSizer from "../../components/ImageSizer";

const CreateCharacterModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
}> = ({ isOpen, onClose }) => {
	const [name, setName] = useState("");
	const [className, setClassName] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
				<button
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
					type="button"
					onClick={onClose}
				>
					<CloseIcon />
				</button>
				<form onSubmit={handleSubmit}>
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
						<input
							type="url"
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
							required
						/>
					</div>
					{imageUrl !== "" && (
						<ImageSizer imageUrl={imageUrl} />
					)}
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded-lg"
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateCharacterModal;
