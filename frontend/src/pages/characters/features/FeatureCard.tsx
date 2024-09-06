import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import { stripHtml } from "string-strip-html";
import Modal from "../../../components/Modal";
import type { Feature } from "../../../types/feature";

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
	const [showFull, setShowFull] = useState(false);
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
					<div
						className="w-full h-full line-clamp-[9]"
					>{stripHtml(feature.description).result}</div>
				</div>
				<div className="absolute bottom-0 w-full flex justify-center z-10 text-md text-gray-800 font-bold">
					Click to show full feature
				</div>
			</div>
			{showFull && (
				<Modal onClose={() => setShowFull(false)} className="w-full sm:w-4/5" >
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
