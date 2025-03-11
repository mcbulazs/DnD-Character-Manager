import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import UnstyledNumberInput from "../../../components/UnstyledNumberInput";
import type { Tracker as TrackerOBJ } from "../../../types/tracker";
import { useState } from "react";

const Tracker: React.FC<{
  tracker: TrackerOBJ;
  style?: React.CSSProperties;
}> = ({ tracker, style }) => {
  const [currentValue, setCurrentValue] = useState(tracker.currentValue);
  const { setNodeRef, listeners, transform, transition, isDragging } =
    useSortable({
      id: tracker.id,
    });
  return (
    <div
      className="w-min min-w-32 h-min box-content"
      ref={setNodeRef}
      style={{
        ...style,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div
        className={`w-full whitespace-nowrap h-fit
        border-2 border-ancient-gold rounded-t-md 
        bg-parchment-beige text-center ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        {...listeners}
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
          className="text-2xl bg-light-parchment-beige text-center border-ancient-gold border-2"
          defaultValue={currentValue}
          maxValue={tracker.maxValue}
          minValue={0}
          onChange={(val) => {
            setCurrentValue(val);
          }}
        />
        <UnstyledNumberInput
          disabled={true}
          className="text-2xl bg-light-parchment-beige text-center border-ancient-gold border-2"
          defaultValue={tracker.maxValue}
          onChange={() => { }}
        />
        <div
          className="h-4 w-full flex items-center justify-center cursor-pointer select-none text-xl border-2 border-ancient-gold"
          onMouseUp={() => {
            if (currentValue === 0) return;
            setCurrentValue((value) => value - 1);
          }}
        >
          -
        </div>
        <div
          className="h-4 w-full flex items-center justify-center cursor-pointer select-none text-xl border-2 border-ancient-gold"
          onMouseUp={() => {
            if (currentValue === tracker.maxValue) return;
            setCurrentValue((value) => value + 1);
          }}
        >
          +
        </div>
      </div>
    </div>
  );
};

export default Tracker;
