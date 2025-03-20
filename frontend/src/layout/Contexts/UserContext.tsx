import type React from "react";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserData } from "../../types/user";
import { useGetUserDataQuery } from "../../store/api/userApiSlice";

// Define the shape of the context value
interface UserContextType {
  User: UserData | null;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook for easier access to the context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

// UserProvider component
const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data } = useGetUserDataQuery();
  const [user, setUser] = useState<UserData | null>(null);
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  return (
    <UserContext.Provider value={{ User: user }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
