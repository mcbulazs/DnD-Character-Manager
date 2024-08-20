import React, { useEffect } from 'react';
import { useLogoutMutation } from '../../store/api/userApiSlice';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout().unwrap(); 
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
