import CloseIcon from "@mui/icons-material/Close";
import type { ReactNode } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

const Modal: React.FC<{
	children: ReactNode;
	onClose: () => void;
	style?: React.CSSProperties;
	className?: string;
}> = ({ children, onClose, style, className }) => {
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
				className={className}
				style={{
					borderRadius: "0.5rem",
					height: "auto",
					paddingTop: "1rem",
					maxWidth: "28rem",
					...style,
                    backgroundColor: "#f6e1bc",
					position: "relative",
					display: "flex",
				}}
			>
				<button
					className="hover:text-gray-800"
					style={{
						position: "absolute",
						top: "0.25rem",
						right: "0.25rem",
						color: "rgb(107,114,128)",
                        zIndex: 3,
					}}
					type="button"
					onClick={onClose}
				>
					<CloseIcon />
				</button>

				<Scrollbars
					autoHeight
					autoHeightMin={"fit-content"}
					autoHeightMax={"90vh"}
					style={{ flexGrow: 1, marginRight: "0.2rem" }}
				>
					<div style={{ overflowX: "hidden", padding: "0 1rem 1rem 1rem", marginTop:"1rem" }}>
						{children}
					</div>
				</Scrollbars>
				<div
					style={{
						position: "absolute",
						top: "1rem",
						left: 0,
						right: 0,
						height: "20px", // Adjust height as needed
						pointerEvents: "none",
						background:
							"linear-gradient(to bottom, rgba(246, 225, 188, 1) 0%, rgba(246, 225, 188, 0) 100%)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						height: "20px", // Adjust height as needed
						pointerEvents: "none",
						background:
							"linear-gradient(to bottom, rgba(246, 225, 188, 0) 0%, rgba(246, 225, 188, 1) 100%)",
					}}
				/>
			</div>
		</div>
	);
};

export default Modal;
