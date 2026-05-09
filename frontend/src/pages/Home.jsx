import React from "react";
import { useNavigate } from "react-router-dom";
const Home = ({ setToken }) => {
  const navigate = useNavigate();
  const handlelogout = () => {
    localStorage.clear();
    setToken(null);
    navigate("/login");
  };
  return (
    <div>
      <button onClick={handlelogout}>Logout</button>
    </div>
  );
};

export default Home;
