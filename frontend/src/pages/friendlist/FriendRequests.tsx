import type { FriendRequest } from "../../types/user";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import {
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
} from "../../store/api/friendApiSlice";
const FriendRequests: React.FC<{ requests?: FriendRequest[] }> = ({
  requests,
}) => {
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const [declineRequest] = useDeclineFriendRequestMutation();
  const handleAccept = (id: number) => {
    acceptRequest({ friendRequestId: id });
  };
  const handleDecline = (id: number) => {
    declineRequest({ friendRequestId: id });
  };
  if (!requests || requests.length === 0) {
    return null;
  }
  return (
    <div className="justify-self-end bg-blue-200 border-t-4 border-shadow-black">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex justify-between p-1 gap-1 hover:bg-blue-300 ease-in-out duration-300"
        >
          {request.sender.email}
          <div className="flex">
            <button
              type="button"
              className="hover:bg-blue-400 rounded-md hover:text-green-600 ease-in-out duration-300"
              onClick={() => handleAccept(request.id)}
            >
              <CheckIcon />
            </button>
            <button
              type="button"
              className="hover:bg-blue-400 rounded-md hover:text-red-600 ease-in-out duration-300"
              onClick={() => handleDecline(request.id)}
            >
              <ClearIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;
