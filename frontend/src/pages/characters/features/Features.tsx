import type React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetFeaturesQuery } from "../../../store/api/characterApiSlice";
import CreateButton from "../CreateButton";
import CreateFeatureModal from "./CreateFeatureModal";
import FeatureCard from "./FeatureCard";

const Features: React.FC<{ characterId?: number }> = ({
	characterId: _characterId = undefined,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	let characterId: number;
	if (_characterId) {
		characterId = _characterId;
	} else {
		const { characterId: paramCharacterId } = useParams();
		if (!paramCharacterId || Number.isNaN(Number.parseInt(paramCharacterId))) {
			return <div>Invalid character ID</div>;
		}
		characterId = Number.parseInt(paramCharacterId);
	}
	const { data: features, error, isLoading } = useGetFeaturesQuery(characterId);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		console.error("Error loading features", error);
		toast("Error loading features", { type: "error" });
		return <div>Error loading features</div>;
	}
	console.log(features);
	return (
		<div className="flex gap-2 w-full justify-center">
			{features?.map((feature) => (
				<FeatureCard key={feature.id} feature={feature} />
			))}
			{isModalOpen ? (
				<CreateFeatureModal
					onClose={() => setIsModalOpen(false)}
					characterId={characterId}
				/>
			) : (
				<CreateButton text="Add feature" onClick={() => setIsModalOpen(true)} />
			)}
		</div>
	);
};

export default Features;
