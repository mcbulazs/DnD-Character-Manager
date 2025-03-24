import type React from "react";
import { type ReactNode, createContext, useContext, useState } from "react";

// Define the shape of the context value
interface HeaderContextType {
  title: JSX.Element | null;
  setTitle: React.Dispatch<React.SetStateAction<JSX.Element | null>>;
}

// Create the context with a default value
const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

// Custom hook for easier access to the context
export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
};

// Define the props type for HeaderProvider
interface HeaderProviderProps {
  children: ReactNode;
}

// HeaderProvider component
const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const [title, setTitle] = useState<JSX.Element | null>(null);

  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  );
};
export default HeaderProvider;
