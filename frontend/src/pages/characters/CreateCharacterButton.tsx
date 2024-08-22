import AddIcon from "@mui/icons-material/Add";
import { type SetStateAction, useState } from "react";

const CreateCharacterButton: React.FC<{ setOpen: React.Dispatch<SetStateAction<boolean>> }> = ({
	setOpen,
}) => {
	const [hover, setHover] = useState(false);
	return (
		<>
			<button
				className={`bg-blue-500 hover:bg-blue-700 text-white font-bold
                                ${!hover ? "w-12" : "w-48"} h-12 
                                fixed bottom-16 right-0
                                rounded-full m-5 p-1 z-10 
                                transition-all duration-300 ease-in-out overflow-hidden`}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onMouseDown={() => setOpen(true)}
				type="button"
			>
				{hover ? (
					<span className="text-white text-center whitespace-nowrap">
						Create Character
					</span>
				) : (
					<AddIcon />
				)}
			</button>
		</>
	);
};

export default CreateCharacterButton;
