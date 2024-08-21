import React, { useEffect } from 'react';
import { useLogoutMutation } from '../../store/api/userApiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from '../../store/utility/authSlice';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../store/utility/authSlice';

const Logout: React.FC = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
    const performLogout = async () => {
      try {
        await logout().unwrap(); 
        dispatch(logOut());
        navigate('/login'); 
      } catch (error) {
        console.error('Logout failed', error);
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="w-1/3 m-auto mt-10 text-center">
      <h1 className="text-3xl font-bold">Logging out...</h1>
    </div>
  );
};

export default Logout;
