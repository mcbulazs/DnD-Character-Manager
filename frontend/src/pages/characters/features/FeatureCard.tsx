import { useState } from "react";
import { toast } from "react-toastify";
import { stripHtml } from "string-strip-html";
import Modal from "../../../components/Modal";
import DeleteButton from "../../../components/buttons/DeleteButton";
import EditButton from "../../../components/buttons/EditButton";
import { useDeleteFeatureMutation } from "../../../store/api/characterApiSlice";
import type { Feature } from "../../../types/feature";
import CreateFeatureModal from "./CreateFeatureModal";

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
	const [showFull, setShowFull] = useState(false);
	const [inEdit, setInEdit] = useState(false);
	const [deleteFeature] = useDeleteFeatureMutation();

	const handleDelete = async () => {
		try {
			await deleteFeature({
				id: feature.id,
				characterId: feature.characterID,
			}).unwrap();
			toast("Feature deleted", { type: "success" });
		} catch (error) {
			console.error("Error deleting feature", error);
			toast("Error deleting feature", { type: "error" });
		}
	};
	return (
		<>
			<div
				className="w-full h-80   
                flex flex-col 
                bg-light-parchment-beiage   
                border-4 border-black rounded-xl
                cursor-pointer relative
                "
				onMouseDown={() => setShowFull(true)}
			>
				<h2 className="text-center text-xl font-bold border-b-4 border-dragon-blood">
					{feature.name}
				</h2>
				{feature.source && (
					<p className=" border-b-4 border-dragon-blood overflow-hidden flex items-center text-lg px-2">
						{feature.source}
					</p>
				)}
				<div className="pb-10 w-full h-full px-1">
					<div className="w-full h-full line-clamp-[9]">
						{stripHtml(feature.description).result}
					</div>
				</div>
				<div className="absolute bottom-0 w-full flex justify-center z-10 text-md text-gray-800 font-bold">
					Click to show full feature
				</div>
			</div>
			{showFull && (
				<Modal onClose={() => setShowFull(false)} className="w-full sm:w-4/5">
					<div className="p-4 relative">
						<h2 className="text-2xl font-bold">{feature.name}</h2>
						<p className="my-5">Source: {feature.source}</p>
						{/*biome-ignore lint/security/noDangerouslySetInnerHtml format: Safe as content comes from CKEditor and is sanitized.*/}
						<div dangerouslySetInnerHTML={{ __html: feature.description }} />
						<div className="absolute top-0 right-0 m-5 flex gap-2">
							<DeleteButton
								text="Delete Feature"
								onDelete={() => {
                                    handleDelete();
									setShowFull(false);
								}}
								dialogMessage="Are you sure you want to delete this feature?"
							/>
							<EditButton
								text="Edit Feature"
								onClick={() => {
									setInEdit(true);
									setShowFull(false);
								}}
							/>
						</div>
					</div>
				</Modal>
			)}
			{inEdit && (
				<CreateFeatureModal
					onClose={() => {
						setInEdit(false);
						setShowFull(true);
					}}
					feature={feature}
					characterId={feature.characterID}
				/>
			)}
		</>
	);
};

export default FeatureCard;
