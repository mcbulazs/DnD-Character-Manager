import type { SerializedError } from "@reduxjs/toolkit";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useGetCharactersQuery } from "../../store/api/characterApiSlice";
import { useIsAuthenticatedQuery } from "../../store/api/userApiSlice";
import type { ApiError } from "../../types/apiError";
import type { CharacterBase } from "../../types/characterBase";

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
	const { data } = useIsAuthenticatedQuery();
	const isLoggedIn = data?.authenticated;
	const [currentCharacters, setCurrentCharacters] = useState<
		CharacterBase[] | null
	>(null);
	const {
		data: characters,
		isLoading,
		error,
	} = useGetCharactersQuery(undefined, {
		skip: !isLoggedIn, // Conditionally skip fetching
	});

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
