import { useCharacterContext } from "../../../layout/Contexts/CharacterContext";
import Tracker from "./tracker";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import type { Tracker as TrackerObj } from "../../../types/tracker";

const Trackers: React.FC = () => {
  const [trackers, setTrackers] = useState<TrackerObj[]>([]);
  const { character, error, isLoading } = useCharacterContext();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !character) {
    console.error("Error loading trackers", error);
    return <div>Error loading trackers</div>;
  }
  useEffect(() => {
    if (character) {
      setTrackers(
        character.trackers.filter((tracker) => tracker.type === "Custom"),
      );
    }
  }, [character]);
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTrackers((trackers) => {
        //const oaldIndex = trackers.indexOf(active.id);
        const oldIndex = trackers.findIndex(
          (tracker) => tracker.id === active.id,
        );
        const newIndex = trackers.findIndex(
          (tracker) => tracker.id === over?.id,
        );
        //const newIndex = trackers.indexOf(over.id);

        return arrayMove(trackers, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="w-full h-full pt-1 flex flex-col items-center">
      <div className="w-5/6 flex flex-wrap gap-2">
        <Tracker
          style={{ width: "100%" }}
          tracker={
            character.trackers.filter((tracker) => tracker.type === "Health")[0]
          }
        />
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext
            items={trackers}
            disabled={false}
            strategy={rectSortingStrategy}
          >
            {trackers?.map((tracker) => (
              <Tracker key={tracker.id} tracker={tracker} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Trackers;
