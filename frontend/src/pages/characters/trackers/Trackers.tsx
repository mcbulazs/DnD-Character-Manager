import { useCharacterContext } from "../../../layout/Contexts/CharacterContext";
import Tracker from "./Tracker";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  rectSortingStrategy,
  arrayMove,
  SortableContext,
} from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import type { Tracker as TrackerObj } from "../../../types/tracker";
import EditButton from "../../../components/buttons/EditButton";
import CreateButton from "../../../components/buttons/CreateButton";
import TrackerModal from "./TrackerModal";
import { useUpdateTrackerOrderMutation } from "../../../store/api/characterApiSlice";

const Trackers: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [trackers, setTrackers] = useState<TrackerObj[]>([]);
  const [useUpdateTrackerOrder] = useUpdateTrackerOrderMutation();
  const { character, error, isLoading } = useCharacterContext();
  useEffect(() => {
    if (!isVisible) {
      setIsEditing(false);
    }
  }, [isVisible]);
  useEffect(() => {
    if (character) {
      console.log("Trackers", character.trackers);
      setTrackers(
        character.trackers
          .filter((tracker) =>
            ["Custom", "HitDie", character.options.isXP ? "XP" : []].includes(
              tracker.type,
            ),
          )
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
  const handleStopEditing = () => {
    setIsEditing(false);
    useUpdateTrackerOrder({
      characterId: character.ID,
      trackerIds: trackers.map((tracker) => tracker.id),
    });
  };
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

        return arrayMove(trackers, oldIndex, newIndex);
      });
    }
  }
  if (character.trackers?.length < 1) {
    return <div>Error loading trackers</div>;
  }
  return (
    <>
      <div className="w-full pt-1 flex flex-col items-center">
        <div className="w-5/6 flex flex-wrap gap-2">
          <Tracker
            canEdit={character.isOwner && !character.options.isDead}
            style={{ width: "100%" }}
            tracker={
              character.trackers.filter(
                (tracker) => tracker.type === "Health",
              )[0]
            }
            isEditing={isEditing}
            characterId={character.ID}
            disabled={!isVisible}
          />
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext
              items={trackers}
              disabled={!isEditing}
              strategy={rectSortingStrategy}
            >
              {trackers.map((tracker) => (
                <Tracker
                  disabled={!isVisible}
                  canEdit={character.isOwner && !character.options.isDead}
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
      {character.isOwner && !character.options.isDead && (
        <div className="w-full h-16 absolute bottom-0 grid grid-cols-2">
          <div className="w-full flex items-center justify-center p-2">
            {!isEditing ? (
              <EditButton
                disabled={!isVisible}
                text="Edit trackers"
                onClick={() => {
                  setIsEditing(true);
                }}
              />
            ) : (
              <button
                disabled={!isVisible}
                className={`bg-orange-500 hover:bg-orange-700 text-white font-bold
                                w-48 h-12 
                                rounded-full p-1 z-10 
                                transition-all duration-300 ease-in-out overflow-hidden`}
                onClick={handleStopEditing}
                type="button"
              >
                <span className="text-white text-center whitespace-nowrap">
                  Stop Editing
                </span>
              </button>
            )}
          </div>
          <div className="w-full flex items-center justify-center p-2">
            <CreateButton
              disabled={!isVisible}
              text="Create tracker"
              onClick={() => setTrackerModalOpen(true)}
            />
          </div>
        </div>
      )}
      {trackerModalOpen && (
        <TrackerModal
          onClose={() => setTrackerModalOpen(false)}
          characterId={character.ID}
        />
      )}
    </>
  );
};

export default Trackers;
