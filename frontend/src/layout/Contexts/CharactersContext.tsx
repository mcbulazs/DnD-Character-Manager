import type { SerializedError } from "@reduxjs/toolkit";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
	useGetCharacterByIdQuery,
	useGetCharactersQuery,
} from "../../store/api/characterApiSlice";
import type { ApiError } from "../../types/apiError";
import type { CharacterBase } from "../../types/characterBase";
import type { CharacterData } from "../../types/characterData";

// Define the context shape
interface CharactersContextType {
	characters: CharacterBase[] | null;
	isLoading: boolean;
	error: ApiError | SerializedError | undefined;
}

// Create the context
const CharactersContext = createContext<CharactersContextType | undefined>(
	undefined,
);

// Create a hook to use the context
export const useCharactersContext = () => {
	const context = useContext(CharactersContext);
	if (!context) {
		throw new Error(
			"useCharactersContext must be used within a CharactersProvider",
		);
	}
	return context;
};

// CharactersProvider component that wraps the app
export const CharactersProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { data: characters, isLoading, error } = useGetCharactersQuery();
	const [currentCharacters, setCurrentCharacters] = useState<
		CharacterBase[] | null
	>(null);

	useEffect(() => {
		if (characters) {
			setCurrentCharacters(characters);
		}
	}, [characters]);

	return (
		<CharactersContext.Provider
			value={{ characters: currentCharacters, isLoading, error }}
		>
			{children}
		</CharactersContext.Provider>
	);
};
