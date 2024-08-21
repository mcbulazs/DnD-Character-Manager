import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DesktopLayout from "./layout/Desktop-layout";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './components/toast/toast.css';
import Register from './pages/auth/Register';
import AuthGuard from './components/AuthGuard';
import CharacterList from './pages/characters/CharacterList';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from './store/utility/authSlice';
import Cookies from 'js-cookie';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('session');
    if (token) {
      dispatch(setLoggedIn(true));
    }
  }, [ dispatch ]);

  return (
    <BrowserRouter>
			<Routes>
				<Route path="/" element={<DesktopLayout />}>
          <Route path="register" element={
            <AuthGuard>
              <Register />
            </AuthGuard>
          } />  
          <Route path="login" element={ 
              <AuthGuard>
                <Login />
              </AuthGuard>
            } />
          <Route path="logout" element={<Logout />} />
          <Route path="characters" element={<CharacterList />} />
          
        </Route>
			</Routes>
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
		</BrowserRouter>
  )
}

export default App
