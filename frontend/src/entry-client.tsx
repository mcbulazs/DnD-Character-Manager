import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { configureAppStore } from "./store/store";
import "./index.css"

const rootElement = document.getElementById("root");

if (!rootElement) {
	console.error("Root element not found");
	throw new Error("Root element not found");
}

// Create Redux store with state injected by the server
//@ts-ignore
const store = configureAppStore(window.__PRELOADED_STATE__);

// Allow the passed state to be garbage-collected
//@ts-ignore
//biome-ignore lint/performance/noDelete: This is necessary to prevent memory leaks
delete window.__PRELOADED_STATE__;

ReactDOM.hydrateRoot(
	rootElement as HTMLElement,
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
);
