import type React from "react";
import { useIsAuthenticatedQuery } from "../store/api/userApiSlice";
import UserProvider from "../layout/Contexts/UserContext";
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
    return <UserProvider>{children}</UserProvider>;
  }

  return <div>Log in to view this page</div>;
};

export default AuthGuard;
