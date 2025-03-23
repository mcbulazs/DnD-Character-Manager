import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Accordion from "../../../components/Accordion";
import UnstyledNumberInput from "../../../components/UnstyledNumberInput";
import { useModifyTrackerMutation } from "../../../store/api/characterApiSlice";
import type { Spell } from "../../../types/spell";
import type { Tracker } from "../../../types/tracker";
import debounce from "../../../utility/debounce";
import SpellCard from "./SpellCard";

const AccordionHeader: React.FC<{
  tracker: Tracker;
  level: number;
  characterId: number;
  disabled: boolean;
}> = ({ tracker, level, characterId, disabled }) => {
  const name = level === 0 ? "Cantrips" : `Spell level ${level}`;
  const [currentValue, setCurrentValue] = useState(tracker.currentValue);
  const [maxValue, setMaxValue] = useState(tracker.maxValue);
  useEffect(() => {
    setCurrentValue(tracker.currentValue);
    setMaxValue(tracker.maxValue);
  }, [tracker]);

  const [modifyTracker] = useModifyTrackerMutation();
  const updateTracker = useCallback(
    debounce(async (tracker: Tracker) => {
      try {
        await modifyTracker({ tracker, characterId }).unwrap();
      } catch (error) {
        toast("Error updating tracker", { type: "error" });
        console.error("Error updating tracker", error);
      }
    }, 1000),
    [],
  );
  return (
    <div className="flex items-center gap-10 sm:gap-28">
      {name}
      {level !== 0 && (
        <div className="flex items-center">
          <div className="flex items-center">
            <button
              disabled={disabled}
              type="button"
              className="p-2 mx-1 rounded-full h-5 w-5 
                        flex justify-center items-center 
                        bg-slate-400 hover:bg-red-400 
                        transition-all ease-in-out duration-300"
              onClick={() => {
                let newVal = currentValue - 1;
                if (newVal < 0) {
                  newVal = 0;
                }
                updateTracker({
                  ...tracker,
                  currentValue: newVal,
                });
                setCurrentValue(newVal);
              }}
            >
              <RemoveIcon fontSize="small" />
            </button>
            <UnstyledNumberInput
              disabled={disabled}
              defaultValue={currentValue}
              minValue={0}
              maxValue={maxValue}
              onChange={(val) => {
                updateTracker({
                  ...tracker,
                  currentValue: val,
                });
                setCurrentValue(val);
              }}
              className="bg-slate-500 w-14 text-center rounded-lg "
            />
            <button
              disabled={disabled}
              type="button"
              className="p-2 mx-1 rounded-full h-5 w-5 
                        flex justify-center items-center
                        bg-slate-400 hover:bg-green-400
                        transition-all ease-in-out duration-300"
              onClick={() => {
                let newVal = currentValue + 1;
                if (newVal > maxValue) {
                  newVal = maxValue;
                }
                updateTracker({
                  ...tracker,
                  currentValue: newVal,
                });
                setCurrentValue(newVal);
              }}
            >
              <AddIcon fontSize="small" />
            </button>
          </div>
          /{" "}
          <UnstyledNumberInput
            disabled={disabled}
            defaultValue={maxValue}
            onChange={(val) => {
              setMaxValue(val);
              updateTracker({
                ...tracker,
                maxValue: val,
              });
            }}
            className="bg-slate-500 w-14 text-center rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

const SpellListPerLevel: React.FC<{
  spells: Spell[];
  trackers: Tracker[];
  level: number;
  characterId: number;
  canEdit: boolean;
}> = ({ spells: _spells, trackers, level, characterId, canEdit }) => {
  //const levels = Array.from(new Set(spells.map((spell) => spell.level)));
  const spells = _spells
    .filter((spell) => spell.level === level)
    .sort((a) => (a.active ? -1 : 1));
  const tracker = trackers.filter(
    (tracker) => tracker.type === `SpellSlot_${level}`,
  )[0];
  if (spells.length === 0) {
    return null;
  }
  return (
    <Accordion
      head={
        <AccordionHeader
          disabled={!canEdit}
          tracker={tracker}
          level={level}
          characterId={characterId}
        />
      }
      defaultOpen
    >
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 p-2">
        {spells.map((spell) => (
          <SpellCard
            canEdit={canEdit}
            key={spell.id}
            spell={spell}
            characterId={characterId}
          />
        ))}
      </div>
    </Accordion>
  );
};

export default SpellListPerLevel;
