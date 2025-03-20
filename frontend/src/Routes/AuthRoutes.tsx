import { Route, Routes } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import Login from "../pages/auth/Login";
import Logout from "../pages/auth/Logout";
import Register from "../pages/auth/Register";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route
        path="register"
        element={
          <AuthGuard loggedInRequired={false}>
            <Register />
          </AuthGuard>
        }
      />
      <Route
        path="login"
        element={
          <AuthGuard loggedInRequired={false}>
            <Login />
          </AuthGuard>
        }
      />

      <Route
        path="logout"
        element={
          <AuthGuard loggedInRequired={true}>
            <Logout />
          </AuthGuard>
        }
      />
    </Routes>
  );
};
export default AuthRoutes;
