import { createContext, useContext, useRef } from "react";

type TouchLockContextType = {
  acquireLock: (claimer: string) => boolean;
  releaseLock: (claimer: string) => void;
  isLocked: (claimer: string) => boolean;
};

const TouchLockContext = createContext<TouchLockContextType | null>(null);

export const TouchLockProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isLocked = useRef(false);
  const owner = useRef<React.ReactNode | null>(null);

  const acquireLock = (claimer: string) => {
    if (isLocked.current) return false;
    isLocked.current = true;
    owner.current = claimer;
    return true;
  };

  const releaseLock = (claimer: string) => {
    if (owner.current !== claimer) return;
    owner.current = null;
    isLocked.current = false;
  };
  const isLockedForClaimer = (claimer: string) => {
    const isLocked = owner.current !== null && owner.current !== claimer;
    return isLocked;
  };

  return (
    <TouchLockContext.Provider
      value={{ isLocked: isLockedForClaimer, acquireLock, releaseLock }}
    >
      {children}
    </TouchLockContext.Provider>
  );
};

export const useTouchLockContext = () => {
  const context = useContext(TouchLockContext);
  if (!context) {
    throw new Error("useTouchLock must be used within a TouchLockProvider");
  }
  return context;
};
