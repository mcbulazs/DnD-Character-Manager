import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import TextEditor from "../../../components/CKEditor/CKEditor";
import Modal from "../../../components/Modal";
import { useCreateFeatureMutation } from "../../../store/api/characterApiSlice";

const CreateFeatureModal: React.FC<{
	onClose: () => void;
	characterId: number;
}> = ({ onClose, characterId }) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [source, setSource] = useState("");
	const [createFeatureMutation] = useCreateFeatureMutation();

	const createFeature = async () => {
        if (name.trim().length < 1 ) {
            toast("Name is required", { type: "error" });
            return;
        }
		try {
			const feature = { name, description, source };
			await createFeatureMutation({ feature, characterId }).unwrap();
			toast("Feature created", { type: "success" });
			onClose();
		} catch (error) {
			console.error("Error creating feature", error);
			toast("Error creating feature", { type: "error" });
		}
	};

	return (
		<Modal onClose={onClose} className=" max-w-4/5 lg:w-4/5">
			<div className="h-full pt-4">
				<label className="block text-sm font-medium text-gray-700">Name:</label>
				<input
					required
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="p-2 border border-gray-300 rounded-lg w-full"
				/>
				<label className="block text-sm font-medium text-gray-700">
					Source:
				</label>
				<input
                    required
					type="text"
					value={source}
					onChange={(e) => setSource(e.target.value)}
					className="p-2 border border-gray-300 rounded-lg w-full"
				/>
				<label className="block text-sm font-medium text-gray-700">
					Description:
				</label>
				<TextEditor
					value={description}
					onChange={(val) => {
						console.log(val);
						setDescription(val);
					}}
				/>
				<button
					type="button"
					onClick={createFeature}
					className="p-2 bg-green-500 text-white rounded-lg mt-4"
				>
					Create
				</button>
			</div>
		</Modal>
	);
};

export default CreateFeatureModal;
