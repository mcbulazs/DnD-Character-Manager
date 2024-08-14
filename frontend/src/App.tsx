import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DesktopLayout from "./layout/desktop-layout";

function App() {

  return (
    <BrowserRouter>
			<Routes>
				<Route path="/" element={<DesktopLayout />}>  
        </Route>
			</Routes>
		</BrowserRouter>
  )
}

export default App
