const backendUrl = () => {
	const url = process.env.REACT_APP_API_URL;
	console.log('url', url);
	return url;
};

export default backendUrl;