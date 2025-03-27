import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom/server"; // Use StaticRouter
import App from "./App";
import { configureAppStore } from "./store/store";
import "./index.css";

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

  const GetHeader = () => {
    switch (url) {
      case "/":
        return (
          <>
            <title>DnD Character Manager</title>
            <link rel="canonical" href="https://dnd.bulazs.com/" />
            <meta name="description" content="Manage your DnD characters" />
            <meta name="og:description" content="Manage your DnD characters" />
          </>
        );
      case "/login":
        return (
          <>
            <title>Login</title>
            <meta name="description" content="Login to your account" />
            <meta name="og:description" content="Login to your account" />
          </>
        );
      case "/register":
        return (
          <>
            <title>Register</title>
            <meta name="description" content="Register for an account" />
            <meta name="og:description" content="Register for an account" />
          </>
        );
      case "/dicethrow":
        return (
          <>
            <title>Dice Throw</title>
            <meta name="description" content="Throw some dice" />
            <meta name="og:description" content="Throw some dice" />
          </>
        );
      default:
        return <></>;
    }
  };
  const head = ReactDOMServer.renderToString(GetHeader());
  const preloadedState = store.getState();
  return { html, preloadedState, head };
}
