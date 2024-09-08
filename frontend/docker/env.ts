const backendUrl = () => {
	// TODO manage url from environment
	const url = process.env.VITE_API_URL || "http://localhost/api";
	return url;
};

export default backendUrl;