import type React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetFeaturesQuery } from "../../../store/api/characterApiSlice";
import FeatureCard from "./FeatureCard";

const Features: React.FC = () => {
	const { characterId } = useParams();
	if (!characterId || Number.isNaN(Number.parseInt(characterId))) {
		return <div>Invalid character ID</div>;
	}
	const {
		data: features,
		error,
		isLoading,
	} = useGetFeaturesQuery(Number.parseInt(characterId));

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		console.error("Error loading features", error);
		toast("Error loading features", { type: "error" });
		return <div>Error loading features</div>;
	}
    console.log(features)
	return (
		<div>
			<h1>Features</h1>
			{features?.map((feature) => (
				<FeatureCard key={feature.id} feature={feature} />
			))}
		</div>
	);
};

export default Features;
