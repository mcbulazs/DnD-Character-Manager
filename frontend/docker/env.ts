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

export default backendUrl;
