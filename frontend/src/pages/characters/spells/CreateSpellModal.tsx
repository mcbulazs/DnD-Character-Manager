import type React from "react";
import { Suspense, lazy, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../../../components/Modal";
import {
  useCreateSpellMutation,
  useModifySpellMutation,
} from "../../../store/api/characterApiSlice";
import type { CreateSpell, Spell } from "../../../types/spell";
//import TextEditor from "../../../components/CKEditor/CKEditor";
const TextEditor = lazy(() => import("../../../components/CKEditor/CKEditor"));

type componentType = {
  Vocal: boolean;
  Somatic: boolean;
  Material: boolean;
  MaterialDesc?: string;
};
const convertToComponentType = (components: string): componentType => {
  if (components === "") {
    return {
      Vocal: false,
      Somatic: false,
      Material: false,
    };
  }
  const comp: componentType = {
    Vocal: false,
    Somatic: false,
    Material: false,
  };
  const regex = / /gm;
  const mainComponents = (() => {
    const index = components.indexOf("(");
    if (index === -1) {
      // If '(' is not found, return the whole string
      return components;
    }
    return components.substring(0, index - 1);
  })()
    .replace(regex, "")
    .split(",");
  if (mainComponents.includes("V")) {
    comp.Vocal = true;
  }
  if (mainComponents.includes("S")) {
    comp.Somatic = true;
  }
  if (mainComponents.includes("M")) {
    comp.Material = true;
    const index = components.indexOf("(");
    if (index !== -1) {
      comp.MaterialDesc = components.substring(
        index + 1,
        components.length - 1,
      );
    }
  }
  return comp;
};

const convertToComponentString = (components: componentType): string => {
  let str = "";
  const comps = [];
  if (components.Vocal) {
    comps.push("V");
  }
  if (components.Somatic) {
    comps.push("S");
  }
  if (components.Material) {
    comps.push("M");
  }
  str = comps.join(", ");
  if (components.MaterialDesc) {
    str += ` (${components.MaterialDesc})`;
  }
  return str;
};

const validateSpell = (spell: CreateSpell) => {
  if (spell.name.trim().length < 1) {
    toast("Name is required", { type: "error" });
    return false;
  }
  if (Number.isNaN(spell.level) || spell.level < 0 || spell.level > 9) {
    toast("Invalid spell level", { type: "error" });
    return false;
  }
  if (spell.school.trim().length < 1) {
    toast("School is required", { type: "error" });
    return false;
  }

  return true;
};

const CreateSpellModal: React.FC<{
  onClose: () => void;
  characterId: number;
  spell?: Spell;
}> = ({ onClose, characterId, spell }) => {
  const [name, setName] = useState(spell?.name || "");
  const [level, setLevel] = useState<number>(spell?.level || 0);
  const [school, setSchool] = useState(spell?.school || "abjuration");
  const [castingTime, setCastingTime] = useState(spell?.castingTime || "");
  const [range, setRange] = useState(spell?.range || "");
  const [duration, setDuration] = useState(spell?.duration || "");
  const [description, setDescription] = useState(spell?.description || "");
  console.log("level", level);
  const [components, setComponents] = useState<componentType>(
    convertToComponentType(spell?.components || ""),
  );

  const [createSpellMutation] = useCreateSpellMutation();
  const [modifySpellMutation] = useModifySpellMutation();

  const createSpell = async () => {
    const spell = {
      name,
      description,
      level,
      school,
      castingTime,
      range,
      duration,
      components: convertToComponentString(components),
    };
    if (!validateSpell(spell)) {
      return;
    }
    try {
      await createSpellMutation({ spell, characterId }).unwrap();
      toast("Spell created", { type: "success" });
      onClose();
    } catch (error) {
      console.error("Error creating spell", error);
      toast("Error creating spell", { type: "error" });
    }
  };
  const updateSpell = async () => {
    const updatedSpell = {
      name,
      description,
      level,
      school,
      castingTime,
      range,
      duration,
      components: convertToComponentString(components),
    };

    if (!validateSpell(updatedSpell)) {
      return;
    }

    try {
      if (!spell) {
        return;
      }
      await modifySpellMutation({
        spell: {
          ...updatedSpell,
          id: spell.id,
          active: spell.active,
        },
        characterId,
      }).unwrap();
      toast("Spell updated", { type: "success" });
      onClose();
    } catch (error) {
      console.error("Error updating spell", error);
      toast("Error updating spell", { type: "error" });
    }
  };

  return (
    <Modal onClose={onClose} className=" max-w-4/5 lg:w-4/5 ">
      <div className="h-full pt-4 ">
        <label className="block text-sm font-medium text-gray-700">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        <label className="block text-sm font-medium text-gray-700">
          Level:
        </label>
        <select
          className="p-2 border border-gray-300 rounded-lg w-full"
          onChange={(e) => setLevel(Number.parseInt(e.target.value))}
          value={level}
        >
          <option value={0}>Cantrip</option>
          <option value={1}>1st</option>
          <option value={2}>2nd</option>
          <option value={3}>3rd</option>
          <option value={4}>4th</option>
          <option value={5}>5th</option>
          <option value={6}>6th</option>
          <option value={7}>7th</option>
          <option value={8}>8th</option>
          <option value={9}>9th</option>
        </select>
        <label className="block text-sm font-medium text-gray-700">
          School:
        </label>
        <select
          className="p-2 border border-gray-300 rounded-lg w-full"
          onChange={(e) => setSchool(e.target.value)}
          value={school}
        >
          <option value="Abjuration">Abjuration</option>
          <option value="Alteration">Alteration</option>
          <option value="Conjuration">Conjuration</option>
          <option value="Divination">Divination</option>
          <option value="Enchantment">Enchantment</option>
          <option value="Evocation">Evocation</option>
          <option value="Illusion">Illusion</option>
          <option value="Necromancy">Necromancy</option>
        </select>
        <label className="block text-sm font-medium text-gray-700">
          Casting Time:
        </label>
        <input
          type="text"
          value={castingTime}
          onChange={(e) => setCastingTime(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        <label className="block text-sm font-medium text-gray-700">
          Range:
        </label>
        <input
          type="text"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        <label className="block text-sm font-medium text-gray-700">
          Duration:
        </label>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        <label className="block text-sm font-medium text-gray-700">
          Components:
        </label>
        <div className="flex gap-2 items-center">
          <div className="grid grid-cols-2 grid-rows-3 gap-1 gap-x-5">
            <label className="block text-sm font-medium text-gray-700">
              Vocal
            </label>
            <input
              type="checkbox"
              checked={components.Vocal}
              onChange={(e) =>
                setComponents((prev) => ({
                  ...prev,
                  Vocal: e.target.checked,
                }))
              }
            />
            <label className="block text-sm font-medium text-gray-700">
              Somatic
            </label>
            <input
              type="checkbox"
              checked={components.Somatic}
              onChange={(e) =>
                setComponents((prev) => ({
                  ...prev,
                  Somatic: e.target.checked,
                }))
              }
            />
            <label className="block text-sm font-medium text-gray-700">
              Material
            </label>
            <input
              type="checkbox"
              checked={components.Material}
              onChange={(e) =>
                setComponents((prev) => ({
                  ...prev,
                  Material: e.target.checked,
                }))
              }
            />
          </div>
          <textarea
            disabled={!components.Material}
            placeholder="Material Description"
            value={components.MaterialDesc}
            onChange={(e) => {
              setComponents((prev) => ({
                ...prev,
                MaterialDesc: e.target.value,
              }));
            }}
            className="p-2 border border-gray-300 rounded-lg h-full w-full resize-none"
          />
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Description:
        </label>

        <Suspense fallback={<div>Loading editor...</div>}>
          <TextEditor
            placeholder="Type or paste your spell description here!"
            value={description}
            onChange={(val) => {
              setDescription(val);
            }}
          />
        </Suspense>
        <button
          type="button"
          onClick={spell ? updateSpell : createSpell}
          className="p-2 bg-green-500 text-white rounded-lg my-4"
        >
          {spell ? "Update" : "Create"} Spell
        </button>
      </div>
    </Modal>
  );
};

export default CreateSpellModal;
