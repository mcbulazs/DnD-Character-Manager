import { useState } from "react";
import { useUserContext } from "../../layout/Contexts/UserContext";
import FriendList from "./FirendList";
import type { UserData } from "../../types/user";
import FriendRequests from "./FriendRequests";
import FriendCharacters from "./FriendCharacters";

const Friends: React.FC = () => {
  const { User } = useUserContext();
  const [selectedFriend, setSelectedFriend] = useState<UserData | null>(null);
  if (!User) {
    return <div>Error...</div>;
  }
  console.log(User);
  return (
    <div className="flex w-full lg:w-4/5 justify-between">
      <div className="h-full w-44 flex flex-col bg-light-parchment-beige border-4 border-shadow-black rounded-md">
        <FriendList friends={User.friends} onFriendSelect={setSelectedFriend} />
        {User.friendRequests?.length > 0 && (
          <FriendRequests requests={User.friendRequests} />
        )}
      </div>
      {selectedFriend && <FriendCharacters friendId={selectedFriend.id} />}
    </div>
  );
};

export default Friends;
