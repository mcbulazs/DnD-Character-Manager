const backendUrl = () => {
  return "http://localhost:8080/api/";
};
const websocketBackendUrl = () => {
  return "ws://localhost:8080/api/ws/";
};

export default backendUrl;
export const websocketUrl = websocketBackendUrl;
