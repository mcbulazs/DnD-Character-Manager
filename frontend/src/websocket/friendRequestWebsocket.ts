import { useDispatch } from "react-redux";
import { userTag } from "../store/api/tags";
import useWebSocket from "./websocket";
import { userApiSlice } from "../store/api/userApiSlice";
import { toast } from "react-toastify";

const friendRequestWebsocket = (userId?: number) => {
  const url = `users/${userId}`;
  const dispatch = useDispatch();
  const handleMessage = (data: MessageEvent) => {
    if (!data.data) {
      return;
    }
    dispatch(userApiSlice.util.invalidateTags([userTag]));
    toast(data.data, { type: "info" });
  };

  // Handle errors
  const handleError = (error: Event) => {
    console.error("WebSocket error:", error);
  };

  // Handle connection close
  const handleClose = () => { };

  // Create a new WebSocket
  useWebSocket(
    url,
    handleMessage,
    handleError,
    handleClose,
    userId === undefined,
  );
};

export default friendRequestWebsocket;
