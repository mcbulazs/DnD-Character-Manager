import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DesktopLayout from "./layout/Desktop-layout";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <BrowserRouter>
			<Routes>
				<Route path="/" element={<DesktopLayout />}>  
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
        </Route>
			</Routes>
		</BrowserRouter>
  )
}

export default App
