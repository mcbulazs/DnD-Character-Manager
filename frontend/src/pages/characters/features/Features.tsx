import type React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CreateButton from "../../../components/buttons/CreateButton";
import { useGetFeaturesQuery } from "../../../store/api/characterApiSlice";
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
	return (
		<>
			<div className="gap-2 w-11/12  xl:w-4/5 2xl:w-3/5
                grid gap-y-10
                grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{features?.map((feature) => (
					<FeatureCard key={feature.id} feature={feature} />
				))}
			</div>
			{isModalOpen ? (
				<CreateFeatureModal
					onClose={() => setIsModalOpen(false)}
					characterId={characterId}
				/>
			) : (
                <div className="fixed bottom-0 right-0 m-5">
				    <CreateButton text="Add feature" onClick={() => setIsModalOpen(true)} />
                </div>
			)}
		</>
	);
};

export default Features;
