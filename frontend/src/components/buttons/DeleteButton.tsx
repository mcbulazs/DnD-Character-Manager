import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import DeleteDialog from "../DeleteDialog";

const DeleteButton: React.FC<{
	onDelete: () => void;
	text: string;
	dialogMessage: string;
}> = ({ onDelete, text, dialogMessage }) => {
	const [hover, setHover] = useState(false);
	const [open, setOpen] = useState(false);
	return (
		<>
			<button
				className={`bg-red-500 hover:bg-red-700 text-white font-bold
                ${!hover ? "w-12" : "w-48"} h-12 
                rounded-full p-1 z-10 
                transition-all duration-300 ease-in-out overflow-hidden`}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onClick={() => setOpen(true)}
				type="button"
			>
				{hover ? (
					<span className="text-white text-center whitespace-nowrap">
						{text}
					</span>
				) : (
					<DeleteIcon />
				)}
			</button>
			{open && (
				<DeleteDialog
					message={dialogMessage}
					onCancel={() => setOpen(false)}
					onConfirm={() => {
                        setOpen(false);
						onDelete();
					}}
				/>
			)}
		</>
	);
};

export default DeleteButton;
