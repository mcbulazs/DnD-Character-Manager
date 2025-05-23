import CloseIcon from "@mui/icons-material/Close";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

const Modal: React.FC<{
  children: ReactNode;
  onClose: () => void;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, onClose, style, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    // Attach event listener
    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);

    setTimeout(() => {
      onClose();
    }, 300);
  };
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
        zIndex: 1001,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        className={className}
        style={{
          borderRadius: "0.5rem",
          height: "auto",
          paddingTop: "1.05rem",
          paddingBottom: "1rem",
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
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
        <div
          style={{
            width: "100%",
            height: "auto",
            overflow: "hidden",
            flexGrow: 1,
            marginRight: "0.2rem",
            marginBottom: "1rem",
            marginTop: "1rem",
          }}
        >
          <Scrollbars
            autoHeight
            autoHeightMax={"90vh"}
            style={{
              marginBottom: "-15px",
            }}
            universal
          >
            <div
              style={{
                overflow: "hidden",
                padding: "0 1rem 1rem",
              }}
            >
              {children}
            </div>
          </Scrollbars>
        </div>
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
            bottom: "1rem",
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
