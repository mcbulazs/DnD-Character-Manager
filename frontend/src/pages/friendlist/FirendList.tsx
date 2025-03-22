import { useState } from "react";
import type { UserData } from "../../types/user";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import Scrollbars from "react-custom-scrollbars-2";
const FriendList: React.FC<{
  friends: UserData[];
  onFriendSelect: (friend: UserData) => void;
}> = ({ friends, onFriendSelect }) => {
  const [search, setSearch] = useState("");
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex bg-gray-600 text-gray-100 p-1">
        <input
          onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          placeholder="Search"
          className=" w-full bg-transparent outline-none"
        />
        <SearchIcon />
      </div>
      <div className="flex-1 w-full">
        <Scrollbars className="w-full bg-gray-400 " universal>
          {friends
            .filter((friend) => friend.email.includes(search))
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
  );
};

export default FriendList;
