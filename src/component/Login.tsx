import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Login Form Data:", formData);
    // Implement your login logic here
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6  rounded w-[80%]  "
      >
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Login</h1>

        <div>
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-700 block mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="shadow-sm bg-gray-50 border text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 block mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={passwordShown ? "text" : "password"}
              id="password"
              name="password"
              className="shadow-sm bg-gray-50 border text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              value={formData.password}
              onChange={handleChange}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
              <button
                type="button"
                onClick={togglePassword}
                className="text-gray-700"
              >
                {passwordShown ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="hover:text-white text-black bg-white border border-blue-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 w-[8rem] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
