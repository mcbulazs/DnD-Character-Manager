import type React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../store/utility/authSlice";

interface AuthGuardProps {
	children: JSX.Element;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
	const isLoggedIn = useSelector(selectIsLoggedIn);

	// Redirect to home page if logged in
	if (isLoggedIn) {
		return <Navigate to="/" replace />;
	}

	// Allow access if not logged in
	return children;
};

export default AuthGuard;
