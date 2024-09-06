import type React from "react";

const DeleteDialog: React.FC<{
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => {
	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				overflow: "hidden",
				zIndex: 1000,
			}}
		>
			<div
				className="bg-light-parchment-beiage rounded-xl border-4 border-black text-black p-4"
				style={{ maxWidth : "28rem" }}
			>
				<p className="text-center text-lg font-semibold">{message}</p>
				<div className="gap-4 mt-4 flex justify-evenly">
					<button
						type="button"
						className="text-xl text-white bg-blue-500 hover:bg-blue-600 px-3 py-0 rounded-lg transition-all"
						onClick={onCancel}
					>
						Cancel
					</button>
					<button
						type="button"
						className="text-xl text-white bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition-all"
						onClick={onConfirm}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteDialog;
