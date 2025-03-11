import { useSortable } from "@dnd-kit/sortable";
import EditIcon from "@mui/icons-material/Edit";
import { CSS } from "@dnd-kit/utilities";
import UnstyledNumberInput from "../../../components/UnstyledNumberInput";
import type { Tracker as TrackerOBJ } from "../../../types/tracker";
import { useState } from "react";
import TrackerModal from "./trackerModal";

const Tracker: React.FC<{
  tracker: TrackerOBJ;
  style?: React.CSSProperties;
  isEditing: boolean;
  characterId: number;
}> = ({ tracker, style, isEditing, characterId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(tracker.currentValue);
  const {
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({
    id: tracker.id,
  });
  const isDisabled = isEditing;
  return (
    <>
      <div
        className="w-min min-w-32 h-min box-content relative"
        style={{ ...style }}
      >
        {isDisabled && !isSorting && (
          <button
            type="button"
            className="absolute top-0 right-0 text-orange-500"
            onClick={() => {
              console.log("edit");
              setModalOpen(true);
            }}
          >
            <EditIcon fontSize="large" />
          </button>
        )}
        <div
          className={`
        ${!isDisabled ? "" : isDragging ? "cursor-grabbing" : "cursor-grab"}
        ${!isDisabled ? "" : "select-none"}`}
          {...listeners}
          ref={setNodeRef}
          style={{
            transform: CSS.Transform.toString(transform),
            transition,
          }}
        >
          <div
            className={`w-full whitespace-nowrap h-fit
        border-2 border-ancient-gold rounded-t-md 
        bg-parchment-beige text-center`}
          >
            {tracker.name}
          </div>
          <div
            className="w-full h-auto
        border-2 border-ancient-gold rounded-b-md
        bg-parchment-beige
        grid grid-cols-2 grid-rows-[auto_auto]"
          >
            <UnstyledNumberInput
              className={`text-2xl bg-light-parchment-beige text-center border-ancient-gold border-2
            ${!isDisabled ? "" : isDragging ? "cursor-grabbing" : "cursor-grab"}
            ${!isDisabled ? "" : "select-none"}`}
              defaultValue={currentValue}
              maxValue={tracker.maxValue}
              disabled={isDisabled}
              minValue={0}
              onChange={(val) => {
                setCurrentValue(val);
              }}
            />
            <UnstyledNumberInput
              disabled={true}
              className={`text-2xl bg-light-parchment-beige text-center border-ancient-gold border-2
            ${!isDisabled ? "" : isDragging ? "cursor-grabbing" : "cursor-grab"}
            ${!isDisabled ? "" : "select-none"}`}
              defaultValue={tracker.maxValue}
              onChange={() => { }}
            />
            <button
              type="button"
              disabled={isDisabled}
              className={`h-4 w-full flex items-center justify-center select-none text-xl border-2 border-ancient-gold
            ${!isDisabled ? "" : isDragging ? "cursor-grabbing" : "cursor-grab"}
            ${!isDisabled ? "" : "select-none"}`}
              onClick={() => {
                if (currentValue === 0) return;
                setCurrentValue((value) => value - 1);
              }}
            >
              -
            </button>
            <button
              type="button"
              disabled={isDisabled}
              className={`h-4 w-full flex items-center justify-center select-none text-xl border-2 border-ancient-gold
            ${!isDisabled ? "" : isDragging ? "cursor-grabbing" : "cursor-grab"}
            ${!isDisabled ? "" : "select-none"}`}
              onClick={() => {
                if (currentValue === tracker.maxValue) return;
                setCurrentValue((value) => value + 1);
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
      {modalOpen && (
        <TrackerModal
          onClose={() => setModalOpen(false)}
          tracker={tracker}
          characterId={characterId}
        />
      )}
    </>
  );
};

export default Tracker;
