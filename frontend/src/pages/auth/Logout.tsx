import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../store/api/userApiSlice";
import { toast } from "react-toastify";
//import { resetApiState } from "../../store/store";

const Logout: React.FC = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  //const dispatch = useDispatch();
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout().unwrap();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed", error);
        toast("An unexpected error occurred", { type: "error" });
      }
    };

    performLogout();
  }, [navigate, logout]);

  return (
    <div className="w-1/3 m-auto mt-10 text-center">
      <h1 className="text-3xl font-bold">Logging out...</h1>
    </div>
  );
};

export default Logout;
