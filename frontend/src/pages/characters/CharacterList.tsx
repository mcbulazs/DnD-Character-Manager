import React from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../store/utility/authSlice";
import { useNavigate } from "react-router-dom";
import CreateCharacterButton from "./CreateCharacterButton";
import CharacterListCard from "./CharacterListCard";
import { setHeaderText } from "../../store/utility/headerSlice";
import { useDispatch } from "react-redux";

const CharacterList: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	dispatch(setHeaderText("Character List"));
	if (!isLoggedIn) {
		navigate("/login");
	}

	return (
		<>
			<div className="flex w-full lg:w-4/5 flex-wrap justify-evenly gap-4">
				<CharacterListCard isFavorite={false}/>
				<CharacterListCard isFavorite={true}/>
				<CharacterListCard />
                <CharacterListCard />
                <CharacterListCard />
                <CharacterListCard />
				<CharacterListCard />
				<CharacterListCard />
				<CharacterListCard />
			</div>
			<CreateCharacterButton />
		</>
	);
};
export default CharacterList;
