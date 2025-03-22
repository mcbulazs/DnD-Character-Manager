import type React from "react";
import { toast } from "react-toastify";
import { useGetSharedCharactersQuery } from "../../store/api/friendApiSlice";
import CharacterListCard from "../characters/CharacterListCard";

const FriendCharacters: React.FC<{ friendId: number }> = ({ friendId }) => {
  const {
    data: characters,
    isLoading,
    error,
  } = useGetSharedCharactersQuery(friendId);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !characters) {
    toast("Error loading characters", { type: "error" });
    console.error("Error loading characters", error);
    return <div>Error loading characters</div>;
  }

  return (
    <div className="w-full lg:w-4/5 flex flex-wrap justify-evenly gap-4">
      {characters?.map((character) => (
        <CharacterListCard
          key={character.id}
          character={character}
          isOwner={false}
        />
      ))}
    </div>
  );
};
export default FriendCharacters;
