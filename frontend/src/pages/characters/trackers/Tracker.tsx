import { useSortable } from "@dnd-kit/sortable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CSS } from "@dnd-kit/utilities";
import UnstyledNumberInput from "../../../components/UnstyledNumberInput";
import type { Tracker as TrackerOBJ } from "../../../types/tracker";
import { useCallback, useState } from "react";
import TrackerModal from "./TrackerModal";
import debounce from "../../../utility/debounce";
import {
  useDeleteTrackerMutation,
  useModifyTrackerMutation,
} from "../../../store/api/characterApiSlice";
import DeleteDialog from "../../../components/DeleteDialog";

const Tracker: React.FC<{
  tracker: TrackerOBJ;
  style?: React.CSSProperties;
  isEditing: boolean;
  characterId: number;
}> = ({ tracker, style, isEditing, characterId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
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
  const [modifyTrackerMutation] = useModifyTrackerMutation();
  const [deleteTrackerMutation] = useDeleteTrackerMutation();
  const isDisabled = isEditing;
  const UpdateTrackerDebounce = useCallback(
    debounce((value: number) => {
      modifyTrackerMutation({
        characterId,
        tracker: {
          id: tracker.id,
          name: tracker.name,
          maxValue: tracker.maxValue,
          currentValue: value,
          type: tracker.type,
          order: tracker.order,
        },
      });
    }, 300),
    [],
  );

  return (
    <>
      <div
        className="w-min min-w-32 h-min box-content relative"
        style={{ ...style }}
      >
        {isDisabled && !isSorting && (
          <>
            {tracker.type === "Custom" && (
              <button
                type="button"
                className="absolute top-0 left-0 text-red-500"
                onClick={() => {
                  setDeleteOpen(true);
                }}
              >
                <DeleteIcon fontSize="large" />
              </button>
            )}
            <button
              type="button"
              className="absolute top-0 right-0 text-orange-500"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <EditIcon fontSize="large" />
            </button>
          </>
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
        bg-parchment-beige text-center overflow-hidden`}
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
                UpdateTrackerDebounce(val);
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
                UpdateTrackerDebounce(currentValue - 1);
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
                UpdateTrackerDebounce(currentValue + 1);
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
      {deleteOpen && (
        <DeleteDialog
          message={`Are you sure you want to delete tracker: ${tracker.name}?`}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={() => {
            setDeleteOpen(false);
            deleteTrackerMutation({ characterId, id: tracker.id });
          }}
        />
      )}
    </>
  );
};

export default Tracker;
