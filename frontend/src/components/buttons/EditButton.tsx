
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

const EditButton: React.FC<{
	onClick: () => void;
	text: string;
}> = ({ onClick, text }) => {
	const [hover, setHover] = useState(false);
	return (
		<button
			className={`bg-blue-500 hover:bg-blue-700 text-white font-bold
                                ${!hover ? "w-12" : "w-48"} h-12 
                                rounded-full p-1 z-10 
                                transition-all duration-300 ease-in-out overflow-hidden`}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onMouseDown={onClick}
			type="button"
		>
			{hover ? (
				<span className="text-white text-center whitespace-nowrap">{text}</span>
			) : (
				<EditIcon />
			)}
		</button>
	);
};

export default EditButton;