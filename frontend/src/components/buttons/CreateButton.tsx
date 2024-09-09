import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

const CreateButton: React.FC<{
	onClick: () => void;
	text: string;
}> = ({ onClick, text }) => {
	const [hover, setHover] = useState(false);
	const handleClick = (e: React.MouseEvent) => {
		if (e.button !== 0) {
			return;
		}
		onClick();
	}
	return (
		<button
			className={`bg-green-500 hover:bg-green-700 text-white font-bold
                                ${!hover ? "w-12" : "w-48"} h-12 
                                rounded-full p-1 z-10 
                                transition-all duration-300 ease-in-out overflow-hidden`}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onMouseDown={handleClick}
			type="button"
		>
			{hover ? (
				<span className="text-white text-center whitespace-nowrap">{text}</span>
			) : (
				<AddIcon />
			)}
		</button>
	);
};

export default CreateButton;
