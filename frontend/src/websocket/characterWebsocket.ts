import { useDispatch } from "react-redux";
import { characterApiSlice } from "../store/api/characterApiSlice";
import { characterTag } from "../store/api/tags";
import useWebSocket from "./websocket";

const characterWebsocket = (characterId?: number, skip?: boolean) => {
  let ignore = false;
  if (!characterId || skip) {
    ignore = true;
  }
  const url = `characters/${characterId}`;
  const dispatch = useDispatch();
  const handleMessage = (data: MessageEvent) => {
    if (!data.data) {
      return;
    }
    console.log("WebSocket message received");
    dispatch(characterApiSlice.util.invalidateTags([characterTag]));
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
  useWebSocket(url, handleMessage, handleError, handleClose, ignore);
};

export default characterWebsocket;
