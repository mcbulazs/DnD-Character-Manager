import type { Feature } from "../../../types/feature";

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
	return (
        <div>
            <h2>{feature.name}</h2>
            <p>{feature.description}</p>
            <p>{feature.source}</p>
        </div>
	);
};

export default FeatureCard;