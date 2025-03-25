import { useDispatch } from "react-redux";
import { userTag } from "../store/api/tags";
import useWebSocket from "./websocket";
import { userApiSlice } from "../store/api/userApiSlice";
import { toast } from "react-toastify";

const friendRequestWebsocket = (userId?: number) => {
  const url = `friendRequest/${userId}`;
  const dispatch = useDispatch();
  const handleMessage = (data: MessageEvent) => {
    console.log("WebSocket message received");
    dispatch(userApiSlice.util.invalidateTags([userTag]));
    toast(`You have a new friend request from ${data.data}`, { type: "info" });
  };

  // Handle errors
  const handleError = (error: Event) => {
    console.error("WebSocket error:", error);
  };

  // Handle connection close
  const handleClose = () => {
    console.log("WebSocket connection closed");
  };

  // Create a new WebSocket
  useWebSocket(url, handleMessage, handleError, handleClose, userId === null);
};

export default friendRequestWebsocket;
