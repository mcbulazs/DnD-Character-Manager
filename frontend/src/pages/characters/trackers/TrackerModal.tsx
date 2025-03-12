import { useState } from "react";
import Modal from "../../../components/Modal";
import UnstyledNumberInput from "../../../components/UnstyledNumberInput";
import type { Tracker } from "../../../types/tracker";
import {
  useCreateTrackerMutation,
  useModifyTrackerMutation,
} from "../../../store/api/characterApiSlice";

const TrackerModal: React.FC<{
  onClose: () => void;
  tracker?: Tracker;
  characterId: number;
}> = ({ onClose, tracker, characterId }) => {
  const [name, setName] = useState(tracker?.name ?? "");
  const [maxValue, setMaxValue] = useState(tracker?.maxValue ?? 0);
  const [modifyTrackerMutation] = useModifyTrackerMutation();
  const [createTrackerMutation] = useCreateTrackerMutation();
  const createTracker = async () => {
    try {
      await createTrackerMutation({
        tracker: {
          name,
          maxValue,
        },
        characterId,
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Error creating tracker", error);
    }
  };
  const updateTracker = async () => {
    try {
      if (!tracker) {
        return;
      }
      await modifyTrackerMutation({
        tracker: {
          id: tracker.id,
          name: tracker.type !== "Custom" ? tracker.name : name,
          currentValue: tracker.currentValue,
          maxValue,
          order: tracker.order,
          type: tracker.type,
        },
        characterId,
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Error updating tracker", error);
    }
  };
  return (
    <Modal onClose={onClose} className="max-w-4/5 lg:w-4/5 fixed top-0 left-0">
      <div className="h-full pt-4 ">
        <label className="block text-sm font-medium text-gray-700">Name:</label>
        <input
          type="text"
          value={name}
          disabled={tracker && tracker?.type !== "Custom"}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        <label className="block text-sm font-medium text-gray-700">
          Max Value:
        </label>
        <UnstyledNumberInput
          className="p-2 border border-gray-300 rounded-lg w-full"
          defaultValue={maxValue}
          onChange={(val) => setMaxValue(val)}
        />
        <button
          type="button"
          className="p-2 bg-green-500 text-white rounded-lg mt-4 w-full"
          onClick={tracker ? updateTracker : createTracker}
        >
          {tracker ? "Update" : "Create"}
        </button>
      </div>
    </Modal>
  );
};

export default TrackerModal;
