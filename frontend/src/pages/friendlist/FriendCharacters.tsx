import type React from "react";
import { toast } from "react-toastify";
import { useGetSharedCharactersQuery } from "../../store/api/friendApiSlice";
import CharacterListCard from "../characters/CharacterListCard";
import Scrollbars from "react-custom-scrollbars-2";

const FriendCharacters: React.FC<{ friendId: number }> = ({ friendId }) => {
  const {
    data: characters,
    isLoading,
    error,
  } = useGetSharedCharactersQuery(friendId);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    toast("Error loading characters", { type: "error" });
    console.error("Error loading characters", error);
    return <div>Error loading characters</div>;
  }
  if (!characters) {
    return <div>No characters found</div>;
  }

  return (
    <Scrollbars className="w-full h-full" universal>
      <div className="w-full flex flex-wrap justify-evenly gap-4">
        {characters.map((character) => (
          <CharacterListCard
            key={character.ID}
            character={character}
            isOwner={false}
          />
        ))}
      </div>
    </Scrollbars>
  );
};
export default FriendCharacters;
