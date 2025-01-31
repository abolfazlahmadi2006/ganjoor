import { React } from "react";
import { useUser } from "./UserContext";

const Home = () => {
  const { user } = useUser();
  return <h1>{user ? `خوش‌آمدید ${user.username}` : "خوش‌آمدید"}</h1>;
};

export default Home;
