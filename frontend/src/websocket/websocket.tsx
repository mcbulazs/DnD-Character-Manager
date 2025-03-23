import { useEffect } from "react";
import { websocketUrl } from "../env";

const useWebSocket = (
  url: string,
  onMessage: (message: MessageEvent) => void,
  onError: (error: Event) => void,
  onClose: () => void,
  ignore: boolean,
) => {
  useEffect(() => {
    if (ignore) {
      return;
    }
    // Connect to the WebSocket server
    const websocketurl = websocketUrl();
    const socket = new WebSocket(websocketurl + url);

    // Handle incoming messages
    socket.onmessage = (event) => {
      if (onMessage) {
        onMessage(event.data); // Pass the message data to the callback
      }
    };

    // Handle errors
    socket.onerror = (error) => {
      if (onError) {
        onError(error); // Pass the error to the callback
      }
    };

    // Handle connection close
    socket.onclose = () => {
      if (onClose) {
        onClose(); // Call the onClose callback
      }
    };
  }, [url, onMessage, onError, onClose, ignore]); // Re-run if any of these dependencies change
};

export default useWebSocket;
