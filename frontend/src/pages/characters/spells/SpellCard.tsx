import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../../../components/Modal";
import DeleteButton from "../../../components/buttons/DeleteButton";
import EditButton from "../../../components/buttons/EditButton";
import {
  useDeleteSpellMutation,
  useModifySpellMutation,
} from "../../../store/api/characterApiSlice";
import type { Spell } from "../../../types/spell";
import debounce from "../../../utility/debounce";
import CreateSpellModal from "./CreateSpellModal";

const getMainComponents = (components: string) => {
  const index = components.indexOf("(");
  if (index === -1) {
    // If '(' is not found, return the whole string
    return components;
  }
  return components.substring(0, index - 1);
};

const toSpellLevelSchoolString = (level: number, school: string) => {
  if (level === 0) {
    if (school.length === 0) {
      return "Cantrip";
    }
    const _school =
      school.charAt(0).toUpperCase() + school.slice(1).toLowerCase();
    return `${_school} cantrip`;
  }

  const suffixes = ["th", "st", "nd", "rd"];
  suffixes[level] || suffixes[0];

  return `${level}${suffixes[level] || suffixes[0]}-level ${school.toLowerCase()}`;
};

const SpellCard: React.FC<{
  spell: Spell;
  characterId: number;
  canEdit: boolean;
}> = ({ spell: _spell, characterId, canEdit }) => {
  const [active, setActive] = useState(_spell.active);
  const [spell, setSpell] = useState(_spell);
  const [showFull, setShowFull] = useState(false);
  const [inEdit, setInEdit] = useState(false);
  const [deleteSpell] = useDeleteSpellMutation();
  const [modifySpell] = useModifySpellMutation();
  useEffect(() => {
    setSpell(_spell);
    setActive(_spell.active);
  }, [_spell]);

  const handleDelete = async () => {
    try {
      await deleteSpell({
        id: spell.id,
        characterId,
      }).unwrap();
      toast("Spell deleted", { type: "success" });
    } catch (error) {
      console.error("Error deleting spell", error);
      toast("Error deleting spell", { type: "error" });
    }
  };
  const handleClick = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.tagName === "BUTTON") {
      return;
    }
    if (e.button !== 0) {
      return;
    }
    setShowFull(true);
  };
  const debounceActive = useCallback(
    debounce(async (active) => {
      try {
        await modifySpell({
          spell: {
            ...spell,
            active,
          },
          characterId,
        }).unwrap();
      } catch (error) {
        console.error("Error updating active", error);
        toast("Error updating active", { type: "error" });
      }
    }, 300),
    [],
  );

  const handleActive = () => {
    debounceActive(!active);
    setActive(!active);
  };
  return (
    <>
      <div
        className={`w-full h-64 relative 
                flex flex-col 
                bg-light-parchment-beige   
                rounded-xl border-4 border-black
                overflow-hidden
                cursor-pointer
                `}
        onMouseDown={handleClick}
      >
        <button
          disabled={!canEdit}
          type="button"
          onClick={handleActive}
          className="text-2xl absolute top-0 left-0"
        >
          {active ? "🟢" : "🔴"}
        </button>
        <div className=" text-center border-b-4 border-dragon-blood">
          <h3 className=" text-xl font-bold ">{spell.name}</h3>
          <span className="text-sm text-gray-500">{spell.school}</span>
        </div>
        <div className="grid grid-cols-2 h-full grid-rows-2 grid-flow-col text-center">
          <div className="flex flex-col">
            <span className="font-bold">Casting Time</span>
            <span>{spell.castingTime}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Components</span>
            <span>{getMainComponents(spell.components)}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Range</span>
            <span>{spell.range}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Duration</span>
            <span>{spell.duration}</span>
          </div>
        </div>
        <div className="w-full flex justify-center text-md text-gray-600 font-bold">
          Click to show full sepell
        </div>
      </div>
      {showFull && (
        <Modal onClose={() => setShowFull(false)} className="w-full sm:w-4/5">
          <div className="p-4 relative">
            <h2 className="text-2xl font-bold text-[#401A07]">{spell.name}</h2>
            <p className=" text-sm">
              {toSpellLevelSchoolString(spell.level, spell.school)}
            </p>
            <div className="my-4">
              <p>
                <span className="font-bold">Casting Time:</span>{" "}
                {spell.castingTime}
              </p>
              <p>
                <span className="font-bold">Range:</span> {spell.range}
              </p>
              <p>
                <span className="font-bold">Components:</span>{" "}
                {spell.components}
              </p>
              <p>
                <span className="font-bold">Duration:</span> {spell.duration}
              </p>
            </div>
            {/*biome-ignore lint/security/noDangerouslySetInnerHtml format: Safe as content comes from CKEditor and is sanitized.*/}
            <div dangerouslySetInnerHTML={{ __html: spell.description }} />
            {canEdit && (
              <div className="absolute top-0 right-0 m-5 flex gap-2">
                <DeleteButton
                  text="Delete Spell"
                  onDelete={() => {
                    handleDelete();
                    setShowFull(false);
                  }}
                  dialogMessage="Are you sure you want to delete this spell?"
                />
                <EditButton
                  text="Edit Feature"
                  onClick={() => {
                    setInEdit(true);
                    setShowFull(false);
                  }}
                />
              </div>
            )}
          </div>
        </Modal>
      )}
      {inEdit && (
        <CreateSpellModal
          onClose={() => {
            setInEdit(false);
            setShowFull(true);
          }}
          spell={spell}
          characterId={characterId}
        />
      )}
    </>
  );
};

export default SpellCard;
