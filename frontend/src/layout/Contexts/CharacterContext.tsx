import type { SerializedError } from "@reduxjs/toolkit";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useGetCharacterByIdQuery } from "../../store/api/characterApiSlice";
import type { ApiError } from "../../types/apiError";
import type { CharacterData } from "../../types/characterData";

// Define the context shape
interface CharacterContextType {
  character: CharacterData | null;
  isLoading: boolean;
  error: ApiError | SerializedError | undefined;
}

// Create the context
const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined,
);

// Create a hook to use the context
export const useCharacterContext = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error(
      "useCharacterContext must be used within a CharacterProvider",
    );
  }
  return context;
};

// CharacterProvider component that wraps the app
export const CharacterProvider: React.FC<{
  characterId: number;
  children: React.ReactNode;
}> = ({ characterId, children }) => {
  const {
    data: character,
    isLoading,
    error,
  } = useGetCharacterByIdQuery(characterId);
  const [currentCharacter, setCurrentCharacter] =
    useState<CharacterData | null>(null);
  useEffect(() => {
    if (character) {
      setCurrentCharacter(character);
    }
  }, [character]);

  return (
    <CharacterContext.Provider
      value={{ character: currentCharacter, isLoading, error }}
    >
      {children}
    </CharacterContext.Provider>
  );
};
