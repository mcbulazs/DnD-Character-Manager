import { useState } from "react";
import type { Friends } from "../../types/user";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import Scrollbars from "react-custom-scrollbars-2";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Modal from "../../components/Modal";
import {
  useSendFriendRequestMutation,
  useUpdateFriendNameMutation,
} from "../../store/api/friendApiSlice";
import type { ApiError } from "../../types/apiError";
import { toast } from "react-toastify";
const FriendList: React.FC<{
  friends?: Friends[];
  onFriendSelect: (friend: Friends) => void;
  buttonsActive?: boolean;
}> = ({ friends, onFriendSelect, buttonsActive }) => {
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [editFriendId, setEditFriendId] = useState<number | null>(null);
  const [editFriendValue, setEditFriendValue] = useState("");
  const [defaultFriendValue, setDefaultFriendValue] = useState("");
  const [sendFriendRequestMutation] = useSendFriendRequestMutation();
  const [updateFriendNameMutation] = useUpdateFriendNameMutation();
  const handleSendFriendRequest = async () => {
    try {
      const result = await sendFriendRequestMutation({ email });
      if (result.error) throw result.error;

      toast("Friend request sent", { type: "success" });
      setModalOpen(false);
      setEmail("");
    } catch (error) {
      const err = error as ApiError;
      if (err.status === 404) {
        toast("User not found", { type: "error" });
      }
      if (err.status === 409) {
        toast("User not found", { type: "error" });
      }
    }
  };

  const handleRenameing = () => {
    setEditFriendId(null);
    setEditFriendValue("");
    if (editFriendValue === "" || editFriendValue == defaultFriendValue) return;
    updateFriendNameMutation({
      friendId: editFriendId as number,
      name: editFriendValue,
    });
  };
  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="flex bg-gray-800 text-gray-100 p-1 items-center gap-1">
          <SearchIcon />
          <input
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
            placeholder="Search"
            className=" w-full bg-transparent outline-none"
          />
          {buttonsActive && (
            <button
              onClick={() => setModalOpen(true)}
              type="button"
              className="hover:text-amber-500 hover:bg-gray-600 duration-300 ease-in-out rounded-md"
            >
              <PersonAddIcon />
            </button>
          )}
        </div>
        <div className="flex-1 w-full">
          <Scrollbars className="w-full bg-gray-400 " universal>
            {friends
              ?.filter((friend) => friend.friend.email.includes(search))
              .map((friend) =>
                editFriendId === friend.friend.id ? (
                  <div
                    key={friend.friend.id}
                    className="w-full bg-gray-800 text-white flex justify-between p-1"
                  >
                    <input
                      autoFocus
                      className="bg-gray-800 text-white w-full outline-none"
                      type="text"
                      value={editFriendValue}
                      onChange={(val) => setEditFriendValue(val.target.value)}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") handleRenameing();
                      }}
                      onBlur={handleRenameing}
                    />
                    <button
                      type="button"
                      onClick={handleRenameing}
                      className="hover:text-amber-500 hover:bg-gray-600 duration-300 ease-in-out rounded-md"
                    >
                      <CheckIcon />
                    </button>
                  </div>
                ) : (
                  <div
                    key={friend.friend.id}
                    className={`${selectedFriendId == friend.friend.id ? "bg-gray-600 hover:bg-gray-700" : "hover:bg-gray-500"} 
                      ease-in-out duration-300 p-1 flex w-full cursor-pointer`}
                  >
                    <span
                      className="w-full"
                      onMouseUp={() => {
                        setSelectedFriendId(friend.friend.id);
                        onFriendSelect(friend);
                      }}
                    >
                      {friend.name != "" ? friend.name : friend.friend.email}
                    </span>
                    {buttonsActive && (
                      <button
                        type="button"
                        className="hover:text-amber-500 hover:bg-gray-600 duration-300 ease-in-out rounded-md"
                        onClick={() => {
                          setEditFriendId(friend.friend.id);
                          setEditFriendValue(
                            friend.name != ""
                              ? friend.name
                              : friend.friend.email,
                          );
                          setDefaultFriendValue(
                            friend.name != ""
                              ? friend.name
                              : friend.friend.email,
                          );
                        }}
                      >
                        <EditIcon />
                      </button>
                    )}
                  </div>
                ),
              )}
          </Scrollbars>
        </div>
      </div>
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <div className="w-full flex flex-col">
            <h1 className="text-2xl mb-5">Send Friend Request</h1>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-shadow-black outline-none p-2"
              placeholder="example@mail.com"
            />
            <button
              onClick={handleSendFriendRequest}
              type="button"
              className="rounded-lg bg-green-500 hover:bg-green-700 ease-in-out duration-300 text-white mt-5"
            >
              Add Friend
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default FriendList;
