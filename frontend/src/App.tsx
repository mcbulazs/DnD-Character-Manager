import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Router from "./Routes/Router";
import HeaderProvider from "./layout/Contexts/HeaderContext";

function App() {
	return (
		<HeaderProvider>
			<Router />
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</HeaderProvider>
	);
}

export default App;
