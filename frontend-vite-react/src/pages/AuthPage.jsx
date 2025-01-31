import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const AuthPage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { user } = useUser();
  if (user) {
    navigate("/");
  }
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // const url = isLogin ? `${API_BASE_URL}login/` : `${API_BASE_URL}register/`;
    const url = `${API_BASE_URL}login/`;
    const body = isLogin
      ? { username, password }
      : { username, email, password };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      if (isLogin) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        setMessage("...در حال ورود");
        await new Promise((r) => setTimeout(r, 300));
        setMessage("وارد شدید");
        await new Promise((r) => setTimeout(r, 500));
        window.location.reload();
      } else {
        setMessage("Registration successful! You can now log in.");
      }
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen mx-8">
      <div className=" p-8 rounded-lg shadow-md w-96 border-[1px] border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-8">ورود به سامانه گنجور</h2>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="نام‌کاربری"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            // className="w-full p-2 border rounded mb-2"
          />

          <input
            type="password"
            placeholder="گذرواژه"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // className="w-full p-2 border rounded mb-2"
          />
          <div className="">
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white p-2 rounded-lg mt-8"
            >
              ورود
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
