import type React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../store/api/userApiSlice";
import { resetApiState } from "../../store/store";
import { logOut } from "../../store/utility/authSlice";
import { selectIsLoggedIn } from "../../store/utility/authSlice";

const Logout: React.FC = () => {
	const [logout] = useLogoutMutation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isLoggedIn = useSelector(selectIsLoggedIn);
	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
		}
		const performLogout = async () => {
			try {
				await logout();
				dispatch(logOut());
				resetApiState(dispatch);
				navigate("/login");
			} catch (error) {
				console.error("Logout failed", error);
			}
		};

		performLogout();
	}, [navigate, dispatch, logout, isLoggedIn]);

	return (
		<div className="w-1/3 m-auto mt-10 text-center">
			<h1 className="text-3xl font-bold">Logging out...</h1>
		</div>
	);
};

export default Logout;
