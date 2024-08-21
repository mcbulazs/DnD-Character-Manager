import React, { useState, ChangeEvent, FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../store/api/userApiSlice';
import { toast } from 'react-toastify';
import { ApiError } from '../../types/apiError';
import { logIn } from '../../store/authSlice';

interface UserCredentials {
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [credentials, setCredentials] = useState<UserCredentials>({ email: '', password: '' });
  const [registerMutate, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      await registerMutate(credentials).unwrap(); // No response data to check
      dispatch(logIn());
      toast('Registration successful', { type: 'success' });
      navigate('/');
    } catch (error) {
      const err = (error as ApiError);
      console.error('Registration failed', error);
      if (err.status === 409) {
        toast('User already exists', { type: 'warning' });
      } else {
        toast('An unexpected error occurred', { type: 'error' });
      }
    }
  };

  return (
    <div className="w-1/3 m-auto mt-10">
      <h1 className="text-center text-3xl font-bold">Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="my-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            className="w-full p-2 border border-gray-300 rounded"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="my-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            className="w-full p-2 border border-gray-300 rounded"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-700"
          disabled={isLoading} // Optional: disable the button while loading
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <NavLink to="/login" className="block text-center mt-2 text-blue-500 hover:underline">Already have an account? Login</NavLink>
        {error && <p className="text-red-500 mt-2">Registration failed. Please try again.</p>}
      </form>
    </div>
  );
};

export default Register;
