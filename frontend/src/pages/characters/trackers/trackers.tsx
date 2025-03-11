import { useCharacterContext } from "../../../layout/Contexts/CharacterContext";
import Tracker from "./tracker";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  rectSortingStrategy,
  arrayMove,
  SortableContext,
} from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import type { Tracker as TrackerObj } from "../../../types/tracker";

const Trackers: React.FC<{ isEditing: boolean }> = ({ isEditing }) => {
  const [trackers, setTrackers] = useState<TrackerObj[]>([]);
  const { character, error, isLoading } = useCharacterContext();
  useEffect(() => {
    if (character) {
      setTrackers(
        character.trackers
          .filter((tracker) => tracker.type === "Custom")
          .sort((a, b) => a.order - b.order),
      );
    }
  }, [character]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !character) {
    return <div>Error loading trackers</div>;
  }
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
      /*
      if (character) {
        console.log(trackers);
        updateOrder({
          trackerIds: trackers.map((tracker) => tracker.id),
          characterId: character.ID,
        });
      }
      */
    }
  }
  return (
    <div className="w-full pt-1 flex flex-col items-center">
      <div className="w-5/6 flex flex-wrap gap-2">
        <Tracker
          style={{ width: "100%" }}
          tracker={
            character.trackers.filter((tracker) => tracker.type === "Health")[0]
          }
          isEditing={isEditing}
          characterId={character.ID}
        />
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext
            items={trackers}
            disabled={!isEditing}
            strategy={rectSortingStrategy}
          >
            {trackers.map((tracker) => (
              <Tracker
                key={tracker.id}
                tracker={tracker}
                isEditing={isEditing}
                characterId={character.ID}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Trackers;
