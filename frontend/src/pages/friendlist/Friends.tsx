import { useEffect, useState } from "react";
import { useUserContext } from "../../layout/Contexts/UserContext";
import FriendList from "./FirendList";
import type { Friends } from "../../types/user";
import FriendRequests from "./FriendRequests";
import FriendCharacters from "./FriendCharacters";
import { useHeaderContext } from "../../layout/Contexts/HeaderContext";

const Friends: React.FC = () => {
  const { User } = useUserContext();
  const [selectedFriend, setSelectedFriend] = useState<Friends | null>(null);
  const { setTitle } = useHeaderContext();
  useEffect(() => {
    setTitle(<h1>Friends</h1>);
  }, [setTitle]);
  if (!User) {
    return <div>Error...</div>;
  }
  return (
    <div className="flex w-full lg:w-4/5 justify-between">
      <div className="h-full w-44 flex flex-col bg-light-parchment-beige border-4 border-shadow-black rounded-md">
        <FriendList
          friends={User.friends}
          onFriendSelect={setSelectedFriend}
          buttonsActive
        />
        {User.friendRequests?.length > 0 && (
          <FriendRequests requests={User.friendRequests} />
        )}
      </div>
      {selectedFriend && (
        <FriendCharacters friendId={selectedFriend.friend.id} />
      )}
    </div>
  );
};

export default Friends;
