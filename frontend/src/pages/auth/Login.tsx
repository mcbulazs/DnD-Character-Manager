import type React from "react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../store/api/userApiSlice";
import type { ApiError } from "../../types/apiError";
import { useHeaderContext } from "../../layout/Contexts/HeaderContext";

interface UserCredentials {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
  });
  const [loginMutate, { isLoading, error }] = useLoginMutation();
  const { setTitle } = useHeaderContext();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Login";
  }, []);

  useEffect(() => {
    setTitle(null);
  }, [setTitle]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      await loginMutate(credentials).unwrap();
      // Redirect after a successful login
      toast("Login successful", { type: "success" });
      navigate("/");
    } catch (error) {
      const err = error as ApiError;
      console.error("Login failed", error);
      if (err.status === 401) {
        toast("Invalid email or password", { type: "warning" });
      } else {
        toast("An unexpected error occurred", { type: "error" });
      }
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-10 p-4">
      <h1 className="text-center text-3xl font-bold">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
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
        <div className="my-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
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
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <NavLink
          to="/register"
          className="block text-center mt-4 text-blue-500 hover:underline"
        >
          Don't have an account? Register
        </NavLink>
        {error && (
          <p className="text-red-500 mt-2 text-center">
            Login failed. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
