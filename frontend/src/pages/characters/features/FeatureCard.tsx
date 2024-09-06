import { useState } from "react";
import Modal from "../../../components/Modal";
import type { Feature } from "../../../types/feature";

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
	const [showFull, setShowFull] = useState(false);
	return (
		<>
			<div
				className="
                flex flex-col 
                bg-light-parchment-beiage 
                w-5/12 sm:w-5/12 md:w-1/4 lg:w-1/6
                h-fit
                border-4 border-black rounded-xl
                cursor-pointer
                "
				onMouseDown={() => setShowFull(true)}
			>
				<h2 className="text-center text-xl font-bold border-b-4 border-dragon-blood">{feature.name}</h2>
                {
                    feature.source &&
                    <p className=" border-b-4 border-dragon-blood">{feature.source}</p>
                }
				<div className=" relative pb-10">
					{/*biome-ignore lint/security/noDangerouslySetInnerHtml format: Safe as content comes from CKEditor and is sanitized.*/}
					<div dangerouslySetInnerHTML={{ __html: feature.description }}
						className="h-48 line-clamp-[8]"
					/>
					<div className="absolute bottom-0 w-full flex justify-center z-10 text-md text-gray-800 font-bold">
						Click to show full feature
					</div>
				</div>
			</div>
			{showFull && (
				<Modal onClose={() => setShowFull(false)} className="w-4/5">
					<div className="p-4">
						<h2 className="text-2xl font-bold">{feature.name}</h2>
						<p className="my-5">Source: {feature.source}</p>
						{/*biome-ignore lint/security/noDangerouslySetInnerHtml format: Safe as content comes from CKEditor and is sanitized.*/}
						<div dangerouslySetInnerHTML={{ __html: feature.description }} />
					</div>
				</Modal>
			)}
		</>
	);
};

export default FeatureCard;
