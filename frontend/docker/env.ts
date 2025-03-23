const backendUrl = () => {
  // TODO manage url from environment
  if (typeof window === "undefined") {
    return "";
  }
  origin = window.location.origin;
  //const url = process.env.VITE_API_URL || "http://localhost/api";
  const url = origin + "/api";
  return url;
};
const websocketBackendUrl = () => {
  // TODO manage url from environment
  if (typeof window === "undefined") {
    return "";
  }
  origin = window.location.origin;
  //const url = process.env.VITE_API_URL || "http://localhost/api";
  const url = origin + "/api/ws/";
  const websocketUrl = url.replace(/^http/, "ws");
  return websocketUrl;
}

export default backendUrl;
export const websocketUrl = websocketBackendUrl;
