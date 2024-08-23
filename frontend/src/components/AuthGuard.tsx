import type React from "react";
import { useIsAuthenticatedQuery } from "../store/api/userApiSlice";
interface AuthGuardProps {
	children: React.ReactNode;
	loggedInRequired: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
	children,
	loggedInRequired,
}) => {
	const { data } = useIsAuthenticatedQuery();
	const isLoggedIn = data?.authenticated;

	if (isLoggedIn === loggedInRequired) {
		return <>{children}</>; // Return children wrapped in a fragment
	}

	return <div>Log {loggedInRequired ? "in" : "out"} to view this page</div>;
};

export default AuthGuard;
