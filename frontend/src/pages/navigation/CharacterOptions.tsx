import { useCallback, useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { useCharacterContext } from "../../layout/Contexts/CharacterContext";
import { CharacterOptions } from "../../types/characterData";
import { useModifyCharacterOptionsMutation } from "../../store/api/characterApiSlice";
import debounce from "../../utility/debounce";
import Scrollbars from "react-custom-scrollbars-2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReplyIcon from "@mui/icons-material/Reply";
import Modal from "../../components/Modal";
import { useUserContext } from "../../layout/Contexts/UserContext";
import FriendList from "../friendlist/FirendList";
import {
  useShareCharacterMutation,
  useUnshareCharacterMutation,
} from "../../store/api/friendApiSlice";
import { toast } from "react-toastify";

const CharactOptions: React.FC<{ closeOptions: () => void }> = ({
  closeOptions,
}) => {
  const { character, isLoading, error } = useCharacterContext();
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const { User } = useUserContext();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [options, setOptions] = useState<CharacterOptions>({
    isCaster: false,
    isDead: false,
    isXP: false,
    rollOption: false,
  });
  const [modifyCharacterOptionsMutation] = useModifyCharacterOptionsMutation();
  const [shareCharacterMutation] = useShareCharacterMutation();
  const [unshareCharacterMutation] = useUnshareCharacterMutation();
  useEffect(() => {
    if (character) {
      setOptions(character.options);
    }
  }, [character]);
  const handleSave = useCallback(
    debounce(async (_options) => {
      console.log("Saving options", _options);
      if (_options) {
        await modifyCharacterOptionsMutation({
          characterID: character!.ID,
          options: _options,
        });
      }
    }, 300),
    [options],
  );
  const shareCaracter = async () => {
    if (selectedFriendId == null) {
      return;
    }
    try {
      await shareCharacterMutation({
        friendId: selectedFriendId,
        characterId: character!.ID,
      }).unwrap();
      toast("Character shared", { type: "success" });
      setShareModalOpen(false);
    } catch (error) {
      console.error("Error sharing character", error);
      toast("Error sharing character", { type: "error" });
    }
  };
  const unshareCharacter = async (friendId: number) => {
    try {
      await unshareCharacterMutation({
        friendId,
        characterId: character!.ID,
      }).unwrap();
      toast("Character unshared", { type: "success" });
    } catch (error) {
      console.error("Error unsharing character", error);
      toast("Error unsharing character", { type: "error" });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !character || !options) {
    return <div>Error loading options</div>;
  }
  return (
    <>
      <div className="w-full p-5 flex flex-col items-center text-ancient-gold">
        <div className="w-full">
          <button
            onClick={closeOptions}
            className="flex flex-row items-center hover:text-amber-600"
          >
            <ArrowBackIcon />
            Back
          </button>
        </div>
        <div className="flex flex-col w-full h-full justify-around">
          <label className="flex flex-row items-center gap-2">
            <input
              type="checkbox"
              checked={options.isCaster}
              onChange={(val) => {
                setOptions((prev) => {
                  const newVal = {
                    ...prev,
                    isCaster: val.target.checked,
                  };
                  handleSave(newVal);
                  return newVal;
                });
              }}
            />
            Caster
          </label>
          <label className="flex flex-row items-center gap-2">
            <input
              type="checkbox"
              checked={options.isDead}
              onChange={(val) => {
                setOptions((prev) => {
                  const newVal = {
                    ...prev,
                    isDead: val.target.checked,
                  };
                  handleSave(newVal);
                  return newVal;
                });
              }}
            />
            Dead
          </label>
          <label className="flex flex-row items-center gap-2">
            <input
              type="checkbox"
              checked={options.rollOption}
              onChange={(val) => {
                setOptions((prev) => {
                  const newVal = {
                    ...prev,
                    rollOption: val.target.checked,
                  };
                  handleSave(newVal);
                  return newVal;
                });
              }}
            />
            Add roll option to d20 checks
          </label>
          <div className="flex flex-row w-full justify-around">
            <label className="flex flex-row items-center gap-2">
              <input
                type="radio"
                name="xp"
                checked={!options.isXP}
                onChange={(val) => {
                  if (!val.target.checked) {
                    return;
                  }
                  setOptions((prev) => {
                    const newVal = {
                      ...prev,
                      isXP: false,
                    };
                    handleSave(newVal);
                    return newVal;
                  });
                }}
              />
              Milestone
            </label>
            <label className="flex flex-row items-center gap-2">
              <input
                type="radio"
                name="xp"
                checked={options.isXP}
                onChange={(val) => {
                  if (!val.target.checked) {
                    return;
                  }
                  setOptions((prev) => {
                    const newVal = {
                      ...prev,
                      isXP: true,
                    };
                    handleSave(newVal);
                    return newVal;
                  });
                }}
              />
              XP
            </label>
          </div>
          <div className="flex flex-row w-full justify-between mt-2">
            <span>Shared: </span>
            <button
              className="bg-amber-500 hover:bg-amber-400 duration-300 ease-in-out text-stone-900 font-bold py-1 px-2 rounded-md flex items-center gap-1"
              onClick={() => setShareModalOpen(true)}
            >
              <ReplyIcon />
              Share
            </button>
          </div>
          <div
            className="flex flex-col 
            text-shadow-black p-2 bg-gray-400 
            w-full h-96 justify-around rounded-md 
            overflow-hidden border-2 border-black"
          >
            <Scrollbars className="w-full" universal>
              {character.sharedWith?.map((user) => (
                <div
                  key={user.friend.id}
                  className="flex flex-row justify-between"
                >
                  <div>{user.name !== "" ? user.name : user.friend.email}</div>
                  <button
                    type="button"
                    className="bg-gray-500 flex justify-center items-center rounded-md
                    hover:bg-gray-600 hover:text-red-500
                    duration-300 ease-in-out"
                    onClick={() => {
                      unshareCharacter(user.friend.id);
                    }}
                  >
                    <ClearIcon />
                  </button>
                </div>
              ))}
            </Scrollbars>
          </div>
        </div>
      </div>
      {shareModalOpen && (
        <Modal onClose={() => setShareModalOpen(false)}>
          <div className="w-full h-52 rounded-md overflow-hidden border-black border-2">
            <FriendList
              friends={User?.friends.filter(
                (friend) =>
                  !character.sharedWith?.some(
                    (user) => user.friend.id === friend.friend.id,
                  ),
              )}
              onFriendSelect={(val) => setSelectedFriendId(val.friend.id)}
            />
          </div>
          <button
            className="w-full p-2 
            disabled:bg-gray-600 bg-green-500 hover:bg-green-600 
            duration-300 ease-in-out 
            text-white rounded-lg mt-4"
            disabled={selectedFriendId == null}
            onClick={() => {
              shareCaracter();
            }}
          >
            Share
          </button>
        </Modal>
      )}
    </>
  );
};

export default CharactOptions;
