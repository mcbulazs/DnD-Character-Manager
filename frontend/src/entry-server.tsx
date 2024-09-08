import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom/server"; // Use StaticRouter
import App from "./App";
import { configureAppStore } from "./store/store";
import "./index.css"

export function render(url: string) {
	const store = configureAppStore();
	const html = ReactDOMServer.renderToString(
		<Provider store={store}>
			<StaticRouter location={url}>
				<App />
			</StaticRouter>
		</Provider>,
	);
	console.log("Rendering on server");

	const preloadedState = store.getState();
	return { html, preloadedState };
}
