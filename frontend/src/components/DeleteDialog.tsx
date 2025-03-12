import type React from "react";
import { useEffect, useState } from "react";

const DeleteDialog: React.FC<{
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };

    // Attach event listener
    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleCancel = () => {
    setIsVisible(false);

    setTimeout(() => {
      onCancel();
    }, 300);
  };

  const handleConfirm = () => {
    setIsVisible(false);

    setTimeout(() => {
      onConfirm();
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
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        className="bg-light-parchment-beige rounded-xl border-4 border-black text-black p-4 w-full"
        style={{ maxWidth: "28rem" }}
      >
        <p className="text-center text-lg font-semibold break-words">
          {message}
        </p>
        <div className="gap-4 mt-4 flex justify-evenly">
          <button
            type="button"
            className="text-xl text-white bg-blue-500 hover:bg-blue-600 px-3 py-0 rounded-lg transition-all"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="text-xl text-white bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition-all"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
