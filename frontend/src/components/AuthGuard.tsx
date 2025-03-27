import type React from "react";
import { useIsAuthenticatedQuery } from "../store/api/userApiSlice";
interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { data } = useIsAuthenticatedQuery();
  const isLoggedIn = data?.authenticated;

  if (isLoggedIn) {
    return <>{children}</>;
  }

  return <div>Log in to view this page</div>;
};

export default AuthGuard;
