import type React from "react";
import {useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCharactersQuery } from "../../store/api/characterApiSlice";
import { selectIsLoggedIn } from "../../store/utility/authSlice";
import { setHeaderText } from "../../store/utility/headerSlice";
import CharacterListCard from "./CharacterListCard";
import CreateCharacterButton from "./CreateCharacterButton";
import CreateCharacterModal from "./CreateCharacterModal";

const CharacterList: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isLoggedIn = useSelector(selectIsLoggedIn);
    const { data: characters, error, isLoading } = useGetCharactersQuery();

	const [modalOpen, setModalOpen] = useState(false);

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
			<CreateCharacterButton setOpen={setModalOpen} />
            <CreateCharacterModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
		</>
	);
};
export default CharacterList;
