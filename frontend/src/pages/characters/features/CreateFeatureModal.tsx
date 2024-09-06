import type React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import TextEditor from "../../../components/CKEditor/CKEditor";
import Modal from "../../../components/Modal";
import {
	useCreateFeatureMutation,
	useModifyFeatureMutation,
} from "../../../store/api/characterApiSlice";
import type { Feature } from "../../../types/feature";

const CreateFeatureModal: React.FC<{
	onClose: () => void;
	characterId: number;
	feature?: Feature;
}> = ({ onClose, characterId, feature }) => {
	const [name, setName] = useState(feature?.name || "");
	const [description, setDescription] = useState(feature?.description || "");
	const [source, setSource] = useState(feature?.source || "");
	const [createFeatureMutation] = useCreateFeatureMutation();
	const [modifyFeatureMutation] = useModifyFeatureMutation();

	const createFeature = async () => {
		if (name.trim().length < 1) {
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
	const updateFeature = async () => {
		if (name.trim().length < 1) {
			toast("Name is required", { type: "warning" });
			return;
		}
		try {
			if (!feature) {
				return;
			}
			const updatedFeature = { name, description, source };
            console.log(feature.id);
			await modifyFeatureMutation({
				feature: {
					...updatedFeature,
					id: feature.id,
					characterID: feature.characterID,
				},
				characterId,
			}).unwrap();
			toast("Feature updated", { type: "success" });
			onClose();
		} catch (error) {
			console.error("Error updating feature", error);
			toast("Error updating feature", { type: "error" });
		}
	};

	return (
		<Modal onClose={onClose} className=" max-w-4/5 lg:w-4/5 ">
			<div className="h-full pt-4 ">
				<label className="block text-sm font-medium text-gray-700">Name:</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="p-2 border border-gray-300 rounded-lg w-full"
				/>
				<label className="block text-sm font-medium text-gray-700">
					Source:
				</label>
				<input
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
						setDescription(val);
					}}
				/>
				<button
					type="button"
					onClick={feature ? updateFeature : createFeature}
					className="p-2 bg-green-500 text-white rounded-lg mt-4"
				>
					{feature ? "Update" : "Create"} Feature
				</button>
			</div>
		</Modal>
	);
};

export default CreateFeatureModal;
