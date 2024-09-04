import CloseIcon from "@mui/icons-material/Close";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { toast } from "react-toastify";
import ImageSizer from "../../../../components/ImageSizer";
import { useModifyCharacterImageMutation } from "../../../../store/api/characterApiSlice";
import type { BackgroundImageProps } from "../../../../types/backgroundImageProps";

const CharacterImageModal: React.FC<{
	image: BackgroundImageProps;
	characterID: number;
	onClose: () => void;
}> = ({ image: _image, characterID, onClose }) => {
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

	const innerScrollbarRef = useRef<HTMLDivElement>(null);

	const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {

        e.preventDefault();
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div
				className=" bg-white p-3 rounded-lg shadow-lg w-full max-w-md relative overflow-hidden flex flex-col max-h-[90vh]"
			>
				<button
					className="absolute top-1 right-1 text-gray-500 hover:text-gray-800"
					type="button"
					onClick={onClose}
				>
					<CloseIcon />
				</button>

				<PerfectScrollbar className="h-full p-3 mt-4 overscroll-none">
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
							backgroundPosition={_image.backgroundPosition}
							backgroundSize={_image.backgroundSize}
						/>
					)}
					<button
						type="button"
						className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={modifyBackgroundImage}
					>
						Save Image
					</button>
				</PerfectScrollbar>
			</div>
		</div>
	);
};

export default CharacterImageModal;
