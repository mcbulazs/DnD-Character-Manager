import type React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../store/utility/authSlice";

interface AuthGuardProps {
	children: React.ReactNode;
	loggedInRequired: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
	children,
	loggedInRequired,
}) => {
	const isLoggedIn = useSelector(selectIsLoggedIn);

	if (isLoggedIn === loggedInRequired) {
		return <>{children}</>; // Return children wrapped in a fragment
	}

	return <div>Log {loggedInRequired ? "in" : "out"} to view this page</div>;
};

export default AuthGuard;
