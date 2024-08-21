import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../store/utility/authSlice";
import { useNavigate } from "react-router-dom";
import CreateCharacterButton from "./CreateCharacterButton";
import CharacterListCard from "./CharacterListCard";
import { setHeaderText } from "../../store/utility/headerSlice";
import { useDispatch } from "react-redux";
import { useGetCharactersQuery } from "../../store/api/characterApiSlice";
import { toast } from "react-toastify";

const CharacterList: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isLoggedIn = useSelector(selectIsLoggedIn);
    const { data: characters, error, isLoading } = useGetCharactersQuery();

    useEffect(() => {
        dispatch(setHeaderText("Character List"));

        if (!isLoggedIn) {
            navigate("/login");
        }

        if (error) {
            toast("Error loading characters", { type: "error" });
        }
    }, [dispatch, isLoggedIn, navigate, error]);
    
    if (isLoading) {
        return <div>Loading...</div>;
    }

	return (
		<>
			<div className="flex w-full lg:w-4/5 flex-wrap justify-evenly gap-4">
                {characters?.map((character) => (
                    <CharacterListCard key={character.ID} character={character} />
                ))}
			</div>
			<CreateCharacterButton />
		</>
	);
};
export default CharacterList;
