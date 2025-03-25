import { useEffect, useRef } from "react";
import { websocketUrl } from "../env";

const useWebSocket = (
  url: string,
  onMessage: (message: string) => void,
  onError: (error: Event) => void,
  onClose: () => void,
  ignore: boolean,
) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (ignore) return;

    // Create WebSocket connection
    const websocketurl = websocketUrl();
    const socket = new WebSocket(websocketurl + url);
    socketRef.current = socket;

    // Event handlers
    const handleMessage = (event: MessageEvent) => {
      onMessage?.(event.data);
    };

    const handleError = (error: Event) => {
      onError?.(error);
    };

    const handleClose = () => {
      onClose?.();
    };

    socketRef.current.addEventListener("message", handleMessage);
    socketRef.current.addEventListener("error", handleError);
    socketRef.current.addEventListener("close", handleClose);

    // Cleanup function
    return () => {
      if (!socketRef.current) return;
      socketRef.current.removeEventListener("message", handleMessage);
      socketRef.current.removeEventListener("error", handleError);
      socketRef.current.removeEventListener("close", handleClose);

      // Close connection if still open
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socketRef.current.close(1000, "Component unmounted"); // Normal closure code
      }
    };
  }, [url, ignore]);
};

export default useWebSocket;
