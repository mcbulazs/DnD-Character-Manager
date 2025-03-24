import { useState } from "react";
import type { UserData } from "../../types/user";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import Scrollbars from "react-custom-scrollbars-2";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Modal from "../../components/Modal";
import { useSendFriendRequestMutation } from "../../store/api/friendApiSlice";
import type { ApiError } from "../../types/apiError";
import { toast } from "react-toastify";
const FriendList: React.FC<{
  friends?: UserData[];
  onFriendSelect: (friend: UserData) => void;
}> = ({ friends, onFriendSelect }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [sendFriendRequestMutation] = useSendFriendRequestMutation();
  const handleSendFriendRequest = async () => {
    try {
      const asd = await sendFriendRequestMutation({ email });
      if (asd.error) throw asd.error;

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
  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="flex bg-gray-600 text-gray-100 p-1 items-center gap-1">
          <SearchIcon />
          <input
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
            placeholder="Search"
            className=" w-full bg-transparent outline-none"
          />
          <button
            onClick={() => setModalOpen(true)}
            type="button"
            className="hover:text-amber-500 hover:bg-gray-600 duration-300 ease-in-out rounded-md"
          >
            <PersonAddIcon />
          </button>
        </div>
        <div className="flex-1 w-full">
          <Scrollbars className="w-full bg-gray-400 " universal>
            {friends
              ?.filter((friend) => friend.email.includes(search))
              .map((friend) => (
                <div
                  key={friend.id}
                  className="hover:bg-gray-500 ease-in-out duration-300 p-1 flex w-full cursor-pointer"
                >
                  <span
                    className="w-full"
                    onMouseUp={() => onFriendSelect(friend)}
                  >
                    {friend.email}
                  </span>
                  <button
                    type="button"
                    className="hover:text-amber-500 hover:bg-gray-600 duration-300 ease-in-out rounded-md"
                  >
                    <EditIcon />
                  </button>
                </div>
              ))}
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
